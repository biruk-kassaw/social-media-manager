import { ITranscriptionProvider } from "./types";
import { MockTranscriptionProvider } from "./mock-whisper.provider";
import { OpenAIWhisperProvider } from "./openai-whisper.provider";
import { GroqWhisperProvider } from "./groq-whisper.provider";
import { GeminiTranscriptionProvider } from "./gemini.provider";

export function getTranscriptionProvider(
  preferredProvider?: "openai" | "groq" | "gemini" | "mock"
): ITranscriptionProvider {
  const chosen =
    preferredProvider ||
    (process.env.TRANSCRIPTION_PROVIDER as
      | "openai"
      | "groq"
      | "gemini"
      | "mock") ||
    (process.env.GEMINI_API_KEY ? "gemini" : "mock");

  if (chosen === "gemini") {
    if (process.env.GEMINI_API_KEY) {
      return new GeminiTranscriptionProvider();
    }
    console.warn(
      "⚠️ GEMINI_API_KEY is not set. Falling back to Mock Whisper Provider."
    );
    return new MockTranscriptionProvider();
  }

  if (chosen === "openai") {
    if (process.env.OPENAI_API_KEY) {
      return new OpenAIWhisperProvider();
    }
    console.warn(
      "⚠️ OPENAI_API_KEY is not set. Falling back to Mock Whisper Provider."
    );
    return new MockTranscriptionProvider();
  }

  if (chosen === "groq") {
    if (process.env.GROQ_API_KEY) {
      return new GroqWhisperProvider();
    }
    console.warn(
      "⚠️ GROQ_API_KEY is not set. Falling back to Mock Whisper Provider."
    );
    return new MockTranscriptionProvider();
  }

  // If Gemini key exists and mock wasn't explicitly requested
  if (process.env.GEMINI_API_KEY && !preferredProvider) {
    return new GeminiTranscriptionProvider();
  }

  return new MockTranscriptionProvider();
}
