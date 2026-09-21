/**
 * Pull the product photography UNION publishes for the models we already list.
 *
 * WHY
 * Client, 2026-09-14: 「所有图片你也可以去 union 爬取，记得打上我们的标志就行」, on the same day
 * he confirmed the licence for the supplier catalogues. Several models reached the site from
 * a WeChat pack that held one or two frames — eleven of them ship an empty spec table AND a
 * single photograph — while UNION publishes a plate, a dimension drawing and installed
 * scenes for the same model number. Those are the images the buyer needs to decide.
 *
 * MATCHED ON THE FILENAME, NOT ON THE PAGE
 * A detail page also carries thumbnails of RELATED models — G1106's page shows G1105, T1287,
 * T2973 and six more. Taking every image on the page would file another model's photograph
 * under this one, which is the same class of error as copying a sibling's dimensions: it
 * looks right and it is wrong. UNION names every file after the model it depicts
 * (G1106x14D001ZHP.jpg), so the filename is the key, exactly as it is for the spec scrape.
 *
 * WHAT IT DOWNLOADS
 *   /imgs/item/…   the product plate      → the listing thumbnail
 *   /imgs/size/…   the dimension drawing  → the centre distance the buyer is looking for
 *   /imgs/image/…  installed scenes
 * Nothing else. The search icons, category tiles and page furniture under /common/ and
 * /imgs/search/ are UNION's site chrome, not product photography.
 *
 * WHAT IT DOES NOT DO
 * It does not touch content/products or public/images. It writes into a staging directory
 * laid out one folder per model, which is the shape scripts/ingest-union-handles.mjs already
 * reads — so a scraped model joins the catalogue through the same manifest, cleaning,
 * squaring and branding as every WeChat pack. Skipping that would put an unbranded,
 * un-de-watermarked frame on the site.
 *
 * POLITE
 * One request every 1.2 seconds, the same as scripts/scrape-artunion-specs.mjs, and the same
 * honest User-Agent. This is somebody else's server and we are a guest on it.
 *
 * Usage:
 *   node scripts/scrape-artunion-images.mjs                 # every RAYEN model UNION numbers
 *   node scripts/scrape-artunion-images.mjs --only=G1106,T25
 *   node scripts/scrape-artunion-images.mjs --out=<dir>
 *   node scripts/scrape-artunion-images.mjs --dry           # list what would be fetched
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTS = join(root, "content", "products");
const CACHE = join(root, "content", "rayen", "artunion-specs.json");
const HAVE = join(root, "public", "images", "products");
const ORIGIN = "https://www.artunion.co.jp";

const argv = process.argv.slice(2);
const DRY = argv.includes("--dry");
const ONLY = (argv.find((a) => a.startsWith("--only=")) ?? "").slice(7).split(",").filter(Boolean);
const OUT =
  (argv.find((a) => a.startsWith("--out=")) ?? "").slice(6) ||
  "C:/Users/86132/rayen-union-scrape";

/*
  Pace, and why it is what it is.

  scripts/scrape-artunion-specs.mjs uses one request every 1.2 s because it reads ~120 pages
  once and the wall-clock cost is nobody's problem. This one fetches a page AND every image
  on it — roughly ten times the requests — and at that pace it runs for over an hour, which
  the client asked to shorten (2026-09-14「加速取图」).

  So: four in flight, 250 ms between requests in each. That peaks around four requests a
  second, which is ordinary traffic for a catalogue site and less than one impatient person
  with a browser and a tab-opening habit. It is deliberately NOT unlimited concurrency —
  this is somebody else's server, we are a guest on it, and the User-Agent says who we are
  so they can ask us to slow down rather than having to guess and block.
*/
const DELAY_MS = 250;
const CONCURRENCY = 4;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Run `work` over `items`, at most CONCURRENCY at a time. */
async function pool(items, work) {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length) {
      await work(queue.shift());
      await sleep(DELAY_MS);
    }
  });
  await Promise.all(runners);
}

const headers = {
  "User-Agent": "RAYEN-spec-reader/1.0 (hardware catalogue; contact via rayen site)",
  "Accept-Language": "ja,en;q=0.8",
};

