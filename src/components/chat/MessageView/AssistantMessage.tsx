import styles from "./AssistantMessage.module.scss";
import { Streamdown } from "streamdown";
import OpenAIIcon from "@/components/icons/OpenAIIcon";
import AnthropicIcon from "@/components/icons/AnthropicIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";

function ProviderIcon({ provider, size }: { provider?: string; size: number }) {
  if (provider === "anthropic") return <AnthropicIcon size={size} />;
  if (provider === "google") return <GoogleIcon size={size} />;
  return <OpenAIIcon size={size} />;
}

export default function AssistantMessage({
  content,
  provider,
}: {
  content: string;
  provider?: string;
}) {
  return (
    <div className={styles.assistantMessage}>
      <div className={styles.icon}>
        <ProviderIcon provider={provider} size={18} />
      </div>
      {content ? (
        <Streamdown className={styles.content}>{content}</Streamdown>
      ) : (
        <p className={styles.loading}>Thinking...</p>
      )}
    </div>
  );
}
