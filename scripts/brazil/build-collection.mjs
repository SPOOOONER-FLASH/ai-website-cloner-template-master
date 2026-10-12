#!/usr/bin/env node
/*
  Build the Brazil panic-bar collection (docs/collaboration/tasks/2026-10-12-brazil-panic-bars.md)
  from the crawl in tmp/claude-brazil/products.json.

  A marketplace lists one part many times — left hand, right hand, black, grey, with and without
  the outside lever — so listings are folded into one model per (mould family, door, style,
  outside access), and hand and colour become that model's options. Each customer's design is
  one mould family with an anonymous BR number; the customer's name stays in `sources` for
  tracing and is never rendered. HYDE's own 306 bars lead the list with their catalogue pages.

    node scripts/brazil/build-collection.mjs        (run from the repository root)
*/
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const TMP = existsSync(join("tmp", "claude-brazil")) ? join("tmp", "claude-brazil") : join("..", "claude-brazil");
const OUT_JSON = join("src", "data", "generated", "brazil-collection.json");
const OUT_IMG = join("public", "images", "brazil-collection");
mkdirSync(OUT_IMG, { recursive: true });

/*
  One anonymous family per customer design, e.g. { "<brand>": "BR1" }. The map and every source
  URL stay on this computer (tmp/claude-brazil, copied to the private hyde-brain): this repository
  is public, and the A/B pages are client components whose data ships to every browser.
  Order is arbitrary and must not change once published.
*/
const FAMILY = JSON.parse(readFileSync(join(TMP, "families.json"), "utf8"));
const BRAND_WORDS = new RegExp(`\\b(${Object.keys(FAMILY).join("|")})\\b`, "i");

export function classify(name) {
  const n = name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const isTrim = /^(fechadura|macaneta)\b/.test(n) && /barra/.test(n);
  const family = isTrim ? "trim" : /dupla|duas folhas|0?2 folhas/.test(n) ? "double" : "single";
  const style = /touch/.test(n) ? "touch" : "crossbar";
  const locking = family === "double" || /vertical/.test(n) ? "vertical" : "lateral";
  const lever = /macaneta/.test(n) && !/sem macaneta/.test(n);
  const key = /chave/.test(n) && !/sem chave/.test(n);
  const outside = isTrim ? (key ? "lever-key" : "lever") : lever ? (key ? "lever-key" : "lever") : key ? "lever-key" : "none";
  const colours = [
    [/pret[ao]/, "black"], [/cinza/, "grey"], [/branc[ao]/, "white"], [/vermelh[ao]/, "red"], [/cromad[ao]|prata/, "silver"],
  ].filter(([re]) => re.test(n)).map(([, c]) => c);
  return { family, style, locking: family === "trim" ? undefined : locking, outside, colours };
}

const NAMES = {
  pt: {
    single: "Barra antipânico para porta de uma folha",
    double: "Barra antipânico para porta de duas folhas",
    trim: "Maçaneta externa para barra antipânico",
    touch: " tipo touch",
    vertical: ", travamento vertical",
    lever: ", com maçaneta externa",
    "lever-key": ", com maçaneta externa e chave",
    trimKey: " com chave",
  },
  en: {
    single: "Single-door panic bar",
    double: "Double-door panic bar",
    trim: "Outside lever for panic bars",
    touch: ", touch bar",
    vertical: ", top and bottom rods",
    lever: ", with outside lever",
    "lever-key": ", with outside lever and key",
    trimKey: " with key",
  },
};
function nameOf(m, lang) {
  const w = NAMES[lang];
  if (m.family === "trim") return w.trim + (m.outside === "lever-key" ? w.trimKey : "");
  return w[m.family] + (m.style === "touch" ? w.touch : "") + (m.family === "single" && m.locking === "vertical" ? w.vertical : "") + (m.outside !== "none" ? w[m.outside] : "");
}

const LETTER = { single: "S", double: "D", trim: "T" };
/* BR1-SVK = family BR1, Single door, Vertical rods, outside lever with Key. T after the door letter = touch bar. */
const modelOf = (m) =>
  `${FAMILY[m.brand]}-${LETTER[m.family]}${m.style === "touch" ? "T" : ""}${m.family === "single" && m.locking === "vertical" ? "V" : ""}${
    m.outside === "lever-key" ? "K" : m.outside === "lever" && m.family !== "trim" ? "L" : ""
  }`;

