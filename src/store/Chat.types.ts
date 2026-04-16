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
  provider?: string;
}

export interface MCPServer {
  id: string;
  name: string;
  type: "stdio" | "sse";
  command?: string | null;
  url?: string | null;
}

export type SidecarStatus = "starting" | "ready" | "error";

export interface ChatStoreState {
  // Settings (loaded from backend)
  openaiApiKey: string;
  anthropicApiKey: string;
  geminiApiKey: string;
  selectedModel: string;
  enabledProviders: Record<string, boolean>;
  mcpServers: MCPServer[];
  settingsLoaded: boolean;

  // Sidecar
  sidecarStatus: SidecarStatus;
  sidecarError: string;

  // Messages (session-only, not persisted)
  messages: Record<string, Message>;

  // Actions
  loadSettings: () => Promise<void>;
  saveOpenAIApiKey: (key: string) => void;
  saveAnthropicApiKey: (key: string) => void;
  saveGeminiApiKey: (key: string) => void;
  toggleProvider: (provider: string) => void;
  setSelectedModel: (model: string) => void;
  addMCPServer: (server: Omit<MCPServer, "id">) => void;
  removeMCPServer: (id: string) => void;
  setSidecarStatus: (status: SidecarStatus, error?: string) => void;
  addMessage: (role: ChatRole, content: string, provider?: string) => string;
  updateMessage: (id: string, content: string) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}
