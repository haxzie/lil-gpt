import { memo } from "react";
import styles from "./ChatScreen.module.scss";
import ChatMessages from "../ChatMessages/ChatMessages";
import ChatBox from "../ChatBox/ChatBox";
import useChatStore from "@/store/Chat.store";
import { useShallow } from "zustand/react/shallow";

function ChatScreen() {
  const { sidecarStatus, sidecarError } = useChatStore(
    useShallow(({ sidecarStatus, sidecarError }) => ({ sidecarStatus, sidecarError }))
  );

  return (
    <div className={styles.chatScreen} data-testid="chatScreen">
      <div className={styles.chatMessages} id="message-list">
        <ChatMessages />
      </div>
      {sidecarStatus !== "ready" && (
        <div className={[styles.statusBar, sidecarStatus === "error" && styles.statusBarError].filter(Boolean).join(" ")}>
          {sidecarStatus === "starting" ? "Starting chat server…" : `Server error: ${sidecarError}`}
        </div>
      )}
      <div className={styles.chatInputWrapper}>
        <ChatBox />
      </div>
    </div>
  );
}

export default memo(ChatScreen);
