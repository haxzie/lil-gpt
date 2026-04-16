import { FormEvent, useCallback, useState } from "react";
import styles from "./APIKeyForm.module.scss";
import useChatStore from "@/store/Chat.store";
import { useShallow } from "zustand/react/shallow";

export default function APIKeyForm({
  onKeyChange,
}: {
  onKeyChange?: () => void;
}) {
  const { openaiApiKey, saveOpenAIApiKey } = useChatStore(
    useShallow(({ openaiApiKey, saveOpenAIApiKey }) => ({
      openaiApiKey,
      saveOpenAIApiKey,
    }))
  );

  const [inputValue, setInputValue] = useState(openaiApiKey || "");

  const handleSaveApiKey = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim()) return;
      saveOpenAIApiKey(inputValue.trim());
      if (onKeyChange) {
        onKeyChange();
      }
    },
    [inputValue, saveOpenAIApiKey]
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
          placeholder="sk-..."
          className={styles.apiKeyInput}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          data-testid="apiKeySaveButton"
          className={styles.cta}
          disabled={!inputValue.trim()}
        >
          Save API Key
        </button>
      </form>
    </div>
  );
}
