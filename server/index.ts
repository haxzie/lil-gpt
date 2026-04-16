import { Hono } from "hono";
import { cors } from "hono/cors";
import { stream } from "hono/streaming";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { settings, mcpServers } from "./schema";

const PORT = 11435;
const app = new Hono();

app.use("*", cors({ origin: "*" }));

// ─── Health ───────────────────────────────────────────────────────────────────

app.get("/health", (c) => c.json({ status: "ok" }));

// ─── Settings ────────────────────────────────────────────────────────────────

app.get("/settings", async (c) => {
  const rows = await db.select().from(settings);
  const result: Record<string, string> = {};
  for (const row of rows) result[row.key] = row.value;
  return c.json(result);
});

app.patch("/settings", async (c) => {
  const body: Record<string, string> = await c.req.json();
  for (const [key, value] of Object.entries(body)) {
    await db
      .insert(settings)
      .values({ key, value: String(value) })
      .onConflictDoUpdate({ target: settings.key, set: { value: String(value) } });
  }
  return c.json({ ok: true });
});

// ─── MCP Servers ──────────────────────────────────────────────────────────────

app.get("/mcp-servers", async (c) => {
  const rows = await db.select().from(mcpServers);
  return c.json(rows);
});

app.post("/mcp-servers", async (c) => {
  const body = await c.req.json();
  const server = {
    id: body.id as string,
    name: body.name as string,
    type: body.type as "stdio" | "sse",
    command: (body.command as string) ?? null,
    url: (body.url as string) ?? null,
    createdAt: Date.now(),
  };
  await db.insert(mcpServers).values(server);
  return c.json(server, 201);
});

app.delete("/mcp-servers/:id", async (c) => {
  const { id } = c.req.param();
  await db.delete(mcpServers).where(eq(mcpServers.id, id));
  return c.json({ ok: true });
});

// ─── Chat ─────────────────────────────────────────────────────────────────────

app.post("/chat", async (c) => {
  const { model, provider, messages, systemPrompt } = await c.req.json();

  // Read API keys from the database — never sent over the wire from the client
  const rows = await db.select().from(settings);
  const s: Record<string, string> = {};
  for (const row of rows) s[row.key] = row.value;

  let aiModel;
  try {
    switch (provider) {
      case "openai": {
        const key = s["openai_api_key"];
        if (!key) return c.json({ error: "OpenAI API key not configured" }, 400);
        aiModel = createOpenAI({ apiKey: key })(model);
        break;
      }
      case "anthropic": {
        const key = s["anthropic_api_key"];
        if (!key) return c.json({ error: "Anthropic API key not configured" }, 400);
        aiModel = createAnthropic({ apiKey: key })(model);
        break;
      }
      case "google": {
        const key = s["gemini_api_key"];
        if (!key) return c.json({ error: "Gemini API key not configured" }, 400);
        aiModel = createGoogleGenerativeAI({ apiKey: key })(model);
        break;
      }
      default:
        return c.json({ error: `Unknown provider: ${provider}` }, 400);
    }
  } catch (err) {
    return c.json({ error: String(err) }, 400);
  }

  const filteredMessages = messages.filter(
    (m: { role: string; content: string }) => m.content?.trim()
  );

  let textStream: AsyncIterable<string>;
  try {
    const result = streamText({
      model: aiModel,
      messages: [{ role: "system", content: systemPrompt }, ...filteredMessages],
    });
    textStream = result.textStream;
  } catch (err) {
    return c.json({ error: extractMessage(err) }, 500);
  }

  return stream(c, async (s) => {
    try {
      for await (const chunk of textStream) {
        await s.write(chunk);
      }
    } catch (err) {
      await s.write(`\n__STREAM_ERROR__${JSON.stringify({ message: extractMessage(err) })}`);
    }
  });
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractMessage(err: unknown): string {
  if (err instanceof Error) {
    try {
      const parsed = JSON.parse(err.message);
      if (parsed?.error?.message) return parsed.error.message;
    } catch {}
    return err.message;
  }
  return String(err);
}

export default { port: PORT, fetch: app.fetch };
