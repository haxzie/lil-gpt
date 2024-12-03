import useChatStore from "@/store/Chat.store";
import { useShallow } from "zustand/react/shallow";
import APIKeyInputScreen from "@/components/settings/APIKeyInputScreen/APIKeyInputScreen";
import ChatScreen from "@/components/chat/ChatScreen/ChatScreen";
import PanelLayout from "@/layouts/PanelLayout";

export default function () {
  const { apiKey } = useChatStore(useShallow(({ apiKey }) => ({ apiKey })));
  return (
    <PanelLayout>
      {!apiKey ? <APIKeyInputScreen /> : <ChatScreen />}
    </PanelLayout>
  );
}
