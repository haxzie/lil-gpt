import React, { useCallback, useState } from "react";
import styles from "./PanelLayout.module.scss";
import TopBar from "@/components/shared/TopBar";
import SettingsBottomSheet from "@/components/settings/SettingsBottomSheet/SettingsBottomSheet";
import { AnimatePresence } from "motion/react";
import useChatStore from "@/store/Chat.store";
import { useShallow } from "zustand/react/shallow";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const { openaiApiKey, anthropicApiKey, geminiApiKey } = useChatStore(
    useShallow(({ openaiApiKey, anthropicApiKey, geminiApiKey }) => ({
      openaiApiKey,
      anthropicApiKey,
      geminiApiKey,
    }))
  );

  const hasAnyKey = !!(openaiApiKey || anthropicApiKey || geminiApiKey);
  const [showSettings, setShowSettings] = useState(!hasAnyKey);

  const toggleSettings = useCallback(() => {
    setShowSettings((prev) => !prev);
  }, []);

  return (
    <div className={styles.layout}>
      <TopBar onClickShowSettings={toggleSettings} />
      <main className={styles.content}>{children}</main>
      <AnimatePresence>
        {showSettings && <SettingsBottomSheet onClose={toggleSettings} />}
      </AnimatePresence>
    </div>
  );
}
