#!/usr/bin/env node
/**
 * Keeps the previous release's hashed assets alive so cached HTML never 404s its CSS.
 *
 * ---------------------------------------------------------------------------
 * THE FAILURE THIS PREVENTS — an entirely unstyled page, for a real visitor
 *
 * Every asset filename is a content hash, and the site ships ONE stylesheet for all 977
 * pages. So the stylesheet's name changes on essentially every deploy: 1s-z0puwq07tq.css
 * on 2026-09-01 05:39, 2x_0pmfgo5bbx.css by 06:10, 2rs4qcis3uegi.css by 07:39,
 * 0mxbf313rzbi0.css since 09-02. Deploying is a `git pull`, so the old name is DELETED
 * from the server the moment the new one lands. Measured against production, all three
 * retired stylesheets return 404 today.
 *
 * HTML, meanwhile, outlives its own build. The origin sends
 * `max-age=300, stale-while-revalidate=60`, but Cloudflare's Edge TTL overrides that —
 * `/products/` was observed serving `cf-cache-status: HIT` at `Age: 4647`, 77 minutes
 * old. Browser caches and back/forward navigation hold HTML too.
 *
 * Put those together and there is a window after every deploy in which a visitor is
 * served cached HTML that references a stylesheet the server has just deleted. Their
 * browser gets a 404 for it and paints the page with NO CSS AT ALL: nav as underlined
 * blue links, inline SVG icons at their intrinsic size — several hundred pixels of blue
 * globe — and no layout. It looks like the site is broken, because for that visitor it is.
 *
 * The JS chunks mostly survive a deploy, which is why this is easy to miss: a file whose
 * content did not change keeps its hash and its name. The stylesheet is the one file that
 * changes on nearly every build, so it is the one that goes missing.
 *
 * ---------------------------------------------------------------------------
 * THE FIX
 *
 * Restore any `out/_next/static/**` file this build removed, and keep it until it is
 * safely older than any cache that could still be pointing at it. Serving one extra
 * stylesheet costs ~70KB on disk; the alternative costs a visitor the entire page.
 *
 * Retirement dates live in a manifest beside the assets so pruning is deterministic and
 * does not depend on file mtimes, which `git pull` rewrites.
 *
 * This is deliberately NOT a Cloudflare change. A cache rule would fix the edge and
 * nothing else — browser caches and any intermediary hold stale HTML too, and a zone
 * purge is client-only here. Keeping the asset fixes it for every cache everywhere.
 *
 * Run after `npm run build`, before committing out/.
 *
 * `--since <ref>` widens the baseline. The default, HEAD, answers "what did the build I
 * am about to commit remove". An older release answers "what have the last few deploys
 * already removed" — which is how the backlog gets recovered the first time this runs,
 * after several releases have already dropped their stylesheets.
 *
 * Usage: node scripts/retain-previous-assets.mjs [--check] [--since <ref>]
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const STATIC_DIR = "out/_next/static";
const MANIFEST = join(STATIC_DIR, "retired-assets.json");

/**
 * How long a retired asset is kept.
 *
 * It has to comfortably exceed the longest cache that can still hand out HTML naming it.
 * The observed Cloudflare edge age was 77 minutes and the client's stated Edge TTL is two
 * hours, so 48 hours is roughly a 24× margin — chosen because the cost of being generous
 * is a few hundred kilobytes, and the cost of being tight is a blank-looking website.
 */
const RETAIN_HOURS = 48;

const check = process.argv.includes("--check");

function git(args) {
  return execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

const sinceFlag = process.argv.indexOf("--since");
const BASELINE =
  sinceFlag > -1 && process.argv[sinceFlag + 1] ? process.argv[sinceFlag + 1] : "HEAD";

/** Files under out/_next/static that the baseline has and the working tree no longer does. */
function deletedSinceBaseline() {
  const out = git(["diff", "--name-only", "--diff-filter=D", BASELINE, "--", STATIC_DIR]);
  return out.split("\n").map((s) => s.trim()).filter(Boolean);
}

const now = Date.now();
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};

/* ------------------------------------------------------------------ restore */

const deleted = deletedSinceBaseline();
const restored = [];

for (const path of deleted) {
  if (path === MANIFEST) continue;
  if (check) {
    restored.push(path);
    continue;
  }
  mkdirSync(dirname(path), { recursive: true });
  // Take the bytes from the baseline — the version that release actually served.
  const bytes = execFileSync("git", ["show", `${BASELINE}:${path}`], { maxBuffer: 64 * 1024 * 1024 });
  writeFileSync(path, bytes);
  if (!manifest[path]) manifest[path] = new Date(now).toISOString();
  restored.push(path);
}

/* -------------------------------------------------------------------- prune */

const cutoff = now - RETAIN_HOURS * 3600 * 1000;
const pruned = [];

for (const [path, retiredAt] of Object.entries(manifest)) {
  if (Date.parse(retiredAt) > cutoff) continue;
  /*
    Only prune something still absent from the current build. A hash that came BACK —
    the content reverted — is a live asset again and its retirement no longer applies.
  */
  if (deleted.includes(path) || !existsSync(path)) {
    delete manifest[path];
    continue;
  }
  if (!restored.includes(path)) {
    pruned.push(path);
    delete manifest[path];
  }
}

/*
  ONE `git rm`, NOT ONE PER FILE.

  The first version called `git rm` inside the loop. Each call takes and releases
  .git/index.lock, and on 2026-09-05 that left a stale zero-byte lock behind twice in one
  session — both times immediately after `npm run deploy:prep`, both times blocking the
  very next `git add` with "Another git process seems to be running". Nothing was running;
  the lock was simply never cleaned up after the last call in the loop.

  A stale lock in a shared checkout is worse than slow: the other agent cannot tell it
  from a live commit in progress, and deleting someone else's live lock destroys their
  work. So the fix is to hold the lock exactly once. It is also much faster.
*/
if (!check && pruned.length) {
  try {
    execFileSync("git", ["rm", "-q", "--ignore-unmatch", "--", ...pruned], {
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    /* Untracked or already gone; nothing to do. */
  }
}

if (check) {
  if (restored.length) {
    console.error(
      `${restored.length} asset(s) from the previous build were removed and not retained.\n` +
        `Cached HTML naming them would 404 and render unstyled.\n` +
        `Run: node scripts/retain-previous-assets.mjs\n` +
        restored.slice(0, 6).map((p) => `  ${p}`).join("\n"),
    );
    process.exit(1);
  }
  console.log("No previous-build assets are missing from this build.");
  process.exit(0);
}

mkdirSync(STATIC_DIR, { recursive: true });
writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

const held = Object.keys(manifest).length;
console.log(
  `retained ${restored.length} asset(s) from the previous build; ` +
    `pruned ${pruned.length} older than ${RETAIN_HOURS}h; ${held} held in total.`,
);
if (restored.length) {
  for (const p of restored.slice(0, 8)) console.log(`  + ${p.replace("out/_next/static/", "")}`);
}
