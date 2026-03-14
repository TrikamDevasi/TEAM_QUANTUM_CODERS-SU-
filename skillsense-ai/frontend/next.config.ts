import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ── TypeScript & ESLint ─────────────────────────────────────────────────────
  // Allow builds even with type errors during hackathon dev
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ── Image domains ────────────────────────────────────────────────────────────
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },

  // ── API Proxy (avoids CORS during local dev) ─────────────────────────────────
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
