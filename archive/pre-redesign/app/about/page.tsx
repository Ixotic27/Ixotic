"use client";

import Navbar from "@/components/Navbar";
import RevealText from "@/components/RevealText";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero Section with i1.png ───────────────────────── */}
      <section className="relative w-full h-screen flex items-end overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/i1.png"
            alt="Portrait"
            fill
            className="object-cover object-center"
            priority
            quality={95}
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/90 via-[#0a0a0f]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        </div>

        {/* Left-aligned massive heading */}
        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 pb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/40 text-sm tracking-[0.3em] uppercase mb-4"
          >
            (About)
          </motion.p>
          <RevealText as="h1" className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-tight text-white uppercase">
            ABOUT
          </RevealText>
          <RevealText as="h1" delay={0.15} className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-tight text-white/40 uppercase">
            ME
          </RevealText>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-white/30 text-sm tracking-[0.2em] mt-8"
          >
            (Scroll down)
          </motion.p>
        </div>
      </section>

      {/* ── Content Sections ──────────────────────────────── */}
      <main className="relative w-full bg-[#0a0a0f] px-6 sm:px-12 lg:px-20 py-32">

        {/* Section 1: Who I Am */}
        <section className="max-w-4xl border-t border-white/10 pt-16 pb-32">
          <div className="flex items-start gap-8 mb-8">
            <span className="text-white/20 text-sm font-light tracking-widest">01</span>
          </div>
          <RevealText as="h2" className="text-[clamp(2rem,5vw,5rem)] font-bold leading-[1.05] tracking-tight text-white uppercase mb-10">
            WHO I AM
          </RevealText>
          <RevealText delay={0.1}>
            <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
              I am a creative developer who bridges the gap between design and engineering. 
              My focus is on crafting interactive, immersive, and highly performant web 
              experiences that push the boundaries of what a browser can do.
            </p>
          </RevealText>
        </section>

        {/* Section 2: The Journey */}
        <section className="max-w-4xl border-t border-white/10 pt-16 pb-32">
          <div className="flex items-start gap-8 mb-8">
            <span className="text-white/20 text-sm font-light tracking-widest">02</span>
          </div>
          <RevealText as="h2" className="text-[clamp(2rem,5vw,5rem)] font-bold leading-[1.05] tracking-tight text-white uppercase mb-10">
            THE JOURNEY
          </RevealText>
          <RevealText delay={0.1}>
            <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
              It started with modding games and tweaking pixels. Now, I build full-stack worlds.
              From Next.js and TypeScript on the frontend to intricate WebGL and Canvas animations,
              I treat code as my native medium of art.
            </p>
          </RevealText>
        </section>

        {/* Section 3: What Drives Me */}
        <section className="max-w-4xl border-t border-white/10 pt-16 pb-32">
          <div className="flex items-start gap-8 mb-8">
            <span className="text-white/20 text-sm font-light tracking-widest">03</span>
          </div>
          <RevealText as="h2" className="text-[clamp(2rem,5vw,5rem)] font-bold leading-[1.05] tracking-tight text-white uppercase mb-10">
            WHAT DRIVES ME
          </RevealText>
          <RevealText delay={0.1}>
            <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
              Attention to detail. Liquid-smooth 60fps animations. A deep respect for web accessibility.
              I don&apos;t just write code to make things work—I write code to make things feel alive.
            </p>
          </RevealText>
        </section>

      </main>
    </>
  );
}
