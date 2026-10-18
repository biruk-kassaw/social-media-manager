import { audioExtractionService } from "./audio-extraction.service";
import { transcriptionService } from "./transcription.service";
import { jobManager } from "./job-manager.service";
import { TranscriberJob } from "../types";

export class TranscriptionPipeline {
  /**
   * Starts a processing job asynchronously in the background
   */
  async startJob(
    url: string,
    options?: {
      provider?: "openai" | "groq" | "gemini" | "mock";
    }
  ): Promise<TranscriberJob> {
    const job = await jobManager.createJob(url);

    // Run pipeline asynchronously without blocking HTTP response
    this.runPipeline(job.id, url, options?.provider).catch((err) => {
      console.error(`Pipeline error on job ${job.id}:`, err);
    });

    return job;
  }

  private async runPipeline(
    jobId: string,
    url: string,
    provider?: "openai" | "groq" | "gemini" | "mock"
  ): Promise<void> {
    let cleanupFn: (() => Promise<void>) | undefined;

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
        progress: 55,
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

      // Step 2: Transcription
      await jobManager.updateJob(jobId, {
        status: "transcribing",
        progress: 75,
        currentStepMessage: `Transcribing audio to English text with ${provider || "default"} model...`,
      });

      const result = await transcriptionService.transcribeAudio(
        extracted.audioPath,
        {
          provider,
          translateToEnglish: true,
        }
      );

      // Step 3: Completion & Cleanup
      if (cleanupFn) {
        await cleanupFn();
      }

      await jobManager.updateJob(jobId, {
        status: "completed",
        progress: 100,
        currentStepMessage: "Transcription completed successfully.",
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
