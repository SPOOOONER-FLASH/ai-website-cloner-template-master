/**
 * Which English fields a translation was made from, and whether they have changed since.
 *
 * The English side keeps editing records after they are translated (2026-09-25: 47 product
 * records in one afternoon, then two guides and a news article). A translation of the old
 * sentence looks finished on the board and is wrong on the page. So every merged entry
 * carries `sourceHash`, one short hash per translatable field, written by
 * scripts/i18n-merge.mjs from the job's `source`; `i18n-batch.mjs --stale` re-cuts exactly
 * the fields whose hash no longer matches the current English, and the board counts them.
 */
import { createHash } from "node:crypto";

export const FIELDS = {
  products: ["name", "summary", "description", "features", "specs"],
  news: ["title", "summary", "seoTitle", "seoDescription", "body", "faq"],
  guides: ["title", "summary", "seoTitle", "seoDescription", "body", "faq"],
  projects: ["name", "buildingType", "summary", "seoTitle", "seoDescription", "body"],
  categories: ["name", "summary", "children"],
  faq: ["question", "answer"],
};

const canon = (field, value) => {
  if (field === "specs" && Array.isArray(value)) return value.map(({ label, value: v }) => [label, v]);
  return value ?? "";
};

export const hashOf = (field, value) => createHash("sha1").update(JSON.stringify(canon(field, value))).digest("hex").slice(0, 12);

/** `{ field: hash }` for the translatable fields of one English source object. */
export function hashRecord(kind, source) {
  return Object.fromEntries((FIELDS[kind] ?? []).filter((f) => source[f] !== undefined).map((f) => [f, hashOf(f, source[f])]));
}

/** Fields whose English moved since the overlay entry was merged. No `sourceHash` → every field counts as stale. */
export function staleFields(kind, source, entry) {
  const now = hashRecord(kind, source);
  const then = entry?.sourceHash ?? {};
  return Object.keys(now).filter((f) => then[f] !== now[f]);
}
