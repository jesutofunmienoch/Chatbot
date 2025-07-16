/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.clerk.com'], // ✅ Add this line
  },
}

module.exports = nextConfig
