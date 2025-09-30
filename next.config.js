/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { 
    serverActions: { 
      allowedOrigins: ['*'],
      bodySizeLimit: '10mb'
    } 
  },
  images: {
    domains: ['localhost', 'therabrake.academy']
  }
};
module.exports = nextConfig;
