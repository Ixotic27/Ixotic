"use client";

import { useRef, useEffect, useState } from "react";
import { useMotionValue } from "framer-motion";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useMotionValue(0);

  // Bulletproof manual scroll tracking to guarantee functionality across all browsers
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // rect.top is 0 when the top of the container hits the top of the viewport
      // It becomes highly negative as we scroll down.
      // Progress should be 0 at top=0, and 1 when the bottom of the 500vh container hits the bottom of the viewport (which is top = -400vh)
      const scrollableDistance = rect.height - window.innerHeight;
      
      let progress = 0;
      if (scrollableDistance > 0) {
        progress = Math.max(0, Math.min(1, Math.abs(rect.top) / scrollableDistance));
      }
      
      // If we haven't reached the container yet, progress is 0.
      if (rect.top > 0) progress = 0;
      
      scrollYProgress.set(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll(); // initial set

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [scrollYProgress]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[500vh] w-full bg-[#121212]"
    >
      {/* 
        This sticky wrapper stays fixed to the screen for the entire 500vh duration.
        Both the Canvas and the Text Overlays share the exact same DOM layout 
        and respond to the identical framer-motion scroll value.
      */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <ScrollyCanvas scrollProgress={scrollYProgress} />
        <Overlay scrollProgress={scrollYProgress} />
      </div>
    </section>
  );
}
