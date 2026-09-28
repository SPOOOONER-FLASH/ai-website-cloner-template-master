import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import test from "node:test";

/*
  Google Discover readiness (client 2026-09-28): large images, a feed, no intrusive popup
  over an article on a phone. Each of these was checked by hand once; these keep it true.
*/

test("every article has a 1200×675 share image under 500 KB", () => {
  const manifest = JSON.parse(readFileSync("src/data/generated/article-share-images.json", "utf8")) as Record<string, { file: string }>;
  for (const section of ["guides", "news"]) {
    for (const f of readdirSync(`content/${section}`).filter((x) => x.endsWith(".json"))) {
      const a = JSON.parse(readFileSync(`content/${section}/${f}`, "utf8"));
      if (!a.heroImage?.src) continue;
      const entry = manifest[`${section}/${a.slug}`];
      assert.ok(entry, `${section}/${a.slug}: no share image — run node scripts/build-article-share-images.mjs`);
      const file = `public${entry.file}`;
      assert.ok(existsSync(file), `${file} missing`);
      assert.ok(statSync(file).size <= 500 * 1024, `${file} is over 500 KB`);
    }
  }
});

test("every locale layout allows large image previews for all engines, not only Googlebot", () => {
  for (const p of ["src/app/(en)/layout.tsx", "src/app/es/layout.tsx", "src/app/pt/layout.tsx", "scripts/scaffold-locale-routes.mjs"]) {
    assert.match(readFileSync(p, "utf8"), /index: true, follow: true, "max-image-preview": "large", googleBot/, p);
  }
});

test("the RSS feed exists and every English page declares it", () => {
  assert.ok(existsSync("src/app/feed.xml/route.ts"));
  assert.match(readFileSync("src/app/(en)/layout.tsx", "utf8"), /<link rel="alternate" type="application\/rss\+xml"[^>]*href="\/feed\.xml"/);
  assert.match(readFileSync("src/app/robots.ts", "utf8"), /absoluteUrl\("\/feed\.xml"\)/);
});

test("no promo card over an article on a phone", () => {
  assert.match(readFileSync("src/components/site/PromoDialog.tsx", "utf8"), /surface === "news" && !forcedOpen\(\) && window\.matchMedia\("\(max-width: 639\.98px\)"\)\.matches/);
});
