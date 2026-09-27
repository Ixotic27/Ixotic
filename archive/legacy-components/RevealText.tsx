"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RevealTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
}

export default function RevealText({
  children,
  delay = 0,
  className = "",
  as = "div",
}: RevealTextProps) {
  const Component = motion[as] as any;

  return (
    <div className="overflow-hidden">
      <Component
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className={className}
      >
        {children}
      </Component>
    </div>
  );
}
