/**
 * Canton Hyland — content model
 * ============================================================================
 * Shapes only. No business logic, no rendering, no data fetching.
 *
 * This is the English-language site, so every display field is English.
 * Fields ending in `Zh` are optional Chinese source text: the catalogue is
 * authored in Chinese internally, and keeping the original alongside the
 * translation makes review easier and leaves the door open to a /zh site later.
 * Nothing renders `*Zh` today.
 *
 * Every id/slug is lowercase kebab-case and must be URL-safe — these become
 * real paths under the static export, where each route has to be enumerable at
 * build time via generateStaticParams(). See BUILD_PLAN.md "Known constraints".
 * ============================================================================
 */

/* -------------------------------------------------------------------------
 * Shared primitives
 * ---------------------------------------------------------------------- */

/**
 * An image slot.
 *
 * The site currently has no photography, so every slot renders through
 * MediaPlaceholder (a flat block at the right aspect ratio with a label).
 * `src` is therefore optional: fill it in as real assets arrive and the
 * placeholder disappears on its own — no component changes needed.
 */
export interface ImageRef {
  /** Path under /public once a real asset exists, e.g. "/images/products/hy007-s.jpg". */
  src?: string;
  /** Aspect ratio, CSS syntax: "1 / 1", "3 / 2", "2880 / 1391". Required — it reserves the space. */
  ratio: string;
  /** Alt text when `src` is set; placeholder caption when it is not. */
  label: string;
  /** Spanish alt text; Spanish routes fall back to `label` when it is absent. */
  labelEs?: string;
  /** Chinese source caption, for internal review. */
  labelZh?: string;
  /**
   * Marks an asset that should be replaced once a better original exists. Never
   * rendered — it is a handle for tooling.
   *
   * The only value in use is `"2022-watermarked"`, set by
   * scripts/import-drive-images.mjs on images from the 2022 shoot, which carry a
   * diagonal www.cantonlock.com tile baked into the photograph. The client chose to
   * publish those rather than leave the products blank, on the condition that they stay
   * findable: this field is how a later pass locates them without re-inspecting pixels.
   */
  sourceNote?: string;
}

/**
 * A product video.
 *
 * `src` takes either a file this site serves (`/videos/305-operation.mp4`) or a YouTube
 * or Vimeo watch/share URL. Both are supported because the two have opposite costs and
 * the right answer differs per video:
 *
 *   Self-hosted plays with no third party involved and no cookie banner implication, but
 *   every megabyte lives in the repository and is pushed to the server on each deploy.
 *   Fine for a short clip, wrong for a 200 MB factory tour.
 *
 *   YouTube and Vimeo carry the bandwidth, but embed a third-party frame. The renderer
 *   uses youtube-nocookie / Vimeo DNT so nothing is set until the visitor presses play.
 *
 * `poster` matters more than it looks: without one the player shows a black rectangle
 * until the visitor interacts, which on a catalogue page reads as a broken image.
 */
export interface VideoRef {
  /** Local path under /public, or a YouTube/Vimeo URL. */
  src: string;
  /** Still frame shown before playback. Strongly recommended for self-hosted files. */
  poster?: ImageRef;
  /** Describes the video for people who cannot see it, and labels the player. */
  label: string;
  /**
   * Runtime of the file this site serves, in seconds.
   *
   * Present for self-hosted clips only. Google's video structured data will not produce a
   * video result without a duration, and measuring it off the delivered file rather than
   * the camera original means the number cannot disagree with what a visitor watches.
   */
  durationSeconds?: number;
  /** ISO date this site published the clip. Also required by video structured data. */
  uploadDate?: string;
}

/**
 * One row of the spec table. Products have different numbers of rows, so this
 * is a plain list rather than a fixed set of fields — a lock body and a glass
 * clamp share almost no attributes.
 */
export interface SpecRow {
  /** Left column, e.g. "Backset". */
  label: string;
  /** Right column, e.g. "70". */
  value: string;
  /** Optional unit rendered after the value, e.g. "mm". */
  unit?: string;
  labelZh?: string;
}

/** A certification or standard the product has been tested to. */
export interface Certification {
  /** Short name shown as a badge, e.g. "ANSI/BHMA Grade 3". */
  name: string;
  /** Issuing body or standard number, e.g. "ANSI/BHMA A156.13". */
  standard?: string;
  /** Optional link to the certificate in the download centre. */
  downloadId?: string;
}

/* -------------------------------------------------------------------------
 * Product
 * ---------------------------------------------------------------------- */

