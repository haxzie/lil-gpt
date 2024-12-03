import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import { Role } from "@/store/Chat.types";

export default function Message({
  role,
  content,
}: {
  role: string;
  content: string;
}) {
  return role === Role.user ? (
    <UserMessage content={content} />
  ) : (
    <AssistantMessage content={content} />
  );
}
