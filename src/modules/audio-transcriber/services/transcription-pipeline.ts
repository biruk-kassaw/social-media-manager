import { audioExtractionService } from "./audio-extraction.service";
import { transcriptionService } from "./transcription.service";
import { amharicLocalizationService } from "./amharic-localization.service";
import { jobManager } from "./job-manager.service";
import { TranscriberJob, AmharicTone } from "../types";

export class TranscriptionPipeline {
  /**
   * Starts a processing job asynchronously in the background
   */
  async startJob(
    url: string,
    options?: {
      provider?: "openai" | "groq" | "gemini" | "mock";
      tone?: AmharicTone;
    }
  ): Promise<TranscriberJob> {
    const job = await jobManager.createJob(url);

    if (options?.tone) {
      await jobManager.updateJob(job.id, { tone: options.tone });
    }

    // Run pipeline asynchronously without blocking HTTP response
    this.runPipeline(job.id, url, options?.provider, options?.tone).catch(
      (err) => {
        console.error(`Pipeline error on job ${job.id}:`, err);
      }
    );

    return job;
  }

  private async runPipeline(
    jobId: string,
    url: string,
    provider?: "openai" | "groq" | "gemini" | "mock",
    tone?: AmharicTone
  ): Promise<void> {
    let cleanupFn: (() => Promise<void>) | undefined;
    const selectedTone = tone || "creator";

    try {
      // Step 1: Extraction
      await jobManager.updateJob(jobId, {
        status: "extracting",
        progress: 25,
        currentStepMessage: "Resolving TikTok media and extracting audio stream...",
      });

      const extracted = await audioExtractionService.extractAudio(url);
      cleanupFn = extracted.cleanup;

      await jobManager.updateJob(jobId, {
        status: "extracting",
        progress: 50,
        currentStepMessage: `Audio extracted: "${extracted.title}". Preparing transcription...`,
        metadata: {
          title: extracted.title,
          author: extracted.author,
          duration: extracted.duration,
          audioPath: extracted.audioPath,
          audioUrl: extracted.audioUrl,
          thumbnailUrl: extracted.thumbnailUrl,
          format: extracted.format,
          platform: "tiktok",
          videoId: extracted.videoId,
          sourceUrl: extracted.sourceUrl,
        },
      });

      // Step 2: Speech-to-Text Transcription
      await jobManager.updateJob(jobId, {
        status: "transcribing",
        progress: 68,
        currentStepMessage: `Transcribing audio to English text with ${provider || "default"} model...`,
      });

      const result = await transcriptionService.transcribeAudio(
        extracted.audioPath,
        {
          provider,
          translateToEnglish: true,
        }
      );

      // Clean up extracted temp audio file immediately after transcription
      if (cleanupFn) {
        await cleanupFn();
        cleanupFn = undefined;
      }

      // Step 3: Decoupled Amharic Social Media Script Localization
      await jobManager.updateJob(jobId, {
        status: "localizing",
        progress: 85,
        currentStepMessage: `Localizing script into authentic Amharic (${selectedTone} style)...`,
      });

      const localization = await amharicLocalizationService.localize({
        text: result.text,
        segments: result.segments,
        tone: selectedTone,
      });

      result.amharicText = localization.amharicText;
      result.amharicSegments = localization.amharicSegments;
      result.amharicTone = localization.amharicTone;

      await jobManager.updateJob(jobId, {
        status: "completed",
        progress: 100,
        currentStepMessage: "Transcription and Amharic script localization completed successfully.",
        result,
      });
    } catch (err: any) {
      console.error(`Job ${jobId} failed:`, err);

      if (cleanupFn) {
        try {
          await cleanupFn();
        } catch {
          // ignore cleanup failure
        }
      }

      await jobManager.updateJob(jobId, {
        status: "failed",
        progress: 100,
        currentStepMessage: "Processing failed.",
        error:
          err?.message ||
          "An unexpected error occurred during audio extraction or transcription.",
      });
    }
  }
}

export const transcriptionPipeline = new TranscriptionPipeline();
