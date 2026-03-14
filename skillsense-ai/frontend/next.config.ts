import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Allow builds even with type errors during hackathon dev
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
