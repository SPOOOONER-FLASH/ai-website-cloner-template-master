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
  images?: string[];
  videos?: SitemapVideo[];
};

/**
 * One <video:video> entry. The field names are Google's, not ours — they go into the XML
 * verbatim, so they stay snake_case.
 *
 * title, thumbnail_loc and description are REQUIRED by the video sitemap schema, plus one
 * of content_loc or player_loc. An entry missing any of them is rejected for the whole
 * URL, not just the video, which is why the caller filters before building one.
 */
export type SitemapVideo = {
  title: string;
  thumbnail_loc: string;
  description: string;
  content_loc?: string;
  player_loc?: string;
  /** Seconds. Google accepts 1 to 28800. */
  duration?: number;
  publication_date?: string;
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
/**
 * Assistant crawlers, named explicitly.
 *
 * They are already permitted by the `*` group, so this changes no access today. It is
 * here because a named group is a stated decision rather than an accident of the
 * wildcard, and because these four are the ones that decide whether this catalogue can
 * be quoted when a buyer asks an assistant for a panic-device manufacturer.
 *
 * Google-Extended is not a crawler: it is the opt-in token for Gemini and Vertex AI
 * grounding. Listing it is a commercial choice to be quotable, and it is reversible by
 * moving it out of this list.
 *
 * CCBot is Common Crawl, and it is the odd one out: it does not answer anybody's
 * question directly. It builds the corpus that many models are trained and grounded on,
 * so being in it is how a manufacturer nobody has heard of gets mentioned at all. Named
 * for the same reason as the rest — the access is unchanged, but the decision is now
 * written down instead of inherited from the wildcard.
 */
const ASSISTANT_CRAWLERS = [
  "GPTBot",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
];

export function buildRobotsRules(indexable: boolean, indexNowKey = ""): RobotsPolicyRule[] {
  if (!indexable) return [{ userAgent: "*", disallow: "/" }];

  // The IndexNow key file must stay fetchable — the blanket *.txt disallow would
  // otherwise hide the one file Bing uses to verify domain ownership.
  const allow = ["/", "/llms.txt", ...(indexNowKey ? [`/${indexNowKey}.txt`] : [])];
  /*
    Keep the editor and generated RSC payloads out of search results without blocking
    /_next/static CSS and JavaScript that crawlers need to render pages.

    `/cdn-cgi/` is Cloudflare's, not ours, and nothing under it is a page. Bing's Site
    Scan reported `/cdn-cgi/l/email-protection` as a 4xx on 2026-09-04 — a URL that does
    not exist in our export, because Cloudflare's Email Address Obfuscation invents it at
    the edge when it rewrites a `mailto:`. The obfuscation itself is now switched off
    around our own addresses (see EmailLink), which stops the URL being generated at all;
    this line covers everything else Cloudflare mounts there, and the ones already in
    Bing's index.
  */
  const disallow = ["/admin/", "/cdn-cgi/", "/*.txt$"];

  return [
    { userAgent: "*", allow, disallow },
    /*
      Every named group repeats the same rules on purpose.

      A crawler that finds a group matching its own token obeys that group and ignores
      the `*` group entirely — the rules do not merge. Naming these agents without
      restating the disallow list would therefore have handed exactly these five crawlers
      the admin editor and all 4,693 RSC payload files, which is the opposite of what
      naming them is for.
    */
    ...ASSISTANT_CRAWLERS.map((userAgent) => ({ userAgent, allow, disallow })),
  ];
}

export function buildLocaleSitemapEntries({
  en,
  es,
  bilingual,
  priority,
  changeFrequency = "monthly",
  lastModified,
  images,
  videos,
}: {
  en: string;
  es: string;
  bilingual: boolean;
  priority: number;
  changeFrequency?: SitemapChangeFrequency;
  lastModified?: Date;
  /**
   * Absolute image URLs for this page, emitted as <image:image> entries.
   *
   * Crawlers treat pages and images as two separate paths: indexing the page does not
   * index the photograph on it. That matters here more than on most sites, because the
   * people buying door hardware routinely search Google Images for a shape they can
   * recognise — a patch fitting, a lock case forend — before they know a model number.
   * Both locales get the same list; the image is the same file either way.
   */
  images?: string[];
  /**
   * Demonstration clips on this page, emitted as <video:video>.
   *
   * Same argument as images, one step further: a video sitemap is how a clip becomes
   * eligible for a video result at all, and this catalogue's clips answer the question a
   * spec table cannot — what the part does when a person's hand is on it.
   *
   * Both locales list the same file. The clip has no spoken commentary, so there is
   * nothing in it that is English rather than Spanish; only the title and description
   * differ, and those come from the page.
   */
  videos?: SitemapVideo[];
}): SitemapPolicyEntry[] {
  const shared = {
    ...(lastModified ? { lastModified } : {}),
    ...(images?.length ? { images } : {}),
    ...(videos?.length ? { videos } : {}),
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
