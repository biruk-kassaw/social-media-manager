export interface TranscriptionSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

export type AmharicTone = "creator" | "educational" | "formal";

export interface TranscriptionResult {
  text: string;
  amharicText?: string;
  amharicSegments?: TranscriptionSegment[];
  amharicTone?: AmharicTone;
  language: string;
  isEnglish: boolean;
  segments?: TranscriptionSegment[];
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
  | "localizing"
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
  tone?: AmharicTone;
  metadata?: AudioMetadata;
  result?: TranscriptionResult;
  error?: string;
}

export interface TranscribeRequest {
  url: string;
  provider?: "openai" | "groq" | "gemini" | "mock";
  tone?: AmharicTone;
  targetLanguage?: "en";
}

export interface RefineScriptRequest {
  text: string;
  segments?: TranscriptionSegment[];
  tone: AmharicTone;
  customInstructions?: string;
  jobId?: string;
}

export interface RefineScriptResponse {
  success: boolean;
  amharicText: string;
  amharicSegments?: TranscriptionSegment[];
  amharicTone: AmharicTone;
  error?: string;
}
