import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Zero Tolerance Error Nuke: Enforce checks during build
    typescript: {
        ignoreBuildErrors: false,
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
        ],
        unoptimized: true,
    },
};

export default nextConfig;
