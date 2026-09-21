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
  // 2026-09-14: client rejected the new compositions and requested the original images.
  assert.deepEqual(newsSources, [
    "/images/editorial/news-door-schedule-doors.webp",
    "/images/editorial/news-mortise-lock-inspection.webp",
    "/images/products-hyde/607-pbbk-tubular-lock.webp",
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

test("the three newest News cards use distinct editorial images matched to their subjects", () => {
  const latestNewsSources = [
    readJson("content/news/ansi-grade-1-vs-en-1125-exit-devices.json").heroImage.src,
    readJson("content/news/narrow-stile-aluminium-door-lock-sag.json").heroImage.src,
    readJson("content/news/push-bar-or-touch-bar-panic-exit-devices.json").heroImage.src,
  ];

  /*
    The middle one changed on 2026-09-14, and this assertion is changed deliberately
    rather than relaxed.

    It used to pin `hyde-real-lock-plate.webp`, from the client's instruction to restore
    the original images after rejecting a set of new compositions. That instruction still
    holds — nothing here is a composition. But the same plate was serving two articles,
    and on the same day the client looked at the News index and asked for the repeats to
    go. The narrow-stile article now carries a photograph of AI8530, which is the first
    model its own text names, framed to 16:9.
  */
  assert.deepEqual(latestNewsSources, [
    "/images/products-hyde/307-panic-exit-device-2.webp",
    "/images/editorial/framed/ai8530-lock-case-16x9.webp",
    "/images/editorial/hyde-real-application-detail.webp",
  ]);
  assert.equal(new Set(latestNewsSources).size, 3);

  for (const source of latestNewsSources) {
    assert.ok(
      fs.existsSync(path.join(root, "public", source)),
      `${source} must exist in the public editorial library`,
    );
  }
});

/**
 * No two articles share a hero.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS A TEST AND NOT A CONVENTION
 *
 * It has broken twice. Both times nobody noticed in the repository, because a shared
 * image is invisible one record at a time — you only see it on the News index, where the
 * cards sit in a grid and the eye finds the repeat instantly. The client found it both
 * times, which is the wrong person to be running this check.
 *
 * On 2026-09-14 four images were serving nine articles: one mortise-lock photograph on
 * three, and a cylinder plate, a door-schedule scene and a lock plate on two each.
 *
 * The fix must not be "give it any unused image". Each of the five replacements is a
 * photograph of a model listed in that article's own `relatedModels`, so the picture is
 * of the part the text is about. That is a judgement this test cannot make — what it can
 * do is refuse to let the count of distinct heroes fall below the count of articles.
 */
function heroesIn(collection: string) {
  const directory = path.join(root, collection);
  const heroes = new Map<string, string[]>();

  for (const file of fs.readdirSync(directory).filter((name) => name.endsWith(".json"))) {
    const record = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8")) as {
      slug: string;
      heroImage?: { src?: string };
    };
    const source = record.heroImage?.src;
    /* A record with no image yet is withheld by the site, not a duplicate. */
    if (!source) continue;
    heroes.set(source, [...(heroes.get(source) ?? []), record.slug]);
  }

  return heroes;
}

/*
  News and Applications are checked separately rather than together, because the repeat
  the client is objecting to is a repeat WITHIN ONE GRID. Two sections of the site may
  legitimately reach for the same photograph; five cards in a row may not.
*/
for (const collection of ["content/news", "content/projects"]) {
  test(`every record in ${collection} has a hero image no sibling uses`, () => {
    const heroes = heroesIn(collection);
    const shared = [...heroes.entries()].filter(([, slugs]) => slugs.length > 1);
    assert.deepEqual(
      shared,
      [],
      `these images are used by more than one record:\n${shared
        .map(([source, slugs]) => `  ${source}\n    ${slugs.join("\n    ")}`)
        .join("\n")}`,
    );

    for (const source of heroes.keys()) {
      assert.ok(
        fs.existsSync(path.join(root, "public", source)),
        `${source} must exist under public/`,
      );
    }
  });
}
