"use client";

import Navbar from "@/components/Navbar";
import RevealText from "@/components/RevealText";
import { motion } from "framer-motion";

const SKILLS = [
  { name: "TypeScript", description: "Strongly typed JavaScript for scalable applications" },
  { name: "Next.js", description: "React framework for production-grade web apps" },
  { name: "Framer Motion", description: "Declarative animations and gesture handling" },
  { name: "Three.js / WebGL", description: "3D graphics and immersive experiences" },
  { name: "Canvas API", description: "Custom 2D rendering and interactive visualizations" },
  { name: "Tailwind CSS", description: "Utility-first styling for rapid UI development" },
  { name: "Node.js", description: "Server-side JavaScript runtime and API development" },
];

export default function SkillsPage() {
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
            (Skills)
          </motion.p>
          <RevealText as="h1" className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-tight text-white uppercase">
            THE
          </RevealText>
          <RevealText as="h1" delay={0.15} className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-tight text-white uppercase">
            WORK
            <span className="text-white/30">SHOP</span>
          </RevealText>
        </div>
      </section>

      {/* ── Skills List ───────────────────────────────────── */}
      <main className="relative w-full bg-[#0a0a0f] px-6 sm:px-12 lg:px-20 pb-32">

        <div className="max-w-5xl">
          {SKILLS.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="group border-t border-white/10 py-10 md:py-14 flex items-start gap-6 md:gap-12 cursor-default hover:bg-white/[0.02] transition-colors duration-500 px-2 -mx-2"
            >
              {/* Index */}
              <span className="text-white/15 text-sm font-light tracking-widest pt-1 min-w-[2rem]">
                {String(index + 1).padStart(2, "0")}.
              </span>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight group-hover:text-white/80 transition-colors duration-500">
                  {skill.name}
                </h3>
                <p className="text-white/30 text-sm md:text-base mt-3 font-light max-w-xl">
                  {skill.description}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Bottom border */}
          <div className="border-t border-white/10" />
        </div>

      </main>
    </>
  );
}
