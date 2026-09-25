import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

/**
 * An English product summary must not name a different metal from its Material spec row.
 *
 * 2026-09-25: B024 and B025 are brass, but their summary was the family's stainless-steel text, and
 * seven translated languages copied it. The same day seven zinc alloy handles read "Lever Handle in
 * antique brass": a finish written as if it were the metal. Other languages translate from the
 * English summary, so one wrong word here becomes eight. A metal word is allowed when the same
 * clause calls it a finish, or when it describes the door ("for aluminum doors").
 */
type P = { slug: string; sites?: string[]; summary?: string; specs?: { label: string; value: string }[] };
const METALS: Record<string, RegExp> = {
  brass: /\bbrass\b/i,
  stainless: /\bstainless\b/i,
  iron: /\biron\b/i,
  zinc: /\bzinc\b|\bzamak\b/i,
  aluminum: /\balumini?um\b/i,
};

test("summaries name the metal the Material row names", () => {
  const offenders: string[] = [];
  for (const f of readdirSync("content/products").filter((n) => n.endsWith(".json"))) {
    const p = JSON.parse(readFileSync(`content/products/${f}`, "utf8")) as P;
    if (p.sites && !p.sites.includes("hyde")) continue;
    const material = p.specs?.find((s) => s.label === "Material")?.value;
    if (!material) continue;
    const clause = (p.summary ?? "").split(/[.;]/)[0].replace(/\bfor [a-z -]*doors?\b/gi, "");
    if (/\bfinish\b/i.test(clause)) continue;
    const claimed = Object.keys(METALS).filter((m) => METALS[m].test(clause));
    const specified = Object.keys(METALS).filter((m) => METALS[m].test(material));
    if (claimed.length && specified.length && !claimed.some((m) => specified.includes(m))) {
      offenders.push(`${p.slug}: Material=${material} | ${clause}`);
    }
  }
  assert.deepEqual(offenders, [], "the summary names a different metal from the Material row (write the color as a finish)");
});
