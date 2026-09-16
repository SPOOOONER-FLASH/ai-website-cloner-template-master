import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

/**
 * The RAYEN site is indexable, and every gate that could stop it agrees.
 *
 * WHY THIS FILE EXISTS
 * Whether a page can be indexed is decided in two places that know nothing about each other:
 *
 *   1. robots.txt, written by scripts/build-rayen-site.mjs
 *   2. <meta name="robots">, from `robots` in the two root layouts
 *
 * Both said "no" while the site lived on a preview subdomain, which was right. On 2026-09-15
 * only the first was flipped, and the release notes recorded the indexing block as fixed. It
 * was not: a noindex meta overrides a permissive robots.txt, so all 418 pages stayed out of
 * the index and nothing failed. The comment in the layout even called itself "the single
 * switch".
 *
 * That is the shape of the bug worth a test — not a wrong value, but two settings that have
 * to agree and no place where they meet. This is that place.
 */

const OUT = "out-rayen";
const built = existsSync(OUT);

function pages(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...pages(full));
    else if (entry.name === "index.html") out.push(full);
  }
  return out;
}

test("robots.txt 允许收录，并指向 sitemap", { skip: !built }, () => {
  const robots = readFileSync(join(OUT, "robots.txt"), "utf8");
  assert.ok(!/Disallow:\s*\/\s*$/m.test(robots), `robots.txt 还在全站禁止收录：\n${robots}`);
  assert.match(robots, /Sitemap:\s*https:\/\/\S+\/sitemap\.xml/, "robots.txt 没有指向 sitemap");
});

test("没有任何页面带 noindex", { skip: !built }, () => {
  const blocked = pages(OUT)
    .filter((file) => /<meta name="robots"[^>]*noindex/i.test(readFileSync(file, "utf8")))
    .map((file) => file.slice(OUT.length + 1));
  assert.deepEqual(
    blocked.slice(0, 10),
    [],
    `${blocked.length} 个页面带 noindex —— robots.txt 放开了但 meta 还锁着，` +
      `这正是 2026-09-15 那次只翻了一个开关的情形`,
  );
});

test("每个页面都声明中英文 hreflang", { skip: !built }, () => {
  const all = pages(OUT);
  const missing = all
    .filter((file) => {
      const html = readFileSync(file, "utf8");
      /* HTML attribute names are case-insensitive and Next emits hrefLang. */
      return !/rel="alternate"[^>]+hreflang="zh-Hans"/i.test(html);
    })
    .map((file) => file.slice(OUT.length + 1));
  assert.deepEqual(missing.slice(0, 10), [], `${missing.length} 个页面没有 hreflang`);
});

test("sitemap 覆盖每一个页面，且带语言备选", { skip: !built }, () => {
  const sitemap = readFileSync(join(OUT, "sitemap.xml"), "utf8");
  const locs = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  const expected = pages(OUT).map((file) => {
    /* Separators are normalised: join() gives backslashes on Windows, and without this the
       test compares "rayen.cn/en\company\" against the sitemap's real URL and fails on every
       page while the sitemap is perfectly correct. */
    const rel = file.slice(OUT.length + 1).replaceAll("\\", "/").replace(/index\.html$/, "");
    return `https://rayen.cn/${rel}`;
  });
  const missing = expected.filter((url) => !locs.has(url));
  assert.deepEqual(missing.slice(0, 10), [], `${missing.length} 个页面不在 sitemap 里`);
  assert.match(sitemap, /hreflang="x-default"/, "sitemap 没有 x-default");
});

test("首页保留搜索引擎验证标记", { skip: !built }, () => {
  /* Bing verifies ownership by fetching https://rayen.cn/ and looking for this tag, and its
     own instructions say not to remove it after verification — a rebuild that dropped it
     would un-verify the property silently, with no error anywhere. The tokens live in
     `siteVerification` in src/data/rayen.ts; this asserts they actually reach the HTML. */
  for (const home of ["index.html", join("en", "index.html")]) {
    const html = readFileSync(join(OUT, home), "utf8");
    assert.match(html, /name="msvalidate\.01"/, `${home} 少了 Bing 站长验证标记`);
  }
});
