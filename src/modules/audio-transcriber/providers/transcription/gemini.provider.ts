import { promises as fs } from "node:fs";
import path from "node:path";
import { TranscriptionResult } from "../../types";
import { ITranscriptionProvider, TranscriptionOptions } from "./types";

export class GeminiTranscriptionProvider implements ITranscriptionProvider {
  readonly name = "Google Gemini AI";
  readonly modelName = "gemini-3.8-flash";
  private apiKey: string;

  constructor(apiKey?: string, modelName?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || "";
    if (modelName) {
      (this as any).modelName = modelName;
    }
    if (!this.apiKey) {
      console.warn("⚠️ Gemini Transcription Provider initialized without an API key.");
    }
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case ".mp3":
        return "audio/mp3";
      case ".m4a":
        return "audio/m4a";
      case ".wav":
        return "audio/wav";
      case ".aac":
        return "audio/aac";
      case ".ogg":
        return "audio/ogg";
      default:
        return "audio/mp3";
    }
  }

  async transcribe(
    audioPath: string,
    options?: TranscriptionOptions
  ): Promise<TranscriptionResult> {
    if (!this.apiKey) {
      throw new Error(
        "Gemini API key is missing. Please set GEMINI_API_KEY in your environment or .env.local file."
      );
    }

    const fileBuffer = await fs.readFile(audioPath);
    const base64Data = fileBuffer.toString("base64");
    const mimeType = this.getMimeType(audioPath);

    const promptText = `
You are an expert audio transcriber and multilingual translator specializing in English and Amharic (አማርኛ).
Please listen to the attached audio file and perform two key tasks:
1. Transcribe the spoken dialogue into clean, natural English (if spoken in another language, translate it to English).
2. Translate the speech into authentic, high-quality Amharic (አማርኛ) text written in the Ge'ez script (ፊደል).
Ensure the Amharic translation is natural, grammatically sound, and conveys the full context and nuance.

Respond strictly in valid JSON with this exact structure:
{
  "text": "Full continuous English transcription text here.",
  "amharicText": "ሙሉውን የአማርኛ ትርጉም እዚህ ይጻፉ።",
  "language": "Detected spoken language (e.g. English, Spanish, Amharic, etc.)",
  "segments": [
    {
      "id": 1,
      "start": 0.0,
      "end": 3.5,
      "text": "English segment"
    }
  ],
  "amharicSegments": [
    {
      "id": 1,
      "start": 0.0,
      "end": 3.5,
      "text": "የአማርኛ ክፍል ጽሑፍ"
    }
  ]
}
`.trim();

    const requestUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;

    const payload = {
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    };

    let response: Response | null = null;
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 503 || response.status === 429) {
        if (attempt < maxRetries) {
          console.warn(
            `⚠️ Gemini API temporary spike (HTTP ${response.status}). Retrying in ${attempt * 1.5}s (attempt ${attempt}/${maxRetries})...`
          );
          await new Promise((r) => setTimeout(r, attempt * 1500));
          continue;
        }
      }
      break;
    }

    if (!response || !response.ok) {
      const errorText = response ? await response.text() : "Network error";
      throw new Error(
        `Gemini API transcription failed (HTTP ${response?.status || 500}): ${errorText}`
      );
    }

    const data = await response.json();
    const candidateText =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error(
        "Gemini API returned an empty response. The audio may be silent or inaudible."
      );
    }

    try {
      const parsed = JSON.parse(candidateText);
      const text = (parsed.text || "").trim();
      const amharicText = (parsed.amharicText || "").trim();
      const detectedLanguage = parsed.language || "English";
      const isEnglish = true; // English transcript is always provided

      const segments = Array.isArray(parsed.segments)
        ? parsed.segments.map((seg: any, idx: number) => ({
            id: seg.id || idx + 1,
            start: typeof seg.start === "number" ? seg.start : 0,
            end: typeof seg.end === "number" ? seg.end : 0,
            text: (seg.text || "").trim(),
          }))
        : undefined;

      const amharicSegments = Array.isArray(parsed.amharicSegments)
        ? parsed.amharicSegments.map((seg: any, idx: number) => ({
            id: seg.id || idx + 1,
            start: typeof seg.start === "number" ? seg.start : 0,
            end: typeof seg.end === "number" ? seg.end : 0,
            text: (seg.text || "").trim(),
          }))
        : undefined;

      return {
        text,
        amharicText: amharicText || undefined,
        language: detectedLanguage,
        isEnglish,
        segments: segments && segments.length > 0 ? segments : undefined,
        amharicSegments:
          amharicSegments && amharicSegments.length > 0
            ? amharicSegments
            : undefined,
        provider: this.name,
        model: this.modelName,
        completedAt: new Date().toISOString(),
      };
    } catch {
      // Fallback if model responded in plain text instead of strict JSON
      return {
        text: candidateText.trim(),
        language: "en",
        isEnglish: true,
        provider: this.name,
        model: this.modelName,
        completedAt: new Date().toISOString(),
      };
    }
  }
}
