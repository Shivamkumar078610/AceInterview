"use client";

import { useState, useEffect } from "react";
import { IntroAnimation } from "@/components/intro/IntroAnimation";
import { CustomCursor } from "@/components/shared/CustomCursor";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Footer } from "@/components/landing/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [introComplete, setIntroComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Check if user has seen intro before
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("intro_seen");
    if (hasSeenIntro) {
      setIntroComplete(true);
      setShowContent(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem("intro_seen", "true");
    setIntroComplete(true);
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden">
      {/* Custom cursor */}
      <CustomCursor />

      {/* Intro animation */}
      <AnimatePresence>
        {!introComplete && (
          <IntroAnimation onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/* Main content */}
      <AnimatePresence>
        {(introComplete || showContent) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated background */}
            <AnimatedBackground />

            {/* Navigation */}
            <Navbar />

            {/* Page sections */}
            <HeroSection />
            <FeaturesSection />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
