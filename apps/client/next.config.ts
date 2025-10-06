import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@budrive/validation"],
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
