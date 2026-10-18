import { getTranscriptionProvider } from "../providers/transcription/factory";
import {
  ITranscriptionProvider,
  TranscriptionOptions,
} from "../providers/transcription/types";
import { TranscriptionResult } from "../types";

export class TranscriptionService {
  async transcribeAudio(
    audioPath: string,
    options?: {
      provider?: "openai" | "groq" | "gemini" | "mock";
      language?: string;
      translateToEnglish?: boolean;
    }
  ): Promise<TranscriptionResult> {
    const provider: ITranscriptionProvider = getTranscriptionProvider(
      options?.provider
    );

    const transOptions: TranscriptionOptions = {
      language: options?.language || "en",
      translateToEnglish: options?.translateToEnglish ?? true,
    };

    return provider.transcribe(audioPath, transOptions);
  }
}

export const transcriptionService = new TranscriptionService();
