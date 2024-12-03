import { FormEvent, useCallback, useState } from "react";
import styles from "./APIKeyForm.module.scss";
import useChatStore from "@/store/Chat.store";
import { useShallow } from "zustand/react/shallow";

export default function APIKeyForm({
  onKeyChange,
}: {
  onKeyChange?: () => void;
}) {
  const { apiKey, saveApiKey } = useChatStore(
    useShallow(({ apiKey, saveApiKey }) => ({
      apiKey,
      saveApiKey,
    }))
  );

  const [openAIAPIKey, setOpenAIAPIKey] = useState(apiKey || "");

  const handleSaveApiKey = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!openAIAPIKey.trim()) return;
      saveApiKey(openAIAPIKey.trim());

      // Call the onKeyChange callback if it is provided
      if (onKeyChange) {
        onKeyChange();
      }
    },
    [openAIAPIKey, saveApiKey]
  );
  return (
    <div className={styles.apiKeyForm} data-testid="apiKeyForm">
      <div className={styles.texts}>
        <h2>Enter your OpenAI API Key</h2>
        <p>Lil-GPT uses your OpenAI Models to get the results</p>
      </div>
      <form className={styles.form} onSubmit={handleSaveApiKey}>
        <input
          data-testid="apiKeyInput"
          type="password"
          placeholder="**************************************"
          className={styles.apiKeyInput}
          value={openAIAPIKey}
          onChange={(e) => setOpenAIAPIKey(e.target.value)}
        />
        <button
          data-testid="apiKeySaveButton"
          className={styles.cta}
          disabled={!openAIAPIKey.trim()}
        >
          Save API Key
        </button>
      </form>
    </div>
  );
}
