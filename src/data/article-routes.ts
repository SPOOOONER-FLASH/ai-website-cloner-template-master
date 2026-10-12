import routesFile from "../../content/article-routes.json";

/**
 * Where an article sends a reader who is ready to look at products (2026-10-12).
 *
 * Bing's AI report for 2026-10-12: Copilot cited our guides and news 2,330 times and our
 * product pages 28 times. The readers arrive on the articles; this is the curated second
 * step each one offers, beside the article's own related products. Data lives in
 * content/article-routes.json and is checked by src/data/article-routes.test.ts.
 */
export type ArticleNext =
  | { kind: "compare"; category: string }
  | { kind: "category"; category: string }
  | { kind: "finishes" | "certifications" | "price-list" | "documents" };

export type ArticleRoute = { next?: ArticleNext; noProducts?: string };

type RawRoute = { next?: string; noProducts?: string };
const raw = (routesFile as { articles: Record<string, RawRoute> }).articles;

export function parseNext(value: string, key = ""): ArticleNext {
  const [kind, category] = value.split(":");
  if ((kind === "compare" || kind === "category") && category) return { kind, category };
  if (!category && (kind === "finishes" || kind === "certifications" || kind === "price-list" || kind === "documents")) return { kind };
  /* A misspelt route would silently drop the link from a page Copilot cites; stop the build instead. */
  throw new Error(`Unknown article next step "${value}" (${key})`);
}

export function articleRoute(section: "news" | "guides", slug: string): ArticleRoute | undefined {
  const key = `${section}/${slug}`;
  const entry = raw[key];
  if (!entry) return undefined;
  return { next: entry.next ? parseNext(entry.next, key) : undefined, noProducts: entry.noProducts };
}

export const articleRouteKeys = Object.keys(raw);
