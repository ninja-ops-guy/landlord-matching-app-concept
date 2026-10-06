import type { NextConfig } from "next";
const basePath = process.env.NODE_ENV === "production" ? "/landlord-matching-app-concept" : "";
const config: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  output: "export", basePath, trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  transpilePackages: ["@electric-sql/pglite"],
};
export default config;
