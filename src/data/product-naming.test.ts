import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

/*
  Generated product records must not be named after a different product.

  Three variants of one mistake shipped on 2026-09-08, all from a script picking a name out
  of a category instead of off the product:

    · the first record in `stainless-steel-handles` is called "Concealed Sliding Door
      Handle", so nine pull handles were created as `lh1083-concealed-sliding-door-handle`
    · "Door viewer" is the commonest name in `hardware-accessories`, which also holds
      stoppers, flush bolts and latches — so a flush bolt became `fb001-door-viewer` and a
      latch `l002-door-viewer`
    · a structural folder called 图库 became a product whose model was the Chinese word
      for "gallery"

  Each was caught by eye. The failure is quiet by nature — the page builds, the photograph
  is right, the spec table is empty as intended, and only the name and the URL are wrong —
  so it needs an assertion rather than another pair of eyes.

  These run over the real catalogue, not a fixture, because the thing being guarded is the
  catalogue itself.
*/

const DIR = "content/products";

interface Record {
  model: string;
  slug: string;
  name: string;
  categoryPath: string[];
}

const products: Record[] = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")) as Record);

/** The letter prefix of a model number is its product type: FB, L, DS, LH, NC. */
const prefixOf = (model: string) => model.trim().toUpperCase().match(/^[A-Z]+/)?.[0] ?? null;

test("no record is named after a folder rather than a product", () => {
  const structural = /^(图库|视频|主图|gallery|videos?)$/i;
  for (const product of products) {
    assert.doesNotMatch(
      product.model.trim(),
      structural,
      `${product.slug} has a folder name as its model number`,
    );
    assert.ok(product.model.trim(), `${product.slug} has an empty model number`);
    assert.doesNotMatch(
      product.slug,
      /^-/,
      `${product.slug} starts with a hyphen, which means its model was empty when the slug was built`,
    );
  }
});

test("models sharing a letter prefix in one category share a product name", () => {
  /*
    FB001 and FB017 are both flush bolts; L001 and L002 are both latches. A group where one
    member disagrees is the signature of a name taken from the category instead of from the
    part — which is exactly how a flush bolt ended up at `/fb001-door-viewer/`.

    Groups of one prove nothing and are skipped. So are prefixes shared by genuinely
    different things: `hardware-accessories` uses bare numbers for several unrelated items,
    and a numeric model has no prefix to group on anyway.
  */
  const groups = new Map<string, Record[]>();
  for (const product of products) {
    const prefix = prefixOf(product.model);
    if (!prefix) continue;
    const key = `${product.categoryPath[0]}::${prefix}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(product);
  }

  /*
  Discrepancies that are open questions for the factory, not defects to fix here.

  DS011 is named "Door Flush Bolt" while the seven other DS records are door stoppers, and
  its slug says flush bolt too. The evidence points the other way: Bing's keyword report
  for 2026-09-08 contains a real buyer query, "door stopper ds013 vs ds011", comparing the
  two as stoppers. But the specs do not settle it — DS011 is brass with a finish list and
  no dimensions — and what a product IS cannot be inferred from a prefix and a search
  query. Renaming it on that basis would be exactly the invented-fact failure this
  catalogue is built to avoid, so it is listed, not changed. Remove the entry when the
  factory answers.
*/
const AWAITING_FACTORY = new Set(["hardware-accessories::DS::DS011"]);

const disagreements: string[] = [];
  for (const [key, group] of groups) {
    if (group.length < 3) continue;
    const tally = new Map<string, number>();
    for (const p of group) tally.set(p.name, (tally.get(p.name) ?? 0) + 1);
    if (tally.size === 1) continue;

    const [[majority, count]] = [...tally].sort((a, b) => b[1] - a[1]);
    /*
      A minority of one against a clear majority is the bug. Two established names in a
      prefix is a real distinction the catalogue draws — hinges carry both plain and
      ball-bearing variants under one prefix — so only a lone dissenter is reported.
    */
    if (count < group.length - 1) continue;
    for (const p of group) {
      if (p.name === majority) continue;
      if (AWAITING_FACTORY.has(`${key}::${p.model}`)) continue;
      disagreements.push(
        `${key}: ${p.model} is "${p.name}" while ${count} siblings are "${majority}" (${p.slug})`,
      );
    }
  }

  assert.deepEqual(
    disagreements,
    [],
    `a generated record was named from its category instead of its siblings:\n  ${disagreements.join("\n  ")}`,
  );
});

test("a slug spells out the model it belongs to", () => {
  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  for (const product of products) {
    /*
      `modelTbc` marks a record whose "model" is a descriptive label rather than the
      client's real SKU — see the field's comment in types.ts. Its slug is built from the
      description instead, which is correct, so it cannot spell out a model number that
      does not exist yet.
    */
    if ((product as { modelTbc?: boolean }).modelTbc) continue;
    /*
      Contains, not starts-with. The AR4 range is slugged `hyde-ar4-101-mortise-lock` — a
      brand prefix the catalogue puts there on purpose (see ArgentinaAr4Showcase.tsx), and
      requiring the model first would fail every one of them for being correct.

      Containment still catches the failure worth catching: a slug built from a DIFFERENT
      model, which is what happens when a generator substitutes the donor's model instead
      of the new one — `3431-sset-snet-lever-handle` shipped that way on 2026-09-07.
    */
    assert.ok(
      product.slug.includes(slugify(product.model)),
      `${product.slug} does not contain its own model number (${product.model})`,
    );
  }
});
