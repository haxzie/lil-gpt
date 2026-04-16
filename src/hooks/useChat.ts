import { useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import useChatStore from "../store/Chat.store";
import { Role } from "../store/Chat.types";
import { generateSystemPrompt } from "../utils/prompt";
import { ALL_MODELS, SERVER_URL } from "@/utils/constants";

const STREAM_ERROR_SENTINEL = "\n__STREAM_ERROR__";

export default function useChat() {
  const abortRef = useRef<AbortController | null>(null);

  const { selectedModel, addMessage, updateMessage, removeMessage } =
    useChatStore(
      useShallow(({ selectedModel, updateMessage, addMessage, removeMessage }) => ({
        selectedModel,
        updateMessage,
        addMessage,
        removeMessage,
      }))
    );

  const stopMessage = () => {
    abortRef.current?.abort();
  };

  const sendMessage = async (message: string) => {
    addMessage(Role.user, message);

    const modelInfo = ALL_MODELS.find((m) => m.id === selectedModel);
    if (!modelInfo) throw new Error(`Unknown model: ${selectedModel}`);

    // Snapshot messages before adding the assistant placeholder —
    // Anthropic rejects empty content blocks
    const conversationMessages = Object.values(useChatStore.getState().messages);

    // Add the assistant message immediately so the loading state shows
    const assistantMessageId = addMessage(Role.assistant, "", modelInfo.provider);

    const systemPrompt = await generateSystemPrompt();

    const abort = new AbortController();
    abortRef.current = abort;

    let response: Response;
    try {
      response = await fetch(`${SERVER_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abort.signal,
        body: JSON.stringify({
          model: selectedModel,
          provider: modelInfo.provider,
          messages: conversationMessages,
          systemPrompt,
        }),
      });
    } catch (err) {
      removeMessage(assistantMessageId);
      if ((err as Error).name === "AbortError") return;
      throw new Error("Could not reach chat server");
    }

    if (!response.ok) {
      removeMessage(assistantMessageId);
      const body = await response.json().catch(() => ({}));
      throw new Error(body?.error ?? `Server error ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    const parts: string[] = [];

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        const sentinelIndex = chunk.indexOf(STREAM_ERROR_SENTINEL);
        if (sentinelIndex !== -1) {
          const errorJson = chunk.slice(sentinelIndex + STREAM_ERROR_SENTINEL.length);
          const { message: errMsg } = JSON.parse(errorJson);
          removeMessage(assistantMessageId);
          throw new Error(errMsg);
        }

        parts.push(chunk);
        updateMessage(assistantMessageId, parts.join(""));
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      removeMessage(assistantMessageId);
      throw err instanceof Error ? err : new Error(String(err));
    }
  };

  return { sendMessage, stopMessage };
}
