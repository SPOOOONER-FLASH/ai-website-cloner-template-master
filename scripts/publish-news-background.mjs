import sharp from "sharp";

// Export only the empty generated backdrop. Hardware photographs remain unchanged.
await sharp("docs/design-references/2026-09-16-news-studio/empty-stone-background.png")
  .resize(1200).webp({ quality: 78 })
  .toFile("public/images/editorial/news-stone-background.webp");
