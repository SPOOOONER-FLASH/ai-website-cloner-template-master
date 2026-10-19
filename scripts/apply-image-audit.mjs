// Takes every product image the audit failed (docs/research/image-audit/verdicts.json, verdict
// 不通过) off its product page. Client rule 10-13: one mismatch with the real photos and the image
// does not ship — the page falls back to the real photographs it already has.
//
//   node scripts/apply-image-audit.mjs            dry run: what would leave, per product
//   node scripts/apply-image-audit.mjs --write    edit content/products/*.json
//
// A failed hero is replaced by the first gallery image the audit typed as a photograph; a
// product left with no photograph keeps its hero and is reported instead, because a page with
// no image at all helps nobody — those wait for the client's new photos. Files stay on disk
// (git keeps them either way); only the records stop pointing at them.
import fs from "node:fs";

const WRITE = process.argv.includes("--write");
const verdicts = JSON.parse(fs.readFileSync("docs/research/image-audit/verdicts.json", "utf8"));
const v = (src) => verdicts[`public${src}`] ?? {};
const failed = (src) => v(src).verdict === "不通过";

let removed = 0, products = 0;
const kept = [];
for (const f of fs.readdirSync("content/products").filter((x) => x.endsWith(".json"))) {
  const file = `content/products/${f}`;
  const raw = fs.readFileSync(file, "utf8");
  const p = JSON.parse(raw);
  if (p.sites && !p.sites.includes("hyde")) continue;
  const gallery = (p.gallery ?? []).filter((g) => !failed(g.src));
  let hero = p.heroImage;
  if (hero?.src && failed(hero.src)) {
    const i = gallery.findIndex((g) => v(g.src).type === "photo");
    if (i === -1) kept.push(`${p.slug}: failed hero kept, no photograph to replace it`);
    else {
      const [g] = gallery.splice(i, 1);
      hero = { src: g.src, ratio: g.ratio ?? "1 / 1", label: hero.label };
      console.log(`${p.slug}: hero → ${g.src.split("/").pop()}`);
    }
  }
  const gone = (p.gallery ?? []).filter((g) => failed(g.src)).length + (hero !== p.heroImage ? 1 : 0);
  if (gone === 0) continue;
  products++;
  removed += gone;
  console.log(`${p.slug}: ${gone} image(s) off the page`);
  if (WRITE) {
    p.gallery = gallery;
    p.heroImage = hero;
    fs.writeFileSync(file, JSON.stringify(p, null, 2) + (raw.endsWith("\n") ? "\n" : ""));
  }
}
for (const k of kept) console.log(`! ${k}`);
console.log(`${removed} image(s) off ${products} product page(s)${WRITE ? "" : " (dry run)"}`);
