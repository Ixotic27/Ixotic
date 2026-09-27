"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DialogueBoxProps {
  title: string;
  children: ReactNode;
  delay?: number;
}

export default function DialogueBox({ title, children, delay = 0 }: DialogueBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, type: "spring", bounce: 0.4 }}
      className="relative max-w-2xl w-full p-6 md:p-8 bg-bg-card backdrop-blur-md rounded-2xl border border-border-card shadow-2xl overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-400 opacity-80" />
      
      <motion.h2 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
        className="font-pixel text-cyan-400 text-sm md:text-base mb-6 tracking-widest uppercase flex items-center gap-3"
      >
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        {title}
      </motion.h2>
      
      <div className="text-text-primary text-lg md:text-xl leading-relaxed font-light text-balance space-y-4">
        {children}
      </div>
    </motion.div>
  );
}
