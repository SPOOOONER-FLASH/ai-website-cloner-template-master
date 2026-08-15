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
  /** Chinese source caption, for internal review. */
  labelZh?: string;
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
  /** Full spec table. Row count varies by product type. */
  specs: SpecRow[];
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
  /** Download ids (see downloads data) — datasheets, CAD, installation guides. */
  attachmentIds: string[];
  /** Model numbers of related products. Resolved at render time, not stored as objects. */
  relatedModels: string[];
  /** <title> for the detail page. Keep under ~60 chars. */
  seoTitle: string;
  /** <meta name="description">. Keep under ~155 chars. */
  seoDescription: string;
}

/* -------------------------------------------------------------------------
 * Project (reference case study)
 * ---------------------------------------------------------------------- */

export interface Project {
  /** URL segment, unique site-wide. e.g. "riverside-tower-guangzhou". */
  slug: string;
  /** Project name, e.g. "Riverside Tower". */
  name: string;
  nameZh?: string;
  /** City. */
  location: string;
  /** Country, for filtering by market. */
  country: string;
  /** Year of completion. */
  year: number;
  /** Building type, e.g. "Office", "Library", "Hotel". Drives listing filters. */
  buildingType: string;
  /** Architect or specifier credit. */
  architect?: string;
  /** One or two sentences for the listing card. */
  summary: string;
  /** Body copy for the detail page. Paragraphs as separate array entries. */
  body: string[];
  /** Model numbers used on this project — links the case study back to the catalogue. */
  productModels: string[];
  heroImage: ImageRef;
  gallery: ImageRef[];
  seoTitle: string;
  seoDescription: string;
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
  /** Short description for the category landing page. */
  summary: string;
  /** Lead image for the category card. */
  image: ImageRef;
  /** Sub-categories. Absent or empty means this is a leaf that holds products. */
  children?: Category[];
}
