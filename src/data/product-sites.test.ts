import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

/**
 * Two rules introduced by the 2026-09-08 supplier handle import, both of which are silent
 * when broken.
 *
 * 1. SITE SCOPING. One content/products directory feeds three brands. Fourteen records
 *    carry sites:["rayen"] because the client scoped that batch to the Chinese site. If
 *    src/data/products.ts ever stops filtering on it, those products appear on
 *    cantonlock.com and nothing errors — they simply show up in the English catalogue,
 *    the sitemap and the search index, and nobody notices until a buyer asks about a
 *    model the export desk has never quoted.
 *
 * 2. STYLE FAMILY SYMMETRY. The pairing between a pull handle and its matching lever is
 *    derived from a shared styleFamily string rather than stored twice. That is what makes
 *    it impossible for the handle's page to recommend a lever whose own page does not
 *    recommend the handle — but only while the derivation stays derived. A future "let's
 *    just store the partner list" refactor would reintroduce exactly the drift this
 *    avoids, so the symmetry is asserted rather than assumed.
 */

type Record = {
  model: string;
  slug: string;
  sites?: string[];
  styleFamily?: string;
  categoryPath: string[];
  specs: { label: string; value: string }[];
};

const DIR = join(process.cwd(), "content", "products");
const records: Record[] = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(DIR, f), "utf8")));

const manifest = JSON.parse(
  readFileSync(join(process.cwd(), "content", "rayen", "union-handles.json"), "utf8"),
);

test("每个 sites 值都是已知站点", () => {
  const known = new Set(["hyde", "rayen"]);
  const bad = records
    .filter((r) => r.sites?.some((s) => !known.has(s)))
    .map((r) => `${r.model}: ${r.sites?.join(",")}`);
  assert.deepEqual(bad, []);
});

/**
 * The end-to-end version of the scoping rule, checked against the built export rather
 * than against the module that implements it.
 *
 * Asserting on src/data/products.ts would test the filter I just wrote; asserting on
 * out/ tests the thing the client would actually see. A RAYEN-only slug appearing under
 * a cantonlock.com path means the filter was removed, bypassed, or that some other code
 * path reads the barrel directly — and only the third of those would survive a unit test.
 *
 * Skipped when out/ has not been built, so a fresh clone is not blocked by it.
 */
test("构建产物里没有只上雷茵的型号", { skip: !existsSync(join(process.cwd(), "out", "products")) }, () => {
  const rayenOnly = records.filter((r) => r.sites && !r.sites.includes("hyde"));
  const leaked = rayenOnly.filter((r) =>
    existsSync(join(process.cwd(), "out", "products", r.categoryPath[0], r.slug)),
  );
  assert.deepEqual(
    leaked.map((r) => r.model),
    [],
    "这些型号只该在雷茵站上，却在 out/ 里生成了 HYDE 页面",
  );
});

test("清单里的 14 个型号都建了产品记录", () => {
  const bySlug = new Map(records.map((r) => [r.slug, r]));
  const missing = manifest.models
    .filter((m: { slug: string }) => !bySlug.has(m.slug))
    .map((m: { model: string }) => m.model);
  assert.deepEqual(missing, [], `清单里有但仓库里没有：${missing.join(", ")}`);
});

test("证据不足的型号没有被偷偷建成产品", () => {
  const models = new Set(records.map((r) => r.model));
  const published = manifest.heldBack
    .filter((h: { model: string }) => models.has(h.model))
    .map((h: { model: string }) => h.model);
  assert.deepEqual(
    published,
    [],
    `这些型号只有合影或场景图，不该单独上架：${published.join(", ")}`,
  );
});

test("同款式关系是对称的", () => {
  const byFamily = new Map<string, Record[]>();
  for (const record of records) {
    if (!record.styleFamily) continue;
    const list = byFamily.get(record.styleFamily) ?? [];
    list.push(record);
    byFamily.set(record.styleFamily, list);
  }

  // A family of one is a record that thinks it has partners and has none — either the
  // family string is a typo or the partner was held back without clearing the field.
  const orphans = [...byFamily.entries()]
    .filter(([, members]) => members.length < 2)
    .map(([family, members]) => `${family} 只有 ${members[0].model}`);
  assert.deepEqual(orphans, [], `孤立的款式：${orphans.join("；")}`);
});

test("有图纸的型号必须有尺寸行，没图纸的必须是空的", () => {
  const bySlug = new Map(records.map((r) => [r.slug, r]));
  const wrong: string[] = [];
  for (const entry of manifest.models as { slug: string; model: string; drawing: string | null }[]) {
    const record = bySlug.get(entry.slug);
    if (!record) continue;
    const hasSpecs = record.specs.length > 0;
    if (entry.drawing && !hasSpecs) wrong.push(`${entry.model} 有图纸却没有尺寸行`);
    /*
      The reverse is the one that matters. A model with no drawing must ship an empty spec
      table rather than dimensions copied from a sibling: G* and T* of the same family are
      different lengths on different fixings, so "close enough" is a wrong hole position and
      a wasted container. See AGENTS.md — a dash costs less trust than a plausible number.
    */
    if (!entry.drawing && hasSpecs) wrong.push(`${entry.model} 没有图纸却写了尺寸行`);
  }
  assert.deepEqual(wrong, [], wrong.join("；"));
});
