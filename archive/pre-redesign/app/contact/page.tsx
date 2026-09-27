"use client";

import Navbar from "@/components/Navbar";
import RevealText from "@/components/RevealText";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
            (Contact)
          </motion.p>
          <RevealText as="h1" className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-tight text-white uppercase">
            LET&apos;S
          </RevealText>
          <RevealText as="h1" delay={0.15} className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-tight text-white/40 uppercase">
            TALK
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

      {/* ── Contact Form ──────────────────────────────────── */}
      <main className="relative w-full bg-[#0a0a0f] px-6 sm:px-12 lg:px-20 pb-32">

        <div className="max-w-3xl">

          {/* Name Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border-t border-white/10 py-10 md:py-14"
          >
            <label className="block text-white/20 text-xs tracking-[0.3em] uppercase mb-4">
              01 — Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-transparent text-white text-2xl md:text-4xl font-light border-b border-white/10 pb-4 focus:border-white/40 transition-colors duration-500 outline-none placeholder:text-white/10"
            />
          </motion.div>

          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="border-t border-white/10 py-10 md:py-14"
          >
            <label className="block text-white/20 text-xs tracking-[0.3em] uppercase mb-4">
              02 — Your Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full bg-transparent text-white text-2xl md:text-4xl font-light border-b border-white/10 pb-4 focus:border-white/40 transition-colors duration-500 outline-none placeholder:text-white/10"
            />
          </motion.div>

          {/* Message Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border-t border-white/10 py-10 md:py-14"
          >
            <label className="block text-white/20 text-xs tracking-[0.3em] uppercase mb-4">
              03 — Your Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project..."
              rows={4}
              className="w-full bg-transparent text-white text-xl md:text-2xl font-light border-b border-white/10 pb-4 focus:border-white/40 transition-colors duration-500 outline-none resize-none placeholder:text-white/10"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="border-t border-white/10 pt-10 md:pt-14"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-6 text-white text-lg md:text-xl tracking-widest uppercase transition-all duration-500"
            >
              <span className="font-light">Send Message</span>
              <span className="inline-block w-12 h-[1px] bg-white/30 group-hover:w-20 group-hover:bg-white transition-all duration-500" />
              <span className="text-white/30 text-sm group-hover:text-white transition-colors duration-500">→</span>
            </motion.button>
          </motion.div>

          {/* Bottom border */}
          <div className="border-t border-white/10 mt-14" />

          {/* Direct contact info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="pt-14 flex flex-col sm:flex-row gap-12"
          >
            <div>
              <p className="text-white/20 text-xs tracking-[0.3em] uppercase mb-3">Email</p>
              <p className="text-white/50 text-sm font-light">hello@ixotic.dev</p>
            </div>
            <div>
              <p className="text-white/20 text-xs tracking-[0.3em] uppercase mb-3">Location</p>
              <p className="text-white/50 text-sm font-light">Available Worldwide</p>
            </div>
          </motion.div>

        </div>
      </main>
    </>
  );
}
