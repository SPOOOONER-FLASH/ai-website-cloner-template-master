import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const repositoryRoot = process.cwd();
const homeEn = readFileSync(join(repositoryRoot, "src", "data", "home.ts"), "utf8");
const homeEs = readFileSync(join(repositoryRoot, "src", "data", "home-es.ts"), "utf8");
const credits = readFileSync(join(repositoryRoot, "IMAGE_CREDITS.md"), "utf8");
const editorialConfig = JSON.parse(
  readFileSync(
    join(repositoryRoot, "src", "components", "site", "editorial-images.config.json"),
    "utf8",
  ),
) as Record<string, { sourceWidth: number; variants: number[] }>;

/*
  Updated 2026-09-06 when the client asked for no white grounds on the homepage or
  /products, keeping white for Product Finder only. Four of the six flat-white plates were
  replaced by graded ones under scripts/compose-editorial-plate.mjs — the products in them
  are the same photographs, only the field changed.

  The list is pinned rather than derived on purpose: it is the one place that says which
  six images the homepage is supposed to carry, so an image quietly disappearing from
  home.ts fails here instead of leaving a gap on the page.
*/
const expectedAssets = [
  "/images/editorial/hyde-hero-lever.webp",
  "/images/editorial/hyde-hero-cylinder.webp",
  "/images/editorial/hyde-real-product-atlas.webp",
  "/images/editorial/hyde-real-cylinder-plate.webp",
  "/images/editorial/hyde-hero-lockcase.webp",
  "/images/editorial/hyde-hero-hinge.webp",
] as const;

const approvedEditorialLibrary = ["product-range", "exhibition-wall"].flatMap((kind) =>
  Array.from(
    { length: 10 },
    (_, index) =>
      `/images/editorial/hyde-editorial-${kind}-${String(index + 1).padStart(2, "0")}.webp`,
  ),
);

test("English and Spanish home data use six unique sales-semantic editorial assets", () => {
  assert.equal(new Set(expectedAssets).size, 6);
  for (const asset of expectedAssets) {
    assert.match(homeEn, new RegExp(`src: "${asset.replaceAll("/", "\\/")}"`));
    assert.match(homeEs, new RegExp(`src: "${asset.replaceAll("/", "\\/")}"`));
  }
  assert.doesNotMatch(expectedAssets.join("\n"), /panic|commercial-egress/i);
});

test("new homepage asset labels describe visible door-hardware sales context", () => {
  for (const source of [homeEn, homeEs]) {
    const relevantLines = source
      .split(/\r?\n/)
      .filter((line) => expectedAssets.some((asset) => line.includes(asset)))
      .map((line) => source.split(/\r?\n/).indexOf(line));

    assert.equal(relevantLines.length, 6);
  }
  assert.match(homeEn, /label: ".*(hardware|lock|hinge|sample|schedule).*"/i);
  assert.match(homeEs, /label: ".*(herrajes|cerradura|bisagra|muestra|cuadro).*"/i);
});

test("every new homepage source has responsive candidates and provenance", () => {
  for (const asset of expectedAssets) {
    const config = editorialConfig[asset];
    assert.ok(config, `missing responsive config for ${asset}`);
    assert.ok(config.sourceWidth > Math.max(...config.variants));
    assert.match(credits, /real photographs/);
    const provenance = JSON.parse(readFileSync(join(repositoryRoot, "public", `${asset}.json`), "utf8"));
    /*
      Two vocabularies, one meaning. `real-photograph-composition` is written by the atlas
      composer and `real-photograph-on-editorial-field` by compose-editorial-plate.mjs;
      both assert the same thing, which is the only claim this test cares about — the
      product pixels are the client's own photograph and only the field was added.
    */
    assert.ok(
      ["real-photograph-composition", "real-photograph-on-editorial-field"].includes(
        provenance.kind,
      ),
      `${asset} claims provenance "${provenance.kind}", which is not a real-photograph kind`,
    );
    assert.ok(provenance.sources.length > 0);
  }
});

test("Spanish FAQ card falls back to the existing English FAQ route", () => {
  assert.match(homeEs, /href: "\/faq"/);
  assert.doesNotMatch(homeEs, /href: "\/es\/faq"/);
});

test("the historical generated library remains archived with provenance, not approved for new product use", () => {
  assert.equal(approvedEditorialLibrary.length, 20);
  assert.equal(new Set(approvedEditorialLibrary).size, 20);

  for (const asset of approvedEditorialLibrary) {
    const config = editorialConfig[asset];
    assert.ok(config, `missing responsive config for ${asset}`);
    assert.deepEqual(config, { sourceWidth: 1536, variants: [480, 960, 1440] });
    assert.ok(existsSync(join(repositoryRoot, "public", asset)), `missing canonical ${asset}`);
    assert.ok(
      existsSync(join(repositoryRoot, "public", `${asset}.json`)),
      `missing prompt provenance for ${asset}`,
    );

    for (const width of config.variants) {
      const responsive = asset.replace(
        "/images/editorial/",
        "/images/editorial/responsive/",
      ).replace(/\.webp$/, `-${width}w.webp`);
      assert.ok(
        existsSync(join(repositoryRoot, "public", responsive)),
        `missing responsive derivative ${responsive}`,
      );
    }
  }
});
