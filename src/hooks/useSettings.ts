import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import useChatStore from "@/store/Chat.store";

export default function useSettings() {
  const { sidecarStatus, loadSettings } = useChatStore(
    useShallow(({ sidecarStatus, loadSettings }) => ({ sidecarStatus, loadSettings }))
  );

  useEffect(() => {
    if (sidecarStatus === "ready") {
      loadSettings();
    }
  }, [sidecarStatus]);
}
