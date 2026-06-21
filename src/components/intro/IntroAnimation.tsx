"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/shared/BrandLogo";

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<
    "particles" | "converge" | "logo" | "text" | "done"
  >("particles");
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (skipped) {
      onComplete();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      targetX: number;
      targetY: number;
      converging: boolean;
    }> = [];

    const colors = ["#3B82F6", "#8B5CF6", "#60A5FA", "#A78BFA", "#06b6d4"];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Create particles
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 200 + Math.random() * 400;
      particles.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        targetX: cx + (Math.random() - 0.5) * 80,
        targetY: cy + (Math.random() - 0.5) * 80,
        converging: false,
      });
    }

    let frame = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#050816";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw neural network connections
      if (frame > 60) {
        ctx.globalAlpha = Math.min((frame - 60) / 60, 0.3);
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.strokeStyle = "#3B82F6";
              ctx.lineWidth = 0.5;
              ctx.globalAlpha = (1 - dist / 120) * 0.2;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
      }

      // Update and draw particles
      particles.forEach((p) => {
        if (frame > 120) {
          p.converging = true;
        }

        if (p.converging) {
          p.x += (p.targetX - p.x) * 0.05;
          p.y += (p.targetY - p.y) * 0.05;
        } else {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, p.color + "40");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw center glow after convergence
      if (frame > 150) {
        const progress = Math.min((frame - 150) / 60, 1);
        const glowRadius = 60 * progress;

        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
        grd.addColorStop(0, `rgba(59, 130, 246, ${0.8 * progress})`);
        grd.addColorStop(0.5, `rgba(139, 92, 246, ${0.4 * progress})`);
        grd.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      frame++;

      if (frame < 240) {
        animId = requestAnimationFrame(draw);
      } else {
        setPhase("logo");
        setTimeout(() => setPhase("text"), 800);
        setTimeout(() => setPhase("done"), 2000);
        setTimeout(() => onComplete(), 2800);
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [onComplete, skipped]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-background flex items-center justify-center overflow-hidden"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Canvas for particle animation */}
        <canvas ref={canvasRef} className="absolute inset-0" />

        {/* Logo overlay */}
        <AnimatePresence>
          {(phase === "logo" || phase === "text" || phase === "done") && (
            <motion.div
              className="relative z-10 flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {/* Logo */}
              <motion.div
                className="relative w-24 h-24"
                animate={{ rotateY: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/50"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border border-accent/40"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />

                {/* Center logo */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-md">
                  <BrandLogo className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              {/* Brand name */}
              {(phase === "text" || phase === "done") && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-4xl font-bold font-heading gradient-text">
                    AceInterview AI
                  </h1>
                  <motion.p
                    className="text-text-secondary text-sm mt-2 tracking-widest uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    Ace Your Dream Job With AI
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip button */}
        <button
          onClick={() => {
            setSkipped(true);
            onComplete();
          }}
          className="absolute bottom-8 right-8 text-text-secondary text-sm hover:text-white transition-colors px-4 py-2 rounded-lg border border-white/10 hover:border-white/20"
        >
          Skip intro →
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
