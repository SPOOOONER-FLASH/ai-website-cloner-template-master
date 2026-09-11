/**
 * Pull published specification facts for UNION-numbered models from artunion.co.jp.
 *
 * WHY
 * Our G/T/UL/PRE drawings gave us dimensions but not 重量 (weight), 施工 (fixing screw and
 * hole sizes) or a confirmed ピッチ (centre distance). Those three are exactly what a buyer
 * needs to decide whether a handle can be installed, and inventing them is the one thing
 * AGENTS.md forbids outright. UNION publishes them per model number, so we read them.
 *
 * HOW IT MATCHES — BY MODEL NUMBER, NEVER BY TITLE OR IMAGE
 * POST /products/search_id.php with id=<model> returns the path of a result page listing
 * every finish variant (G1106 → G1106-01-011, -01-015, -01-024). Each variant has a
 * detail.php page carrying the spec block. Matching on a title or a thumbnail would be
 * guessing; the model number is the factory's own key and it is either an exact hit or a
 * miss we record as a miss.
 *
 * The match is self-checking: where we already read a centre distance off the drawing, the
 * scraped ピッチ must agree. A disagreement means the number belongs to a different part
 * and the record is dropped rather than merged. `--verify` prints that comparison.
 *
 * WHAT IT DELIBERATELY DOES NOT TAKE
 *   価格     — the client said not to copy prices, and UNION's yen list price has nothing
 *              to do with what this factory quotes.
 *   施工実績 — UNION's built references (named Japanese towers). Copying another company's
 *              project list onto ours would be a straightforward lie.
 *   機能     — branded feature names like 「アートセーフ対応」 are UNION's programme, not a
 *              property of the metal.
 *   カタログ — page numbers in UNION's own catalogue.
 * Those four are still written to the cache so a human can read them; the merge step
 * (scripts/merge-artunion-specs.mjs) refuses to put them on a product.
 *
 * Output: content/rayen/artunion-specs.json — a cache, not a deliverable. Re-running skips
 * models already in it unless --refresh is passed, so an interrupted run resumes and the
 * site is not re-fetched for nothing.
 *
 * Usage:
 *   node scripts/scrape-artunion-specs.mjs            # fetch what is missing
 *   node scripts/scrape-artunion-specs.mjs --refresh  # re-fetch everything
 *   node scripts/scrape-artunion-specs.mjs --verify   # no network; compare cache vs drawings
 *   node scripts/scrape-artunion-specs.mjs --only=G1106,T2973
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTS = join(root, "content", "products");
const CACHE = join(root, "content", "rayen", "artunion-specs.json");
const ORIGIN = "https://www.artunion.co.jp";

const argv = process.argv.slice(2);
const REFRESH = argv.includes("--refresh");
const VERIFY_ONLY = argv.includes("--verify");
const ONLY = (argv.find((a) => a.startsWith("--only=")) ?? "").slice(7).split(",").filter(Boolean);

/* Polite: one request per 1.2s. This is somebody else's server and we are a guest on it. */
const DELAY_MS = 1200;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------- which models to ask about */

/**
 * UNION's own numbering. Anything outside these prefixes is a RAYEN or HYDE model that
 * UNION never made, and querying it would just produce noise in the miss list.
 */
const UNION_PREFIX = /^(?:UL|PRE-?|G|T)\d/i;

function rayenModels() {
  const out = [];
  for (const file of readdirSync(PRODUCTS)) {
    if (!file.endsWith(".json")) continue;
    let product;
    try {
      product = JSON.parse(readFileSync(join(PRODUCTS, file), "utf8"));
    } catch {
      continue; // another session may be mid-write; skip rather than die
    }
    if (!(product.sites ?? []).includes("rayen")) continue;
    const model = String(product.model ?? "").trim();
    if (!UNION_PREFIX.test(model)) continue;
    out.push({
      model,
      slug: product.slug,
      file,
      /* What we already believe, so the scrape can be checked against it. */
      drawnPitch: pickSpec(product, ["Centre distance", "Fixing centre", "Fixing pitch"]),
      drawnLength: pickSpec(product, ["Overall length", "Available lengths", "Lever length"]),
    });
  }
  return out.sort((a, b) => a.model.localeCompare(b.model));
}

function pickSpec(product, labels) {
  for (const label of labels) {
    const hit = (product.specs ?? []).find((s) => s.label === label);
    if (hit) return String(hit.value ?? "").trim();
  }
  return "";
}

/* ------------------------------------------------------------------- fetching */

