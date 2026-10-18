import { TranscriptionResult } from "../../types";

export interface TranscriptionOptions {
  language?: string;
  prompt?: string;
  translateToEnglish?: boolean;
}

export interface ITranscriptionProvider {
  readonly name: string;
  readonly modelName: string;
  transcribe(
    audioPath: string,
    options?: TranscriptionOptions
  ): Promise<TranscriptionResult>;
}
