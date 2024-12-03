import styles from "./APIKeyInputScreen.module.scss";
import OpenAIIcon from "../../icons/OpenAIIcon";
import APIKeyForm from "@/components/settings/APIKeyForm/APIKeyForm";
import { memo } from "react";

function APIKeyInputScreen() {
  return (
    <div className={styles.apiKeyInputScreen}  data-testid="apiInputScreen">
      <div className={styles.icon}>
        <OpenAIIcon size={34} />
      </div>
      <APIKeyForm />
    </div>
  );
}

export default memo(APIKeyInputScreen);
