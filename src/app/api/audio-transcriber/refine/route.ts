import { NextRequest, NextResponse } from "next/server";
import {
  refineScriptSchema,
  amharicLocalizationService,
  jobManager,
} from "@/modules/audio-transcriber";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = refineScriptSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { text, segments, tone, customInstructions, jobId } = parseResult.data;

    // Run specialized Amharic localization
    const localized = await amharicLocalizationService.localize({
      text,
      segments,
      tone,
      customInstructions,
    });

    // If linked to an existing job, update the stored job result
    if (jobId) {
      try {
        const job = await jobManager.getJob(jobId);
        if (job && job.result) {
          await jobManager.updateJob(jobId, {
            tone,
            result: {
              ...job.result,
              amharicText: localized.amharicText,
              amharicSegments: localized.amharicSegments,
              amharicTone: localized.amharicTone,
            },
          });
        }
      } catch (err) {
        console.warn(`Could not update job ${jobId} with refined Amharic script:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      amharicText: localized.amharicText,
      amharicSegments: localized.amharicSegments,
      amharicTone: localized.amharicTone,
    });
  } catch (err: any) {
    console.error("API error refining script:", err);
    return NextResponse.json(
      { error: err.message || "Failed to refine Amharic script" },
      { status: 500 }
    );
  }
}
