import React, { useCallback, useState } from "react";
import styles from "./PanelLayout.module.scss";
import TopBar from "@/components/shared/TopBar";
import SettingsBottomSheet from "@/components/settings/SettingsBottomSheet/SettingsBottomSheet";
import { AnimatePresence } from "motion/react";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSettings, setShowSettings] = useState(false);

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
