import styles from "./APIKeyInputScreen.module.scss";
import { memo } from "react";
import SettingsIcon from "@/components/icons/SettingsIcon";

function APIKeyInputScreen() {
  return (
    <div className={styles.apiKeyInputScreen} data-testid="apiInputScreen">
      <div className={styles.icon}>
        <SettingsIcon size={24} />
      </div>
      <div className={styles.texts}>
        <h2>Add an API Key to get started</h2>
        <p>Open Settings to connect OpenAI, Anthropic, or Gemini.</p>
      </div>
    </div>
  );
}

export default memo(APIKeyInputScreen);
