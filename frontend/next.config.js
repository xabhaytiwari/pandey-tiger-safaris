/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "bandhavgarhtigerreserve.org" },
      { protocol: "https", hostname: "www.team-bhp.com" },
      { protocol: "https", hostname: "5.imimg.com" },
      { protocol: "https", hostname: "i.ndtvimg.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "chalbanjare.com" },
      { protocol: "https", hostname: "indiantigersafaris.com" },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
