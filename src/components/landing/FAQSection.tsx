"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How realistic are the AI interviews?",
    a: "Extremely realistic. Our AI uses advanced language models to generate contextual questions based on your resume, experience, and the job description. It asks intelligent follow-up questions, challenges vague answers, and adapts the difficulty in real-time — just like a real interviewer would.",
  },
  {
    q: "What types of interviews does AceInterview AI support?",
    a: "We support HR/Cultural interviews, Behavioral interviews (STAR method), Technical interviews, System Design interviews, Coding interviews (with live code execution), and Voice interviews. You can also practice in Company Mode for FAANG and top-tier companies.",
  },
  {
    q: "Is my data secure and private?",
    a: "Absolutely. We use enterprise-grade security including encrypted data storage, HTTP-only cookies, and never expose your data to third parties. Resume files are stored in private cloud storage with signed URLs. We comply with GDPR and CCPA. You can delete your data at any time.",
  },
  {
    q: "How does the resume analyzer work?",
    a: "Upload your PDF resume and our AI extracts the text, analyzes it for ATS compatibility, grammar, formatting, and keyword density. It then compares it against your target job description to identify gaps and provide specific, actionable improvements.",
  },
  {
    q: "Can I try it for free?",
    a: "Yes! The Free plan includes 5 AI interviews per month, basic resume analysis, and access to HR & Behavioral interview modes. No credit card required. Upgrade to Pro anytime for unlimited access.",
  },
  {
    q: "Which programming languages are supported for coding interviews?",
    a: "We support 50+ languages including Python, JavaScript, TypeScript, Java, C++, C, Go, Rust, Ruby, Swift, Kotlin, PHP, and many more — all with live sandboxed code execution and AI-powered review.",
  },
  {
    q: "How does the voice interview feature work?",
    a: "Our voice interview uses your browser's microphone (Web Speech API with Deepgram Nova-2 for production accuracy). The AI speaks questions aloud, listens to your responses, and analyzes fluency, speaking pace, filler words, and communication quality in real-time.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes, we offer a 14-day money-back guarantee for Pro and Enterprise plans. If you're not satisfied for any reason, contact our support team within 14 days of your purchase for a full refund.",
  },
];

export function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding relative" ref={ref}>
      <div className="container-xl max-w-4xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label mb-4 inline-flex">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 text-left py-1"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-white pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-text-secondary flex-shrink-0 transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-text-secondary text-sm leading-relaxed pt-3 border-t border-white/8">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
