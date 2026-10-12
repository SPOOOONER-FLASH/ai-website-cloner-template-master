import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

/*
  content/article-routes.json — where each cited article sends a reader who is ready to
  look at products (2026-10-12). Read with fs, like the other content tests, because the
  loader imports JSON the way only the bundler resolves it.
*/
const root = process.cwd();
const routes = (JSON.parse(fs.readFileSync(path.join(root, "content/article-routes.json"), "utf8")) as {
  articles: Record<string, { next?: string; noProducts?: string }>;
}).articles;

type Record_ = { model: string; slug: string; sites?: string[]; published?: boolean; heroImage?: { src?: string }; categoryPath?: string[] };
const products = fs
  .readdirSync(path.join(root, "content/products"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(root, "content/products", f), "utf8")) as Record_)
  .filter((p) => (!p.sites || p.sites.includes("hyde")) && p.heroImage?.src);
const byModel = new Map(products.map((p) => [p.model, p]));

const NEXT = /^(?:(?:compare|category):[a-z0-9-]+|finishes|certifications|price-list|documents)$/;

function article(key: string) {
  const [section, slug] = key.split("/");
  const file = path.join(root, "content", section, `${slug}.json`);
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as { relatedModels?: string[]; body?: string[] }) : undefined;
}

test("every route names an existing guide or news article and a known next step", () => {
  for (const [key, route] of Object.entries(routes)) {
    assert.match(key, /^(guides|news)\/[a-z0-9-]+$/, key);
    assert.ok(article(key), `${key}: no such article file`);
    if (route.next) assert.match(route.next, NEXT, `${key}: unknown next step "${route.next}"`);
  }
});

test("a category in a route has published HYDE products, and the cylinder comparison is never used", () => {
  for (const [key, route] of Object.entries(routes)) {
    const [kind, category] = (route.next ?? "").split(":");
    if (!category) continue;
    assert.ok(products.some((p) => p.categoryPath?.[0] === category), `${key}: no published HYDE product in ${category}`);
    /* The cylinder comparison page has no table: only a minority of records carry a size. */
    if (kind === "compare") assert.notEqual(category, "lock-cylinders", key);
  }
});

test("noProducts is a reason, given only when the article lists no published product", () => {
  for (const [key, route] of Object.entries(routes)) {
    if (route.noProducts === undefined) continue;
    assert.ok(route.noProducts.trim().length > 20, `${key}: noProducts must say why`);
    const resolved = (article(key)?.relatedModels ?? []).filter((m) => byModel.has(m));
    assert.deepEqual(resolved, [], `${key}: has published related products, so noProducts is wrong`);
  }
});

test("articles that cite a test report send the reader to the certificates page", () => {
  for (const file of ["news", "guides"].flatMap((s) => fs.readdirSync(path.join(root, "content", s)).map((f) => `${s}/${f.replace(/\.json$/, "")}`))) {
    const body = (article(file)?.body ?? []).join(" ");
    if (/GZU-|CELAB/.test(body)) assert.equal(routes[file]?.next, "certifications", `${file} cites a report number`);
  }
});
