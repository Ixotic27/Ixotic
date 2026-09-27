"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";

/* ─── Project Data ──────────────────────────────────────────── */
const PROJECTS = [
  {
    id: "01",
    name: "The Leetcode City",
    slug: "leetcode-city",
    tagline: "Algorithm Visualizer",
    role: "Full-Stack Dev",
    year: "2024",
    services: ["TypeScript", "Next.js", "Algorithms"],
    outcome: "Open-source",
    description:
      "A TypeScript project focusing on algorithms and robust web components. Visual explanations for every major DSA concept.",
    url: "https://github.com/Ixotic27/The-Leetcode-City",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    glowColor: "rgba(49, 120, 198, 0.30)",
    glowColorStrong: "rgba(49, 120, 198, 0.10)",
  },
  {
    id: "02",
    name: "Smart Hospital",
    slug: "smart-hospital",
    tagline: "Healthcare System",
    role: "System Architect",
    year: "2024",
    services: ["Java", "Queue Management", "Spring Boot"],
    outcome: "Production",
    description:
      "A Java-based system for managing hospital appointments and real-time queues. Reduces wait times by 60%.",
    url: "https://github.com/Ixotic27/Smart-Hospital-Appointment-Real-Time-Queue-Management-System",
    image:
      "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?q=80&w=2070&auto=format&fit=crop",
    glowColor: "rgba(16, 185, 129, 0.30)",
    glowColorStrong: "rgba(16, 185, 129, 0.08)",
  },
  {
    id: "03",
    name: "Busted Fake News",
    slug: "fake-news",
    tagline: "ML Misinformation Detector",
    role: "ML Engineer",
    year: "2024",
    services: ["Python", "Machine Learning", "NLP"],
    outcome: "Research",
    description:
      "A Python project leveraging Machine Learning and NLP for detecting fake news with 94% accuracy.",
    url: "https://github.com/Ixotic27/busted-fake-news-detector",
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop",
    glowColor: "rgba(255, 61, 0, 0.30)",
    glowColorStrong: "rgba(255, 61, 0, 0.08)",
  },
  {
    id: "04",
    name: "Smart Assigner",
    slug: "smart-assigner",
    tagline: "Plagiarism Detection",
    role: "Lead Developer",
    year: "2024",
    services: ["Java", "Algorithms", "NLP"],
    outcome: "Academic Tool",
    description:
      "A Java-based multi-layer plagiarism detection system with algorithmic rigor and comprehensive multi-source analysis.",
    url: "https://github.com/Ixotic27/Smart-Assignment-Checker-SAC-A-Multi-Layer-Plagiarism-Detection-System",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
    glowColor: "rgba(168, 85, 247, 0.30)",
    glowColorStrong: "rgba(168, 85, 247, 0.08)",
  },
];

/* ─── Direction-aware animation variants ────────────────────── */
// direction  1 = scrolling DOWN  → new image enters from bottom-right
// direction -1 = scrolling UP    → new image enters from top-left

const imgVariants = {
  // Enter from bottom-right (down) or top-left (up)
  enter: (dir: number) => ({
    x: dir === 1 ? "60%" : "-60%",
    y: dir === 1 ? "100%" : "-100%",
    opacity: 0,
    scale: 1.06,
  }),
  center: {
    x: "0%",
    y: "0%",
    opacity: 1,
    scale: 1,
  },
  // Exit to top-left (down) or bottom-right (up)
  exit: (dir: number) => ({
    x: dir === 1 ? "-30%" : "30%",
    y: dir === 1 ? "-20%" : "20%",
    opacity: 0,
    scale: 0.96,
  }),
};

const panelVariants = {
  enter: (dir: number) => ({
    y: dir === 1 ? 36 : -36,
    opacity: 0,
  }),
  center: { y: 0, opacity: 1 },
  exit: (dir: number) => ({
    y: dir === 1 ? -22 : 22,
    opacity: 0,
  }),
};

const IMG_TRANSITION = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};
const PANEL_TRANSITION = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

