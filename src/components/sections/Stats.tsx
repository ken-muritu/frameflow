"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "4.9B+", label: "Social media users globally", color: "text-violet-400" },
  { value: "500hrs+", label: "Video uploaded every minute", color: "text-cyan-400" },
  { value: "$1.3T+", label: "Creator economy by 2030", color: "text-green-400" },
  { value: "6 platforms", label: "Supported at launch", color: "text-yellow-400" },
];

export default function Stats() {
  return (
    <section className="py-16 border-y border-white/[0.04] bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className={`text-3xl sm:text-4xl font-bold mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
