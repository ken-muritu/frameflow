"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 via-[#0F0F1B] to-cyan-900/30 border border-violet-500/20 rounded-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

          <div className="relative px-8 py-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Start Capturing the Moments
              <br />
              <span className="gradient-text">That Build Your Brand</span>
            </h2>

            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Join FrameFlow today. The first 10 frames are on us — every day, forever.
              No credit card. No friction. Just frames.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button variant="gradient" size="xl" className="gap-2 group w-full sm:w-auto">
                  Start for Free — It&apos;s Instant
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-white/25">
              Built by{" "}
              <a
                href="https://www.muritu.top"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300"
              >
                Kennedy Muritu
              </a>{" "}
              · Nairobi, Kenya
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
