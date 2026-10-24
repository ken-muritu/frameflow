"use client";

import { motion } from "framer-motion";
import {
  Target, FileText, Palette, Crop, FolderOpen, Code2,
  Wand2, MessageSquare, Layers, Download, Globe2, Webhook,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Smart Frame Detection",
    description:
      "CLIP vision models score every frame for visual richness, face presence, text overlay, and composition. Only the best rise to the top.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: MessageSquare,
    title: "Auto-Captions via Whisper",
    description:
      "OpenAI Whisper transcribes your video and aligns captions to exact frame timestamps. Every frame ships with the words that made it powerful.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: Palette,
    title: "Brand Kit Overlay",
    description:
      "Upload your logo, set your brand colors, choose a watermark style. Every extracted frame is automatically branded and on-identity.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
  {
    icon: Crop,
    title: "Platform-Perfect Crops",
    description:
      "One-click presets for Instagram (1:1, 4:5, 9:16), Twitter/X (16:9), LinkedIn, WhatsApp Status, and more. Never crop manually again.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    icon: FolderOpen,
    title: "Batch Processing",
    description:
      "Submit multiple video URLs at once. Build your entire week of content from a single podcast in one extraction session.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    icon: Code2,
    title: "Developer REST API",
    description:
      "POST a video URL, GET an array of ranked frames with full metadata and timestamps. Webhooks fire when extraction completes.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Wand2,
    title: "AI Scene Analysis",
    description:
      "OpenCV scene change detection finds the most visually distinct moments. No duplicate or near-identical frames in your output.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    icon: Layers,
    title: "Multi-Layer Scoring",
    description:
      "Composite AI score: visual quality (40%) + transcript alignment (35%) + scene novelty (25%). Tuned for maximum share-worthiness.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    icon: Download,
    title: "Bulk ZIP Download",
    description:
      "Download all selected frames as a ZIP — organized by timestamp, score, and platform format. Drop straight into Canva or Buffer.",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
  },
  {
    icon: Globe2,
    title: "Multi-Platform Support",
    description:
      "YouTube, Instagram, TikTok, X, Facebook, LinkedIn, Spotify, Twitch, Rumble, Loom, Vimeo, and direct MP4 URLs.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    icon: FileText,
    title: "Transcript-Aligned Frames",
    description:
      "Frame captured at exactly the moment a powerful quote was said — not just visually good, but contextually rich.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Webhook,
    title: "Webhooks & Integrations",
    description:
      "Connect FrameFlow to your stack. Webhook notifications trigger your scheduler, newsletter, or learning tool the moment frames are ready.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-violet-400 uppercase tracking-wider mb-3"
          >
            Full Feature Set
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Everything You Need to
            <br />
            <span className="gradient-text">Own the Content Cycle</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-white/50"
          >
            Twelve capabilities. One platform. Zero compromise on quality, speed, or branding.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
                className={`group p-5 rounded-xl bg-[#0F0F1B] border ${feature.border} hover:border-opacity-60 transition-all hover:-translate-y-0.5`}
              >
                <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
