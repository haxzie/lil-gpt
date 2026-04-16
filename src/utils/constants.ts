export const SERVER_URL = "http://localhost:11435";

export type ModelProvider = "openai" | "anthropic" | "google";

export interface AIModel {
  id: string;
  name: string;
  provider: ModelProvider;
}

export const OPENAI_MODELS: AIModel[] = [
  { id: "gpt-5.4", name: "GPT-5.4", provider: "openai" },
  { id: "gpt-5.2", name: "GPT-5.2", provider: "openai" },
  { id: "gpt-5.1", name: "GPT-5.1", provider: "openai" },
  { id: "gpt-5", name: "GPT-5", provider: "openai" },
  { id: "gpt-5-mini", name: "GPT-5 mini", provider: "openai" },
  { id: "gpt-5-nano", name: "GPT-5 nano", provider: "openai" },
  { id: "gpt-4.1", name: "GPT-4.1", provider: "openai" },
  { id: "gpt-4.1-mini", name: "GPT-4.1 mini", provider: "openai" },
  { id: "gpt-4.1-nano", name: "GPT-4.1 nano", provider: "openai" },
];

export const ANTHROPIC_MODELS: AIModel[] = [
  { id: "claude-opus-4-6", name: "Claude Opus 4.6", provider: "anthropic" },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", provider: "anthropic" },
  { id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5", provider: "anthropic" },
];

export const GOOGLE_MODELS: AIModel[] = [
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "google" },
  { id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash Lite", provider: "google" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "google" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "google" },
];

export const ALL_MODELS: AIModel[] = [
  ...OPENAI_MODELS,
  ...ANTHROPIC_MODELS,
  ...GOOGLE_MODELS,
];

export const DEFAULT_MODEL_ID = "gpt-5.4";