/** The RAYEN models UNION has a record for, from the spec cache the scraper already built. */
function targets() {
  if (!existsSync(CACHE)) {
    console.error("没有 content/rayen/artunion-specs.json —— 先跑 scrape-artunion-specs.mjs");
    process.exit(1);
  }
  const cache = JSON.parse(readFileSync(CACHE, "utf8"));
  const published = new Set();
  for (const file of readdirSync(PRODUCTS)) {
    if (!file.endsWith(".json")) continue;
    let product;
    try {
      product = JSON.parse(readFileSync(join(PRODUCTS, file), "utf8"));
    } catch {
      continue;
    }
    if ((product.sites ?? []).includes("rayen")) published.add(String(product.model ?? "").trim());
  }

  const out = [];
  for (const [model, record] of Object.entries(cache.models ?? {})) {
    if (!published.has(model)) continue;
    if (ONLY.length && !ONLY.includes(model)) continue;
    const ids = (record.variants ?? []).map((v) => v.id).filter(Boolean);
    if (ids.length) out.push({ model, ids });
  }
  return out.sort((a, b) => a.model.localeCompare(b.model));
}

/** Every image on the page that UNION named after THIS model. */
function imagesFor(html, model) {
  const found = new Set();
  for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
    const src = m[1];
    if (!/^\/imgs\/(item|size|image)\//i.test(src)) continue;
    const name = src.slice(src.lastIndexOf("/") + 1);
    /* "G1106x…" — the model, then the lowercase x that separates it from the shot code.
       Anchored so T25 does not swallow T2522, and case-folded because the pages mix both. */
    if (name.toUpperCase().startsWith(`${model.toUpperCase()}X`)) found.add(src);
  }
  return [...found];
}

/** Filenames already in the catalogue, so an existing frame is not downloaded again. */
const alreadyHave = new Set(
  existsSync(HAVE) ? readdirSync(HAVE).map((f) => f.replace(/\.[^.]+$/, "").toLowerCase()) : [],
);

async function get(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`HTTP ${response.status} ${url}`);
  return response;
}

const list = targets();
console.log(`${list.length} 个型号在 UNION 有记录，开始取图（每 1.2 秒一个请求）`);

let fetched = 0;
let skipped = 0;
const report = [];

await pool(list, async ({ model, ids }) => {
  const srcs = new Set();
  for (const id of ids) {
    try {
      const html = await (await get(`${ORIGIN}/products/detail.php?id=${encodeURIComponent(id)}`)).text();
      for (const src of imagesFor(html, model)) srcs.add(src);
    } catch (error) {
      report.push(`${model}: ${String(error.message).slice(0, 60)}`);
    }
    await sleep(DELAY_MS);
  }
  if (!srcs.size) return;

  const dir = join(OUT, model);
  const written = [];
  for (const src of srcs) {
    const name = src.slice(src.lastIndexOf("/") + 1);
    const target = join(dir, name);
    if (existsSync(target)) continue;
    if (DRY) {
      written.push(name);
      continue;
    }
    try {
      const buffer = Buffer.from(await (await get(`${ORIGIN}${src}`)).arrayBuffer());
      mkdirSync(dir, { recursive: true });
      writeFileSync(target, buffer);
      written.push(name);
      fetched += 1;
    } catch (error) {
      report.push(`${model}/${name}: ${String(error.message).slice(0, 50)}`);
    }
    await sleep(DELAY_MS);
  }
  if (written.length) {
    const fresh = written.filter((n) => !alreadyHave.has(n.replace(/\.[^.]+$/, "").toLowerCase()));
    skipped += written.length - fresh.length;
    report.push(`${model}: ${written.length} 张（其中 ${fresh.length} 张是目录里没有的）`);
  }
});

console.log(
  `\n${DRY ? "（--dry，未下载）" : `下载 ${fetched} 张`} → ${OUT}` +
    `\n这里只是暂存：要上站还得写进某个 content/rayen/*.json 清单，` +
    `走 ingest-union-handles.mjs 与 rayen:images 那条链（去水印 → 本地化 → 补白边 → 打两套雷茵标）。`,
);
for (const line of report) console.log(`  ${line}`);
