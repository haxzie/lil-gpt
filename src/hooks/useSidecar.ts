import { useEffect } from "react";
import { Command } from "@tauri-apps/plugin-shell";
import useChatStore from "@/store/Chat.store";

const SERVER_URL = "http://localhost:11435";
const HEALTH_CHECK_INTERVAL = 200;
const HEALTH_CHECK_TIMEOUT = 10_000;

async function waitForServer(): Promise<void> {
  const deadline = Date.now() + HEALTH_CHECK_TIMEOUT;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${SERVER_URL}/health`);
      if (res.ok) return;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, HEALTH_CHECK_INTERVAL));
  }
  throw new Error("Chat server did not start in time");
}

export default function useSidecar() {
  useEffect(() => {
    let cancelled = false;
    let killFn: (() => void) | null = null;

    const start = async () => {
      try {
        const command = Command.sidecar("binaries/chat-server");
        command.stderr.on("data", (line) => console.error("[server]", line));
        const child = await command.spawn();
        killFn = () => child.kill();

        await waitForServer();

        if (!cancelled) useChatStore.getState().setSidecarStatus("ready");
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : String(err);
          useChatStore.getState().setSidecarStatus("error", msg);
        }
      }
    };

    start();

    return () => {
      cancelled = true;
      killFn?.();
    };
  }, []);
}
