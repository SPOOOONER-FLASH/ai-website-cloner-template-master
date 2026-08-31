import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

const expectedAssets = [
  "/images/editorial/hyde-source-by-range-2026.webp",
  "/images/editorial/hyde-source-by-project-2026.webp",
  "/images/editorial/hyde-nine-families-2026.webp",
  "/images/editorial/hyde-materials-engineering-2026.webp",
  "/images/editorial/hyde-engineering-contact-2026.webp",
  "/images/editorial/hyde-installation-faq-2026.webp",
] as const;

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
    assert.match(credits, new RegExp(asset.slice(asset.lastIndexOf("/") + 1)));
  }
});

test("Spanish FAQ card falls back to the existing English FAQ route", () => {
  assert.match(homeEs, /href: "\/faq"/);
  assert.doesNotMatch(homeEs, /href: "\/es\/faq"/);
});
