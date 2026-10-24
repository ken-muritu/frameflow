import { NextRequest, NextResponse } from "next/server";

const MOCK_FRAMES = [
  {
    id: "frm_001",
    timestamp: 754.3,
    url: "https://placehold.co/1920x1080/1a1a2e/white?text=Frame+1",
    caption: '"The most powerful thing you can do is develop a craft that compounds."',
    ai_score: 9.6,
    face_detected: true,
    text_detected: true,
    width: 1920,
    height: 1080,
    file_size_bytes: 284520,
    metadata: { visual_score: 9.2, transcript_alignment_score: 9.8, scene_novelty_score: 9.5, composite_score: 9.6 },
  },
  {
    id: "frm_002",
    timestamp: 1234.7,
    url: "https://placehold.co/1920x1080/1a1a2e/white?text=Frame+2",
    caption: '"Consistency is not about perfection. It\'s about showing up."',
    ai_score: 9.1,
    face_detected: true,
    text_detected: true,
    width: 1920,
    height: 1080,
    file_size_bytes: 276440,
    metadata: { visual_score: 8.8, transcript_alignment_score: 9.4, scene_novelty_score: 9.0, composite_score: 9.1 },
  },
  {
    id: "frm_003",
    timestamp: 2045.2,
    url: "https://placehold.co/1920x1080/1a1a2e/white?text=Frame+3",
    caption: '"The secret to getting ahead is getting started."',
    ai_score: 8.8,
    face_detected: false,
    text_detected: true,
    width: 1920,
    height: 1080,
    file_size_bytes: 261300,
    metadata: { visual_score: 8.5, transcript_alignment_score: 9.1, scene_novelty_score: 8.8, composite_score: 8.8 },
  },
];

export async function GET(
  req: NextRequest,
  { params }: { params: { job_id: string } }
) {
  const { job_id } = params;

  const workerUrl = process.env.WORKER_API_URL || "http://localhost:8000";
  const workerKey = process.env.WORKER_API_KEY || "";

  try {
    const res = await fetch(`${workerUrl}/frames/${job_id}`, {
      headers: { "X-API-Key": workerKey },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Frames not found" }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      frames: MOCK_FRAMES,
      total: MOCK_FRAMES.length,
      job_id,
      _note: "Worker not available — returning demo frames",
    });
  }
}
