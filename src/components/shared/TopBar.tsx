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
  const { clearMessages, messages, apiKey } = useChatStore(
    useShallow(({ messages, clearMessages, apiKey }) => ({
      messages,
      clearMessages,
      apiKey,
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
      {/* Action buttons  */}
      <div className={styles.actions}>
        {apiKey && (
          <button className={styles.actionButton} onClick={handleShowSettings}>
            <SettingsIcon size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
