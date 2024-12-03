import { memo } from "react";
import styles from "./ChatScreen.module.scss";
import ChatMessages from "../ChatMessages/ChatMessages";
import ChatBox from "../ChatBox/ChatBox";

function ChatScreen() {
  return (
    <div className={styles.chatScreen} data-testid="chatScreen">
      <div className={styles.chatMessages} id="message-list">
        <ChatMessages />
      </div>
      <div className={styles.chatInputWrapper}>
        <ChatBox />
      </div>
    </div>
  );
}

export default memo(ChatScreen);