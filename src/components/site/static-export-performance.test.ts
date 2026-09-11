import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { join } from "node:path";

const repositoryRoot = process.cwd();
const homeExport = join(repositoryRoot, "out", "index.html");

test("the initial home export renders one carousel frame", () => {
  const html = readFileSync(homeExport, "utf8");
  const renderedSlides = html.match(/data-active="(?:true|false)"/g) ?? [];

  assert.equal(
    renderedSlides.length,
    1,
    `expected one initial carousel frame, found ${renderedSlides.length}`,
  );
});

test("every editorial image in the initial home export has responsive candidates", () => {
  const html = readFileSync(homeExport, "utf8");
  const imageTags = html.match(/<img\b[^>]*>/g) ?? [];
  const editorialImages = imageTags.filter((tag) =>
    tag.includes("/images/editorial/"),
  );
  const imagesWithoutCandidates = editorialImages.filter(
    (tag) => !/srcset=/i.test(tag),
  );

  assert.ok(editorialImages.length > 0, "expected editorial images on the homepage");
  assert.deepEqual(
    imagesWithoutCandidates,
    [],
    "every initial editorial image must expose a srcset",
  );
});

test("the mobile hero accounts for its wide-source object-cover crop", () => {
  const html = readFileSync(homeExport, "utf8");
  const heroTag = (html.match(/<img\b[^>]*home-panic-exit-bars[^>]*>/i) ?? [])[0];

  assert.ok(heroTag, "expected the initial Hero image in the static export");
  assert.match(
    heroTag,
    /sizes="[^"]*184vw[^"]*"/i,
    "the 4:3 mobile frame needs a larger source-width hint for its wide editorial crop",
  );
});

test("nested route segment payloads use the flat filenames requested by Next", () => {
  const contactExport = join(repositoryRoot, "out", "contact");
  const entries = readdirSync(contactExport, { withFileTypes: true });
  const pagePayloads = entries.filter(
    (entry) => entry.isFile() && /^__next\..+\.__PAGE__\.txt$/u.test(entry.name),
  );
  const nestedSegmentDirectories = entries.filter(
    (entry) => entry.isDirectory() && entry.name.startsWith("__next."),
  );

  assert.equal(
    pagePayloads.length,
    1,
    `expected one flat contact page payload, found ${pagePayloads.map((entry) => entry.name).join(", ")}`,
  );
  assert.deepEqual(
    nestedSegmentDirectories,
    [],
    "Windows-only nested segment directory must be normalized away",
  );
});

test("project editorial images are responsive while technical product anchors stay untouched", () => {
  const projectSlugs = [
    "commercial-fire-egress-hardware",
    "glass-entrance-hardware-package",
    "hospitality-residential-door-package",
  ];

  for (const slug of projectSlugs) {
    const html = readFileSync(
      join(repositoryRoot, "out", "projects", slug, "index.html"),
      "utf8",
    );
    const imageTags = html.match(/<img\b[^>]*>/g) ?? [];
    const editorialTags = imageTags.filter((tag) =>
      tag.includes("/images/editorial/"),
    );
    const productTags = imageTags.filter((tag) =>
      tag.includes("/images/products-hyde/"),
    );

    assert.ok(editorialTags.length > 0, `${slug} should contain editorial imagery`);
    assert.ok(productTags.length > 0, `${slug} should retain a real product anchor`);
    assert.equal(
      editorialTags.every((tag) => /srcset=/i.test(tag)),
      true,
      `${slug} editorial images must expose responsive candidates`,
    );
    assert.equal(
      productTags.every((tag) => !/srcset=/i.test(tag)),
      true,
      `${slug} product images must not enter the editorial derivative pipeline`,
    );
  }
});

/*
  THE CATALOGUE MUST NOT REACH THE BROWSER ON THE HOMEPAGE.

  Measured 2026-09-11: the homepage shipped 2,241 KB of JavaScript, of which a single
  1,548 KB chunk was the entire product catalogue — 659 records with their specs and
  summaries — downloaded by every visitor so that the facts strip could render two
  numbers.

  The cause is one import. `SiteFacts` and `CapabilityChain` are client components (they
  animate on scroll), and a client component that imports from `@/data/products` pulls the
  generated catalogue into its bundle. Both only ever needed counts, which a server
  component already has.

  This is invisible in every other check: the page renders correctly, the tests pass, the
  HTML is identical, and Lighthouse reports it as an opaque "reduce unused JavaScript".
  So it is asserted on the built output, where the regression would actually appear.

  Fixing it took the homepage from 2,241 KB to 669 KB.

  A NOTE ON THE THRESHOLD. Five records is not a magic number — it is "more than an
  incidental mention". A chunk legitimately contains a slug or two (a link, a redirect
  map). It never legitimately contains dozens.
*/
test("the homepage bundle does not contain the product catalogue", () => {
  const html = readFileSync(homeExport, "utf8");
  const chunks = [...new Set(html.match(/\/_next\/static\/chunks\/[a-z0-9_-]+\.js/g) ?? [])];

  assert.ok(chunks.length > 0, "expected the homepage to reference JavaScript chunks");

  const carryingCatalogue = [];
  let totalKb = 0;

  for (const chunk of chunks) {
    const path = join(repositoryRoot, "out", chunk);
    let source;
    try {
      source = readFileSync(path, "utf8");
    } catch {
      continue;
    }
    totalKb += source.length / 1024;
    const records = (source.match(/slug:"/g) ?? []).length;
    if (records > 5) carryingCatalogue.push(`${chunk} (${records} product records)`);
  }

  assert.deepEqual(
    carryingCatalogue,
    [],
    "a client component is importing @/data/products — pass the count from a server component instead",
  );

  /*
    A ceiling as well as a shape check. The catalogue is the biggest way to blow this, but
    it is not the only one, and a number that creeps back up deserves the same stop.
  */
  assert.ok(
    totalKb < 1200,
    `homepage JavaScript is ${Math.round(totalKb)} KB; it was 669 KB on 2026-09-11 after removing the catalogue`,
  );
});
