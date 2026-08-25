/**
 * Repairs public/admin/config.yml.
 *
 * Commit 5869a40f ("弹窗改为可叠加多卡") appended a rewritten block instead of replacing
 * the old one. The file ended up with two copies of projects / news / taxonomy / site,
 * and the new `site` block also picked up six stray lines belonging to the product
 * collection. Decap parses the whole file, hits the duplicated `hint` inside `cards`,
 * and refuses to load — the admin has been dead since that commit.
 *
 * The two copies are not interchangeable, which is why this is surgery rather than a
 * delete:
 *   first  site (338–406) — the NEW promo (cards list) and nothing else
 *   second site (587–717) — the OLD single-card promo, PLUS navigation, settings, faq
 *
 * So: take the new promo out of the first block, drop the first block and the duplicated
 * collections entirely, and graft the new promo into the second block in place of the
 * old one.
 *
 *   node fix-cms-config.mjs           # dry run, prints the plan
 *   node fix-cms-config.mjs --write
 */
import fs from "node:fs";

const FILE = "public/admin/config.yml";
const write = process.argv.includes("--write");
const src = fs.readFileSync(FILE, "utf8");
const eol = src.includes("\r\n") ? "\r\n" : "\n";
const lines = src.split(/\r?\n/);
const at = (n) => lines[n - 1]; // 1-based

function expect(n, needle, what) {
  if (!at(n)?.includes(needle)) {
    console.error(`anchor moved: line ${n} should contain ${JSON.stringify(needle)} (${what})`);
    console.error(`  actual: ${JSON.stringify(at(n))}`);
    process.exit(1);
  }
}

// --- verify every anchor before touching anything -------------------------
expect(338, 'name: "site"', "first site block");
expect(341, 'name: "promo"', "new promo start");
expect(398, 'name: "label"', "new promo last kept line (image alt)");
expect(399, "mp4", "stray video poster hint");
expect(404, 'name: "seoDescription"', "last stray product field");
expect(407, 'name: "projects"', "duplicated projects");
expect(587, 'name: "site"', "second site block");
expect(590, 'name: "promo"', "old promo start");
expect(637, 'name: "navigation"', "first keeper after old promo");

// The new promo, minus the six stray lines (399–404).
const newPromo = lines.slice(341 - 1, 398); // 341..398 inclusive

// Sanity: the new promo must be the cards version, the old one must not be.
const newText = newPromo.join("\n");
if (!newText.includes('name: "cards"')) { console.error("new promo is not the cards version"); process.exit(1); }
if (!newText.includes("cooldownMinutes")) { console.error("new promo lost cooldownMinutes"); process.exit(1); }
const oldPromo = lines.slice(590 - 1, 636).join("\n");
if (oldPromo.includes('name: "cards"')) { console.error("second block already has cards — rerun?"); process.exit(1); }

// --- rebuild ---------------------------------------------------------------
const head = lines.slice(0, 337);            // 1..337  products/projects/news/taxonomy
const tail = lines.slice(587 - 1, 717);      // 587..717 second site block
// inside `tail`, swap the old promo (its lines 4..50) for the new one
const tailHead = tail.slice(0, 3);           // "- name: site", label, files:
const tailRest = tail.slice(50);             // from navigation onward
const rebuilt = [...head, ...tailHead, ...newPromo, ...tailRest];

// The client asked for a 10-second delay; the CMS default had drifted back to 20.
const out = rebuilt.map((l) =>
  l.includes('name: "delaySeconds"') ? l.replace("default: 20", "default: 10") : l,
);

console.log(`lines ${lines.length} -> ${out.length}`);
console.log("kept   : 1–337 (products, projects, news, taxonomy)");
console.log("kept   : second site block, with the NEW cards promo grafted in");
console.log("dropped: 338–406 (first site block, and its six stray product fields)");
console.log("dropped: 407–586 (duplicate projects / news / taxonomy)");
console.log("dropped: old single-card promo inside the second site block");

const text = out.join(eol) + (src.endsWith("\n") ? eol : "");
if (write) {
  fs.writeFileSync(FILE, text);
  console.log("\nwritten.");
} else {
  fs.writeFileSync("C:/Users/johns/AppData/Local/Temp/claude/C--Users-johns-Downloads-ai-website-cloner-template-master/ae401f7b-ee99-4af8-8705-aa513037c261/scratchpad/config.fixed.yml", text.replace(/\r\n/g, "\n"));
  console.log("\ndry run — preview at C:/Users/johns/AppData/Local/Temp/claude/C--Users-johns-Downloads-ai-website-cloner-template-master/ae401f7b-ee99-4af8-8705-aa513037c261/scratchpad/config.fixed.yml");
}
