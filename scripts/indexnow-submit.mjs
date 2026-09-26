/**
 * Submits the sitemap's URLs to IndexNow (Bing, Yandex, Naver, Seznam).
 *
 * Hosting /<key>.txt only proves ownership — it does not submit anything. Without this
 * script the IndexNow integration was inert: the key sat there and no URL was ever
 * pushed. Bing then rediscovers pages on its own crawl schedule, which for 471 pages is
 * weeks.
 *
 * Reads out/sitemap.xml, so it reports what was actually built and exported rather than
 * what the source thinks exists. Run it after `npm run deploy:prep` and after the push
 * has reached the server — submitting a URL the server has not pulled yet gets it
 * crawled at the old content.
 *
 * `--only <pattern>` submits just the URLs whose path matches, and is the flag you want
 * for a normal release. IndexNow exists to announce what CHANGED; re-pushing all 1,951
 * sitemap URLs on every deploy is what makes an audit report "IndexNow is in batch mode",
 * and a search engine that is handed the same unchanged list repeatedly learns to discount
 * it. Submit the pages the release actually touched:
 *
 *     node scripts/indexnow-submit.mjs --only 'guides/' --dry
 *
 * On Windows, write the pattern WITHOUT a leading slash. Git Bash's MSYS path conversion
 * rewrites a leading-slash argument into a Windows path, so `--only '/guides/'` arrives as
 * `C:/Program Files/Git/guides/` and matches nothing. `MSYS_NO_PATHCONV=1` also works.
 * The "matched none" guard below exists because that failure is silent otherwise —
 * submitting zero URLs and exiting 0 looks exactly like a successful submission.
 *
 * The full-sitemap form is still right after a domain move, a taxonomy-wide rename, or a
 * first-ever submission — cases where genuinely everything changed.
 *
 * Run: node scripts/indexnow-submit.mjs [--dry] [--limit N] [--only <pattern>]
 */
import { existsSync, readFileSync } from "node:fs";

const KEY = "6bb09b9b67d0e605a292835469627988";
const HOST = "cantonlock.com";
const SITEMAP = "out/sitemap.xml";
const ENDPOINT = "https://api.indexnow.org/IndexNow";
/** IndexNow accepts at most 10 000 URLs per request. */
const BATCH = 10000;

const dry = process.argv.includes("--dry");
const limitFlag = process.argv.indexOf("--limit");
const limit = limitFlag > -1 ? Number(process.argv[limitFlag + 1]) : Infinity;

const onlyFlag = process.argv.indexOf("--only");
const only = onlyFlag > -1 ? process.argv[onlyFlag + 1] : null;
if (onlyFlag > -1 && !only) {
  console.error("--only needs a pattern, e.g. --only '/guides/'");
  process.exit(1);
}

/*
  Every sitemap robots.txt declares, not only /sitemap.xml. Since 2026-09-26 /sitemap.xml
  carries the English URLs only (it was 14 MB and Bing stopped reading it) and each locale
  has its own /<code>/sitemap.xml; reading the one file submitted 881 of ~7,000 URLs.
*/
const declared = existsSync("out/robots.txt")
  ? [...readFileSync("out/robots.txt", "utf8").matchAll(/^Sitemap:\s*https?:\/\/[^/]+\/(\S+)$/gim)].map((m) => `out/${m[1]}`)
  : [];
const sitemaps = [...new Set([SITEMAP, ...declared])].filter((f) => existsSync(f));
const all = [
  ...new Set(sitemaps.flatMap((f) => [...readFileSync(f, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))),
].filter((u) => u.startsWith(`https://${HOST}/`) && !u.endsWith(".xml"));

if (!all.length) {
  console.error(`no URLs in ${SITEMAP} — run npm run deploy:prep first`);
  process.exit(1);
}

const urls = (only ? all.filter((u) => new RegExp(only).test(u)) : all).slice(0, limit);

if (!urls.length) {
  // A pattern that matches nothing is almost always a typo, and submitting nothing
  // silently would look exactly like success.
  console.error(`--only ${only} matched none of the ${all.length} URLs in ${SITEMAP}`);
  process.exit(1);
}

if (only) console.log(`--only ${only}: ${urls.length} of ${all.length} URLs`);

console.log(`${urls.length} URLs from ${sitemaps.length} sitemap(s)`);

if (dry) {
  console.log("--dry: nothing submitted");
  console.log(urls.slice(0, 5).map((u) => `  ${u}`).join("\n"));
  process.exit(0);
}

for (let i = 0; i < urls.length; i += BATCH) {
  const urlList = urls.slice(i, i + BATCH);
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList,
    }),
  });

  // 200 accepted · 202 accepted, key still being validated · 400 bad format ·
  // 403 key not found or not matching · 422 URL not on this host · 429 rate limited.
  console.log(`batch ${i / BATCH + 1}: ${urlList.length} URLs -> ${response.status} ${response.statusText}`);
  if (!response.ok && response.status !== 202) {
    console.error(await response.text());
    process.exit(1);
  }
}
