"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SkillBarProps {
  name: string;
  level: number; // 0 to 100
  color?: string;
  delay?: number;
}

export default function SkillBar({ name, level, color = "#00f5ff", delay = 0 }: SkillBarProps) {
  const [isInView, setIsInView] = useState(false);

  return (
    <div className="w-full relative py-2">
      <div className="flex justify-between items-end mb-2">
        <span className="font-pixel text-xs md:text-sm text-text-primary uppercase tracking-widest drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
          {name}
        </span>
        <span className="font-pixel text-xs opacity-50 flex items-center">
          LVL{" "}
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="ml-2 inline-block w-8 text-right"
            style={{ color }}
          >
            {Math.floor(level / 10)}
          </motion.span>
        </span>
      </div>

      <div className="h-3 w-full bg-[#121212] rounded-full overflow-hidden border border-border-card relative">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.5, delay, type: "spring", bounce: 0.2 }}
          className="h-full relative rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
        >
          {/* Animated shine effect */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: delay + 1.5 }}
            className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
          />
        </motion.div>
      </div>
    </div>
  );
}
