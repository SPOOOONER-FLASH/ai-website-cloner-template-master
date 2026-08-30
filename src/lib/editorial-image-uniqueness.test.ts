import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function readJson(relativePath: string) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8")) as {
    heroImage: { src: string };
  };
}

test("the flagship homepage and three news stories use four purpose-built images", () => {
  const home = fs.readFileSync(path.join(root, "src/data/home.ts"), "utf8");
  const homeEs = fs.readFileSync(path.join(root, "src/data/home-es.ts"), "utf8");
  const layoutEn = fs.readFileSync(path.join(root, "src/app/(en)/layout.tsx"), "utf8");
  const layoutEs = fs.readFileSync(path.join(root, "src/app/es/layout.tsx"), "utf8");
  const newsSources = [
    readJson("content/news/door-hardware-schedule-guide.json").heroImage.src,
    readJson("content/news/mortise-lock-backset-and-centre-distance-guide.json").heroImage.src,
    readJson("content/news/reading-door-hardware-model-numbers.json").heroImage.src,
  ];

  assert.match(home, /\/images\/editorial\/home-panic-exit-bars\.webp/);
  assert.match(homeEs, /\/images\/editorial\/home-panic-exit-bars\.webp/);
  assert.match(layoutEn, /\/images\/editorial\/home-panic-exit-bars\.webp/);
  assert.match(layoutEs, /\/images\/editorial\/home-panic-exit-bars\.webp/);
  assert.deepEqual(newsSources, [
    "/images/editorial/news-door-schedule-doors.webp",
    "/images/editorial/news-mortise-lock-inspection.webp",
    "/images/editorial/news-finish-function-library.webp",
  ]);
  assert.equal(new Set(newsSources).size, 3);
  assert.ok(!newsSources.includes("/images/editorial/home-panic-exit-bars.webp"));

  for (const source of [
    "/images/editorial/home-panic-exit-bars.webp",
    ...newsSources,
  ]) {
    assert.ok(
      fs.existsSync(path.join(root, "public", source)),
      `${source} must exist in the public editorial library`,
    );
  }
});
