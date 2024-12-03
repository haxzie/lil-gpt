import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import styles from "./ChatBox.module.scss";
import EnterIcon from "@/components/icons/EnterIcon";
import useChat from "@/hooks/useChat";
import useChatStore from "@/store/Chat.store";

/**
 * ChatBox component
 * Renders a chat input box and a send button to send messages
 * @param props
 * @returns
 */
function ChatBox() {
  const { sendMessage } = useChat();

  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isAIReplying, setIsAIReplying] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSendMessage = useCallback(async () => {
    const userMessage = message.trim();
    setMessage(""); // Clear the input
    if (userMessage) {
      try {
        setIsAIReplying(true);
        setError(""); // clear the error, so users can try again
        sendMessage(userMessage);
      } catch (error) {
        console.error(error);
        // clear all the messages
        useChatStore.getState().clearMessages();
        setError("An error occurred while sending the message");
      } finally {
        setIsAIReplying(false);
      }
    }
  }, [message]);

  /**
   * Handle the form submission
   */
  const handleOnSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  }, [handleSendMessage]);

  /**
   * Handle the keydown event
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Check if Shift+Enter is pressed
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Prevents creating a new line when sending
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  /**
   * Handles auto resizing the textarea
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
      autoResizeTextarea();
    },
    [setMessage]
  );

  const autoResizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.overflow = "auto";
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`; // Set height to 150px
  }, []);

  useEffect(() => {
    autoResizeTextarea(); // Adjust the height when the message state changes
  }, [message]);

  return (
    <form
      className={[
        styles.ChatBox,
        isFocused && styles.focused,
        error && styles.error,
      ].join(" ")}
      onSubmit={handleOnSubmit}
      data-testid="chatBox"
    >
      <textarea
        ref={textareaRef}
        className={styles.ChatBoxInput}
        onKeyDown={handleKeyDown}
        value={message}
        onChange={handleInputChange}
        placeholder={error || "Ask a question or send a message..."}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={isAIReplying}
        rows={1}
        autoFocus
      />
      <button
        className={[styles.sendButton, message && styles.active].join(" ")}
      >
        <EnterIcon size={18} />
      </button>
    </form>
  );
}

export default memo(ChatBox);
