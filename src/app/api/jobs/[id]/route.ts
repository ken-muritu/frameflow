import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const workerUrl = process.env.WORKER_API_URL || "http://localhost:8000";
  const workerKey = process.env.WORKER_API_KEY || "";

  try {
    const res = await fetch(`${workerUrl}/jobs/${id}`, {
      headers: { "X-API-Key": workerKey },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    const mockStatuses = ["queued", "downloading", "extracting", "analyzing", "ranking", "captioning", "complete"];
    const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];

    return NextResponse.json({
      job_id: id,
      status: randomStatus,
      progress: randomStatus === "complete" ? 100 : Math.floor(Math.random() * 90),
      progress_message: `${randomStatus}...`,
      frame_count: randomStatus === "complete" ? 12 : null,
      created_at: new Date().toISOString(),
      _note: "Worker not available — demo mode",
    });
  }
}
