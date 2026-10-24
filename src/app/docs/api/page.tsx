import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "API Documentation — FrameFlow",
  description: "FrameFlow REST API reference. Integrate frame extraction into your own tools.",
};

const endpoints = [
  {
    method: "POST",
    path: "/api/v1/extract",
    description: "Start a frame extraction job for a video URL.",
    body: `{
  "url": "https://youtube.com/watch?v=...",
  "mode": "ai | interval | timestamps",
  "options": {
    "max_frames": 20,
    "interval_seconds": 30,
    "timestamps": [100, 200, 300],
    "include_captions": true,
    "apply_brand_kit": false
  }
}`,
    response: `{
  "job_id": "job_01JBVX...",
  "status": "queued",
  "estimated_duration_seconds": 45,
  "created_at": "2026-04-13T09:14:00Z"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/jobs/{id}",
    description: "Poll the status and progress of an extraction job.",
    body: null,
    response: `{
  "job_id": "job_01JBVX...",
  "status": "extracting | analyzing | complete | failed",
  "progress": 68,
  "progress_message": "AI scoring frames...",
  "frame_count": 12,
  "completed_at": null
}`,
  },
  {
    method: "GET",
    path: "/api/v1/frames/{job_id}",
    description: "Retrieve all extracted frames with metadata and scores.",
    body: null,
    response: `{
  "frames": [
    {
      "id": "frm_01JBVX...",
      "timestamp": 754.3,
      "url": "https://cdn.frameflow.io/frames/...",
      "caption": "The most powerful thing...",
      "ai_score": 9.6,
      "face_detected": true,
      "text_detected": true,
      "width": 1920,
      "height": 1080,
      "file_size_bytes": 284520
    }
  ],
  "total": 12,
  "job_id": "job_01JBVX..."
}`,
  },
  {
    method: "POST",
    path: "/api/v1/frames/{id}/caption",
    description: "Generate or customize caption for a specific frame.",
    body: `{
  "style": "quote | description | hashtags",
  "max_length": 280,
  "language": "en"
}`,
    response: `{
  "frame_id": "frm_01JBVX...",
  "caption": "The most powerful thing you can do...",
  "tokens": 12
}`,
  },
  {
    method: "POST",
    path: "/api/v1/webhooks",
    description: "Register a webhook endpoint to receive job completion events.",
    body: `{
  "url": "https://yourapp.com/webhook",
  "events": ["job.complete", "job.failed"],
  "secret": "your_webhook_secret"
}`,
    response: `{
  "webhook_id": "wh_01JBVX...",
  "url": "https://yourapp.com/webhook",
  "active": true
}`,
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-green-500/20 text-green-400 border-green-500/30",
  POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[#08080F] text-white">
      <Navbar />
      <main className="pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <Badge variant="violet" className="mb-4">API Reference</Badge>
            <h1 className="text-4xl font-bold text-white mb-3">FrameFlow REST API</h1>
            <p className="text-white/50 max-w-xl">
              Integrate frame extraction into your own tools — newsletter builders, social schedulers, 
              learning platforms, and content libraries. Available on Pro and Business plans.
            </p>
          </div>

          {/* Base URL */}
          <div className="p-4 rounded-xl bg-[#0F0F1B] border border-white/[0.06] mb-8 font-mono text-sm">
            <span className="text-white/40">Base URL: </span>
            <span className="text-violet-400">https://api.frameflow.io/v1</span>
          </div>

          {/* Auth */}
          <div className="p-6 rounded-xl bg-[#0F0F1B] border border-white/[0.06] mb-8">
            <h2 className="text-lg font-semibold text-white mb-3">Authentication</h2>
            <p className="text-sm text-white/50 mb-3">
              All API requests require a Bearer token in the Authorization header.
            </p>
            <pre className="bg-black/40 rounded-lg p-4 text-sm text-green-400 overflow-x-auto">
              {`curl -H "Authorization: Bearer <YOUR_API_KEY>" \\
     https://api.frameflow.io/v1/jobs`}
            </pre>
          </div>

          {/* Endpoints */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Endpoints</h2>
            {endpoints.map((endpoint) => (
              <div key={endpoint.path} className="rounded-xl bg-[#0F0F1B] border border-white/[0.06] overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${methodColors[endpoint.method]}`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm text-white font-mono">{endpoint.path}</code>
                </div>
                <div className="p-4">
                  <p className="text-sm text-white/50 mb-4">{endpoint.description}</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {endpoint.body && (
                      <div>
                        <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Request Body</p>
                        <pre className="bg-black/40 rounded-lg p-3 text-xs text-cyan-300 overflow-x-auto">
                          {endpoint.body}
                        </pre>
                      </div>
                    )}
                    <div className={!endpoint.body ? "sm:col-span-2" : ""}>
                      <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Response</p>
                      <pre className="bg-black/40 rounded-lg p-3 text-xs text-green-300 overflow-x-auto">
                        {endpoint.response}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rate Limits */}
          <div className="mt-8 p-6 rounded-xl bg-[#0F0F1B] border border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-3">Rate Limits</h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {[
                { plan: "Free", limit: "10 calls/day", note: "No API access" },
                { plan: "Pro", limit: "Not included", note: "API Tier only" },
                { plan: "API Tier", limit: "500 calls/month + pay-per-use", note: "$0.02/call above quota" },
              ].map(({ plan, limit, note }) => (
                <div key={plan} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <p className="font-medium text-white mb-1">{plan}</p>
                  <p className="text-white/50 text-xs">{limit}</p>
                  <p className="text-white/30 text-xs mt-1">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
