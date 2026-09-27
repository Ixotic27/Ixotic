"use client";

import { motion } from "framer-motion";

interface NeonSignProps {
  text: string;
  color?: "cyan" | "purple" | "amber";
  className?: string;
}

const colorMap = {
  cyan: "text-cyan-400",
  purple: "text-purple-400",
  amber: "text-amber-400",
};

export default function NeonSign({ text, color = "cyan", className = "" }: NeonSignProps) {
  return (
    <motion.h3
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`font-pixel text-xl tracking-widest ${colorMap[color]} ${className}`}
    >
      {text}
    </motion.h3>
  );
}
