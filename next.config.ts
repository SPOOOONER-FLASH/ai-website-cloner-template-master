import os from "node:os";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permit the two preview origins used by this project to load dev-only HMR assets.
  // This setting affects `next dev` only; the static export has no development endpoints.
  allowedDevOrigins: ["127.0.0.1", "cantonlock.free.idcfengye.com"],
  // Static export: `next build` emits a fully static site to out/ that can be
  // dropped on any static host. No Node server required.
  output: "export",
  // The export target has no Image Optimization API, so images must be passed through.
  // (This prototype uses no next/image anyway — every visual slot is a MediaPlaceholder div.)
  images: { unoptimized: true },
  // Emit out/index.html style directory routes so paths resolve without a rewrite rule.
  trailingSlash: true,
  // Multiple documented root layouts give / and /es their correct static html[lang].
  // The global 404 convention is required because there is no longer one shared root.
  experimental: {
    globalNotFound: true,
    /*
      NOT `inlineCss: true` (tried 2026-09-30). It removes the export's only render-blocking
      requests — three stylesheets, 19 KB compressed — and Lighthouse's slow-4G run gained
      0.3 s of first paint. But Next also copies the whole 124 KB stylesheet into every
      page's RSC payload: out/index.html went from 282 KB to 534 KB, and across 8,135 HTML
      files that is +2 GB in out/, which this repository commits on every release through a
      proxy that already needs chunked pushes. Not worth 0.3 s. Revisit if out/ ever stops
      being tracked.
    */
    /*
      Build worker cap. Next defaults to one worker per core less one — 31 on the johns
      release machine — and on 2026-09-28 three of four `deploy:prep` runs died in
      "Collecting page data using 31 workers" with 0xC0000409, no JavaScript error. Twelve
      is still fast and leaves headroom; NEXT_BUILD_CPUS overrides it on another machine.
    */
    cpus: Number(process.env.NEXT_BUILD_CPUS) || Math.min(12, Math.max(1, os.cpus().length - 1)),
  },
};

export default nextConfig;
