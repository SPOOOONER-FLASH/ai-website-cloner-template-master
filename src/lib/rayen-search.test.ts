import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { queryTerms, score, type SearchIndexEntry } from "./search-matching.ts";

/**
 * The RAYEN search index, and the one rule that separates it from HYDE's.
 *
 * WHY THIS FILE EXISTS
 * On 2026-09-14, adding search to the RAYEN site turned up that HYDE's index already carried
 * all 196 RAYEN-only products — a quarter of its 769 entries — on /products/… URLs that do
 * not exist in HYDE's build. Every one of them was a dead result. Nothing caught it: the
 * dead-link audit walks anchors in built HTML, and these were strings inside a JSON payload
 * fetched at runtime, so they were invisible to it.
 *
 * The fix is one line in scripts/build-search-index.mjs. This is the assertion that keeps it,
 * because the failure is silent in both directions and neither site's build would complain.
 */

const read = (path: string): SearchIndexEntry[] =>
  existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as SearchIndexEntry[]) : [];

const products = readdirSync("content/products")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`content/products/${f}`, "utf8")))
  .filter((p) => p.heroImage?.src);

const rayenOnlySlugs = new Set(
  products.filter((p) => (p.sites ?? []).includes("rayen") && !(p.sites ?? []).includes("hyde"))
    .map((p) => p.slug as string),
);

const hydeIndex = read("public/search-index.json");
const rayenZh = read("public/search-index-rayen-zh.json");
const rayenEn = read("public/search-index-rayen-en.json");

test("HYDE 的搜索索引里没有只上雷茵的型号", () => {
  const leaked = hydeIndex
    .filter((e) => e.type === "product")
    .filter((e) => [...rayenOnlySlugs].some((slug) => e.href.includes(`/${slug}/`)))
    .map((e) => e.subtitle);
  assert.deepEqual(
    leaked.slice(0, 10),
    [],
    `这些型号只上雷茵站，却出现在 cantonlock 的搜索里，点开是 404：${leaked.length} 个`,
  );
});

test("雷茵的搜索索引两种语言都建了，且条目数一致", () => {
  assert.ok(rayenZh.length > 0, "中文索引是空的 —— 先跑 node scripts/build-search-index.mjs");
  assert.equal(
    rayenZh.length,
    rayenEn.length,
    "中英文索引条目数不一样，说明有产品只进了一边",
  );
});

test("索引里存的是不带语言前缀的路径", () => {
  /*
    The prefix is added in the browser from location.pathname. If one were baked in here it
    would be right in `next dev` (/zh/…) or on the deployed host (/…) but never both — and
    the half that breaks is whichever nobody clicked.
  */
  const prefixed = [...rayenZh, ...rayenEn].filter(
    (e) => e.href.startsWith("/zh/") || e.href.startsWith("/zh-en/") || e.href.startsWith("/en/"),
  );
  assert.deepEqual(prefixed.map((e) => e.href).slice(0, 5), []);
});

test("按型号搜得到，而且排第一", () => {
  for (const model of ["T1050", "G1216", "T2973"]) {
    const terms = queryTerms(model);
    const ranked = rayenZh
      .map((item) => ({ item, points: score(item, terms) }))
      .filter((r) => r.points > 0)
      .sort((a, b) => b.points - a.points);
    assert.ok(ranked.length > 0, `搜 ${model} 一条都没有`);
    assert.ok(
      ranked[0].item.subtitle.toUpperCase().startsWith(model),
      `搜 ${model} 排第一的是 ${ranked[0].item.subtitle}`,
    );
  }
});

test("中文词搜得到 —— 不用分词器", () => {
  /*
    queryTerms splits on whitespace, so 「玻璃门拉手」 stays one term and is matched as a
    substring; 「拉手」 is two characters and falls to startsWord(), which only asks that the
    character before it is not a latin letter or digit — always true inside Chinese text.
    Both shapes therefore hit, which is why no segmenter is shipped to the browser.
  */
  for (const word of ["拉手", "玻璃门", "执手"]) {
    const terms = queryTerms(word);
    const hits = rayenZh.filter((item) => score(item, terms) > 0);
    assert.ok(hits.length > 0, `中文搜「${word}」一条都没有`);
  }
});
