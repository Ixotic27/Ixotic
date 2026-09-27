import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/manrope";
import "./globals.css";
export const metadata: Metadata = {
  title: "Ixotic — A Little Room on the Internet",
  description: "Explore Ixotic’s illustrated rooms. Open the iMac, browse project books in the library, pick up the Game Boy, or play table tennis with Ixotic.",
  openGraph: { title: "Ixotic — A Little Room on the Internet", description: "An illustrated study, a library of projects, and a friendly game of table tennis.", type: "website" },
};
export const viewport: Viewport = { themeColor: "#ecebdf" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

