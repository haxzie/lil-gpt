import styles from "./WelcomeView.module.scss";
import LogoIcon from "@/components/icons/LogoIcon";
import { motion } from "motion/react";

export default function WelcomeView() {
  return (
    <div className={styles.welcomeView} data-testid="welcomeView">
      <div className={styles.icon}>
        <motion.div
          className={styles.iconWrapper}
          animate={{
            scale: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        >
          <LogoIcon size={34} />
        </motion.div>
      </div>
      <div className={styles.texts}>
        <h2>How can I help you today?</h2>
        <p>I'll be able to answer anything you need help with</p>
      </div>
    </div>
  );
}
