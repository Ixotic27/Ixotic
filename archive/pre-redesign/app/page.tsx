import HeroSequence from "@/components/sections/HeroSequence";
import AboutSection from "@/components/sections/AboutSection";
import MarqueeDivider from "@/components/sections/MarqueeDivider";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="relative bg-[#0c0d10] min-h-screen selection:bg-[#ff3d00] selection:text-white pb-32">
      <Navbar />

      {/* ── Hero: 500vh Scrollytelling Sequence ──── */}
      <HeroSequence />

      {/* ── Valentin-Style Hero Section (Now Section #2) ─────────── */}
      <AboutSection />

      {/* ── Marquee Divider ─────────────────────────────── */}
      <MarqueeDivider text="CREATIVE DEVELOPER" />

      {/* ── Projects Section (Pinned Gallery) ───────────────── */}
      <ProjectsSection />

      {/* ── Marquee Divider ─────────────────────────────── */}
      <MarqueeDivider text="EXPLORE MY SKILLS" accentColor="#3178c6" />

      {/* ── Skills Section ───────────────────────────────── */}
      <SkillsSection />

      {/* ── Contact Section ──────────────────────────────── */}
      <ContactSection />

      {/* ── Footer ─────────────────────────────────────────── */}
      <Footer />
    </main>
  );
}
