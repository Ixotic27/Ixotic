"use client";

import { motion } from "framer-motion";

const PROJECTS = [
  {
    id: 1,
    title: "E-Commerce Experience",
    category: "Web & 3D",
    desc: "An immersive shopping platform featuring real-time WebGL product configurators.",
  },
  {
    id: 2,
    title: "Fintech Dashboard",
    category: "Product Design",
    desc: "A sleek, high-performance analytic interface for modern traders.",
  },
  {
    id: 3,
    title: "Editorial Portfolio",
    category: "Creative Dev",
    desc: "A scrollytelling visual essay exploring the intersection of art and code.",
  },
  {
    id: 4,
    title: "Brand Identity",
    category: "Art Direction",
    desc: "A comprehensive digital brand overhaul for an emerging AI startup.",
  }
];

export default function Projects() {
  return (
    <section className="relative w-full py-32 px-6 md:px-12 lg:px-24 bg-[#121212]">
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
            Selected Works
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-zinc-500 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] p-8 md:p-12 hover:bg-white/[0.05] transition-colors duration-500 backdrop-blur-md"
            >
              {/* Subtle hover glow (Glass-morphism detail) */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
              
              <div className="relative z-10 h-64 md:h-80 w-full mb-8 rounded-lg overflow-hidden bg-zinc-900 border border-white/5">
                {/* Placeholder for project image */}
                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
                   <span className="text-zinc-600 font-medium tracking-widest text-sm uppercase">Project Preview</span>
                </div>
              </div>
              
              <div className="relative z-10 flex flex-col items-start gap-4">
                <span className="px-3 py-1 rounded-full border border-white/20 text-xs font-medium text-zinc-400 tracking-wider uppercase backdrop-blur-sm">
                  {project.category}
                </span>
                <h3 className="text-3xl font-bold text-white tracking-tight">
                  {project.title}
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
                  {project.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
