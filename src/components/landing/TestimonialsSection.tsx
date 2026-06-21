"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    avatar: "SC",
    color: "from-blue-500 to-cyan-400",
    rating: 5,
    text: "AceInterview AI completely transformed my interview preparation. The AI asked follow-up questions just like real interviewers do. I went from failing every Google round to getting an offer in 3 months.",
    company: "Google",
  },
  {
    name: "Marcus Johnson",
    role: "Senior Backend Engineer at Meta",
    avatar: "MJ",
    color: "from-violet-500 to-purple-400",
    rating: 5,
    text: "The system design interviews are incredibly realistic. The AI challenged my assumptions and pushed me to think about scalability trade-offs. Landed my Meta L5 offer after 6 weeks of practice.",
    company: "Meta",
  },
  {
    name: "Priya Patel",
    role: "Data Scientist at Amazon",
    avatar: "PP",
    color: "from-pink-500 to-rose-400",
    rating: 5,
    text: "The resume analyzer caught 12 ATS issues I never noticed. My application rate jumped from 5% to 40% after following the AI's suggestions. Worth every penny.",
    company: "Amazon",
  },
  {
    name: "Alex Rivera",
    role: "Full Stack Developer at Stripe",
    avatar: "AR",
    color: "from-emerald-500 to-teal-400",
    rating: 5,
    text: "The voice interview feature is a game-changer. It caught my filler words and pacing issues that I never noticed myself. My communication score went from 62 to 94 in a month.",
    company: "Stripe",
  },
  {
    name: "Jordan Lee",
    role: "ML Engineer at OpenAI",
    avatar: "JL",
    color: "from-orange-500 to-amber-400",
    rating: 5,
    text: "I practiced 80+ coding problems with the AI code reviewer. The complexity analysis and optimization suggestions were better than any LeetCode solution I'd seen. Got the OpenAI offer!",
    company: "OpenAI",
  },
  {
    name: "Emma Watson",
    role: "Product Manager at Shopify",
    avatar: "EW",
    color: "from-indigo-500 to-blue-400",
    rating: 5,
    text: "As a PM, I needed behavioral interview practice. The STAR method coaching and leadership scenarios were spot-on. The AI remembered my previous answers and built on them naturally.",
    company: "Shopify",
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative" ref={ref}>
      <div className="container-xl">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label mb-4 inline-flex">Success Stories</span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Real People,{" "}
            <span className="gradient-text">Real Results</span>
          </h2>
          <p className="text-text-secondary text-lg">
            Join thousands of professionals who landed their dream jobs with
            AceInterview AI.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="glass-card relative"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />

              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-text-secondary text-xs truncate">{t.role}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-3.5 h-3.5 text-warning"
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
