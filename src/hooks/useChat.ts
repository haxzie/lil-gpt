import { useShallow } from "zustand/react/shallow";
import useChatStore from "../store/Chat.store";
import { Role } from "../store/Chat.types";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { generateSystemPrompt } from "../utils/prompt";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

const marked = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

export default function useChat() {
  const { apiKey, addMessage, updateMessage } = useChatStore(
    useShallow(({ updateMessage, addMessage, apiKey }) => ({
      apiKey,
      updateMessage,
      addMessage,
    }))
  );

  /**
   * Sends a message to the assistant
   * 1. Adds the user message to the store
   * 2. Streams the assistant response
   * 3. Updates the assistant message in the store
   * @param message string
   */
  const sendMessage = async (message: string) => {
    // add the user message to the store
    addMessage(Role.user, message);

    // create an instance of the OpenAI API
    const ChatGPT = createOpenAI({
      apiKey,
    });
    // generate a system prompt
    const systemPrompt = await generateSystemPrompt();

    // create a text stream
    const { textStream } = streamText({
      model: ChatGPT("gpt-3.5-turbo"),
      messages: [
        {
          role: Role.system,
          content: systemPrompt,
        },
        ...Object.values(useChatStore.getState().messages),
      ],
    });

    // create an assistant message, we will update this message as we stream the response
    const assistantMessageId = addMessage(Role.assistant, "");
    const parts = [];
    for await (const textPart of textStream) {
      parts.push(textPart);
      const markedText = await marked.parse(parts.join(""));
      updateMessage(assistantMessageId, markedText);
    }
  };

  return {
    sendMessage,
  };
}
