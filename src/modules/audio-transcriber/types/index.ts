export interface TranscriptionSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResult {
  text: string;
  amharicText?: string;
  language: string;
  isEnglish: boolean;
  segments?: TranscriptionSegment[];
  amharicSegments?: TranscriptionSegment[];
  duration?: number;
  provider: string;
  model?: string;
  completedAt: string;
}

export interface AudioMetadata {
  title: string;
  author: string;
  duration?: number;
  audioPath: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  format: "mp3" | "m4a" | "wav";
  platform: "tiktok";
  videoId?: string;
  sourceUrl: string;
}

export type JobStatus =
  | "queued"
  | "extracting"
  | "transcribing"
  | "completed"
  | "failed";

export interface TranscriberJob {
  id: string;
  status: JobStatus;
  inputUrl: string;
  createdAt: string;
  updatedAt: string;
  progress: number;
  currentStepMessage: string;
  metadata?: AudioMetadata;
  result?: TranscriptionResult;
  error?: string;
}

export interface TranscribeRequest {
  url: string;
  provider?: "openai" | "groq" | "gemini" | "mock";
  targetLanguage?: "en";
}
