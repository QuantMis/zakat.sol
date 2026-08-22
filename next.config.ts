import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Traces the server's real dependencies into .next/standalone so the Docker
  // image can run without node_modules. See Dockerfile.
  output: "standalone",

  // next/dist/server/require-hook.js reaches for @swc/helpers/esm/* at startup
  // through a runtime resolve, which the tracer cannot see — it copies cjs/ and
  // stops. Without this the standalone server dies on MODULE_NOT_FOUND.
  outputFileTracingIncludes: {
    "/**": ["./node_modules/.pnpm/@swc+helpers@*/node_modules/@swc/helpers/esm/**"],
  },
};

export default nextConfig;
