import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const pressStart = Press_Start_2P({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ixotic — Creative Developer Portfolio",
  description:
    "A high-end scrollytelling portfolio showcasing creative development, design engineering, and digital craft.",
  openGraph: {
    title: "Ixotic — Creative Developer Portfolio",
    description:
      "Scroll-driven cinematic portfolio blending design and engineering.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${pressStart.variable}`}>
      <body className="font-sans antialiased">
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