export interface Product {
  /** Model number — the primary business key. e.g. "305". */
  model: string;
  /**
   * True when `model` is a working label rather than the client's real SKU.
   * Several products arrived as descriptive names only. Render a "model on request"
   * note instead of the code, and never quote it back to a customer as an order code.
   */
  modelTbc?: boolean;
  /** URL segment, unique within its category. e.g. "hy007-s". */
  slug: string;
  /** Display name, e.g. "Solid Lever Handle on Rose". */
  name: string;
  nameZh?: string;
  /** Spanish display name for the /es mirror. */
  nameEs?: string;
  /** Product family/series this belongs to, e.g. "Hyland 007". */
  series: string;
  /**
   * Category path from root to leaf, as slugs — e.g. ["levers", "lever-on-rose"].
   * Drives the /products/[category]/[slug] URL and the breadcrumb.
   * Must resolve against the tree in categories.ts.
   */
  categoryPath: string[];
  /** One or two sentences for cards and listings. */
  summary: string;
  summaryZh?: string;
  /** Spanish summary, composed from the spec rows rather than translated. */
  summaryEs?: string;
  /**
   * Long-form product copy, as Markdown.
   *
   * Optional and usually absent: the imported catalogue supplies a spec table but no
   * prose, and the site does not invent any. When present it renders under the summary
   * on the detail page.
   *
   * Markdown rather than raw HTML because the CMS writes this field and pasted HTML from
   * a marketplace listing brings inline styles, font tags and tracking pixels with it —
   * which is how a B2B catalogue ends up with three typefaces on one page. The editor
   * still offers bold, italic, headings, lists and links; it just cannot smuggle in
   * arbitrary markup.
   */
  description?: string;
  /** Full spec table. Row count varies by product type. */
  specs: SpecRow[];
  /**
   * The Spanish side, composed from `specs` rather than translated — see
   * scripts/translate-products-es.mjs. Absent where the record has no rows to compose
   * from, in which case the /es page falls back to the English text rather than
   * showing a gap.
   */
  specsEs?: SpecRow[];
  /** Base material, e.g. "Solid brass". */
  material: string;
  /** Surface finish(es), e.g. ["Satin stainless", "Matt black (PVD)"]. */
  finishes: string[];
  /** Door types this suits, e.g. ["Timber", "Steel", "Frameless glass"]. */
  doorTypes: string[];
  /** Standards and approvals. */
  certifications: Certification[];
  /** Lead image — cards, listing thumbnails, detail hero. */
  heroImage: ImageRef;
  /** Additional images for the detail-page gallery. */
  gallery: ImageRef[];
  /**
   * Product videos — operation, installation, factory footage. Optional, and absent on
   * every imported record because the legacy catalogue had none.
   */
  videos?: VideoRef[];
  /** Download ids (see downloads data) — datasheets, CAD, installation guides. */
  attachmentIds: string[];
  /** Model numbers of related products. Resolved at render time, not stored as objects. */
  relatedModels: string[];
  /**
   * The product's own listing on the client's Alibaba storefront.
   *
   * Optional, and empty on every imported record. When set, the detail page links
   * straight to that listing; when absent it falls back to a storefront search seeded
   * with the model number. See src/lib/alibaba.ts — the fallback exists because asking
   * the client to paste 431 URLs before the site can send anyone to Alibaba would mean
   * it never sends anyone to Alibaba.
   */
  alibabaUrl?: string;
  /**
   * Exact storefront search term when Alibaba uses a different numeric catalogue code.
   * This remains a search result, not a claimed direct listing URL.
   */
  alibabaSearchTerm?: string;
  /** <title> for the detail page. Keep under ~60 chars. */
  seoTitle: string;
  /** <meta name="description">. Keep under ~155 chars. */
  seoDescription: string;
  /**
   * Spanish mirrors, generated by scripts/generate-product-seo.mjs alongside the
   * English pair. Optional only until the next --write run backfills every record.
   */
  seoTitleEs?: string;
  seoDescriptionEs?: string;
}

/* -------------------------------------------------------------------------
 * Project (reference case study)
 * ---------------------------------------------------------------------- */

