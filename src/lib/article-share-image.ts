import manifest from "@/data/generated/article-share-images.json";

/**
 * The article's 1200×675 share image (scripts/build-article-share-images.mjs), made from
 * its own hero photograph. Google Discover shows a large card only for images at least
 * 1200 px wide; 40 of 82 articles had a square product plate as hero (09-28).
 */
export function articleShareImage(section: "news" | "guides", slug: string): string | undefined {
  return (manifest as Record<string, { file: string }>)[`${section}/${slug}`]?.file;
}

export const SHARE_IMAGE_SIZE = { width: 1200, height: 675 } as const;
