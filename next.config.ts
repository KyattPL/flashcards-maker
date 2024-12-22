import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // If you're not deploying to the root domain, add this:
  // basePath: '/flashcards-maker',
  // assetPrefix: "/flashcards-maker/",
  images: {
    unoptimized: true,
  }
}

export default nextConfig;