export interface Project {
  /** URL segment, unique site-wide. e.g. "riverside-tower-guangzhou". */
  slug: string;
  /** Project name, e.g. "Riverside Tower". */
  name: string;
  nameEs?: string;
  nameZh?: string;
  /** City. */
  location?: string;
  /** Country, for filtering by market. */
  country?: string;
  /** Year of completion. */
  year?: number;
  /** Separates verified built references from clearly labelled application concepts. */
  referenceStatus: "verified-project" | "representative-application";
  /** Building type, e.g. "Office", "Library", "Hotel". Drives listing filters. */
  buildingType: string;
  buildingTypeEs?: string;
  /** Architect or specifier credit. */
  architect?: string;
  /** One or two sentences for the listing card. */
  summary: string;
  summaryEs?: string;
  /** Body copy for the detail page. Paragraphs as separate array entries. */
  body: string[];
  bodyEs?: string[];
  /** Model numbers used on this project — links the case study back to the catalogue. */
  productModels: string[];
  heroImage: ImageRef;
  gallery: ImageRef[];
  seoTitle: string;
  seoDescription: string;
  /** Spanish SERP copy. Kept separate from summaryEs so the visible intro stays untouched. */
  seoTitleEs?: string;
  seoDescriptionEs?: string;
}

/* -------------------------------------------------------------------------
 * Promotional dialog
 * ---------------------------------------------------------------------- */

/** Which routes the dialog is allowed to interrupt. */
export type PromoSurface =
  | "home"
  | "products"
  | "product-detail"
  | "product-finder"
  | "projects"
  | "news"
  | "company"
  | "downloads";

/**
 * The site-wide promotional dialog, modelled on FSB's newsletter popup.
 *
 * FSB decides visibility on the server: the browser posts its last-seen timestamp and
 * the server answers with the markup or with nothing. A static export has no server, so
 * every rule here is evaluated in the browser instead. The visible behaviour matches;
 * what changes is that a determined visitor can clear localStorage and see it again,
 * which is an acceptable trade for a marketing dialog.
 */
export interface PromoDialogConfig {
  /** Master switch. False means the component renders nothing at all. */
  enabled: boolean;
  /** Internal label — never rendered, only to identify the campaign in the CMS. */
  name: string;
  /**
   * Bump to force the dialog back in front of people who already dismissed it.
   *
   * FSB derives this from the content's edit time, so editing the copy resets everyone's
   * cooldown. Here it is manual and deliberate: changing a typo should not re-interrupt
   * every visitor, but a new campaign should.
   */
  version: number;
  /** ISO dates, inclusive. Empty means no bound on that end. */
  startAt?: string;
  endAt?: string;
  /** Seconds after load before it appears. FSB uses 20. */
  delaySeconds: number;
  /**
   * Minutes before a dismissed dialog may return.
   *
   * Minutes rather than hours because the client asked for a 30-minute window, which an
   * hours field cannot express. Short windows mean the same visitor can be interrupted
   * more than once in a session — that is the intent here, not an oversight.
   */
  cooldownMinutes: number;
  /** Routes it may appear on. Empty array means nowhere — a safer default than everywhere. */
  surfaces: PromoSurface[];
  /**
   * Campaign offers, presented one at a time in a non-modal complementary rail.
   * Dismissing the current card reveals the next; an empty array renders nothing.
   */
  cards: PromoCard[];
}

export interface PromoCard {
  /** Bold first line. */
  title: string;
  titleEs?: string;
  /** Second line, set in the lighter weight. */
  titleLight?: string;
  titleLightEs?: string;
  body: string;
  bodyEs?: string;
  /** Call to action. `href` may be internal or a file under /downloads. */
  ctaLabel: string;
  ctaLabelEs?: string;
  ctaHref: string;
  /** Optional locale-specific destination for campaigns whose target has a Spanish route. */
  ctaHrefEs?: string;
  /**
   * What fills the left panel.
   *
   * "logo" renders the brand lockup on black — no asset to keep in sync, and it stays
   * sharp at any density. "image" uses `image` below, for a campaign that needs to show
   * a specific product.
   */
  visual: "logo" | "image";
  image?: ImageRef;
}

/* -------------------------------------------------------------------------
 * News
 * ---------------------------------------------------------------------- */

/**
 * Two kinds of article, kept in one collection.
 *
 * FSB splits these across /press and /magazine, and the distinction is real: a press
 * release is a dated, factual company announcement that a journalist may quote, while
 * an insight piece is undated marketing writing. Mixing them costs credibility in both
 * directions — a trade editor scrolling past "5 Reasons to Choose Stainless" stops
 * treating the feed as a newsroom.
 *
 * They share one collection because the record shape is identical and the site has far
 * too little content to justify two. `kind` drives the filter and the listing label;
 * splitting into separate routes later is a rename, not a migration.
 */
export type NewsKind = "press-release" | "insight";

