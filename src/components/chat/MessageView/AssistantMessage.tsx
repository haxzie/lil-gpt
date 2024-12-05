import OpenAIIcon from "@/components/icons/OpenAIIcon";
import styles from "./AssistantMessage.module.scss";

export default function AssistantMessage({ content }: { content: string }) {
  return (
    <div className={styles.assistantMessage}>
      <div className={styles.icon}>
        <OpenAIIcon size={18} />
      </div>
      {content ? (
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      ) : (
        <p className={styles.loading}>Thinking...</p>
      )}
    </div>
  );
}
