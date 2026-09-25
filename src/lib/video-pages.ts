import { isPublished, products } from "@/data/products";
import type { Product, VideoRef } from "@/data/types";
import { isoUploadDate } from "@/lib/upload-date";

/**
 * One watch page per product clip: /video/<product slug>/.
 *
 * ---------------------------------------------------------------------------
 * WHY THESE PAGES EXIST
 *
 * Search Console's video report, 2026-09-23: 97 clips under 「视频不在观看页面上」— "Video
 * isn't on a watch page". Validation failed again on 2026-09-24. Google indexes a video only
 * from a page whose MAIN PURPOSE is that video, and a product page's main purpose is the
 * product, whatever order the page is in. The earlier fixes (preload="metadata", uploadDate
 * with an offset, serving the file with byte ranges) were all correct and none of them could
 * change that.
 *
 * So each clip gets a page that is about the clip: the player first and full width, the
 * product's own summary under it, a link back to the specifications. The VideoObject and the
 * sitemap <video:video> entry live here now, not on the product page; the product page keeps
 * playing the clip for buyers and links here.
 *
 * `/video/` (singular) because `/videos/products/` is where the files themselves are served.
 * English only: one watch page per clip is what Google needs, and an /es or /pt copy would be
 * a second page competing for the same video.
 */

/** A self-hosted clip carrying every field a video result needs. */
export function isIndexableVideo(video: VideoRef): boolean {
  return Boolean(
    video.src.startsWith("/") &&
      video.poster?.src &&
      video.durationSeconds &&
      isoUploadDate(video.uploadDate),
  );
}

export function watchPagePath(product: Product): string {
  return `/video/${product.slug}/`;
}

/** The clip a product's watch page plays: its first indexable one, or none. */
export function watchVideo(product: Product): VideoRef | undefined {
  return (product.videos ?? []).find(isIndexableVideo);
}

/** Published HYDE products that have a watch page. */
export function productsWithWatchPage(): Product[] {
  return products.filter((p) => isPublished(p) && watchVideo(p));
}

export function getWatchPageProduct(slug: string): Product | undefined {
  return productsWithWatchPage().find((p) => p.slug === slug);
}

/** "5831 Tubular Lock" — or just the name for records with no factory model yet. */
export function productTitle(product: Product): string {
  return product.modelTbc ? product.name : `${product.model} ${product.name}`;
}

/** "1:26" */
export function clock(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