/**
 * A named author for an article.
 *
 * Present only where a real person wrote or edited the piece, with the credential that
 * person actually holds. An invented byline is the same class of error as an invented
 * dimension: a reader who checks one and finds it false discounts everything else on the
 * page, and E-E-A-T is precisely the signal being checked.
 */
export interface ArticleAuthor {
  name: string;
  nameZh?: string;
  /** Function at the company, e.g. "Digital Communications, Canton Hyland". */
  role: string;
  roleEs?: string;
  /** The qualification held, stated plainly. Omit rather than approximate. */
  credential?: string;
  /** A profile that resolves, so the author is an entity and not a string. */
  url?: string;
}

export interface NewsArticle {
  /** URL segment, unique site-wide. e.g. "en-1125-certification-for-panic-range". */
  slug: string;
  title: string;
  titleEs?: string;
  titleZh?: string;
  kind: NewsKind;
  /**
   * ISO 8601 date, "YYYY-MM-DD". Drives ordering and the dateline.
   *
   * On a static export "scheduled publishing" is not a thing the site can do by itself:
   * a future date only takes effect at the next build. `getPublishedNews()` filters
   * future dates out so a post-dated draft cannot leak, but someone still has to
   * rebuild on the day. Say so to whoever schedules one.
   */
  publishedAt: string;
  /** Named author. Absent on corporate announcements, which are authored by the company. */
  author?: ArticleAuthor;
  /** Kept out of the build entirely. Use for work in progress. */
  draft?: boolean;
  /** One or two sentences for the listing card and the meta description fallback. */
  summary: string;
  summaryEs?: string;
  /** Body copy, one array entry per paragraph — same convention as Project. */
  body: string[];
  bodyEs?: string[];
  heroImage: ImageRef;
  gallery?: ImageRef[];
  /** Model numbers this article concerns, linking it back to the catalogue. */
  relatedModels?: string[];
  /**
   * Download ids for a press kit — high-resolution imagery, the full release as PDF.
   * Journalists expect to leave with assets, not with a right-click.
   */
  attachmentIds?: string[];
  seoTitle: string;
  seoDescription: string;
  /**
   * Spanish snippet copy for the /es/news mirror.
   *
   * Separate fields rather than a translation of seoTitle at render time: a meta
   * description is written to a character budget Google actually renders, and Spanish
   * runs roughly 20% longer than English for the same content. A machine-shortened
   * English sentence would either overflow that budget or stop mid-word.
   */
  seoTitleEs?: string;
  seoDescriptionEs?: string;
}

/* -------------------------------------------------------------------------
 * Download
 * ---------------------------------------------------------------------- */

/** What kind of document this is — drives the download-centre grouping. */
export type DownloadKind =
  | "catalogue"
  | "datasheet"
  | "certificate"
  | "cad"
  | "bim"
  | "installation"
  | "warranty";

export interface DownloadFile {
  /** Stable id referenced by Product.attachmentIds and Certification.downloadId. */
  id: string;
  /** Display title, e.g. "HY007-S Technical Datasheet". */
  title: string;
  titleZh?: string;
  kind: DownloadKind;
  /** File extension, lowercase — drives the type badge. e.g. "pdf", "dwg", "rfa", "zip". */
  format: string;
  /** Size in bytes. Formatted for display at render time, not stored pre-formatted. */
  sizeBytes: number;
  /** Path under /public, e.g. "/downloads/hy007-s-datasheet.pdf". */
  url: string;
  /** BCP 47 language tag of the document itself, e.g. "en", "zh-CN". */
  language: string;
  /** Model numbers this document covers. Empty for site-wide documents. */
  relatedModels: string[];
  /** ISO 8601 date, e.g. "2026-08-15". Shown as "last updated". */
  updatedAt: string;
}

/* -------------------------------------------------------------------------
 * Category tree
 * ---------------------------------------------------------------------- */

export interface Category {
  /** URL segment, unique among its siblings. e.g. "locks". */
  slug: string;
  /** Display name, e.g. "Mortise Locks". */
  name: string;
  nameZh?: string;
  /**
   * Latin American trade Spanish, for the /es mirror. Written rather than translated —
   * see src/data/es-glossary.ts for the register and the terminology decisions.
   */
  nameEs?: string;
  summaryEs?: string;
  /** Short description for the category landing page. */
  summary: string;
  /** Lead image for the category card. */
  image: ImageRef;
  /** Sub-categories. Absent or empty means this is a leaf that holds products. */
  children?: Category[];
}
