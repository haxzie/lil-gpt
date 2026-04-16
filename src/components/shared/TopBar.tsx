import { useCallback } from "react";
import styles from "./TopBar.module.scss";
import BackIcon from "@/components/icons/BackIcon";
import useChatStore from "@/store/Chat.store";
import { useShallow } from "zustand/react/shallow";
import SettingsIcon from "@/components/icons/SettingsIcon";

export default function TopBar({
  onClickShowSettings,
}: {
  onClickShowSettings?: () => void;
}) {
  const { clearMessages, messages } = useChatStore(
    useShallow(({ messages, clearMessages }) => ({
      messages,
      clearMessages,
    }))
  );

  const handleShowSettings = useCallback(() => {
    if (onClickShowSettings) {
      onClickShowSettings();
    }
  }, []);

  return (
    <div className={styles.topBar}>
      <div className={styles.header}>
        {messages && Object.keys(messages).length > 0 && (
          <button className={styles.backButton} onClick={clearMessages}>
            <BackIcon size={18} />
          </button>
        )}
        <h1 className={styles.title}>Lil-GPT</h1>
      </div>
      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={handleShowSettings}>
          <SettingsIcon size={18} />
        </button>
      </div>
    </div>
  );
}
