import useChatStore from "@/store/Chat.store";
import { useShallow } from "zustand/react/shallow";
import APIKeyInputScreen from "@/components/settings/APIKeyInputScreen/APIKeyInputScreen";
import ChatScreen from "@/components/chat/ChatScreen/ChatScreen";
import PanelLayout from "@/layouts/PanelLayout";
import useSidecar from "@/hooks/useSidecar";
import useSettings from "@/hooks/useSettings";

export default function () {
  useSidecar();
  useSettings();

  const { openaiApiKey, anthropicApiKey, geminiApiKey, settingsLoaded } = useChatStore(
    useShallow(({ openaiApiKey, anthropicApiKey, geminiApiKey, settingsLoaded }) => ({
      openaiApiKey,
      anthropicApiKey,
      geminiApiKey,
      settingsLoaded,
    }))
  );

  const hasAnyKey = !!(openaiApiKey || anthropicApiKey || geminiApiKey);

  return (
    <PanelLayout>
      {settingsLoaded && !hasAnyKey ? <APIKeyInputScreen /> : <ChatScreen />}
    </PanelLayout>
  );
}
