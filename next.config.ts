import type { NextConfig } from 'next';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5155';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Proxy all /api/* to backend EXCEPT /api/ai/* (handled by Next.js Route Handlers)
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
        // Next.js Route Handlers (app/api/ai/...) take precedence over rewrites automatically
      },
    ];
  },
};

export default nextConfig;
