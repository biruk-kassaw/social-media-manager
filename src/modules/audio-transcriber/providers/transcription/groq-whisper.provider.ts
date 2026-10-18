import { promises as fs } from "node:fs";
import path from "node:path";
import { TranscriptionResult } from "../../types";
import { ITranscriptionProvider, TranscriptionOptions } from "./types";

export class GroqWhisperProvider implements ITranscriptionProvider {
  readonly name = "Groq Whisper (Fast)";
  readonly modelName = "whisper-large-v3";
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || "";
    if (!this.apiKey) {
      console.warn("⚠️ Groq Whisper Provider initialized without an API key.");
    }
  }

  async transcribe(
    audioPath: string,
    options?: TranscriptionOptions
  ): Promise<TranscriptionResult> {
    if (!this.apiKey) {
      throw new Error(
        "Groq API key is missing. Please set GROQ_API_KEY in your environment or .env.local file."
      );
    }

    const fileBuffer = await fs.readFile(audioPath);
    const fileName = path.basename(audioPath);

    const formData = new FormData();
    const fileBlob = new Blob([fileBuffer], { type: "audio/mpeg" });
    formData.append("file", fileBlob, fileName);
    formData.append("model", this.modelName);
    formData.append("response_format", "verbose_json");

    const endpoint = options?.translateToEnglish
      ? "https://api.groq.com/openai/v1/audio/translations"
      : "https://api.groq.com/openai/v1/audio/transcriptions";

    if (!options?.translateToEnglish && options?.language) {
      formData.append("language", options.language);
    }

    if (options?.prompt) {
      formData.append("prompt", options.prompt);
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(
        `Groq Whisper API request failed (${response.status}): ${errText}`
      );
    }

    const data = await response.json();

    const segments = (data.segments || []).map((seg: any, idx: number) => ({
      id: idx + 1,
      start: Math.round(seg.start * 10) / 10,
      end: Math.round(seg.end * 10) / 10,
      text: seg.text.trim(),
    }));

    const detectedLanguage = data.language || options?.language || "en";
    const isEnglish =
      detectedLanguage.toLowerCase() === "en" ||
      detectedLanguage.toLowerCase() === "english" ||
      !!options?.translateToEnglish;

    return {
      text: data.text?.trim() || "",
      language: detectedLanguage,
      isEnglish,
      segments: segments.length > 0 ? segments : undefined,
      duration: data.duration,
      provider: this.name,
      model: this.modelName,
      completedAt: new Date().toISOString(),
    };
  }
}
