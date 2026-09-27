"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

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
    <section ref={sectionRef} className="relative w-full bg-[#0c0d10] overflow-hidden">

      {/* Warm glow at the bottom — matching the Valentin Cheval footer effect */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,69,0,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── Section Header ────────────────────────────────── */}
      <motion.div
        className="px-6 sm:px-12 lg:px-20 pt-40 pb-20"
        style={{ opacity: headingOpacity, y: headingY }}
      >
        <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-6 font-light">
          (Contact)
        </p>
        <h2 className="text-[clamp(3.5rem,12vw,10rem)] font-extrabold leading-[0.85] tracking-tighter text-white uppercase">
          LET&apos;S
        </h2>
        <h2 className="text-[clamp(3.5rem,12vw,10rem)] font-extrabold leading-[0.85] tracking-tighter text-white/30 uppercase">
          TALK
        </h2>
      </motion.div>

      {/* ── Form ──────────────────────────────────────────── */}
      <div className="relative z-10 px-6 sm:px-12 lg:px-20 pb-32">
        <div className="max-w-3xl">

          <FormField
            label="01 — Your Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            delay={0}
          />

          <FormField
            label="02 — Your Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            delay={0.05}
          />

          <FormFieldTextarea
            label="03 — Your Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project..."
            delay={0.1}
          />

          {/* Submit */}
          <div className="border-t border-white/[0.08] pt-12">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="group flex items-center gap-6 text-white text-sm md:text-base tracking-[0.3em] uppercase font-light transition-all duration-500"
            >
              <span>Send Message</span>
              <span className="inline-block w-10 h-[1px] bg-white/20 group-hover:w-16 group-hover:bg-white/50 transition-all duration-700" />
              <span className="text-white/20 group-hover:text-white/60 transition-colors duration-500">→</span>
            </motion.button>
          </div>

          {/* Contact info */}
          <div className="border-t border-white/[0.08] mt-16 pt-12 flex flex-col sm:flex-row gap-12">
            <div>
              <p className="text-white/15 text-[10px] tracking-[0.4em] uppercase mb-2">Email</p>
              <p className="text-white/40 text-sm font-light">hello@ixotic.dev</p>
            </div>
            <div>
              <p className="text-white/15 text-[10px] tracking-[0.4em] uppercase mb-2">Location</p>
              <p className="text-white/40 text-sm font-light">Available Worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label, name, type, value, onChange, placeholder, delay,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="border-t border-white/[0.08] py-10 md:py-12">
      <label className="block text-white/15 text-[10px] tracking-[0.4em] uppercase mb-4">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-white text-xl md:text-3xl font-light border-b border-white/[0.08] pb-3 focus:border-white/30 transition-colors duration-700 outline-none placeholder:text-white/[0.07]"
      />
    </motion.div>
  );
}

function FormFieldTextarea({
  label, name, value, onChange, placeholder, delay,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="border-t border-white/[0.08] py-10 md:py-12">
      <label className="block text-white/15 text-[10px] tracking-[0.4em] uppercase mb-4">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-transparent text-white text-lg md:text-2xl font-light border-b border-white/[0.08] pb-3 focus:border-white/30 transition-colors duration-700 outline-none resize-none placeholder:text-white/[0.07]"
      />
    </motion.div>
  );
}
