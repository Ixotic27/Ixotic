"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ScrollRevealText from "./ScrollRevealText";

// Cycling words in orange
const CYCLING_WORDS = ["DEVELOPER", "ENGINEER", "DESIGNER", "ARCHITECT"];

function CyclingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % CYCLING_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    // Increased height and centered line-height to prevent clipping the bottom of letters
    <div className="relative h-[1.4em] overflow-hidden flex items-end">
      <AnimatePresence mode="wait">
        <motion.span
          key={CYCLING_WORDS[index]}
          initial={{ y: "-100%", opacity: 0 }} // Starts above
          animate={{ y: "0%", opacity: 1 }} // Rolls down into place
          exit={{ y: "100%", opacity: 0 }} // Rolls down out of place
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="block leading-[0.85] pb-2"
          style={{ color: "#ff3d00" }} // Exact Valentin Orange
        >
          {CYCLING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax State
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to range [-1, 1]
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll Parallax (Reduced zoom to prevent image cutoff)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.7], [0, -100]);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#0c0d10]">
      {/* ── Full-viewport hero with i1.png + mouse depth + zoom ── */}
      <div className="relative w-full h-[130vh] overflow-hidden">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#0c0d10]">
          
          {/* Depth Wrapper — Moves opposite to mouse position for 3D parallax */}
          <motion.div
            className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%]"
            animate={{
              x: mousePosition.x * -20,
              y: mousePosition.y * -20,
            }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.8 }}
          >
            {/* Scroll Zoom Wrapper */}
            <motion.div
              className="absolute inset-0 z-0 origin-top will-change-transform"
              style={{ scale: imageScale }}
            >
              <Image
                src="/i1.png"
                alt="Portrait"
                fill
                className="object-cover object-top"
                quality={95}
                priority
              />
            </motion.div>
          </motion.div>

          {/* Gradient overlays with correct Valentin background color #0c0d10 */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0c0d10]/95 via-[#0c0d10]/50 to-transparent pointer-events-none" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0c0d10] via-transparent to-[#0c0d10]/20 pointer-events-none" />

          {/* Intro Text Overlay */}
          <motion.div
            className="absolute bottom-0 left-0 z-10 w-full px-6 sm:px-12 lg:px-20 pb-16 pointer-events-none"
            style={{ opacity: textOpacity, y: textY }}
          >
            <p className="text-white/40 text-xs tracking-[0.4em] uppercase mb-4 font-light">
              Hi there! this is Ixotic
            </p>
            <p className="text-white/70 text-sm sm:text-base tracking-wide mb-8 font-light max-w-sm leading-relaxed">
              Crafting premium digital experiences through motion, depth, and precise engineering.
            </p>

            <h2 className="text-[clamp(3.5rem,10vw,9rem)] font-black leading-[0.85] tracking-tighter text-white uppercase">
              CRAFTING
            </h2>
            {/* Highly visible outline "DIGITAL" text instead of dim fill */}
            <h2 
              className="text-[clamp(3.5rem,10vw,9rem)] font-black leading-[0.85] tracking-tighter uppercase text-transparent !opacity-100"
              style={{ WebkitTextStroke: "2px rgba(255, 255, 255, 0.75)" }}
            >
              DIGITAL
            </h2>
            <h2 className="text-[clamp(3.5rem,10vw,9rem)] font-black leading-[0.85] tracking-tighter uppercase relative z-20">
              <CyclingText />
            </h2>
          </motion.div>
        </div>
      </div>

      {/* ── Intro Text Reveal Section (Replaces Static ContentBlocks) ── */}
      <div className="relative z-10 px-6 sm:px-12 lg:px-20 py-40 bg-[#0c0d10] min-h-[100vh] flex items-center">
        <div className="max-w-5xl">
          <p className="text-[#ff3d00] text-sm tracking-[0.4em] uppercase mb-12 font-bold">
            01 / WHO I AM
          </p>
          {/* Scroll Highlight Text */}
          <ScrollRevealText text="I am a creative developer who bridges the gap between design and engineering. My focus is on crafting interactive, immersive, and highly performant web experiences that push the boundaries of what a browser can do. Attention to detail and liquid-smooth animations are my native medium." />
        </div>
      </div>
    </section>
  );
}