/* ─── Main Component ─────────────────────────────────────────── */
export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const prevIndexRef = useRef(0);

  const sectionHeight = `${PROJECTS.length * 100}vh`;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const activeIndexRaw = useTransform(scrollYProgress, (p) =>
    Math.min(Math.floor(p * PROJECTS.length), PROJECTS.length - 1)
  );

  useMotionValueEvent(activeIndexRaw, "change", (next) => {
    const prev = prevIndexRef.current;
    setDirection(next >= prev ? 1 : -1);
    prevIndexRef.current = next;
    setCurrent(next);
  });

  const project = PROJECTS[current];

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#0a0a0a]"
      style={{ height: sectionHeight }}
    >
      {/* ── Sticky Viewport ───────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Ambient glow behind center ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={project.slug + "-bg"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: `radial-gradient(ellipse 55% 55% at 50% 50%, ${project.glowColor} 0%, transparent 70%)`,
            }}
          />
        </AnimatePresence>

        {/* ── 3-Panel Layout ─────────────────────────────── */}
        <div className="relative w-full grid grid-cols-[72px_1fr_280px] z-10" style={{ height: '100vh' }}>

          {/* ════════ LEFT: Thumbnail Strip ════════ */}
          <div className="flex flex-col items-center justify-center gap-0 py-10 border-r border-white/[0.05]">
            {PROJECTS.map((p, i) => (
              <ThumbItem
                key={p.slug}
                project={p}
                index={i}
                isActive={i === current}
                isLast={i === PROJECTS.length - 1}
              />
            ))}
          </div>

          {/* ════════ CENTER: Full Image + Overlay Name ════════ */}
          <div className="relative h-full min-h-0 overflow-hidden">
            {/* Direction-aware image slide */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current + "-img"}
                className="absolute inset-0"
                custom={direction}
                variants={imgVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={IMG_TRANSITION}
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1280px) 80vw, 1100px"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient overlays for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/20 via-transparent to-[#0a0a0a]/40 pointer-events-none z-10" />

            {/* Big project name overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-20 px-8 pb-10 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current + "-nameoverlay"}
                  custom={direction}
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ ...PANEL_TRANSITION, delay: 0.2 }}
                >
                  <h2
                    className="font-black uppercase text-white leading-[0.85] tracking-tight select-none"
                    style={{
                      fontSize: "clamp(3.5rem, 8vw, 9rem)",
                      textShadow: "0 4px 40px rgba(0,0,0,0.8)",
                    }}
                  >
                    {project.name}
                  </h2>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Top pagination counter */}
            <div className="absolute top-8 left-8 z-20">
              <AnimatePresence mode="wait">
                <motion.span
                  key={current + "-counter"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-white/30 text-xs tracking-[0.3em]"
                >
                  {String(current + 1).padStart(2, "0")} /{" "}
                  {String(PROJECTS.length).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* ════════ RIGHT: Editorial Panel ════════ */}
          <div className="flex flex-col justify-center gap-10 px-8 py-10 border-l border-white/[0.05]">

            {/* Year */}
            <div className="flex flex-col gap-2">
              <span className="text-white/25 text-[9px] tracking-[0.35em] uppercase font-medium">
                Year
              </span>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.span
                  key={current + "-year"}
                  custom={direction}
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ ...PANEL_TRANSITION }}
                  className="font-black text-white leading-none"
                  style={{ fontSize: "clamp(2.4rem, 3.5vw, 3.5rem)" }}
                >
                  {project.year}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="w-8 h-px bg-white/10" />

            {/* Role */}
            <div className="flex flex-col gap-2">
              <span className="text-white/25 text-[9px] tracking-[0.35em] uppercase font-medium">
                Role
              </span>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.span
                  key={current + "-role"}
                  custom={direction}
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ ...PANEL_TRANSITION, delay: 0.06 }}
                  className="text-white/80 text-sm font-light leading-snug"
                >
                  {project.role}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="w-8 h-px bg-white/10" />

            {/* Description */}
            <div className="flex flex-col gap-2">
              <span className="text-white/25 text-[9px] tracking-[0.35em] uppercase font-medium">
                Description
              </span>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.p
                  key={current + "-desc"}
                  custom={direction}
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ ...PANEL_TRANSITION, delay: 0.12 }}
                  className="text-white/50 text-xs font-light leading-relaxed"
                >
                  {project.description}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="w-8 h-px bg-white/10" />

            {/* Stack tags */}
            <div className="flex flex-col gap-2">
              <span className="text-white/25 text-[9px] tracking-[0.35em] uppercase font-medium">
                Stack
              </span>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current + "-stack"}
                  custom={direction}
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ ...PANEL_TRANSITION, delay: 0.15 }}
                  className="flex flex-wrap gap-1.5"
                >
                  {project.services.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 text-[10px] tracking-wide text-white/40 border border-white/10 font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTA */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.a
                key={current + "-cta"}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                custom={direction}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ ...PANEL_TRANSITION, delay: 0.2 }}
                className="group inline-flex items-center gap-2 text-white/35 hover:text-white/80 transition-colors duration-300 text-[10px] tracking-[0.25em] uppercase mt-2 w-fit"
              >
                <span className="border-b border-transparent group-hover:border-white/50 pb-0.5 transition-colors duration-300">
                  View on GitHub
                </span>
                <span className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300">
                  →
                </span>
              </motion.a>
            </AnimatePresence>

          </div>
        </div>

        {/* ── Subtle top rule ── */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.05] pointer-events-none z-30" />
      </div>
    </section>
  );
}

/* ─── Thumbnail Strip Item ────────────────────────────────────── */
function ThumbItem({
  project,
  index,
  isActive,
  isLast,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
  isActive: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      {index > 0 && (
        <motion.div
          className="w-px"
          style={{ height: 20 }}
          animate={{ backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)" }}
          transition={{ duration: 0.4 }}
        />
      )}

      <motion.div
        animate={{
          opacity: isActive ? 1 : 0.28,
          scale: isActive ? 1 : 0.85,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden"
        style={{
          width: 40,
          height: 30,
          outline: isActive ? `1px solid ${project.glowColor}` : "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover object-center"
          sizes="40px"
        />
      </motion.div>

      <motion.span
        animate={{ color: isActive ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.18)" }}
        transition={{ duration: 0.35 }}
        className="font-mono text-[8px] tracking-widest mt-1.5"
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>

      {!isLast && (
        <motion.div
          className="w-px"
          style={{ height: 20 }}
          animate={{ backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)" }}
          transition={{ duration: 0.4 }}
        />
      )}
    </div>
  );
}
