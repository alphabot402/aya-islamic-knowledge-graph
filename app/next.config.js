/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['reactflow', '@react-three/fiber', '@react-three/drei']
  }
}

module.exports = nextConfig
