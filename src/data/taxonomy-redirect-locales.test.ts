import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { locales } from "./locales.ts";

const CONF = path.join(process.cwd(), "deploy/nginx/taxonomy-redirects.conf");

/**
 * Every retired catalogue path must redirect in EVERY locale, and never to a 404.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS IS FOR
 *
 * `deploy/nginx/taxonomy-redirects.conf` emitted English-only rules until 2026-09-17.
 * Search Console's 404 export of that date carries two Spanish URLs crawled days
 * earlier — /es/products/panic-exit-devices/72-panic-exit-device/ and the 030 —
 * both retired paths that the English side redirects correctly and the Spanish
 * mirror 404'd. A rename handled cleanly in one tree dropped two indexed pages in
 * another, and Portuguese would have inherited the same hole the moment it shipped.
 *
 * The generator is the fix; this is what keeps it fixed. It reads the conf as
 * deployed rather than re-running the generator, because the file on disk is what
 * `deploy/install-nginx-redirects.sh` copies to the server — and a generator that
 * is right while the committed output is stale is the failure mode the conf's own
 * header warns about.
 */
function rules(): { from: string; to: string }[] {
  const text = fs.readFileSync(CONF, "utf8");
  const out: { from: string; to: string }[] = [];
  const pattern = /location = (\S+) \{\s*\n\s*return 301 (\S+);/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) out.push({ from: match[1]!, to: match[2]! });
  return out;
}

/** A file rather than a page — the renamed product videos (2026-09-25). No locale, no index.html. */
const isFile = (url: string) => /\.[a-z0-9]+$/i.test(url);

/** "/es/products/x/y" → { locale: "es", path: "/products/x/y" } */
function split(url: string): { locale: string; path: string } {
  const prefix = url.split("/")[1];
  if ((locales as readonly string[]).includes(prefix) && prefix !== "en") {
    return { locale: prefix, path: url.slice(prefix.length + 1) || "/" };
  }
  return { locale: "en", path: url };
}

test("every retired path redirects in every locale", () => {
  const byPath = new Map<string, Set<string>>();

  for (const { from } of rules()) {
    const { locale, path: bare } = split(from);
    /* The pre-PHP entry points are English-only by nature — /index.asp never had a
       Spanish counterpart, because the ASP site predates the mirrors entirely. */
    if (!bare.startsWith("/products")) continue;
    if (!byPath.has(bare)) byPath.set(bare, new Set());
    byPath.get(bare)!.add(locale);
  }

  assert.ok(byPath.size > 0, "expected the conf to carry product redirects");

  const incomplete: string[] = [];
  for (const [bare, covered] of byPath) {
    const missing = locales.filter((locale) => !covered.has(locale));
    if (missing.length) incomplete.push(`${bare} — missing ${missing.join(", ")}`);
  }

  assert.deepEqual(
    incomplete,
    [],
    "run: node scripts/build-taxonomy-redirects.mjs (it emits every locale and verifies each destination)",
  );
});

/**
 * And the destination has to exist.
 *
 * A 301 to a page that is not there is worse than the 404 it replaces: the crawler
 * spends its budget and lands on a soft error instead of a hard one, and the rule
 * looks correct in the conf. The committed conf carried exactly one of these until
 * 2026-09-17 — t2973a → t2973, where t2973 is a rayen-only product that has never
 * existed on cantonlock.com. The generator now refuses to write it.
 */
test("no taxonomy redirect points at a page the export does not have", () => {
  const broken: string[] = [];

  for (const { from, to } of rules()) {
    /* The site root always exists and is not an exported directory. */
    if (to === "/") continue;
    const page = isFile(to)
      ? path.join(process.cwd(), "out", to)
      : path.join(process.cwd(), "out", to, "index.html");
    if (!fs.existsSync(page)) broken.push(`${from} -> ${to}`);
  }

  assert.deepEqual(broken, [], "these redirects land on a 404");
});
