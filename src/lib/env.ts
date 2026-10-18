import { z } from "zod";

const envSchema = z.object({
  TRANSCRIPTION_PROVIDER: z
    .enum(["openai", "groq", "gemini", "mock"])
    .default("mock"),
  OPENAI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = {
  TRANSCRIPTION_PROVIDER:
    (process.env.TRANSCRIPTION_PROVIDER as
      | "openai"
      | "groq"
      | "gemini"
      | "mock") || "mock",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  NODE_ENV: process.env.NODE_ENV || "development",
};

export function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.warn("⚠️ Invalid environment variables:", result.error.format());
  }
  return result.success;
}
