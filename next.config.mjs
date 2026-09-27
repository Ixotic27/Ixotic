/** @type {import('next').NextConfig} */
const pages = process.env.GITHUB_PAGES === "true";
const nextConfig = {
  ...(pages ? { output: "export", distDir: ".next-pages", trailingSlash: true } : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  images: {
    unoptimized: pages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
