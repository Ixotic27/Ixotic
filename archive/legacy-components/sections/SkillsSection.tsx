"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const SKILLS = [
  { name: "TypeScript", description: "Strongly typed JavaScript for scalable applications" },
  { name: "Next.js", description: "React framework for production-grade web apps" },
  { name: "Framer Motion", description: "Declarative animations and gesture handling" },
  { name: "Three.js / WebGL", description: "3D graphics and immersive experiences" },
  { name: "Canvas API", description: "Custom 2D rendering and interactive visualizations" },
  { name: "Tailwind CSS", description: "Utility-first styling for rapid UI development" },
  { name: "Node.js", description: "Server-side JavaScript and API development" },
];

function SkillRow({ skill, index }: { skill: typeof SKILLS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.6, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className="group border-t border-white/[0.08] py-8 md:py-12 flex items-start gap-6 md:gap-12 cursor-default hover:bg-white/[0.015] transition-colors duration-700 px-2 -mx-2"
    >
      <span className="text-white/10 text-xs font-mono tracking-widest pt-1.5 min-w-[2rem]">
        {String(index + 1).padStart(2, "0")}.
      </span>
      <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h3 className="text-xl md:text-3xl font-extrabold text-white tracking-tight group-hover:text-white/70 transition-colors duration-700">
          {skill.name}
        </h3>
        <p className="text-white/25 text-xs md:text-sm font-light max-w-sm md:text-right">
          {skill.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#0c0d10]">

      {/* ── Section Header ────────────────────────────────── */}
      <motion.div
        className="px-6 sm:px-12 lg:px-20 pt-40 pb-20"
        style={{ opacity: headingOpacity, y: headingY }}
      >
        <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-6 font-light">
          (Skills)
        </p>
        <h2 className="text-[clamp(3.5rem,12vw,10rem)] font-extrabold leading-[0.85] tracking-tighter text-white/15 uppercase">
          THE
        </h2>
        <h2 className="text-[clamp(3.5rem,12vw,10rem)] font-extrabold leading-[0.85] tracking-tighter uppercase">
          <span className="text-white">WORK</span>
          <span className="text-white/20">SHOP</span>
        </h2>
      </motion.div>

      {/* ── Skills List ───────────────────────────────────── */}
      <div className="px-6 sm:px-12 lg:px-20 pb-32">
        <div className="max-w-5xl">
          {SKILLS.map((skill, index) => (
            <SkillRow key={skill.name} skill={skill} index={index} />
          ))}
          <div className="border-t border-white/[0.08]" />
        </div>
      </div>
    </section>
  );
}
