export interface AudioExtractionResult {
  audioPath: string;
  title: string;
  author: string;
  duration?: number;
  thumbnailUrl?: string;
  audioUrl?: string;
  videoId?: string;
  format: "mp3" | "m4a" | "wav";
  sourceUrl: string;
  cleanup?: () => Promise<void>;
}

export interface IAudioExtractor {
  extract(inputUrlOrEmbed: string): Promise<AudioExtractionResult>;
}
