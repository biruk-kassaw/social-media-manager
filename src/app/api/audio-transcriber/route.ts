import { NextRequest, NextResponse } from "next/server";
import {
  transcribeRequestSchema,
  transcriptionPipeline,
} from "@/modules/audio-transcriber";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = transcribeRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { url, provider, tone } = parseResult.data;
    const job = await transcriptionPipeline.startJob(url, { provider, tone });

    return NextResponse.json({ success: true, job }, { status: 202 });
  } catch (err: any) {
    console.error("API error starting transcription job:", err);
    return NextResponse.json(
      { error: err.message || "Failed to start processing job" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    supportedPlatforms: ["tiktok"],
    tones: [
      {
        id: "creator",
        name: "Conversational Creator (ፈጣሪ / ማራኪ አቀራረብ)",
        description: "Modern, high-energy Addis Ababa creator style for TikTok/Reels",
      },
      {
        id: "educational",
        name: "Informative / Educational (ትምህርታዊ / ማብራሪያ)",
        description: "Clear, explanatory breakdown of concepts",
      },
      {
        id: "formal",
        name: "Formal / Professional (መደበኛ / ቢዝነስ)",
        description: "Respectful, broadcast-ready business tone",
      },
    ],
    providers: [
      {
        id: "gemini",
        name: "Google Gemini AI (gemini-3.8-flash)",
        available: !!process.env.GEMINI_API_KEY,
      },
      {
        id: "mock",
        name: "Mock Whisper (Offline / Dev)",
        available: true,
      },
      {
        id: "openai",
        name: "OpenAI Whisper (whisper-1)",
        available: !!process.env.OPENAI_API_KEY,
      },
      {
        id: "groq",
        name: "Groq Whisper (whisper-large-v3, ultra-fast)",
        available: !!process.env.GROQ_API_KEY,
      },
    ],
  });
}
