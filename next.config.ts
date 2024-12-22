import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // If you're not deploying to the root domain, add this:
  // basePath: '/flashcards-maker',
  // assetPrefix: process.env.NODE_ENV === "production" ? "/flashcards-maker/" : undefined,
  images: {
    unoptimized: true,
  }
}

export default nextConfig;
