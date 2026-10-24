"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for exploring FrameFlow",
    badge: null,
    features: [
      "10 frame extractions per day",
      "5 supported platforms",
      "AI frame detection (top 5 frames)",
      "Basic caption extraction",
      "1:1 and 16:9 crops only",
      "FrameFlow watermark on outputs",
    ],
    cta: "Get Started Free",
    href: "/auth/signup",
    variant: "outline" as const,
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For serious creators and learners",
    badge: "Most Popular",
    features: [
      "Unlimited frame extractions",
      "All 12 platforms supported",
      "Full AI pipeline — all frames ranked",
      "Auto-captions via Whisper",
      "All crop presets + custom dimensions",
      "Brand kit (logo + colors)",
      "No watermark on outputs",
      "Unlimited ZIP downloads",
      "Email support",
    ],
    cta: "Start Pro",
    href: "/auth/signup?plan=pro",
    variant: "gradient" as const,
    highlight: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "per month",
    description: "For teams and agencies",
    badge: null,
    features: [
      "Everything in Pro",
      "5 team seats",
      "Shared brand kit library",
      "API access (500 calls/month)",
      "Batch URL processing",
      "Custom caption fonts & styles",
      "Workspace management",
      "Advanced analytics",
      "Priority processing queue",
      "Priority support + SLA",
    ],
    cta: "Start Business",
    href: "/auth/signup?plan=business",
    variant: "outline" as const,
    highlight: false,
  },
  {
    name: "API Tier",
    price: "$0.02",
    period: "per extraction",
    description: "For developers building with FrameFlow",
    badge: "For Devs",
    features: [
      "Full REST API access",
      "All AI features via API",
      "Webhook support",
      "Frame metadata + timestamps",
      "500 free calls/month included",
      "Pay-per-use above quota",
      "99.9% SLA",
      "Dedicated API documentation",
      "Rate limiting controls",
      "Usage dashboard",
    ],
    cta: "Get API Access",
    href: "/docs/api",
    variant: "outline" as const,
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-violet-400 uppercase tracking-wider mb-3"
          >
            Simple Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Start Free.
            <br />
            <span className="gradient-text">Scale When You&apos;re Ready.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto text-white/50"
          >
            Freemium means every extracted frame on the free plan is your distribution engine. 
            No credit card required to start.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.highlight
                  ? "pricing-popular border-violet-500/40 shadow-2xl shadow-violet-500/10"
                  : "bg-[#0F0F1B] border-white/[0.06]"
              }`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-xs font-bold text-white shadow-lg">
                    <Zap className="w-3 h-3" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan name & price */}
              <div className="mb-5">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-white/40 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.highlight ? "gradient-text" : "text-white"}`}>
                    {plan.price}
                  </span>
                  <span className="text-sm text-white/40">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/60">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href={plan.href}>
                <Button variant={plan.variant} className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Annual savings note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-white/30 mt-8"
        >
          Annual plans save 30%. Pro yearly: $99/yr · Business yearly: $399/yr · M-Pesa payment coming in v3.
        </motion.p>
      </div>
    </section>
  );
}
