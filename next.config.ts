import type { NextConfig } from "next";

/**
 * Default (Vercel / `npm run build`): a normal Next.js build.
 * `STATIC_EXPORT=1 npm run build`: emits a fully static site to /out,
 * used for publishing a standalone preview copy. Vercel should NOT set
 * that variable — it deploys the native build.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStaticExport ? { output: "export" as const, trailingSlash: true } : {}),
};

export default nextConfig;
