"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
  ArrowRight,
  Bot,
  TrendingUp,
  CheckCircle2,
  Mic,
  FileText,
  Sparkles,
} from "lucide-react";

export function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMousePos({ x: nx * 15, y: -ny * 15 }); // Max 15 degrees tilt
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section className="min-h-screen flex items-center pt-32 pb-20 px-6 md:px-12 relative overflow-hidden">
      {/* Neural Glow */}
      <div className="glow-accent top-1/4 left-1/4" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="flex flex-col items-start gap-6 z-10 relative">
          {/* Floating 3D Elements */}
          <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ perspective: "1000px" }}>
            {/* 1. Communication Score */}
            <div className="absolute top-[-15%] right-[10%] animate-[float_5s_ease-in-out_infinite]">
              <div 
                className="glass-card p-3 shadow-2xl backdrop-blur-2xl bg-white/5 border border-white/10 flex items-center gap-2 rounded-lg"
                style={{ 
                  transform: "translateZ(80px) rotateY(-15deg) rotateX(10deg)", 
                  transformStyle: "preserve-3d" 
                }}
              >
                <span className="text-[11px] text-white font-semibold">Comm. Score: <span className="text-primary">94%</span></span>
                <div className="flex items-end gap-0.5 h-3 ml-1">
                  <div className="w-1 bg-primary h-2/3 animate-pulse"></div>
                  <div className="w-1 bg-primary h-full animate-pulse"></div>
                  <div className="w-1 bg-primary h-1/2 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* 2. AI Analysis Badge */}
            <div className="absolute top-[25%] left-[-15%] animate-[float_6s_ease-in-out_infinite_1s]">
              <div 
                className="glass-card px-4 py-2 shadow-2xl backdrop-blur-2xl bg-white/5 border border-white/10 flex items-center gap-2 rounded-full"
                style={{ 
                  transform: "translateZ(40px) rotateY(20deg) rotateX(-5deg)", 
                  transformStyle: "preserve-3d" 
                }}
              >
                <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse shadow-[0_0_8px_rgba(0,220,229,0.8)]"></div>
                <span className="text-[10px] text-white font-semibold tracking-wider uppercase">AI Analysis: Active</span>
              </div>
            </div>

            {/* 3. Technical Accuracy Meter */}
            <div className="absolute bottom-[20%] right-[-10%] animate-[float_4.5s_ease-in-out_infinite_0.5s]">
              <div 
                className="glass-card p-3 rounded-full shadow-2xl backdrop-blur-2xl bg-white/5 border border-white/10 w-20 h-20 flex items-center justify-center flex-col relative"
                style={{ 
                  transform: "translateZ(120px) rotateY(-25deg) rotateX(15deg)", 
                  transformStyle: "preserve-3d" 
                }}
              >
                <svg className="absolute inset-0 w-full h-full -rotate-90 transform p-1" viewBox="0 0 100 100">
                  <circle className="text-white/10 stroke-current" cx="50" cy="50" fill="transparent" r="45" strokeWidth="6"></circle>
                  <circle className="text-tertiary stroke-current" cx="50" cy="50" fill="transparent" r="45" strokeDasharray="282.7" strokeDashoffset="28.27" strokeWidth="6"></circle>
                </svg>
                <span className="text-[16px] text-white font-bold leading-none z-10">90%</span>
                <span className="text-[8px] text-on-surface-variant text-center mt-1 z-10 uppercase tracking-widest">Tech</span>
              </div>
            </div>

            {/* 4. Resume ATS Score Tag */}
            <div className="absolute bottom-[-10%] left-[5%] animate-[float_5.5s_ease-in-out_infinite_1.5s]">
              <div 
                className="glass-card px-3 py-2 shadow-2xl backdrop-blur-2xl bg-white/5 border border-white/10 flex items-center gap-2 rounded-lg"
                style={{ 
                  transform: "translateZ(60px) rotateY(15deg) rotateX(-10deg)", 
                  transformStyle: "preserve-3d" 
                }}
              >
                <FileText className="w-4 h-4 text-secondary" />
                <span className="text-[11px] text-white font-semibold">Resume ATS Score: <span className="text-secondary">88</span></span>
              </div>
            </div>

            {/* 5. Success Probability */}
            <div className="absolute top-[55%] left-[80%] animate-[float_7s_ease-in-out_infinite_2s]">
              <div 
                className="glass-card px-3 py-2 shadow-2xl backdrop-blur-2xl bg-white/5 border border-white/10 flex items-center gap-1.5 rounded-md"
                style={{ 
                  transform: "translateZ(30px) rotateY(-10deg) rotateX(5deg)", 
                  transformStyle: "preserve-3d" 
                }}
              >
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] text-white font-semibold">Success Prob: <span className="text-primary">High</span></span>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-semibold text-xs text-primary uppercase tracking-widest">Next-Gen AI Coach</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-heading text-white leading-tight">
            Ace Your <br />
            <span className="gradient-text">Dream Job</span>
            <br />
            With AI.
          </h1>

          <p className="text-lg text-on-surface max-w-xl relative z-10 leading-relaxed">
            Experience hyper-realistic interview simulations tailored to your industry. Get real-time feedback, master technical challenges, and walk into your next interview with unshakeable confidence.
          </p>

          <div className="flex flex-wrap gap-4 mt-4 relative z-10">
            <Link href="/signup" className="btn-primary flex items-center gap-2">
              Start Interviewing
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="btn-secondary flex items-center gap-2">
              <Play className="w-4 h-4 text-white" />
              Watch Demo
            </button>
          </div>
        </div>

        {/* Dashboard Showcase */}
        <div 
          className="relative z-10 w-full max-w-2xl mx-auto lg:mx-0 mt-12 lg:mt-0"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
            transition: mousePos.x === 0 ? "transform 0.5s ease" : "transform 0.1s ease-out",
            transformStyle: "preserve-3d"
          }}
        >
          <div className="glass-card p-6 shadow-2xl relative border border-white/10 rounded-2xl bg-white/5 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/10 to-transparent rounded-xl pointer-events-none" />
            
            {/* Card Header */}
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base text-white">AI Interviewer - Sarah</h3>
                  <p className="text-xs text-on-surface-variant">Senior Product Manager Role</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-tertiary-container/20 text-tertiary font-semibold text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                Live Analysis
              </div>
            </div>

            {/* Video Area */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-surface-dim border border-white/5 mb-6">
              <img 
                className="w-full h-full object-cover opacity-80" 
                alt="AI Interviewer Avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuArclvITWXlh51nYxVnYV2yzdf3ckxQBMi2eiT2wllc7-2qtEytDnY_bWTc2t89n4j-bBK8TcguFT02fiHGg3AWo4t32R9DzxJC5sWsBsz6B9pAJqpaDI1paqr6B-M21nCr6qDWv6w-gjB7uvGQ0Ygc5FFNtGBSebEbhNruLqPlRS4xqiiuyk7KkKcZAyBGCKFPPXuVFrZbCemLIpjpPSxDrSgTGwsfGHH1L5KM0mItWEp767T-zpzjGT2IM2c9WJ4v6xBVzxyWB2Me" 
              />
              
              {/* Overlay UI */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10">
                  <Mic className="w-5 h-5 text-white" />
                  <div className="flex gap-1 items-end h-4">
                    <div className="w-1 bg-primary h-full animate-[bounce_1s_infinite]"></div>
                    <div className="w-1 bg-primary h-2/3 animate-[bounce_1.2s_infinite]"></div>
                    <div className="w-1 bg-primary h-4/5 animate-[bounce_0.8s_infinite]"></div>
                    <div className="w-1 bg-primary h-1/2 animate-[bounce_1.1s_infinite]"></div>
                  </div>
                </div>
                <div className="glass-card px-3 py-1 rounded-lg text-xs font-semibold text-white bg-black/40 backdrop-blur-md border border-white/10">
                  04:23
                </div>
              </div>
            </div>

            {/* Stats Area */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface-container/50 rounded-lg p-3 border border-white/5">
                <p className="text-[10px] text-on-surface-variant mb-1 font-semibold">Confidence</p>
                <div className="flex items-end justify-between">
                  <span className="text-lg text-primary font-bold">87%</span>
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="bg-surface-container/50 rounded-lg p-3 border border-white/5">
                <p className="text-[10px] text-on-surface-variant mb-1 font-semibold">Clarity</p>
                <div className="flex items-end justify-between">
                  <span className="text-lg text-tertiary font-bold">92%</span>
                  <TrendingUp className="w-4 h-4 text-tertiary" />
                </div>
              </div>
              <div className="bg-surface-container/50 rounded-lg p-3 border border-white/5">
                <p className="text-[10px] text-on-surface-variant mb-1 font-semibold">Pacing</p>
                <div className="flex items-end justify-between">
                  <span className="text-lg text-secondary font-bold">Optimal</span>
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
