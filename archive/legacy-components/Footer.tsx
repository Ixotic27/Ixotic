"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-[#0c0d10] border-t border-white/[0.06] px-6 sm:px-12 lg:px-20 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          {/* Left side */}
          <div>
            <motion.p
              className="text-white/20 text-[10px] tracking-[0.4em] uppercase mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Ready to collaborate?
            </motion.p>
            <motion.h3
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Let&apos;s work together.
            </motion.h3>
            <motion.p
              className="text-white/30 text-sm max-w-md mt-3 font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Open to freelance projects, collaborations, and full-time
              opportunities in creative development.
            </motion.p>
          </div>

          {/* Right side — links */}
          <motion.div
            className="flex gap-8 text-xs text-white/30 tracking-[0.2em] uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {["GitHub", "Twitter", "LinkedIn", "Email"].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-white transition-colors duration-500"
              >
                {link}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-white/15 tracking-widest uppercase">
          <span>© 2025 Ixotic. All rights reserved.</span>
          <span>Built with Next.js · Framer Motion</span>
        </div>
      </div>
    </footer>
  );
}
