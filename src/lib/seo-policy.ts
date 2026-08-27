export type SitemapChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type SitemapPolicyEntry = {
  url: string;
  lastModified?: Date;
  changeFrequency?: SitemapChangeFrequency;
  priority?: number;
  alternates?: { languages: Record<string, string> };
};

export type RobotsPolicyRule = {
  userAgent: string;
  allow?: string[];
  disallow: string | string[];
};

/**
 * @param indexNowKey  Bing verifies domain ownership by fetching /<key>.txt, so that one
 *   file must be exempt from the blanket *.txt disallow. Passed in rather than imported
 *   to keep this module free of path aliases — it is unit-tested with plain node --test.
 */
export function buildRobotsRules(indexable: boolean, indexNowKey = ""): RobotsPolicyRule[] {
  if (!indexable) return [{ userAgent: "*", disallow: "/" }];

  return [
    {
      userAgent: "*",
      // The IndexNow key file must stay fetchable — the blanket *.txt disallow below
      // would otherwise hide the one file Bing uses to verify domain ownership.
      allow: ["/", "/llms.txt", ...(indexNowKey ? [`/${indexNowKey}.txt`] : [])],
      // Keep the editor and generated RSC payloads out of search results without
      // blocking /_next/static CSS and JavaScript that crawlers need to render pages.
      disallow: ["/admin/", "/*.txt$"],
    },
  ];
}

export function buildLocaleSitemapEntries({
  en,
  es,
  bilingual,
  priority,
  changeFrequency = "monthly",
  lastModified,
}: {
  en: string;
  es: string;
  bilingual: boolean;
  priority: number;
  changeFrequency?: SitemapChangeFrequency;
  lastModified?: Date;
}): SitemapPolicyEntry[] {
  const shared = {
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
  };

  if (!bilingual) return [{ url: en, ...shared }];

  const languages = { en, es, "x-default": en };
  return [
    { url: en, ...shared, alternates: { languages } },
    { url: es, ...shared, alternates: { languages } },
  ];
}
