import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

/*
  Any catalogue count written into prose has to match the catalogue.

  On 2026-09-07 the OEM answer in content/faq.json said "We publish 435 models across 15
  product families", in both languages. The real figure was 361 — 435 was the record
  count at some earlier point, and by then the catalogue held 462 records of which 361
  had a photograph and were therefore published. So the most persuasive sentence on the
  most commercially important FAQ entry carried a number that was wrong in two directions
  at once, on a site whose whole argument is that its numbers can be trusted.

  Nobody typed a wrong number on purpose. It went stale, which is what typed numbers do.
  The homepage strip and the capability chain avoid this by computing (see
  src/lib/site-facts.ts), but faq.json is hand-written content and cannot compute. A test
  is the next best thing: it cannot keep the sentence current, but it can refuse to let a
  build ship while the sentence is wrong.
*/

const PRODUCT_DIR = "content/products";

function publishedCount(): number {
  let published = 0;
  for (const file of readdirSync(PRODUCT_DIR)) {
    if (!file.endsWith(".json")) continue;
    const record = JSON.parse(readFileSync(`${PRODUCT_DIR}/${file}`, "utf8"));
    /* Mirrors isPublished() in src/data/products.ts: a page without a photograph is noindex. */
    if (record.heroImage?.src) published += 1;
  }
  return published;
}

test("every model count written into the FAQ matches the published catalogue", () => {
  const faq = readFileSync("content/faq.json", "utf8");
  const expected = publishedCount();

  /*
    Matches both languages: "publish 361 models" and "Publicamos 361 modelos". Anchoring
    on the verb rather than on a bare number avoids sweeping up unrelated figures — a
    backset of 60mm or a 30-day lead time is not a model count.
  */
  const claims = [...faq.matchAll(/(?:publish|Publicamos)\s+(\d[\d,]*)\s+(?:models|modelos)/gi)];

  assert.ok(claims.length > 0, "the FAQ should state how many models we publish");

  for (const claim of claims) {
    const stated = Number(claim[1].replace(/,/g, ""));
    assert.equal(
      stated,
      expected,
      `content/faq.json claims ${stated} published models; content/products has ${expected}. ` +
        `Update the sentence in both languages, or the site is quoting a figure it cannot support.`,
    );
  }
});

test("the family count in the FAQ matches content/categories.json", () => {
  const faq = readFileSync("content/faq.json", "utf8");
  const raw = JSON.parse(readFileSync("content/categories.json", "utf8"));
  const families = Array.isArray(raw) ? raw.length : (raw.categories ?? []).length;

  const claims = [
    ...faq.matchAll(/(\d+)\s+(?:product families|familias de producto)/gi),
  ];
  for (const claim of claims) {
    assert.equal(
      Number(claim[1]),
      families,
      `content/faq.json claims ${claim[1]} families; content/categories.json has ${families}.`,
    );
  }
});
