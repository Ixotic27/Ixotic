"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface TerminalInputProps {
  label: string;
  param: string;
  type?: "text" | "email" | "textarea";
  delay?: number;
}

export default function TerminalInput({ label, param, type = "text", delay = 0 }: TerminalInputProps) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  const sharedClasses = `w-full bg-transparent border-none outline-none text-cyan-400 placeholder:text-cyan-400/30 font-pixel text-sm p-0 ml-2 resize-none`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col space-y-2 mb-6"
    >
      <div className="flex items-center text-text-secondary font-pixel text-xs">
        <span className="text-purple-400 mr-2">{"~"}</span>
        <span className="text-amber-400 mr-2 font-bold select-none">{label}</span>
      </div>
      
      <div className={`flex items-start transition-opacity ${focused ? 'opacity-100' : 'opacity-80'}`}>
        <span className="text-cyan-400 font-pixel text-sm mt-1 animate-pulse">
          {">"}
        </span>
        {type === "textarea" ? (
          <textarea
            rows={4}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={`Enter ${param}...`}
            className={sharedClasses}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={`Enter ${param}...`}
            className={sharedClasses}
          />
        )}
      </div>
    </motion.div>
  );
}
