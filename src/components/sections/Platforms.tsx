"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const platforms = [
  { name: "YouTube", emoji: "▶️", color: "#FF0000", release: "v1", status: "live" },
  { name: "Instagram", emoji: "📸", color: "#E1306C", release: "v1", status: "live" },
  { name: "TikTok", emoji: "🎵", color: "#69C9D0", release: "v1", status: "live" },
  { name: "X (Twitter)", emoji: "𝕏", color: "#1DA1F2", release: "v1", status: "live" },
  { name: "Facebook", emoji: "👤", color: "#1877F2", release: "v1", status: "live" },
  { name: "Direct URL / MP4", emoji: "🔗", color: "#8B5CF6", release: "v1", status: "live" },
  { name: "LinkedIn", emoji: "💼", color: "#0A66C2", release: "v2", status: "soon" },
  { name: "Spotify", emoji: "🎧", color: "#1DB954", release: "v2", status: "soon" },
  { name: "Twitch", emoji: "🎮", color: "#9146FF", release: "v2", status: "soon" },
  { name: "Rumble", emoji: "📹", color: "#85C742", release: "v2", status: "soon" },
  { name: "Loom", emoji: "🎬", color: "#FF5B5E", release: "v3", status: "planned" },
  { name: "Vimeo", emoji: "🎥", color: "#1AB7EA", release: "v3", status: "planned" },
];

export default function Platforms() {
  return (
    <section id="platforms" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-violet-400 uppercase tracking-wider mb-3"
          >
            Supported Platforms
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Where the Video Lives,
            <br />
            <span className="gradient-text">FrameFlow Follows</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-white/50"
          >
            Platform-agnostic at its core. v1 covers the biggest six. Every major platform lands by v3.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05 }}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                platform.status === "live"
                  ? "bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:-translate-y-0.5"
                  : "bg-white/[0.01] border-white/[0.04] opacity-60"
              }`}
            >
              <span className="text-2xl">{platform.emoji}</span>
              <span className="text-xs font-medium text-white/70 text-center leading-tight">
                {platform.name}
              </span>
              <Badge
                variant={
                  platform.status === "live"
                    ? "success"
                    : platform.status === "soon"
                    ? "info"
                    : "outline"
                }
                className="text-[9px] px-1.5 py-0"
              >
                {platform.release}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
