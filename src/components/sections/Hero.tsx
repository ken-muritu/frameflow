"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Zap, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockFrames = [
  { score: 9.4, caption: '"The most important skill you can develop..."', time: "12:34" },
  { score: 8.8, caption: '"Success is not final, failure is not fatal..."', time: "34:12" },
  { score: 9.1, caption: '"Every expert was once a beginner."', time: "1:02:45" },
  { score: 7.9, caption: '"Focus is more valuable than intelligence."', time: "45:18" },
  { score: 8.5, caption: '"The compound effect of daily habits..."', time: "22:07" },
  { score: 9.6, caption: '"Consistency beats intensity every time."', time: "58:33" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-[350px] h-[350px] bg-violet-500/8 rounded-full blur-3xl animate-blob animation-delay-4000" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center mb-6"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-sm text-violet-400">
            <Zap className="w-3.5 h-3.5" />
            <span className="font-medium">AI-Powered · Frame Intelligence Platform</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-violet-500/20 text-[10px] font-bold">v1.0</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6"
        >
          Capture the Moments
          <br />
          <span className="gradient-text text-glow-violet">That Matter</span>
          <br />
          — Automatically.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-white/50 leading-relaxed mb-10"
        >
          Paste any video URL and FrameFlow&apos;s AI instantly extracts your most shareable frames —
          captioned, branded, and formatted for every platform. No more pausing. No more missing the moment.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <Link href="/auth/signup">
            <Button variant="gradient" size="xl" className="gap-2 group">
              Start for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="outline" size="xl" className="gap-2">
              <Play className="w-4 h-4" />
              See How It Works
            </Button>
          </Link>
        </motion.div>

        {/* Social proof micro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-6 text-sm text-white/30 mb-16"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            Free tier — no credit card
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            10 frames/day free
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            Built by Kennedy Muritu
          </span>
        </motion.div>

        {/* Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-violet-600/20 via-transparent to-transparent rounded-2xl blur-3xl" />

          {/* Main panel */}
          <div className="relative glass-card rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/50">
            {/* Top bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="max-w-sm mx-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/[0.06]">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs text-white/40 truncate">youtube.com/watch?v=HubermanLab_Ep247</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="px-2 py-1 rounded-md bg-violet-600/20 border border-violet-500/30 text-[10px] text-violet-400 font-medium">
                  AI Mode
                </div>
              </div>
            </div>

            {/* Content area */}
            <div className="p-4 sm:p-6">
              {/* Processing bar */}
              <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white/70">Huberman Lab Ep. 247 — 2:14:38</span>
                    <span className="text-xs text-green-400 font-medium">Complete · 6 frames</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Frame grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mockFrames.map((frame, i) => (
                  <div
                    key={i}
                    className="group relative rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/40 transition-all cursor-pointer"
                  >
                    {/* Fake frame image */}
                    <div className="aspect-video bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center p-3">
                      <p className="text-[9px] sm:text-[10px] text-white/50 text-center leading-relaxed line-clamp-3">
                        {frame.caption}
                      </p>
                    </div>
                    {/* Meta */}
                    <div className="p-2 flex items-center justify-between">
                      <span className="text-[9px] text-white/30">{frame.time}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-[9px] font-semibold text-yellow-400">{frame.score}</span>
                      </div>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="px-2 py-1 rounded-full bg-violet-600 text-[9px] font-medium text-white">
                        Select
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom action bar */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
                <span className="text-xs text-white/30">6 of 24 frames selected · AI ranked</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    Apply Brand Kit
                  </Button>
                  <Button variant="gradient" size="sm" className="text-xs h-8 gap-1.5">
                    <span>Download ZIP</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