async function get(url) {
  const response = await fetch(url, {
    headers: {
      /* Identify honestly. A scraper that pretends to be Chrome is a scraper that will be
         blocked the day somebody looks at the logs, and we have no reason to hide. */
      "User-Agent": "RAYEN-spec-reader/1.0 (hardware catalogue; contact via rayen site)",
      "Accept-Language": "ja,en;q=0.8",
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} ${url}`);
  return response.text();
}

async function resolveVariants(model) {
  const response = await fetch(`${ORIGIN}/products/search_id.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "RAYEN-spec-reader/1.0 (hardware catalogue; contact via rayen site)",
    },
    body: new URLSearchParams({ id: model }).toString(),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} search_id`);
  const path = (await response.text()).trim();
  if (!path.startsWith("/")) return [];
  const html = await get(`${ORIGIN}${path}`);
  const ids = new Set();
  for (const m of html.matchAll(/detail\.php\?id=([A-Za-z0-9\-]+)/g)) ids.add(m[1]);
  /*
    Prefix-exact only. A search for "G110" must not drag in G1106; UNION's own result page
    is a substring search, so the filter belongs here rather than in the trust we place in
    their ranking.
  */
  const exact = [...ids].filter((id) => id.toUpperCase().startsWith(`${model.toUpperCase()}-`));

  /*
    ONE VARIANT PER LENGTH, NOT PER FINISH.

    A UNION part number is <model>-<finish>-<colour>[-L<length>]. G2750 has 15 of them, but
    the numbers we came for — weight, pitch, hole sizes — vary with LENGTH and not with
    whether the brass is mirrored or satin. Fetching by finish costs fifteen requests and
    still misses a length: G2690 publishes twenty variants, and the adjustable 1660–2160
    one we actually sell was not in the first four, which is why its pitch looked like a
    conflict when it was only an absent row.

    So group by the -L#### suffix and take one of each. Fewer requests on somebody else's
    server, and complete coverage of the axis that matters.
  */
  const byLength = new Map();
  for (const id of exact) {
    const key = (id.toUpperCase().match(/-L(\d+)$/) ?? [, "base"])[1];
    if (!byLength.has(key)) byLength.set(key, id);
  }
  return [...byLength.values()];
}

/* --------------------------------------------------------------- spec extraction */

const text = (html) =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

/**
 * The detail page is a flat definition list: a label line followed by its value lines,
 * until the next known label. Parsing it positionally rather than by CSS class means a
 * template change shows up as a missing field we can see, not as a wrong value we cannot.
 */
const LABELS = [
  "カテゴリー",
  "材質・仕上げ",
  "価格",
  "サイズ",
  "製品図",
  "ピッチ",
  "施工",
  "重量",
  "機能",
  "備考",
  "シリーズ",
  "施工実績",
  "カタログ",
  "類似商品",
  "デザインシリーズ",
];

/*
  Where the product ends and the page furniture begins.

  The spec block is not fenced off in the markup, so a naive "collect until the next label"
  run walks straight out of the product and into the global footer — and on a lever handle
  it first walks through UNION's entire MIWA/GOAL lock compatibility matrix. UL1066 came
  back with a 6KB 「カタログ」 value made almost entirely of other companies' lock codes.
  None of it is ever published, but a cache nobody can read is a cache nobody will check,
  and checking it is the whole point.
*/
const PAGE_FURNITURE = [
  "カタログ請求",
  "企業情報",
  "類似商品",
  "美和ロック製対応錠前",
  "GOAL製対応錠前",
  "UNION CORPORATION JAPAN ALL RIGHTS RESERVED.",
];

function parseDetail(html) {
  let lines = text(html);
  const stop = lines.findIndex((line) => PAGE_FURNITURE.some((mark) => line.includes(mark)));
  if (stop > 0) lines = lines.slice(0, stop);
  const fields = {};
  let current = null;
  for (const line of lines) {
    if (LABELS.includes(line)) {
      current = line;
      if (!fields[current]) fields[current] = [];
      continue;
    }
    if (current && !["類似商品", "デザインシリーズ"].includes(current)) {
      fields[current].push(line);
    }
  }
  const join = (key) => (fields[key] ?? []).join(" / ").trim();
  return {
    category: join("カテゴリー"),
    materialFinish: join("材質・仕上げ"),
    size: join("サイズ"),
    pitch: join("ピッチ"),
    installation: join("施工"),
    weight: join("重量"),
    /* Recorded for a human to read; the merge step will not publish these. */
    reference: {
      feature: join("機能"),
      note: join("備考"),
      series: join("シリーズ"),
      builtWorks: join("施工実績"),
      catalogue: join("カタログ"),
    },
  };
}

/* ------------------------------------------------------------------- the run */

function loadCache() {
  if (!existsSync(CACHE)) return { fetchedAt: null, source: ORIGIN, models: {} };
  try {
    return JSON.parse(readFileSync(CACHE, "utf8"));
  } catch {
    return { fetchedAt: null, source: ORIGIN, models: {} };
  }
}

const digits = (value) => (String(value).match(/\d+(?:\.\d+)?/g) ?? []).map(Number);

/**
 * Does the scraped pitch agree with the centre distance we read off the drawing?
 *
 * This is the whole safety argument for the merge. If UNION says 640 and our drawing says
 * P=640mm, the number on their page describes the part in our photograph. If they disagree,
 * we are looking at a different model that happens to share a prefix, and the weight and
 * fixing sizes from that page would be wrong in a way no buyer could catch until the holes
 * did not line up.
 */
function pitchAgrees(scraped, drawn) {
  if (!scraped || !drawn) return null; // nothing to check against
  const a = digits(scraped);
  const b = digits(drawn);
  if (!a.length || !b.length) return null;
  return a.some((x) => b.some((y) => Math.abs(x - y) < 0.51));
}

function verify(cache, models) {
  const rows = [];
  for (const entry of models) {
    const hit = cache.models[entry.model];
    if (!hit || !hit.variants?.length) {
      rows.push({ model: entry.model, state: "miss", detail: hit?.error ?? "未抓到" });
      continue;
    }
    /*
      Check every length, not just the first one listed.

      G3078 is one model in two lengths: L600 has a 582 pitch, L800 has 782. Our drawing
      says 782. Comparing only the first variant called that a conflict and would have
      thrown away a correct match — the model was right, the length was not. A model
      "agrees" if ANY of its published lengths agrees, and the merge then uses that length's
      weight and hole sizes rather than an arbitrary one.
    */
    const matched =
      hit.variants.find((v) => pitchAgrees(v.spec.pitch, entry.drawnPitch) === true) ?? null;
    const spec = (matched ?? hit.variants[0]).spec;
    const agree = matched
      ? true
      : hit.variants.some((v) => pitchAgrees(v.spec.pitch, entry.drawnPitch) === false)
        ? false
        : null;
    rows.push({
      model: entry.model,
      state: agree === false ? "CONFLICT" : agree === true ? "confirmed" : "unchecked",
      detail:
        agree === false
          ? `artunion ピッチ=${spec.pitch} vs 图纸 ${entry.drawnPitch}`
          : `重量=${spec.weight || "—"} ピッチ=${spec.pitch || "—"} 施工=${spec.installation ? "有" : "—"}`,
    });
  }
  const by = (state) => rows.filter((r) => r.state === state);
  console.log(`\n对照 ${rows.length} 个型号：`);
  console.log(`  ピッチ 与图纸吻合：${by("confirmed").length}`);
  console.log(`  无法对照（图纸没有中心距）：${by("unchecked").length}`);
  console.log(`  ⚠ 冲突，不可合并：${by("CONFLICT").length}`);
  console.log(`  未抓到：${by("miss").length}`);
  for (const row of by("CONFLICT")) console.log(`   ⚠ ${row.model}  ${row.detail}`);
  const withWeight = rows.filter((r) => /重量=(?!—)/.test(r.detail)).length;
  console.log(`\n拿到重量的：${withWeight} 个`);
  return rows;
}

async function main() {
  const models = rayenModels().filter((m) => !ONLY.length || ONLY.includes(m.model));
  const cache = loadCache();

  if (VERIFY_ONLY) {
    verify(cache, models);
    return;
  }

  console.log(`准备查询 ${models.length} 个型号（每次间隔 ${DELAY_MS}ms）。`);
  let fetched = 0;
  let missed = 0;

  for (const entry of models) {
    if (!REFRESH && cache.models[entry.model]?.variants?.length) continue;
    try {
      const ids = await resolveVariants(entry.model);
      await sleep(DELAY_MS);
      if (!ids.length) {
        cache.models[entry.model] = { variants: [], error: "search_id 无结果" };
        missed += 1;
        console.log(`  —  ${entry.model}  未收录`);
      } else {
        const variants = [];
        for (const id of ids.slice(0, 10)) {
          const html = await get(`${ORIGIN}/products/detail.php?id=${encodeURIComponent(id)}`);
          variants.push({ id, spec: parseDetail(html) });
          await sleep(DELAY_MS);
        }
        cache.models[entry.model] = { variants };
        fetched += 1;
        const s = variants[0].spec;
        console.log(`  ✓  ${entry.model}  重量=${s.weight || "—"}  ピッチ=${s.pitch || "—"}  变体 ${ids.length}`);
      }
    } catch (error) {
      cache.models[entry.model] = { variants: [], error: String(error.message ?? error) };
      missed += 1;
      console.log(`  ✗  ${entry.model}  ${error.message ?? error}`);
    }
    cache.fetchedAt = new Date().toISOString();
    mkdirSync(dirname(CACHE), { recursive: true });
    writeFileSync(CACHE, `${JSON.stringify(cache, null, 2)}\n`, "utf8");
  }

  console.log(`\n抓到 ${fetched} 个，未收录/失败 ${missed} 个。缓存：content/rayen/artunion-specs.json`);
  verify(cache, models);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
