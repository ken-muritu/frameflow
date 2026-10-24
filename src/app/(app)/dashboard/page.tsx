"use client";

import Link from "next/link";
import {
  Zap, Image, Download, Clock, TrendingUp, ArrowRight,
  Youtube, Play, Star, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatTimestamp } from "@/lib/utils";

const stats = [
  { label: "Extractions Today", value: "7", limit: "10", icon: Zap, color: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "Total Frames Saved", value: "284", icon: Image, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { label: "Downloads This Month", value: "53", icon: Download, color: "text-green-400", bg: "bg-green-500/10" },
  { label: "Hours Processed", value: "12.4", icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
];

const recentJobs = [
  {
    id: "1",
    title: "Lex Fridman #421 — Jensen Huang",
    platform: "YouTube",
    duration: "3h 12m",
    frames: 18,
    status: "complete",
    time: "2 hours ago",
    score: 9.2,
  },
  {
    id: "2",
    title: "Modern Wisdom #756 — Chris Williamson",
    platform: "YouTube",
    duration: "1h 48m",
    frames: 12,
    status: "complete",
    time: "Yesterday",
    score: 8.7,
  },
  {
    id: "3",
    title: "Naval on X — Wealth creation thread",
    platform: "X",
    duration: "0:45",
    frames: 4,
    status: "complete",
    time: "2 days ago",
    score: 9.6,
  },
  {
    id: "4",
    title: "Huberman Lab — Sleep optimization",
    platform: "YouTube",
    duration: "2h 15m",
    frames: 21,
    status: "complete",
    time: "3 days ago",
    score: 8.9,
  },
];

const quickTips = [
  "Use AI Mode for podcasts — it aligns frames to key quotes automatically",
  "Apply your brand kit before downloading to watermark all frames at once",
  "Batch mode (Pro) lets you queue up to 20 URLs in one session",
];

export default function DashboardPage() {
  const usagePercent = (7 / 10) * 100;

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-0.5">Welcome back · Free Plan</p>
        </div>
        <Link href="/extract">
          <Button variant="gradient" className="gap-2">
            <Zap className="w-4 h-4" />
            New Extraction
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-5 rounded-xl bg-[#0F0F1B] border border-white/[0.06]">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
              {stat.limit && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-[10px] text-white/30 mb-1">
                    <span>Daily limit</span>
                    <span>{stat.value}/{stat.limit}</span>
                  </div>
                  <Progress value={usagePercent} className="h-1" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Extractions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Recent Extractions</h2>
            <Link href="/gallery" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#0F0F1B] border border-white/[0.06] hover:border-white/10 transition-colors group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  {job.platform === "YouTube" ? (
                    <Youtube className="w-5 h-5 text-red-400" />
                  ) : (
                    <Play className="w-5 h-5 text-white/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{job.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-white/30">{job.platform}</span>
                    <span className="text-[11px] text-white/20">·</span>
                    <span className="text-[11px] text-white/30">{job.duration}</span>
                    <span className="text-[11px] text-white/20">·</span>
                    <span className="text-[11px] text-white/30">{job.frames} frames</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-yellow-400 font-medium">{job.score}</span>
                  </div>
                  <Badge variant="success" className="text-[10px] px-1.5 py-0">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                    Done
                  </Badge>
                  <span className="text-[11px] text-white/25">{job.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Usage + Tips */}
        <div className="space-y-4">
          {/* Upgrade Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-violet-600/15 to-cyan-500/10 border border-violet-500/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-white">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-white/50 mb-4 leading-relaxed">
              You&apos;ve used 7 of 10 daily extractions. Pro gives you unlimited — plus full AI pipeline, brand kit, and all platforms.
            </p>
            <Link href="/pricing">
              <Button variant="gradient" size="sm" className="w-full text-xs">
                Get Pro — $12/month
              </Button>
            </Link>
          </div>

          {/* Quick Tips */}
          <div className="p-5 rounded-xl bg-[#0F0F1B] border border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2.5">
              {quickTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/40 leading-relaxed">
                  <span className="text-violet-400 flex-shrink-0 mt-0.5">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Extract */}
          <div className="p-5 rounded-xl bg-[#0F0F1B] border border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Extract</h3>
            <Link href="/extract">
              <Button variant="gradient-outline" size="sm" className="w-full gap-2">
                <Zap className="w-3.5 h-3.5" />
                Paste a URL
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
