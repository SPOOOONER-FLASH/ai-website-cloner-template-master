#!/usr/bin/env node
/**
 * Dead links as the LIVE site answers them, not as out/ resolves them.
 *
 * `npm run seo:deadlinks` (scripts/audit-dead-links.mjs) proves every internal link in the
 * export points at a file that exists. It cannot see what nginx and Cloudflare actually
 * return, and it never leaves the domain. This covers both halves (client, 2026-09-27:
 * 「检查死链」):
 *
 *   1. every URL in the English sitemap plus a sample from each locale sitemap, fetched
 *      from https://cantonlock.com — anything but 200 is listed;
 *   2. every distinct external link in out/**.html, fetched once (HEAD, then GET when a
 *      server refuses HEAD) — 404/410/5xx and DNS failures are dead; 401/403/429 are
 *      listed separately as "refused a robot", because marketplaces and social sites
 *      answer scripts that way while working fine in a browser.
 *
 * Run: node scripts/audit-live-links.mjs [--locale-sample 40] [--concurrency 6] [--no-external]
 * Exit 1 when anything is dead, so it can gate a release check.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const HOST = "https://cantonlock.com";
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? Number(process.argv[i + 1]) : fallback;
};
const LOCALE_SAMPLE = arg("--locale-sample", 40);
const CONCURRENCY = arg("--concurrency", 6);
const EXTERNAL = !process.argv.includes("--no-external");
const UA = "Mozilla/5.0 (compatible; cantonlock-link-audit/1.0; +https://cantonlock.com)";

const locs = (file) =>
  existsSync(file) ? [...readFileSync(file, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]) : [];

async function pool(items, fn) {
  const out = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    }),
  );
  return out;
}

async function status(url, method = "GET") {
  try {
    const res = await fetch(url, {
      method,
      redirect: "follow",
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(20000),
    });
    if (method === "GET") await res.arrayBuffer().catch(() => {});
    return { url, code: res.status, final: res.url };
  } catch (error) {
    return { url, code: 0, error: error.cause?.code ?? error.name };
  }
}

// 1 — internal pages.
const english = locs("out/sitemap.xml");
const localeFiles = readdirSync("out", { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join("out", d.name, "sitemap.xml")))
  .map((d) => join("out", d.name, "sitemap.xml"));
const sample = localeFiles.flatMap((f) => {
  const all = locs(f);
  const step = Math.max(1, Math.floor(all.length / LOCALE_SAMPLE));
  return all.filter((_, i) => i % step === 0).slice(0, LOCALE_SAMPLE);
});
const pages = [...new Set([...english, ...sample])].filter((u) => u.startsWith(HOST));
console.log(`internal: ${pages.length} pages (${english.length} English + ${sample.length} sampled from ${localeFiles.length} locales)`);
const internal = await pool(pages, (u) => status(u));
const badInternal = internal.filter((r) => r.code !== 200);

// 2 — external links.
let deadExternal = [];
let refused = [];
let unreachable = [];
if (EXTERNAL) {
  const external = new Map();
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== "_next") walk(p);
      } else if (e.name.endsWith(".html")) {
        for (const m of readFileSync(p, "utf8").matchAll(/<a\b[^>]*\shref="(https?:\/\/[^"]+)"/g)) {
          const url = m[1].replace(/&amp;/g, "&");
          if (url.startsWith(HOST) || url.startsWith("http://cantonlock.com")) continue;
          if (!external.has(url)) external.set(url, p.slice(4).replace(/\\/g, "/"));
        }
      }
    }
  };
  walk("out");
  console.log(`external: ${external.size} distinct links`);
  const results = await pool([...external.keys()], async (u) => {
    let r = await status(u, "HEAD");
    if (r.code === 405 || r.code === 403 || r.code === 0 || r.code >= 500) r = await status(u, "GET");
    return { ...r, page: external.get(u) };
  });
  /*
    A connect timeout is not a dead link. From this office (mainland China) YouTube, Facebook,
    Instagram, Pinterest and Tumblr never connect at all; first run on 2026-09-27 listed all
    five as dead. Reported separately, to be checked from a network that reaches them.
  */
  const timedOut = (r) => r.code === 0 && /TIMEOUT|TimeoutError|ECONNRESET/.test(r.error ?? "");
  unreachable = results.filter(timedOut);
  deadExternal = results.filter((r) => !timedOut(r) && (r.code === 0 || r.code === 404 || r.code === 410 || r.code >= 500));
  refused = results.filter((r) => [401, 403, 429, 999].includes(r.code));
}

const show = (rows) => rows.map((r) => `  ${r.code || r.error}  ${r.url}${r.page ? `   ← ${r.page}` : ""}`).join("\n");
if (badInternal.length) console.log(`\n✖ internal pages not 200 (${badInternal.length}):\n${show(badInternal)}`);
if (deadExternal.length) console.log(`\n✖ dead external links (${deadExternal.length}):\n${show(deadExternal)}`);
if (refused.length) console.log(`\n· refused a robot, check in a browser (${refused.length}):\n${show(refused)}`);
if (unreachable.length) console.log(`
· unreachable from this network, not judged (${unreachable.length}):
${show(unreachable)}`);
if (!badInternal.length && !deadExternal.length) console.log("\n✔ no dead links on the live site");
process.exit(badInternal.length || deadExternal.length ? 1 : 0);
