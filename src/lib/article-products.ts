/**
 * Model numbers in article prose and tables, turned into product links (2026-10-12).
 *
 * The guides Copilot cites name our models in passing ("LC14 85×50mm", "575 ABET") with no
 * way to reach the part. These helpers find those mentions against the published-model
 * index and nothing else: content never carries link markup, so an article cannot link to
 * a page that does not exist or to a model we do not sell.
 *
 * Conservative on purpose:
 * - prose links only models that contain both a letter and a digit — a bare "307" or
 *   "564" is too often a standard ("UL 305"), a size ("564mm") or a count;
 * - first mention per article only, never inside headings;
 * - a match must stand alone: not part of a longer token ("LC85200" is not "LC8520"),
 *   not followed by "mm";
 * - table row headers link only when the whole cell is the model; a digit-only model
 *   qualifies there only if the article lists it in relatedModels.
 * Pure: no data or framework imports, so it is unit-tested directly.
 */
export type ModelIndex = ReadonlyMap<string, string>;

export function isLinkableModel(model: string): boolean {
  return /[A-Za-z]/.test(model) && /\d/.test(model) && model.length >= 3;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** One regex for every linkable model, longest first so "9014 SSET" wins over "9014 SS". */
export function mentionPattern(models: Iterable<string>): RegExp | null {
  const list = [...models].filter(isLinkableModel).sort((a, b) => b.length - a.length).map(escape);
  if (!list.length) return null;
  return new RegExp(`(?<![\\w-])(${list.join("|")})(?![\\w-]|\\s?mm\\b)`, "g");
}

/** Block index → the models first mentioned in that paragraph, with their hrefs. */
export function firstMentions(
  blocks: readonly { kind: string; text?: string }[],
  index: ModelIndex,
): Map<number, Map<string, string>> {
  const pattern = mentionPattern(index.keys());
  const out = new Map<number, Map<string, string>>();
  if (!pattern) return out;
  const seen = new Set<string>();
  blocks.forEach((block, i) => {
    if (block.kind !== "paragraph" || !block.text) return;
    for (const match of block.text.matchAll(pattern)) {
      const model = match[1];
      if (seen.has(model)) continue;
      seen.add(model);
      const map = out.get(i) ?? new Map<string, string>();
      map.set(model, index.get(model)!);
      out.set(i, map);
    }
  });
  return out;
}

/** Split plain text into strings and {model, href} pieces; each model is linked once. */
export function splitMentions(text: string, links: ReadonlyMap<string, string>): (string | { model: string; href: string })[] {
  const pattern = mentionPattern(links.keys());
  if (!pattern) return [text];
  const out: (string | { model: string; href: string })[] = [];
  const used = new Set<string>();
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const model = match[1];
    if (used.has(model)) continue;
    used.add(model);
    out.push(text.slice(last, match.index), { model, href: links.get(model)! });
    last = match.index! + model.length;
  }
  out.push(text.slice(last));
  return out.filter((part) => part !== "");
}

/** Href for a table row header, when the whole cell is a model this article may link. */
export function rowHeaderHref(cell: string, index: ModelIndex, related: ReadonlySet<string>): string | undefined {
  const text = cell.trim();
  const href = index.get(text);
  if (!href) return undefined;
  return isLinkableModel(text) || related.has(text) ? href : undefined;
}
