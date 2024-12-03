import styles from "./UserMessage.module.scss";
import { motion } from "motion/react";

export default function UserMessage({ content }: { content: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, translateY: "10px" }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: "10px" }}
      transition={{ duration: 0.1 }}
      className={styles.userMessage}
    >
      {content}
    </motion.p>
  );
}
