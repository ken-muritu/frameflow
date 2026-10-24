"use client";

import { useState } from "react";
import {
  Zap, Link2, Cpu, Star, Download, CheckCircle2,
  Copy, SlidersHorizontal, Clock, LayoutGrid, List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { detectPlatform, getPlatformLabel, formatTimestamp } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Stage = "idle" | "processing" | "complete";

const mockFrames = [
  { id: "1", timestamp: 754, caption: '"The most powerful thing you can do is develop a craft that compounds over time."', score: 9.6, face: true, text: true },
  { id: "2", timestamp: 1234, caption: '"Consistency is not about perfection. It\'s about showing up."', score: 9.1, face: true, text: true },
  { id: "3", timestamp: 2045, caption: '"The secret to getting ahead is getting started."', score: 8.8, face: false, text: true },
  { id: "4", timestamp: 3312, caption: '"Focus is more valuable than intelligence in today\'s world."', score: 8.5, face: true, text: false },
  { id: "5", timestamp: 4567, caption: '"Every expert was once a complete beginner."', score: 8.2, face: true, text: true },
  { id: "6", timestamp: 5892, caption: '"Compound interest works on skills, not just money."', score: 7.9, face: false, text: true },
];

const stages = [
  { key: "downloading", label: "Downloading video", icon: Link2, duration: 1500 },
  { key: "extracting", label: "Extracting frames", icon: Cpu, duration: 2000 },
  { key: "analyzing", label: "AI scoring frames", icon: Star, duration: 2500 },
  { key: "captioning", label: "Aligning captions", icon: Copy, duration: 1000 },
  { key: "complete", label: "Ready!", icon: CheckCircle2, duration: 0 },
];

export default function ExtractPage() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState("ai");
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedFrames, setSelectedFrames] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"grid" | "list">("grid");

  const platform = detectPlatform(url);

  const runExtraction = async () => {
    if (!url.trim()) return;
    setStage("processing");
    setProgress(0);
    setCurrentStage(0);
    setSelectedFrames(new Set());

    for (let i = 0; i < stages.length - 1; i++) {
      setCurrentStage(i);
      const steps = 20;
      const baseProgress = (i / (stages.length - 1)) * 100;
      for (let j = 0; j <= steps; j++) {
        await new Promise((r) => setTimeout(r, stages[i].duration / steps));
        setProgress(baseProgress + (j / steps) * (100 / (stages.length - 1)));
      }
    }
    setCurrentStage(stages.length - 1);
    setProgress(100);
    setStage("complete");
    setSelectedFrames(new Set(mockFrames.map((f) => f.id)));
  };

  const toggleFrame = (id: string) => {
    setSelectedFrames((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Extract Frames</h1>
        <p className="text-white/40 text-sm mt-0.5">Paste a video URL and let FrameFlow&apos;s AI do the rest</p>
      </div>

      {/* URL Input */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              type="url"
              placeholder="Paste YouTube, TikTok, Instagram, X or any video URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 h-12 text-base"
              disabled={stage === "processing"}
            />
            {url && platform !== "unknown" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Badge variant="violet" className="text-[10px]">{getPlatformLabel(platform)}</Badge>
              </div>
            )}
          </div>
          <Button
            variant="gradient"
            size="lg"
            onClick={runExtraction}
            disabled={!url.trim() || stage === "processing"}
            className="h-12 px-6 gap-2 flex-shrink-0"
          >
            <Zap className="w-4 h-4" />
            {stage === "processing" ? "Processing..." : "Extract"}
          </Button>
        </div>

        {/* Mode selector */}
        <Tabs value={mode} onValueChange={setMode}>
          <TabsList className="h-9">
            <TabsTrigger value="ai" className="text-xs gap-1.5">
              <Star className="w-3 h-3" />AI Auto-Select
            </TabsTrigger>
            <TabsTrigger value="interval" className="text-xs gap-1.5">
              <Clock className="w-3 h-3" />Every N Seconds
            </TabsTrigger>
            <TabsTrigger value="timestamps" className="text-xs gap-1.5">
              <SlidersHorizontal className="w-3 h-3" />Manual Timestamps
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ai" className="mt-3">
            <p className="text-xs text-white/40">
              AI mode uses CLIP vision models + Whisper transcript alignment to automatically surface the most shareable frames.
            </p>
          </TabsContent>
          <TabsContent value="interval" className="mt-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40">Extract a frame every</span>
              <Input type="number" defaultValue={30} className="w-20 h-8 text-xs" />
              <span className="text-xs text-white/40">seconds</span>
            </div>
          </TabsContent>
          <TabsContent value="timestamps" className="mt-3">
            <Input placeholder="e.g. 1:23, 5:45, 12:30" className="text-xs h-8" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Processing Progress */}
      {stage === "processing" && (
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white">{stages[currentStage]?.label}</span>
            <span className="text-sm text-violet-400 font-semibold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex gap-2">
            {stages.slice(0, -1).map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.key}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all",
                    i < currentStage
                      ? "bg-green-500/20 text-green-400"
                      : i === currentStage
                      ? "bg-violet-500/20 text-violet-400 animate-pulse"
                      : "bg-white/5 text-white/20"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {s.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Results */}
      {stage === "complete" && (
        <div>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white">{mockFrames.length} frames extracted</span>
              <Badge variant="success" className="text-[10px]">
                <CheckCircle2 className="w-2.5 h-2.5 mr-1" />AI Ranked
              </Badge>
              <span className="text-xs text-white/30">{selectedFrames.size} selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("grid")}
                className={cn("p-1.5 rounded", view === "grid" ? "text-white bg-white/10" : "text-white/30")}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn("p-1.5 rounded", view === "list" ? "text-white bg-white/10" : "text-white/30")}
              >
                <List className="w-4 h-4" />
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFrames(new Set(mockFrames.map((f) => f.id)))}
              >
                Select All
              </Button>
              <Button variant="gradient" size="sm" className="gap-2" disabled={selectedFrames.size === 0}>
                <Download className="w-4 h-4" />
                Download ZIP ({selectedFrames.size})
              </Button>
            </div>
          </div>

          {/* Grid */}
          <div className={cn(
            view === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 gap-4"
              : "space-y-2"
          )}>
            {mockFrames.map((frame) => {
              const selected = selectedFrames.has(frame.id);
              return view === "grid" ? (
                <div
                  key={frame.id}
                  onClick={() => toggleFrame(frame.id)}
                  className={cn(
                    "group relative rounded-xl overflow-hidden cursor-pointer transition-all",
                    selected
                      ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-[#0F0F1B]"
                      : "ring-1 ring-white/[0.06] hover:ring-white/20"
                  )}
                >
                  <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
                    <p className="text-xs text-white/50 text-center leading-relaxed line-clamp-3">{frame.caption}</p>
                  </div>
                  <div className="p-3 bg-[#0F0F1B] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-white/30" />
                      <span className="text-[11px] text-white/40">{formatTimestamp(frame.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[11px] text-yellow-400 font-semibold">{frame.score}</span>
                    </div>
                  </div>
                  {selected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  key={frame.id}
                  onClick={() => toggleFrame(frame.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all",
                    selected ? "bg-violet-600/10 border border-violet-500/30" : "bg-[#0F0F1B] border border-white/[0.06] hover:border-white/10"
                  )}
                >
                  <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0", selected ? "bg-violet-600 border-violet-600" : "border-white/20")}>
                    {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div className="w-16 h-10 bg-slate-800 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/70 truncate">{frame.caption}</p>
                    <span className="text-xs text-white/30">{formatTimestamp(frame.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-yellow-400 font-semibold">{frame.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
