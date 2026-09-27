"use client";

import { motion, useTransform, MotionValue } from "framer-motion";

export default function Overlay({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  /* 
    The parent container is 500vh. 
    scrollProgress goes from 0 to 1 over that entire scroll distance.
  */

  // Section 1: Center. Fades in slightly after scroll starts
  const s1Opacity = useTransform(scrollProgress, [0, 0.03, 0.15, 0.20], [0, 1, 1, 0]);
  const s1Y = useTransform(scrollProgress, [0, 0.03, 0.15, 0.20], [30, 0, 0, -100]);
  const s1Scale = useTransform(scrollProgress, [0, 0.03, 0.20], [0.95, 1, 0.95]);

  // Section 2: Right aligned. 
  const s2Opacity = useTransform(scrollProgress, [0.35, 0.45, 0.60, 0.65], [0, 1, 1, 0]);
  const s2Y = useTransform(scrollProgress, [0.35, 0.45, 0.60, 0.65], [100, 0, 0, -100]);

  // Section 3: Left aligned. 
  const s3Opacity = useTransform(scrollProgress, [0.70, 0.80, 0.90, 0.95], [0, 1, 1, 0]);
  const s3Y = useTransform(scrollProgress, [0.70, 0.80, 0.90, 0.95], [100, 0, 0, -100]);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      
      {/* ── Section 1 (0%) ─────────────────────────────── */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center px-6"
        style={{ opacity: s1Opacity, y: s1Y, scale: s1Scale }}
      >
        <h1 className="text-5xl sm:text-7xl md:text-[7.5rem] font-bold text-blue-400 tracking-tight leading-none drop-shadow-2xl">
          Ixotic
        </h1>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl font-medium text-zinc-400 tracking-wider">
          Creative Developer
        </p>
        
        {/* Subtle scroll indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/40"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-xs tracking-[0.3em] uppercase">↓ Scroll to explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </motion.div>

      {/* ── Section 2 (~30%) ────────────────────────────── */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full flex flex-col items-end justify-center pr-8 md:pr-24 lg:pr-40 pl-8 text-right"
        style={{ opacity: s2Opacity, y: s2Y }}
      >
        <p className="text-sm sm:text-base md:text-lg font-bold text-blue-400 tracking-[0.2em] mb-4 uppercase">
          What I Do
        </p>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight max-w-4xl drop-shadow-xl">
          I build <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-600">
            digital experiences.
          </span>
        </h2>
      </motion.div>

      {/* ── Section 3 (~60%) ────────────────────────────── */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full flex flex-col items-start justify-center pl-8 md:pl-24 lg:pl-40 pr-8 text-left"
        style={{ opacity: s3Opacity, y: s3Y }}
      >
        <p className="text-sm sm:text-base md:text-lg font-bold text-blue-400 tracking-[0.2em] mb-4 uppercase">
          Philosophy
        </p>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight max-w-4xl drop-shadow-xl">
          Bridging <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-600">
            design & engineering.
          </span>
        </h2>
      </motion.div>

    </div>
  );
}
