"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface MarqueeDividerProps {
  text?: string;
  accentColor?: string;
}

export default function MarqueeDivider({
  text = "CREATIVE DEVELOPER",
  accentColor = "#ff4500",
}: MarqueeDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Scroll-driven horizontal shift
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-25%", "0%"]);

  const items = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden bg-[#0c0d10]"
      style={{ height: "clamp(160px, 20vw, 280px)" }}
    >
      {/* Strip 1 — orange, rotated -5° */}
      <div
        className="absolute left-[-10%] right-[-10%] z-10 py-4"
        style={{
          top: "30%",
          transform: "rotate(-5deg)",
          backgroundColor: accentColor,
        }}
      >
        <motion.div
          className="flex items-center whitespace-nowrap"
          style={{
            x: x1,
          }}
        >
          {items.map((i) => (
            <span
              key={`r1-${i}`}
              className="text-black text-[clamp(1rem,2.2vw,2.2rem)] font-black uppercase tracking-tight mx-6 shrink-0"
            >
              {text} —
            </span>
          ))}
        </motion.div>
      </div>

      {/* Strip 2 — outline text, rotated +5° (crosses strip 1) */}
      <div
        className="absolute left-[-10%] right-[-10%] py-4"
        style={{
          top: "45%",
          transform: "rotate(5deg)",
        }}
      >
        <motion.div
          className="flex items-center whitespace-nowrap"
          style={{ x: x2 }}
        >
          {items.map((i) => (
            <span
              key={`r2-${i}`}
              className="text-[clamp(1rem,2.2vw,2.2rem)] font-black uppercase tracking-tight mx-6 shrink-0"
              style={{
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.2)",
              }}
            >
              {text} —
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
