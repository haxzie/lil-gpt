import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import { Role } from "@/store/Chat.types";

export default function Message({
  role,
  content,
  provider,
}: {
  role: string;
  content: string;
  provider?: string;
}) {
  return role === Role.user ? (
    <UserMessage content={content} />
  ) : (
    <AssistantMessage content={content} provider={provider} />
  );
}
