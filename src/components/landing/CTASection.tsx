"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative" ref={ref}>
      <div className="container-xl">
        <motion.div
          className="relative glass-strong rounded-3xl p-12 md:p-20 text-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)",
            }}
          />

          {/* Floating orbs */}
          <motion.div
            className="absolute w-64 h-64 rounded-full blur-3xl opacity-20 -top-16 -left-16"
            style={{ background: "#3B82F6" }}
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-64 h-64 rounded-full blur-3xl opacity-20 -bottom-16 -right-16"
            style={{ background: "#8B5CF6" }}
            animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <span className="section-label mb-6 inline-flex">Get Started Today</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl font-bold font-heading mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              Your Dream Job is{" "}
              <span className="gradient-text-aurora">One Interview Away</span>
            </motion.h2>

            <motion.p
              className="text-text-secondary text-xl max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              Join 50,000+ professionals who leveled up their interview skills with
              AceInterview AI. Start for free today — no credit card required.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/signup"
                className="btn-primary text-base px-10 py-4 group"
              >
                <Zap className="w-5 h-5" />
                Start Free — No Credit Card
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/pricing"
                className="btn-secondary text-base px-10 py-4"
              >
                View Pricing
              </Link>
            </motion.div>

            <motion.p
              className="text-text-secondary text-sm mt-6"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
            >
              ✓ Free forever plan &nbsp;&nbsp; ✓ No credit card &nbsp;&nbsp; ✓ Cancel anytime
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
