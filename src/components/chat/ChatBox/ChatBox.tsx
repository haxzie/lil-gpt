import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import styles from "./ChatBox.module.scss";
import EnterIcon from "@/components/icons/EnterIcon";
import StopIcon from "@/components/icons/StopIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import ClearIcon from "@/components/icons/ClearIcon";
import useChat from "@/hooks/useChat";
import useChatStore from "@/store/Chat.store";
import { useShallow } from "zustand/react/shallow";
import {
  ALL_MODELS,
  OPENAI_MODELS,
  ANTHROPIC_MODELS,
  GOOGLE_MODELS,
} from "@/utils/constants";

function ModelPicker() {
  const { openaiApiKey, anthropicApiKey, geminiApiKey, enabledProviders, selectedModel, setSelectedModel } =
    useChatStore(
      useShallow(
        ({ openaiApiKey, anthropicApiKey, geminiApiKey, enabledProviders, selectedModel, setSelectedModel }) => ({
          openaiApiKey,
          anthropicApiKey,
          geminiApiKey,
          enabledProviders,
          selectedModel,
          setSelectedModel,
        })
      )
    );

  const availableModels = ALL_MODELS.filter((m) => {
    if (m.provider === "openai") return !!openaiApiKey && !!enabledProviders["openai"];
    if (m.provider === "anthropic") return !!anthropicApiKey && !!enabledProviders["anthropic"];
    if (m.provider === "google") return !!geminiApiKey && !!enabledProviders["google"];
    return false;
  });

  if (availableModels.length === 0) return null;

  const currentModel = availableModels.find((m) => m.id === selectedModel) ?? availableModels[0];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  const hasOpenAI = !!openaiApiKey && !!enabledProviders["openai"] && OPENAI_MODELS.some((m) => availableModels.includes(m));
  const hasAnthropic = !!anthropicApiKey && !!enabledProviders["anthropic"] && ANTHROPIC_MODELS.some((m) => availableModels.includes(m));
  const hasGoogle = !!geminiApiKey && !!enabledProviders["google"] && GOOGLE_MODELS.some((m) => availableModels.includes(m));

  return (
    <div className={styles.modelPickerWrapper}>
      <span className={styles.modelPickerLabel}>
        {currentModel.name}
        <ChevronDownIcon size={12} />
      </span>
      <select
        className={styles.modelPickerSelect}
        value={currentModel.id}
        onChange={handleChange}
        title="Select model"
      >
        {hasOpenAI && (
          <optgroup label="OpenAI">
            {OPENAI_MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </optgroup>
        )}
        {hasAnthropic && (
          <optgroup label="Anthropic">
            {ANTHROPIC_MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </optgroup>
        )}
        {hasGoogle && (
          <optgroup label="Google">
            {GOOGLE_MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </optgroup>
        )}
      </select>
    </div>
  );
}

function ChatBox() {
  const { sendMessage, stopMessage } = useChat();

  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isAIReplying, setIsAIReplying] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = useCallback(async () => {
    const userMessage = message.trim();
    setMessage("");
    if (!userMessage) return;

    try {
      setIsAIReplying(true);
      setError("");
      await sendMessage(userMessage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsAIReplying(false);
    }
  }, [message, sendMessage]);

  const handleOnSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleSendMessage();
    },
    [handleSendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
      autoResizeTextarea();
    },
    []
  );

  const autoResizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.overflow = "auto";
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  }, []);

  useEffect(() => {
    autoResizeTextarea();
  }, [message]);

  return (
    <form
      className={[styles.ChatBox, isFocused && styles.focused].join(" ")}
      onSubmit={handleOnSubmit}
      data-testid="chatBox"
    >
      {error && (
        <div className={styles.errorBanner}>
          <span className={styles.errorMessage}>{error}</span>
          <button
            type="button"
            className={styles.errorDismiss}
            onClick={() => setError("")}
          >
            <ClearIcon size={14} />
          </button>
        </div>
      )}
      <textarea
        ref={textareaRef}
        className={styles.ChatBoxInput}
        onKeyDown={handleKeyDown}
        value={message}
        onChange={handleInputChange}
        placeholder="Ask a question or send a message..."
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={isAIReplying}
        rows={1}
        autoFocus
      />
      <div className={styles.toolbar}>
        <ModelPicker />
        {isAIReplying ? (
          <button
            type="button"
            className={[styles.sendButton, styles.active].join(" ")}
            onClick={stopMessage}
          >
            <StopIcon size={16} />
          </button>
        ) : (
          <button className={[styles.sendButton, message && styles.active].join(" ")}>
            <EnterIcon size={18} />
          </button>
        )}
      </div>
    </form>
  );
}

export default memo(ChatBox);
