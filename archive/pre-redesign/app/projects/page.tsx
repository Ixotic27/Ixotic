"use client";

import Navbar from "@/components/Navbar";
import RevealText from "@/components/RevealText";
import { motion } from "framer-motion";
import Link from "next/link";

const PROJECTS = [
  {
    name: "Portfolio v3",
    description: "A scroll-driven cinematic portfolio built with Next.js, Framer Motion, and Canvas API. Features parallax effects, sprite animation, and immersive storytelling.",
    year: "2024",
    tags: ["Next.js", "Canvas", "Framer Motion"],
    url: "#",
  },
  {
    name: "Neural Dashboard",
    description: "Real-time data visualization dashboard with WebGL-powered charts, dark theme, and responsive analytics panels.",
    year: "2024",
    tags: ["React", "WebGL", "D3.js"],
    url: "#",
  },
  {
    name: "Synthwave Studio",
    description: "An interactive music visualizer that reacts to audio in real-time using the Web Audio API and Three.js particle systems.",
    year: "2023",
    tags: ["Three.js", "Web Audio", "GLSL"],
    url: "#",
  },
  {
    name: "Cipher Chat",
    description: "End-to-end encrypted chat application with ephemeral messaging, built on Node.js with a custom WebSocket implementation.",
    year: "2023",
    tags: ["Node.js", "WebSocket", "Crypto"],
    url: "#",
  },
  {
    name: "PixelForge",
    description: "Browser-based pixel art editor with layer support, export to sprite sheets, and collaborative editing via WebRTC.",
    year: "2022",
    tags: ["Canvas API", "WebRTC", "TypeScript"],
    url: "#",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="relative w-full h-screen flex items-end overflow-hidden bg-[#0a0a0f]">
        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 pb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/40 text-sm tracking-[0.3em] uppercase mb-4"
          >
            (Selected Work)
          </motion.p>
          <RevealText as="h1" className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-tight text-white uppercase">
            PRO
          </RevealText>
          <RevealText as="h1" delay={0.15} className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-tight text-white/40 uppercase">
            JECTS
          </RevealText>
        </div>
      </section>

      {/* ── Projects List ─────────────────────────────────── */}
      <main className="relative w-full bg-[#0a0a0f] px-6 sm:px-12 lg:px-20 pb-32">

        <div className="max-w-6xl">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.05 }}
              className="group border-t border-white/10"
            >
              <Link
                href={project.url}
                className="block py-12 md:py-16 cursor-pointer hover:bg-white/[0.02] transition-colors duration-500 px-2 -mx-2"
              >
                <div className="flex items-start gap-6 md:gap-12">
                  {/* Index */}
                  <span className="text-white/15 text-sm font-light tracking-widest pt-2 min-w-[2rem]">
                    {String(index + 1).padStart(2, "0")}.
                  </span>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-4 mb-4 flex-wrap">
                      <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight group-hover:text-white/80 transition-colors duration-500">
                        {project.name}
                      </h3>
                      <span className="text-white/20 text-sm font-light">
                        {project.year}
                      </span>
                    </div>
                    <p className="text-white/30 text-sm md:text-base font-light max-w-2xl leading-relaxed mb-6">
                      {project.description}
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-white/25 border border-white/10 rounded-full px-3 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Bottom border */}
          <div className="border-t border-white/10" />
        </div>

      </main>
    </>
  );
}
