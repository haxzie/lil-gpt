import { memo, useEffect, useMemo } from "react";
import styles from "./ChatMessages.module.scss";
import WelcomeView from "../WelcomeView/WelcomeView";
import { useShallow } from "zustand/react/shallow";
import useChatStore from "@/store/Chat.store";
import MessageView from "@/components/chat/MessageView/MessageView";
import { AnimatePresence } from "motion/react";

function ChatMessages() {
  const { messages } = useChatStore(
    useShallow(({ messages }) => ({ messages }))
  );

  const messagesArray = useMemo(() => Object.values(messages), [messages]);

  useEffect(() => {
    // Keep the chat scrolled to the bottom
    document.getElementById("message-list")?.scrollTo({
      top: document.getElementById("message-list")?.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return messagesArray.length === 0 ? (
    <WelcomeView />
  ) : (
    <div className={styles.chatMessages} data-testid="chatMessages">
      <AnimatePresence initial={false}>
        {messagesArray.map((message, index) => (
          <MessageView
            key={`message-${message.role}-${index}`}
            role={message.role}
            content={message.content}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default memo(ChatMessages);
