import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const mcpServers = sqliteTable("mcp_servers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().$type<"stdio" | "sse">(),
  command: text("command"),
  url: text("url"),
  createdAt: integer("created_at").notNull(),
});
