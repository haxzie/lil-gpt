import { useCallback, useEffect, useState } from "react";
import styles from "./SettingsBottomSheet.module.scss";
import ClearIcon from "../../icons/ClearIcon";
import { motion } from "motion/react";
import useChatStore from "@/store/Chat.store";
import { useShallow } from "zustand/react/shallow";
import { MCPServer } from "@/store/Chat.types";
import { getCurrentWindow } from "@tauri-apps/api/window";

// ─── Provider Toggle ────────────────────────────────────────────────────────

function ProviderToggle({
  enabled,
  hasKey,
  onToggle,
}: {
  enabled: boolean;
  hasKey: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={!hasKey}
      className={[
        styles.toggle,
        enabled && hasKey ? styles.toggleOn : "",
        !hasKey ? styles.toggleDisabled : "",
      ].join(" ")}
      onClick={onToggle}
    >
      <span className={styles.toggleKnob} />
    </button>
  );
}

// ─── API Key Section ─────────────────────────────────────────────────────────

function ApiKeySection({
  title,
  description,
  provider,
  value,
  placeholder,
  onSave,
}: {
  title: string;
  description: string;
  provider: string;
  value: string;
  placeholder: string;
  onSave: (key: string) => void;
}) {
  const [inputValue, setInputValue] = useState(value);
  const { enabledProviders, toggleProvider } = useChatStore(
    useShallow(({ enabledProviders, toggleProvider }) => ({ enabledProviders, toggleProvider }))
  );

  const hasKey = !!value;
  const isEnabled = hasKey && !!enabledProviders[provider];

  const handleBlur = () => {
    const trimmed = inputValue.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleRow}>
          <h3 className={styles.sectionTitle}>{title}</h3>
          <ProviderToggle
            enabled={isEnabled}
            hasKey={hasKey}
            onToggle={() => toggleProvider(provider)}
          />
        </div>
        <p className={styles.sectionDescription}>{description}</p>
      </div>
      <input
        type="password"
        className={styles.keyInput}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
    </div>
  );
}

// ─── MCP Servers Tab ─────────────────────────────────────────────────────────

function MCPServersTab() {
  const { mcpServers, addMCPServer, removeMCPServer } = useChatStore(
    useShallow(({ mcpServers, addMCPServer, removeMCPServer }) => ({
      mcpServers,
      addMCPServer,
      removeMCPServer,
    }))
  );

  const [name, setName] = useState("");
  const [type, setType] = useState<"stdio" | "sse">("stdio");
  const [command, setCommand] = useState("");
  const [url, setUrl] = useState("");

  const canAdd =
    name.trim() && (type === "stdio" ? command.trim() : url.trim());

  const handleAdd = () => {
    if (!canAdd) return;
    const server: Omit<MCPServer, "id"> =
      type === "stdio"
        ? { name: name.trim(), type, command: command.trim() }
        : { name: name.trim(), type, url: url.trim() };
    addMCPServer(server);
    setName("");
    setCommand("");
    setUrl("");
  };

  return (
    <div className={styles.mcpTab}>
      {/* Add form */}
      <div className={styles.mcpAddForm}>
        <p className={styles.sectionGroupLabel}>Add Server</p>

        <div className={styles.mcpFormRow}>
          <input
            className={styles.keyInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Server name"
          />
        </div>

        <div className={styles.mcpTypeRow}>
          <button
            type="button"
            className={[styles.typeTab, type === "stdio" ? styles.typeTabActive : ""].join(" ")}
            onClick={() => setType("stdio")}
          >
            stdio
          </button>
          <button
            type="button"
            className={[styles.typeTab, type === "sse" ? styles.typeTabActive : ""].join(" ")}
            onClick={() => setType("sse")}
          >
            SSE
          </button>
        </div>

        {type === "stdio" ? (
          <input
            className={styles.keyInput}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="npx -y @modelcontextprotocol/server-filesystem /path"
          />
        ) : (
          <input
            className={styles.keyInput}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://localhost:3000/sse"
          />
        )}

        <button
          type="button"
          className={styles.addButton}
          disabled={!canAdd}
          onClick={handleAdd}
        >
          Add Server
        </button>
      </div>

      {/* Server list */}
      {mcpServers.length > 0 && (
        <div className={styles.mcpList}>
          <p className={styles.sectionGroupLabel}>Configured Servers</p>
          {mcpServers.map((server) => (
            <div key={server.id} className={styles.mcpItem}>
              <div className={styles.mcpItemInfo}>
                <span className={styles.mcpItemName}>{server.name}</span>
                <div className={styles.mcpItemMeta}>
                  <span className={styles.mcpTypeBadge}>{server.type}</span>
                  <span className={styles.mcpItemCommand}>
                    {server.type === "stdio" ? server.command : server.url}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={styles.mcpDeleteButton}
                onClick={() => removeMCPServer(server.id)}
                title="Remove server"
              >
                <ClearIcon size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = "providers" | "mcp";

export default function SettingsBottomSheet({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("providers");

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    getCurrentWindow().startDragging();
  }, []);

  const { openaiApiKey, anthropicApiKey, geminiApiKey, saveOpenAIApiKey, saveAnthropicApiKey, saveGeminiApiKey } =
    useChatStore(
      useShallow(
        ({ openaiApiKey, anthropicApiKey, geminiApiKey, saveOpenAIApiKey, saveAnthropicApiKey, saveGeminiApiKey }) => ({
          openaiApiKey,
          anthropicApiKey,
          geminiApiKey,
          saveOpenAIApiKey,
          saveAnthropicApiKey,
          saveGeminiApiKey,
        })
      )
    );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={styles.overlay}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, translateY: "8px" }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        exit={{ opacity: 0, scale: 0.97, translateY: "8px" }}
        transition={{ duration: 0.2 }}
        className={styles.panel}
      >
        <div className={styles.header} onMouseDown={handleDragStart}>
          <h2 className={styles.title}>Settings</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <ClearIcon size={20} />
          </button>
        </div>

        <div className={styles.tabBar}>
          <button
            className={[styles.tabItem, activeTab === "providers" ? styles.tabItemActive : ""].join(" ")}
            onClick={() => setActiveTab("providers")}
          >
            Providers
          </button>
          <button
            className={[styles.tabItem, activeTab === "mcp" ? styles.tabItemActive : ""].join(" ")}
            onClick={() => setActiveTab("mcp")}
          >
            MCP Servers
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === "providers" && (
            <>
              <p className={styles.sectionGroupLabel}>API Keys</p>
              <ApiKeySection
                title="OpenAI"
                description="Required for GPT-4o, o1, o3 and other OpenAI models."
                provider="openai"
                value={openaiApiKey}
                placeholder="sk-..."
                onSave={saveOpenAIApiKey}
              />
              <ApiKeySection
                title="Anthropic"
                description="Required for Claude Opus, Sonnet and Haiku models."
                provider="anthropic"
                value={anthropicApiKey}
                placeholder="sk-ant-..."
                onSave={saveAnthropicApiKey}
              />
              <ApiKeySection
                title="Gemini"
                description="Required for Google Gemini 2.0 and 1.5 models."
                provider="google"
                value={geminiApiKey}
                placeholder="AIza..."
                onSave={saveGeminiApiKey}
              />
            </>
          )}

          {activeTab === "mcp" && <MCPServersTab />}
        </div>
      </motion.div>
    </motion.div>
  );
}
