# Codex — Products featured imagery replacement

- **Agent:** Codex
- **Scope:** Replaced the two visibly soft Products-index feature banners with unique,
  high-resolution architectural editorial studies that make the represented hardware legible.
- **Files:** `src/app/(en)/products/page.tsx`, two versioned WebP assets, image provenance and
  progress records.
- **Generation:** Built-in Codex image generation; prompts and representative-use boundaries are
  recorded in `IMAGE_CREDITS.md`. No third-party source image was copied.
- **Tests:** Run `npm run assets:editorial`, targeted/static checks, then release build before deploy.
- **Untouched:** Product pack shots, watermark derivatives, Kimi SEO changes, certificates and
  specification claims.
- **Next review:** Visually verify desktop/mobile crop, then audit adaptive HYDE watermark placement.
