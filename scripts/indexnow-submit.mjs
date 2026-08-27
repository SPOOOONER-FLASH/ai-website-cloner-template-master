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
 * Run: node scripts/indexnow-submit.mjs [--dry] [--limit N]
 */
import { readFileSync } from "node:fs";

const KEY = "6bb09b9b67d0e605a292835469627988";
const HOST = "cantonlock.com";
const SITEMAP = "out/sitemap.xml";
const ENDPOINT = "https://api.indexnow.org/IndexNow";
/** IndexNow accepts at most 10 000 URLs per request. */
const BATCH = 10000;

const dry = process.argv.includes("--dry");
const limitFlag = process.argv.indexOf("--limit");
const limit = limitFlag > -1 ? Number(process.argv[limitFlag + 1]) : Infinity;

const urls = [...readFileSync(SITEMAP, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1])
  .filter((u) => u.startsWith(`https://${HOST}/`))
  .slice(0, limit);

if (!urls.length) {
  console.error(`no URLs in ${SITEMAP} — run npm run deploy:prep first`);
  process.exit(1);
}

console.log(`${urls.length} URLs from ${SITEMAP}`);

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
