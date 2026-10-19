import { bhmaRows, canonicalFinish, UNMAPPED_FINISHES, type BhmaRow } from "../bhma-finish.ts";

/**
 * Any finish code in, every exact equivalent out (tool page /finish-code-converter/, 2026-10-19).
 *
 * Accepts the three languages a buyer writes a finish in — a BHMA number (626), a US number
 * (US26D or 26D) or one of our house codes (SC, "Satin Chrome") — and answers from
 * src/lib/bhma-finish.ts, which only holds exact equivalences and refuses the rest. A BHMA
 * number names the base metal too, so one code can return two rows (SC → 626 on brass, 652
 * on steel); that is the point of the tool, not an ambiguity to hide.
 */
export type FinishLookup =
  | { kind: "rows"; rows: BhmaRow[] }
  | { kind: "unmapped"; code: string; reason: string }
  | { kind: "unknown" };

export function lookupFinish(query: string): FinishLookup {
  const raw = query.trim().toUpperCase().replace(/\s+/g, " ");
  if (!raw) return { kind: "unknown" };
  const compact = raw.replace(/[\s-]/g, "");
  const rows = bhmaRows();

  if (/^\d{3}$/.test(compact)) {
    const hit = rows.filter((r) => r.bhma === compact);
    return hit.length ? { kind: "rows", rows: hit } : { kind: "unknown" };
  }
  const us = compact.startsWith("US") ? compact : /^\d{1,2}[A-Z]?$/.test(compact) ? `US${compact}` : null;
  if (us) {
    const hit = rows.filter((r) => r.us === us);
    if (hit.length) return { kind: "rows", rows: hit };
  }
  const house = canonicalFinish(raw);
  const hit = rows.filter((r) => r.house === house);
  if (hit.length) return { kind: "rows", rows: hit };
  if (UNMAPPED_FINISHES[house]) return { kind: "unmapped", code: house, reason: UNMAPPED_FINISHES[house] };
  return { kind: "unknown" };
}
