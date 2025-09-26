/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Set to true to ignore TypeScript errors during build
    ignoreBuildErrors: false,
  },
  // Remove experimental turbopack for production
  experimental: {
    // turbopack is only for dev, not production builds
  },
}

export default nextConfig
