"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";

const stats = [
  {
    value: 50000,
    suffix: "+",
    label: "Users Worldwide",
    description: "Professionals who trust AceInterview AI",
    icon: "👥",
  },
  {
    value: 98,
    suffix: "%",
    label: "Success Rate",
    description: "Users report improved interview performance",
    icon: "📈",
  },
  {
    value: 2000000,
    suffix: "+",
    label: "Questions Asked",
    description: "AI-generated interview questions served",
    icon: "❓",
  },
  {
    value: 4.9,
    suffix: "★",
    decimals: 1,
    label: "Average Rating",
    description: "Based on 10,000+ user reviews",
    icon: "⭐",
  },
];

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative" ref={ref}>
      <div className="container-xl">
        <div className="divider-glow mb-16" />

        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Trusted by{" "}
            <span className="gradient-text">50,000+</span> Professionals
          </h2>
          <p className="text-text-secondary text-lg">
            Join the fastest-growing interview prep community
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-card rounded-2xl p-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-bold font-heading gradient-text mb-2">
                {inView ? (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    delay={0.5 + i * 0.1}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    separator=","
                  />
                ) : (
                  "0"
                )}
              </div>
              <div className="font-semibold text-white mb-1">{stat.label}</div>
              <div className="text-text-secondary text-sm">{stat.description}</div>
            </motion.div>
          ))}
        </div>

        <div className="divider-glow mt-16" />
      </div>
    </section>
  );
}
