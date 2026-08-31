/**
 * Shortlists product images that MIGHT be dimension drawings.
 *
 * ⚠ THIS IS A SHORTLIST, NOT A CLASSIFIER. Roughly one in three survivors is a studio
 * photograph. Open every one before trusting it. Three stricter judgements were tried and
 * all three failed — see docs/collaboration/tasks/cad-drawing-extraction.md for what and
 * why, so nobody spends another afternoon on pixel statistics.
 *
 * The surviving test is about the PAPER, not the lines: a drawing has almost no mid-grey
 * because it has no shading, while a photograph of brushed steel is mostly mid-grey
 * however white its background.
 *
 *   node scripts/find-cad-drawings.mjs        # writes the shortlist
 */
import sharp from "sharp";
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
const dir = "public/images/products";

/**
 * Shortlist images that COULD be dimension drawings.
 *
 * Deliberately tuned for recall, not precision. Two stricter classifiers were tried and
 * both failed in a way that mattered: requiring pure-black ink missed every fine drawing
 * (the lines are thin and anti-aliased), and requiring long dark rules matched dark
 * photographs instead. A studio photo that slips through costs one look; a drawing that
 * does not costs a page its dimensions.
 *
 * The paper test is what survives: a drawing is overwhelmingly white with almost no
 * mid-grey, because it has no shading. A photograph of brushed steel is mostly mid-grey
 * however bright its background.
 */
const stats = [];
for (const f of readdirSync(dir).filter((f) => f.endsWith(".webp"))) {
  try {
    const { data } = await sharp(`${dir}/${f}`).greyscale().resize(160, 160, { fit: "inside" }).raw().toBuffer({ resolveWithObject: true });
    let white = 0, mid = 0;
    for (const v of data) { if (v > 240) white += 1; else if (v >= 80) mid += 1; }
    stats.push({ f, white: white / data.length, mid: mid / data.length });
  } catch {}
}
const cad = stats.filter((s) => s.white > 0.85 && s.mid < 0.13).sort((a, b) => a.mid - b.mid);
console.log(`scanned ${stats.length} · candidates ${cad.length}`);
mkdirSync("docs/collaboration/tasks", { recursive: true });
writeFileSync(
  "docs/collaboration/tasks/cad-drawing-candidates.json",
  `${JSON.stringify(cad.map((c) => c.f), null, 1)}
`,
);
