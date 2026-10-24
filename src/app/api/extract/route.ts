import { NextRequest, NextResponse } from "next/server";
import { detectPlatform } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, mode = "ai", options = {} } = body;

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    const platform = detectPlatform(url);

    if (platform === "unknown") {
      return NextResponse.json({ error: "Unsupported platform or URL" }, { status: 400 });
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const workerUrl = process.env.WORKER_API_URL || "http://localhost:8000";
    const workerKey = process.env.WORKER_API_KEY || "";

    let workerResponse;
    try {
      workerResponse = await fetch(`${workerUrl}/extract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": workerKey,
        },
        body: JSON.stringify({ job_id: jobId, url, platform, mode, options }),
      });
    } catch {
      return NextResponse.json(
        {
          job_id: jobId,
          status: "queued",
          platform,
          estimated_duration_seconds: 45,
          created_at: new Date().toISOString(),
          _note: "Worker not available — running in demo mode",
        },
        { status: 202 }
      );
    }

    if (!workerResponse.ok) {
      return NextResponse.json({ error: "Worker failed to start job" }, { status: 500 });
    }

    return NextResponse.json({
      job_id: jobId,
      status: "queued",
      platform,
      estimated_duration_seconds: 45,
      created_at: new Date().toISOString(),
    }, { status: 202 });

  } catch (error) {
    console.error("Extract API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
