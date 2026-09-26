/**
 * The model-index helpers a client component may import: the entry shape, the search-key
 * normaliser and the A–Z grouping. No catalogue data.
 *
 * WHY A SEPARATE FILE. src/components/site/ModelIndex.tsx is "use client" and imported
 * these from ./model-index.ts, which also imports the whole catalogue (and, since
 * 2026-09-25, every locale's overlays through it). The bundler kept the lot, and the
 * /model-lookup/ pages shipped a 17 MB JavaScript chunk. The page itself passes the entries
 * as props from the server; the client only needs to filter and group them.
 */
export interface ModelIndexEntry {
  /** As the record states it: "306 PS", "LH852 GMBK". */
  model: string;
  /** Product name, for the reader who typed a number they half-remember. */
  name: string;
  /** Category slug, so the index can say where in the catalogue the number lives. */
  category: string;
  href: string;
  /** Uppercase, letters and digits only. Matching uses this; readers never see it. */
  searchKey: string;
}

/**
 * Uppercase, strip everything that is not a letter or a digit.
 *
 * A buyer types what is on their document, and documents are inconsistent about the
 * separators: `306 PS`, `306-PS` and `306ps` are the same part. Stripping separators on
 * both sides makes all three find it. Nothing else is normalised — no stemming, no
 * fuzzy distance — because a model number that is one character different is a different
 * product, and a lookup that helpfully suggests the wrong lock is worse than one that
 * finds nothing.
 */
export function modelSearchKey(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function modelIndexGroup(entry: ModelIndexEntry): string {
  const first = entry.searchKey.charAt(0);
  return /[0-9]/.test(first) ? "0–9" : first || "—";
}

export function groupModelIndex(entries: ModelIndexEntry[]): [string, ModelIndexEntry[]][] {
  const groups = new Map<string, ModelIndexEntry[]>();
  for (const entry of entries) {
    const key = modelIndexGroup(entry);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }
  return [...groups.entries()].sort(([a], [b]) => {
    if (a === "0–9") return -1;
    if (b === "0–9") return 1;
    return a.localeCompare(b);
  });
}
