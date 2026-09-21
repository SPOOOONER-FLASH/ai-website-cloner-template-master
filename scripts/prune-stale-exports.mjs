#!/usr/bin/env node
/**
 * Removes pages the build no longer generates but that survive in the committed export.
 *
 * ---------------------------------------------------------------------------
 * WHAT GOES WRONG WITHOUT THIS
 *
 * `out/` is committed and a Next static export only WRITES; it never deletes. So every
 * time a slug is renamed, the old directory stays behind with whatever was in it — and
 * because the route no longer exists, Next re-renders it as its own error page. The file
 * still returns HTTP 200.
 *
 * That is a soft 404, and it is worse than a real one. A 404 tells a crawler the URL is
 * gone; a 200 with an error page in it tells the crawler the page exists and is empty,
 * which is the state Bing and Google both penalise. Found on 2026-09-14: 24 of them, all
 * left over from the escape-hardware renames of 2026-09-10 and a door-hinges category
 * that moved. None was in the sitemap and none was linked from any page, which is why
 * nothing had noticed — and also why deleting them is safe.
 *
 * The nginx 301s for the renamed URLs fire before the filesystem is consulted, so a
 * visitor arriving on an old link still gets redirected. Where no 301 exists, removing
 * the file turns a soft 404 into a real one, which is the correct answer.
 *
 * ---------------------------------------------------------------------------
 * WHY IT IS A SEPARATE SCRIPT AND NOT PART OF THE BUILD
 *
 * Deleting from `out/` is the one operation in this pipeline that can lose work — the
 * other agent may be mid-release with files this run knows nothing about. So it removes
 * ONLY directories whose index.html Next itself marked as an error page, never a path
 * derived from a list of what "should" exist. If Next rendered it as a page, it stays.
 *
 * Usage:
 *   node scripts/prune-stale-exports.mjs           # report
 *   node scripts/prune-stale-exports.mjs --write   # delete them
 *   node scripts/prune-stale-exports.mjs --check   # non-zero exit if any remain
 */

import { readdirSync, readFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const write = process.argv.includes("--write");
const check = process.argv.includes("--check");

/** Next stamps its error boundary on the html element of a route that no longer resolves. */
const ERROR_MARK = 'id="__next_error__"';

const roots = ["out", "out-rayen"].filter((dir) => existsSync(dir));
const stale = [];

for (const root of roots) {
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name === "index.html") {
        if (readFileSync(path, "utf8").includes(ERROR_MARK)) stale.push(path);
      }
    }
  };
  walk(root);
}

console.log(`stale exported pages: ${stale.length}`);
for (const path of stale) {
  const route = "/" + path.replaceAll("\\", "/").replace(/^out(-rayen)?\//, "").replace(/index\.html$/, "");
  console.log(`  ${route}`);
}

if (write) {
  for (const path of stale) rmSync(dirname(path), { recursive: true, force: true });
  console.log(`\nremoved ${stale.length} directories.`);
} else if (check && stale.length) {
  console.error(
    `\n${stale.length} route(s) in the export render Next's error page and return 200 — a soft 404.`,
  );
  console.error("Run: node scripts/prune-stale-exports.mjs --write");
  process.exit(1);
} else if (!check) {
  console.log("\n--write not given; nothing removed.");
}
