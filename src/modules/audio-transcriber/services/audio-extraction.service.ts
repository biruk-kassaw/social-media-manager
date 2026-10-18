import { TikTokAudioExtractor } from "../providers/audio-extractor/tiktok-extractor";
import {
  AudioExtractionResult,
  IAudioExtractor,
} from "../providers/audio-extractor/types";

export class AudioExtractionService {
  private extractor: IAudioExtractor;

  constructor(extractor?: IAudioExtractor) {
    this.extractor = extractor || new TikTokAudioExtractor();
  }

  async extractAudio(urlOrEmbed: string): Promise<AudioExtractionResult> {
    return this.extractor.extract(urlOrEmbed);
  }
}

export const audioExtractionService = new AudioExtractionService();
