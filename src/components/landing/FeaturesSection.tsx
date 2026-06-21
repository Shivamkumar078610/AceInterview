"use client";

import { motion } from "framer-motion";
import { FileText, Video } from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-6 md:px-12 relative z-10 bg-surface-container-lowest/50 backdrop-blur-sm border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">Master Every Stage</h2>
          <p className="text-lg text-on-surface max-w-2xl mx-auto">
            Comprehensive tools designed to perfect your presentation, technical skills, and communication.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Chapter 1: Resume Analysis */}
          <motion.div 
            className="glass-card p-8 group hover:border-primary/50 transition-all duration-500 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center mb-6 group-hover:bg-primary-container transition-colors duration-500 border border-white/10">
              <FileText className="w-6 h-6 text-primary group-hover:text-white" />
            </div>
            
            <h3 className="text-2xl font-bold font-heading text-white mb-3">Resume Analysis</h3>
            <p className="text-on-surface-variant mb-6 leading-relaxed">
              Our AI scans your resume against millions of successful job applications, providing ATS scoring and actionable improvements instantly.
            </p>
            
            <div className="bg-surface-dim rounded-lg p-4 border border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]" />
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white font-semibold">ATS Match Score</span>
                <span className="text-xs text-tertiary font-semibold">94%</span>
              </div>
              <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-tertiary h-full w-[94%] transition-all duration-1000" />
              </div>
            </div>
          </motion.div>

          {/* Chapter 2: Behavioral Scenarios */}
          <motion.div 
            className="glass-card p-8 group hover:border-primary/50 transition-all duration-500 bg-white/5 border border-white/10 rounded-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center mb-6 group-hover:bg-primary-container transition-colors duration-500 border border-white/10">
              <Video className="w-6 h-6 text-primary group-hover:text-white" />
            </div>
            
            <h3 className="text-2xl font-bold font-heading text-white mb-3">Behavioral Scenarios</h3>
            <p className="text-on-surface-variant mb-6 leading-relaxed">
              Face unpredictable questions in a high-pressure virtual room. The AI adapts its tone based on your responses, mimicking real interview dynamics.
            </p>
            
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-surface-variant text-xs text-on-surface-variant border border-white/5 font-semibold">STAR Method</span>
              <span className="px-3 py-1 rounded-full bg-surface-variant text-xs text-on-surface-variant border border-white/5 font-semibold">Body Language</span>
              <span className="px-3 py-1 rounded-full bg-surface-variant text-xs text-on-surface-variant border border-white/5 font-semibold">Eye Contact Tracking</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
