import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` emits a fully static site to out/ that can be
  // dropped on any static host. No Node server required.
  output: "export",
  // The export target has no Image Optimization API, so images must be passed through.
  // (This prototype uses no next/image anyway — every visual slot is a MediaPlaceholder div.)
  images: { unoptimized: true },
  // Emit out/index.html style directory routes so paths resolve without a rewrite rule.
  trailingSlash: true,
};

export default nextConfig;
