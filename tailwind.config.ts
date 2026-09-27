import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        pixel: ["var(--font-press-start)", "monospace"],
      },
      colors: {
        bg: "var(--bg)",
        "bg-card": "var(--bg-card)",
        "border-card": "var(--border-card)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        accent: "var(--accent)",
        "accent-glow": "var(--accent-glow)",
      },
    },
  },
  plugins: [],
};
export default config;
