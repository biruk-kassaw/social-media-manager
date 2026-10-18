import { NextRequest, NextResponse } from "next/server";
import { jobManager } from "@/modules/audio-transcriber";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const job = await jobManager.getJob(id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to retrieve job" },
      { status: 500 }
    );
  }
}
