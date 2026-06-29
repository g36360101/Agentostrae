import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@agentos/api-client", "@agentos/shared", "@agentos/ui-tokens"],
};

export default nextConfig;
