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
 * `--last-release` (2026-09-27) is the normal post-release form: it submits only the pages
 * whose exported HTML changed in the most recent HYDE release commit, and first checks that
 * the live site already serves that build. Cloudflare caches HTML and purge is the client's
 * step, so a submission sent before the purge would get the old page crawled; the check
 * reads the build id (`"b":"…"`) from a few of the changed pages and refuses when the edge
 * still has the previous one. `--since <ref>` diffs against any earlier commit instead.
 *
 *     npm run seo:indexnow -- --last-release
 *
 * Run: node scripts/indexnow-submit.mjs [--dry] [--limit N] [--only <pattern>] [--last-release | --since <ref>]
 */
import { execFileSync, spawnSync } from "node:child_process";
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

/*
  What a reader or a crawler would see: scripts, stylesheet links, class names and hashed
  asset paths removed. Every build rewrites all ~7,000 index.html files because the build id
  and chunk hashes are embedded in each one, so a byte diff reports every page as changed;
  first run on 2026-09-27 it did exactly that. Titles, meta, canonical/hreflang, text, alt
  and hrefs survive the normalisation, which is what a re-crawl would pick up.
*/
function readable(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/g, "")
    .replace(/<link\b[^>]*_next\/[^>]*>/g, "")
    .replace(/\sclass="[^"]*"/g, "")
    .replace(/\/_next\/[^"'\s)]+/g, "")
    .replace(/\s+/g, " ");
}

/** Blob ids of every exported index.html at a commit. */
function htmlBlobs(ref) {
  const tree = execFileSync("git", ["ls-tree", "-r", ref, "--", "out/"], {
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
  const blobs = new Map();
  for (const line of tree.split("\n")) {
    const m = line.match(/^\S+ blob (\S+)\t(out\/(?:.*\/)?index\.html)$/);
    if (m) blobs.set(m[2], m[1]);
  }
  return blobs;
}

/** Reads blobs through one `git cat-file --batch` per chunk instead of one process each. */
function readBlobs(ids) {
  const text = new Map();
  for (let i = 0; i < ids.length; i += 200) {
    const chunk = ids.slice(i, i + 200);
    const res = spawnSync("git", ["cat-file", "--batch"], { input: chunk.join("\n") + "\n", maxBuffer: 1024 * 1024 * 1024 });
    const buf = res.stdout;
    let at = 0;
    for (const id of chunk) {
      const nl = buf.indexOf(10, at);
      const size = Number(buf.subarray(at, nl).toString().split(" ")[2]);
      text.set(id, buf.subarray(nl + 1, nl + 1 + size).toString("utf8"));
      at = nl + 1 + size + 1;
    }
  }
  return text;
}

/** Pages whose readable content changed between two commits, as live URLs. */
function changedSince(from, to) {
  const before = htmlBlobs(from);
  const after = htmlBlobs(to);
  const differ = [...after].filter(([file, id]) => before.get(file) !== id);
  const pairs = differ.filter(([file]) => before.has(file));
  const text = readBlobs([...new Set(pairs.flatMap(([file, id]) => [id, before.get(file)]))]);
  const changed = [
    ...differ.filter(([file]) => !before.has(file)).map(([file]) => file),
    ...pairs.filter(([file, id]) => readable(text.get(id)) !== readable(text.get(before.get(file)))).map(([file]) => file),
  ];
  console.log(`${differ.length} exported pages differ byte-wise, ${changed.length} in readable content`);
  return new Set(changed.map((f) => `https://${HOST}/${f.slice(4, -"index.html".length)}`));
}

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
let changed = null;
let releaseHead = "HEAD";
if (process.argv.includes("--last-release")) {
  const releases = git("log", "--grep=^发布（HYDE", "-2", "--format=%H").split("\n").filter(Boolean);
  if (releases.length < 2) {
    console.error("--last-release: fewer than two HYDE release commits in history");
    process.exit(1);
  }
  [releaseHead] = releases;
  console.log(`--last-release: ${releases[1].slice(0, 11)} → ${releases[0].slice(0, 11)}`);
  changed = changedSince(releases[1], releases[0]);
}
const sinceFlag = process.argv.indexOf("--since");
if (sinceFlag > -1) {
  const since = process.argv[sinceFlag + 1];
  if (!since) {
    console.error("--since needs a git ref");
    process.exit(1);
  }
  changed = changedSince(since, "HEAD");
}

let urls = (only ? all.filter((u) => new RegExp(only).test(u)) : all).slice(0, limit);
if (changed) {
  urls = urls.filter((u) => changed.has(u));
  if (!urls.length) {
    // Unlike --only, an empty diff can be the right answer: a release that only moved assets.
    console.log(`no sitemap page changed (${changed.size} exported pages differ, none indexable)`);
    process.exit(0);
  }

  // Does the edge serve this build yet? Read the id from the release's own homepage.
  const home = git("show", `${releaseHead}:out/index.html`);
  const buildId = home.match(/\\?"b\\?":\\?"([A-Za-z0-9_-]{8,})/)?.[1];
  if (!buildId) {
    console.error("could not read the build id from out/index.html");
    process.exit(1);
  }
  const sample = urls.slice(0, 3);
  const stale = [];
  for (const url of sample) {
    const body = await fetch(url, { headers: { "User-Agent": "cantonlock-indexnow-check" } }).then((r) => r.text());
    if (!body.includes(buildId)) stale.push(url);
  }
  if (stale.length) {
    console.error(`live site does not serve build ${buildId} yet — purge Cloudflare first, then rerun:`);
    console.error(stale.map((u) => `  ${u}`).join("\n"));
    process.exit(1);
  }
  console.log(`live serves build ${buildId} (${sample.length} pages checked)`);
}

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