async function square(src, out) {
  await sharp(src).flatten({ background: "#ffffff" }).trim({ threshold: 12 }).resize(640, 640, { fit: "contain", background: "#ffffff" })
    .extend({ top: 40, bottom: 40, left: 40, right: 40, background: "#ffffff" }).webp({ quality: 82 }).toFile(out);
}

async function main() {
  const listings = JSON.parse(readFileSync(join(TMP, "products.json"), "utf8"));
  const models = new Map();
  for (const l of listings) {
    if (!FAMILY[l.brand]) continue;
    const c = classify(l.name);
    const key = [l.brand, c.family, c.style, c.locking, c.outside].join("|");
    const m = models.get(key) ?? { brand: l.brand, ...c, colours: [], sources: [], images: [] };
    for (const col of c.colours) if (!m.colours.includes(col)) m.colours.push(col);
    m.sources.push({ url: l.url, name: l.name, priceBRL: l.priceBRL ?? null });
    for (const img of l.localImages ?? []) m.images.push(join(TMP, img.replace(/^tmp[\\/]claude-brazil[\\/]/, "")));
    models.set(key, m);
  }

  const out = [];
  const sources = {};
  /* HYDE's own Brazil-market bars: their factory film has Portuguese captions. */
  for (const slug of ["306-s-panic-exit-device", "306-d-panic-exit-device", "306-ps-panic-exit-device"]) {
    const p = JSON.parse(readFileSync(join("content", "products", `${slug}.json`), "utf8"));
    const isD = slug.startsWith("306-d");
    out.push({
      id: slug, model: p.model, family: isD ? "double" : "single", door: isD ? "double" : "single",
      locking: isD ? "vertical" : slug.startsWith("306-ps") ? undefined : "lateral", outside: "none", colours: ["grey"],
      nameEn: p.name, namePt: p.namePt,
      specs: (p.specs ?? []).map((s, i) => ({ labelEn: s.label, labelPt: p.specsPt?.[i]?.label ?? s.label, valueEn: s.value, valuePt: p.specsPt?.[i]?.value ?? s.value })).filter((s) => s.labelEn === "Material"),
      image: p.heroImage.src, href: `/products/${p.categoryPath[0]}/${p.slug}/`,
    });
  }
  const ordered = [...models.values()].sort((a, b) => modelOf(a).localeCompare(modelOf(b), "en", { numeric: true }));
  const seen = new Map();
  for (const m of ordered) {
    let model = modelOf(m);
    const n = (seen.get(model) ?? 0) + 1;
    seen.set(model, n);
    if (n > 1) model += n;
    const id = model.toLowerCase();
    let image = "";
    const src = m.images.find((p) => existsSync(p));
    if (src) {
      await square(src, join(OUT_IMG, `${id}.webp`));
      image = `/images/brazil-collection/${id}.webp`;
    }
    out.push({
      id, model, family: m.family, door: m.family === "trim" ? undefined : m.family, locking: m.locking, outside: m.outside,
      colours: m.colours, nameEn: nameOf(m, "en"), namePt: nameOf(m, "pt"), specs: [], image,
    });
    sources[model] = { brand: m.brand, listings: m.sources };
    if (out.at(-1).nameEn.match(BRAND_WORDS) || out.at(-1).namePt.match(BRAND_WORDS)) throw new Error(`brand name leaked into ${model}`);
  }
  const json = `${JSON.stringify(out, null, 1)}\n`;
  if (Object.keys(FAMILY).some((b) => json.toLowerCase().includes(b.toLowerCase()))) throw new Error("a customer name reached the public JSON");
  writeFileSync(OUT_JSON, json);
  writeFileSync(join(TMP, "collection-sources.json"), `${JSON.stringify(sources, null, 1)}\n`);
  console.log(`${out.length} models from ${listings.length} listings → ${OUT_JSON}`);
  for (const m of out) console.log(`${m.model.padEnd(8)} ${m.colours.join(",").padEnd(18)} ${m.image ? "img" : "—  "} ${m.nameEn}`);
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`) await main();
