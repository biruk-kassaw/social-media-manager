import { z } from "zod";

/**
 * Extracts a TikTok video URL from either raw text, a direct link,
 * or an HTML embed snippet (e.g., <blockquote cite="...">),
 * directly mirroring the logic from download_tiktok_audio.py.
 */
export function extractTikTokUrl(text: string): string {
  const trimmed = text.trim();

  // Check for cite attribute in HTML embed code: cite="https://..."
  const citeMatch = trimmed.match(/cite=['"]([^'"]+)['"]/i);
  if (citeMatch && citeMatch[1]) {
    return citeMatch[1].split("?")[0];
  }

  // Check for standard TikTok video URL
  const standardMatch = trimmed.match(
    /https?:\/\/(?:www\.)?tiktok\.com\/@[^/]+\/video\/\d+/i
  );
  if (standardMatch) {
    return standardMatch[0];
  }

  // Check for short URLs (vm.tiktok.com or vt.tiktok.com)
  const shortMatch = trimmed.match(
    /https?:\/\/(?:vm|vt)\.tiktok\.com\/[A-Za-z0-9_-]+/i
  );
  if (shortMatch) {
    return shortMatch[0];
  }

  // If it starts with http/https and contains tiktok
  if (
    (trimmed.startsWith("http://") || trimmed.startsWith("https://")) &&
    trimmed.includes("tiktok.com")
  ) {
    return trimmed.split("?")[0];
  }

  throw new Error("Could not find a valid TikTok video URL or embed code in the provided input.");
}

export const transcribeRequestSchema = z.object({
  url: z
    .string()
    .min(1, "URL or TikTok embed snippet is required")
    .refine(
      (val) => {
        try {
          extractTikTokUrl(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message:
          "Please enter a valid TikTok video URL (tiktok.com/@user/video/...), short link (vm.tiktok.com/...), or embed code.",
      }
    ),
  provider: z.enum(["openai", "groq", "gemini", "mock"]).optional().default("mock"),
  tone: z.enum(["creator", "educational", "formal"]).optional().default("creator"),
  targetLanguage: z.literal("en").optional().default("en"),
});

export type TranscribeRequestInput = z.infer<typeof transcribeRequestSchema>;

export const refineScriptSchema = z.object({
  text: z.string().min(1, "Original transcript text is required"),
  segments: z
    .array(
      z.object({
        id: z.number(),
        start: z.number(),
        end: z.number(),
        text: z.string(),
      })
    )
    .optional(),
  tone: z.enum(["creator", "educational", "formal"]).default("creator"),
  customInstructions: z.string().optional(),
  jobId: z.string().optional(),
});

export type RefineScriptInput = z.infer<typeof refineScriptSchema>;
