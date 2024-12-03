import OpenAIIcon from "@/components/icons/OpenAIIcon";
import styles from "./AssistantMessage.module.scss";

export default function AssistantMessage({ content }: { content: string }) {
  return (
    <div className={styles.assistantMessage}>
      <div className={styles.icon}>
        <OpenAIIcon size={18} />
      </div>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
}
