"use client";

import { motion } from "framer-motion";
import { Link2, Cpu, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Link2,
    title: "Paste Your Video URL",
    description:
      "Drop a link from YouTube, TikTok, Instagram, X, Facebook, or any direct MP4 URL. FrameFlow instantly detects the platform.",
    color: "from-violet-600 to-violet-400",
    shadow: "shadow-violet-500/20",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Does the Heavy Lifting",
    description:
      "Our pipeline downloads, extracts frames, scores them using CLIP vision models, aligns with Whisper transcripts, and ranks by shareability.",
    color: "from-cyan-500 to-cyan-400",
    shadow: "shadow-cyan-500/20",
  },
  {
    number: "03",
    icon: Download,
    title: "Download & Post Instantly",
    description:
      "Get platform-ready frames with auto-captions, your brand kit applied, and the perfect crop for Instagram, X, WhatsApp — everything.",
    color: "from-green-500 to-green-400",
    shadow: "shadow-green-500/20",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-violet-400 uppercase tracking-wider mb-3"
          >
            How FrameFlow Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            From URL to Ready-to-Post
            <br />
            <span className="gradient-text">in Under 60 Seconds</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto text-white/50"
          >
            Three steps. Zero friction. The entire workflow that used to take 20 minutes now takes 60 seconds.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/2 -translate-x-1/2 w-[calc(100%-200px)] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Icon */}
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-2xl ${step.shadow}`}>
                    <Icon className="w-7 h-7 text-white" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0F0F1B] border border-white/10 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white/60">{step.number}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed max-w-xs">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
