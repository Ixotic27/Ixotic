"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export default function ScrollRevealText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 25%"],
  });

  const words = text.split(" ");

  return (
    <p ref={ref} className="text-[clamp(1.5rem,3.5vw,3.5rem)] leading-[1.3] font-medium flex flex-wrap gap-x-3 gap-y-1">
      {words.map((word, i) => {
        // Calculate the range for each word to animate sequentially
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} word={word} progress={scrollYProgress} range={[start, end]} />
        );
      })}
    </p>
  );
}

function Word({ word, progress, range }: { word: string; progress: any; range: [number, number] }) {
  // Color transitions from dimmed gray (rgba(255,255,255,0.2)) to pure white (#ffffff)
  const color = useTransform(progress, range, ["rgba(255,255,255,0.2)", "#ffffff"]);
  return (
    <motion.span style={{ color }} className="inline-block">
      {word}
    </motion.span>
  );
}
