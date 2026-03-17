import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Produce standalone server output for Docker-friendly deployment
  output: "standalone",
};

export default nextConfig;
