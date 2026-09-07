#!/usr/bin/env node
/**
 * Checks that the old DedeCMS URLs still 301 to the right new pages.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * On 2026-09-07 the Bing SiteExplorer export showed 371 legacy `index.php` URLs at
 * HTTP 200, and the obvious reading — the old site is still live, go fix the server —
 * was wrong. Every one of those URLs already 301s correctly; the 200s were the status
 * at Bing's LAST CRAWL, and 322 of them were crawled in July and August, before the
 * redirect work landed on 2026-09-04.
 *
 * That mistake was one report-reading away from sending the client into their production
 * nginx config to fix something that already worked. The lesson is narrow and worth
 * keeping: a webmaster tool's HTTP column is history, not current state. Live status
 * needs a request.
 *
 * So this makes the request. It is the re-runnable version of a check that would
 * otherwise be a paragraph in a document going stale.
 *
 * ---------------------------------------------------------------------------
 * WHAT IT DOES NOT DO
 *
 * Read-only GETs against public URLs, nothing else. It does not touch the server, the
 * CDN, or any dashboard, and a failure here is a report — never an automatic fix.
 *
 * Usage:  node scripts/verify-legacy-redirects.mjs [--json]
 */

const JSON_OUT = process.argv.includes("--json");
const ORIGIN = "https://cantonlock.com";

/*
  A sample rather than the full 372, chosen to cover every shape the old CMS emitted:
  the bare entry point, a language switch, a category listing with paging, a Chinese
  listing, and two deep product URLs whose `aid` must map to a specific new product page
  rather than to the catalogue root. If the per-product mapping ever degrades to a
  blanket redirect, the last two are what notice.
*/
const CASES = [
  { path: "/index.php", expect: "/" },
  { path: "/index.php?lang=es", expect: "/es/" },
  { path: "/index.php?m=home&c=lists&a=index&tid=118&lang=cn", expect: "/products/" },
  { path: "/index.php?m=home&c=lists&a=index&tid=113&page=5", expect: "/products/" },
  {
    path: "/index.php?m=home&c=view&a=index&aid=488",
    expect: "/products/hardware-accessories/dv07-door-viewer/",
  },
  {
    path: "/index.php?m=home&c=view&a=index&aid=297&lang=en",
    expect: "/products/glass-door-accessories/f112-glass-door-patch-fittings/",
  },
];

const results = [];

for (const testCase of CASES) {
  const url = ORIGIN + testCase.path;
  try {
    const response = await fetch(url, { redirect: "manual" });
    const location = response.headers.get("location") ?? "";
    /* Compare paths, not whole URLs: the host is allowed to vary, the destination is not. */
    const target = location.startsWith("http") ? new URL(location).pathname : location;
    results.push({
      url: testCase.path,
      status: response.status,
      target,
      expected: testCase.expect,
      ok: response.status === 301 && target === testCase.expect,
    });
  } catch (error) {
    results.push({ url: testCase.path, error: String(error?.message ?? error), ok: false });
  }
}

const failed = results.filter((r) => !r.ok);

if (JSON_OUT) {
  console.log(JSON.stringify({ checked: results.length, failed: failed.length, results }, null, 1));
} else {
  for (const r of results) {
    const mark = r.ok ? "✔" : "✖";
    const detail = r.error ? r.error : `${r.status} → ${r.target || "(no Location)"}`;
    console.log(`${mark} ${r.url.slice(0, 62).padEnd(62)} ${detail}`);
    if (!r.ok && !r.error) console.log(`${" ".repeat(4)}expected 301 → ${r.expected}`);
  }
  console.log(
    `\n${results.length - failed.length}/${results.length} legacy URLs redirect as intended.`,
  );
}

process.exitCode = failed.length ? 1 : 0;
