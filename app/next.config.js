/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['reactflow', '@react-three/fiber', '@react-three/drei']
  }
}

module.exports = nextConfig
