export type ChatRole = "user" | "assistant" | "system";

export const Role: Record<ChatRole, ChatRole> = {
  system: "system",
  user: "user",
  assistant: "assistant",
};

export interface Message {
  id: string;
  role: ChatRole;
  content: string;
}

export interface ChatStoreState {
  apiKey: string;
  messages: Record<string, Message>;
  saveApiKey: (key: string) => void;
  addMessage: (role: ChatRole, content: string) => string;
  updateMessage: (id: string, content: string) => void;
  clearMessages: () => void;
}
