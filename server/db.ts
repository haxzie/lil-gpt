import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { homedir } from "os";
import { mkdirSync } from "fs";
import { join } from "path";
import * as schema from "./schema";

const dataDir = process.env.LIL_GPT_DATA_DIR ?? join(homedir(), ".lil-gpt");
mkdirSync(dataDir, { recursive: true });

const sqlite = new Database(join(dataDir, "data.db"));
sqlite.exec("PRAGMA journal_mode = WAL;");

// Bootstrap tables (no migration tooling needed for this simple schema)
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS mcp_servers (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    type        TEXT NOT NULL,
    command     TEXT,
    url         TEXT,
    created_at  INTEGER NOT NULL
  );
`);

export const db = drizzle(sqlite, { schema });
