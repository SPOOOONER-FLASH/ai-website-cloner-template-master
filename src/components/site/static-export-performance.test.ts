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
  const heroTag = (html.match(/<img\b[^>]*hero-cultural-entrance[^>]*>/i) ?? [])[0];

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
      tag.includes("/images/products/"),
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
