import { create } from "zustand";
import { ChatRole, ChatStoreState, MCPServer } from "./Chat.types";
import { v4 as uuid } from "uuid";
import { SERVER_URL, DEFAULT_MODEL_ID } from "../utils/constants";

async function patchSettings(patch: Record<string, string>) {
  await fetch(`${SERVER_URL}/settings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

const useChatStore = create<ChatStoreState>((set, get) => ({
  // ─── Initial state (empty — populated by loadSettings) ──────────────────
  openaiApiKey: "",
  anthropicApiKey: "",
  geminiApiKey: "",
  selectedModel: DEFAULT_MODEL_ID,
  enabledProviders: {},
  mcpServers: [],
  settingsLoaded: false,
  sidecarStatus: "starting",
  sidecarError: "",
  messages: {},

  // ─── Bootstrap ────────────────────────────────────────────────────────────

  loadSettings: async () => {
    try {
      const [settingsRes, mcpRes] = await Promise.all([
        fetch(`${SERVER_URL}/settings`),
        fetch(`${SERVER_URL}/mcp-servers`),
      ]);

      const s: Record<string, string> = await settingsRes.json();
      const mcp: MCPServer[] = await mcpRes.json();

      const enabledProviders = s["enabled_providers"]
        ? JSON.parse(s["enabled_providers"])
        : {
            openai: !!s["openai_api_key"],
            anthropic: !!s["anthropic_api_key"],
            google: !!s["gemini_api_key"],
          };

      set({
        openaiApiKey: s["openai_api_key"] ?? "",
        anthropicApiKey: s["anthropic_api_key"] ?? "",
        geminiApiKey: s["gemini_api_key"] ?? "",
        selectedModel: s["selected_model"] ?? DEFAULT_MODEL_ID,
        enabledProviders,
        mcpServers: mcp,
        settingsLoaded: true,
      });
    } catch (err) {
      console.error("[store] Failed to load settings:", err);
      set({ settingsLoaded: true }); // unblock UI even on failure
    }
  },

  // ─── API Key actions ──────────────────────────────────────────────────────

  saveOpenAIApiKey: (key: string) => {
    const updated = { ...get().enabledProviders, openai: true };
    set({ openaiApiKey: key, enabledProviders: updated });
    patchSettings({
      openai_api_key: key,
      enabled_providers: JSON.stringify(updated),
    }).catch(console.error);
  },

  saveAnthropicApiKey: (key: string) => {
    const updated = { ...get().enabledProviders, anthropic: true };
    set({ anthropicApiKey: key, enabledProviders: updated });
    patchSettings({
      anthropic_api_key: key,
      enabled_providers: JSON.stringify(updated),
    }).catch(console.error);
  },

  saveGeminiApiKey: (key: string) => {
    const updated = { ...get().enabledProviders, google: true };
    set({ geminiApiKey: key, enabledProviders: updated });
    patchSettings({
      gemini_api_key: key,
      enabled_providers: JSON.stringify(updated),
    }).catch(console.error);
  },

  toggleProvider: (provider: string) => {
    const updated = { ...get().enabledProviders, [provider]: !get().enabledProviders[provider] };
    set({ enabledProviders: updated });
    patchSettings({ enabled_providers: JSON.stringify(updated) }).catch(console.error);
  },

  setSelectedModel: (model: string) => {
    set({ selectedModel: model });
    patchSettings({ selected_model: model }).catch(console.error);
  },

  // ─── MCP Servers ──────────────────────────────────────────────────────────

  addMCPServer: (server) => {
    const newServer: MCPServer = { ...server, id: uuid() };
    set({ mcpServers: [...get().mcpServers, newServer] });
    fetch(`${SERVER_URL}/mcp-servers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newServer),
    }).catch(console.error);
  },

  removeMCPServer: (id: string) => {
    set({ mcpServers: get().mcpServers.filter((s) => s.id !== id) });
    fetch(`${SERVER_URL}/mcp-servers/${id}`, { method: "DELETE" }).catch(console.error);
  },

  // ─── Sidecar ──────────────────────────────────────────────────────────────

  setSidecarStatus: (status, error = "") => {
    set({ sidecarStatus: status, sidecarError: error });
  },

  // ─── Messages (session-only) ──────────────────────────────────────────────

  addMessage: (role: ChatRole, content: string, provider?: string) => {
    const messageId = uuid();
    set((state) => ({
      messages: {
        ...state.messages,
        [messageId]: { id: messageId, role, content, provider },
      },
    }));
    return messageId;
  },

  updateMessage: (id: string, content: string) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [id]: { ...state.messages[id], content },
      },
    }));
  },

  removeMessage: (id: string) => {
    set((state) => {
      const messages = { ...state.messages };
      delete messages[id];
      return { messages };
    });
  },

  clearMessages: () => {
    set({ messages: {} });
  },
}));

export default useChatStore;
