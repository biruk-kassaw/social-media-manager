import { NextResponse } from "next/server";
import { jobManager } from "@/modules/audio-transcriber";

export async function GET() {
  try {
    const jobs = await jobManager.listJobs();
    return NextResponse.json({ jobs });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to list jobs" },
      { status: 500 }
    );
  }
}
