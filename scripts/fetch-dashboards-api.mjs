#!/usr/bin/env node
/**
 * The four dashboards over their APIs instead of hand-exported CSVs.
 *
 *   node scripts/fetch-dashboards-api.mjs [--date YYYY-MM-DD] [--only bing,gsc,ga4,clarity] [--dry-run]
 *
 * Client, 2026-10-25, with the Bing Webmaster API key: 「其他的 API 怎么调用 gsc clarity GA4」.
 *
 * Credentials live in `.env.local` at the repository root (git-ignored) on the machine that runs
 * this, never in git and never in a chat. Each source is independent: a missing credential skips
 * that source with the name of the variable it needs, an API error is reported and the others
 * still run.
 *
 *   BING_WEBMASTER_API_KEY          Bing Webmaster → Settings → API access
 *   GOOGLE_APPLICATION_CREDENTIALS  path to a service-account JSON key; the account's e-mail is
 *                                   added as a user in Search Console (Restricted) and GA4 (Viewer)
 *   GSC_SITE                        optional; default tries sc-domain:cantonlock.com, then the
 *                                   URL-prefix property https://cantonlock.com/
 *   GA4_PROPERTY_ID                 the numeric property ID (GA4 Admin → Property details)
 *   CLARITY_API_TOKEN               Clarity → Settings → Data Export → Generate new API token
 *
 * Writes docs/research/analytics/<date>/api/<source>-<report>.json plus API-SUMMARY.md (row counts
 * and the first rows of each report). Numbers only; conclusions go in DATA-DASHBOARDS.md as before.
 *
 * Limits worth knowing: Clarity's export API returns only the last 1–3 days and allows 10 requests
 * per project per day (this makes 3). GSC data lags about 3 days, so its window ends 3 days ago.
 * Bing's AI-performance pages (AIPageStats, AISearchQueries) have no API; keep exporting those.
 */
import { createSign } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const DATE = value("--date") ?? new Date().toISOString().slice(0, 10);
const ONLY = (value("--only") ?? "bing,gsc,ga4,clarity").split(",");
const DRY = flag("--dry-run");
const OUT = join("docs/research/analytics", DATE, "api");
const env = process.env;
const saved = [];

const day = (offset) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
const redact = (s) => String(s).replace(/(apikey=)[^&\s]+/gi, "$1***").replace(/(Bearer )\S+/g, "$1***");

function save(name, data, rows) {
  if (DRY) return;
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, `${name}.json`), `${JSON.stringify(data, null, 2)}\n`);
  saved.push({ name, rows: rows ?? [] });
  console.log(`  ✓ ${name}  (${(rows ?? []).length} rows)`);
}

async function call(url, init = {}) {
  if (DRY) {
    console.log(`  would ${init.method ?? "GET"} ${redact(url)}`);
    return null;
  }
  const res = await fetch(url, init);
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} ${redact(url)}\n    ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

// --------------------------------------------------------------------------------- Bing
async function bing() {
  const key = env.BING_WEBMASTER_API_KEY;
  if (!key) return "set BING_WEBMASTER_API_KEY";
  const site = encodeURIComponent(env.BING_SITE_URL ?? "https://cantonlock.com/");
  for (const method of ["GetQueryStats", "GetPageStats", "GetRankAndTrafficStats", "GetCrawlStats", "GetCrawlIssues"]) {
    const data = await call(`https://ssl.bing.com/webmaster/api.svc/json/${method}?siteUrl=${site}&apikey=${key}`);
    if (data) save(`bing-${method}`, data, Array.isArray(data.d) ? data.d : []);
  }
}

// ------------------------------------------------------------------- Google (GSC, GA4)
let googleToken;
async function googleAccessToken() {
  if (googleToken) return googleToken;
  const file = env.GOOGLE_APPLICATION_CREDENTIALS;
  const sa = JSON.parse(readFileSync(file, "utf8"));
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(sa.private_key).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Google token: HTTP ${res.status} ${JSON.stringify(body).slice(0, 300)}`);
  googleToken = body.access_token;
  return googleToken;
}

async function googlePost(url, payload) {
  const token = DRY ? "dry" : await googleAccessToken();
  return call(url, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function gsc() {
  if (!env.GOOGLE_APPLICATION_CREDENTIALS) return "set GOOGLE_APPLICATION_CREDENTIALS (service-account JSON path)";
  const sites = env.GSC_SITE ? [env.GSC_SITE] : ["sc-domain:cantonlock.com", "https://cantonlock.com/"];
  const window = { startDate: day(-30), endDate: day(-3) };
  for (const site of sites) {
    const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
    try {
      for (const dims of [["query"], ["page"], ["country"], ["date"], ["query", "page"]]) {
        const data = await googlePost(url, { ...window, dimensions: dims, rowLimit: 1000 });
        if (data) save(`gsc-${dims.join("+")}`, { site, ...window, ...data }, data.rows ?? []);
      }
      return;
    } catch (error) {
      // 403 on a property the account was not added to: try the other property type once.
      if (site === sites.at(-1) || !/HTTP 40[34]/.test(error.message)) throw error;
      console.log(`  ${site} not accessible, trying the next property type`);
    }
  }
}

async function ga4() {
  if (!env.GOOGLE_APPLICATION_CREDENTIALS) return "set GOOGLE_APPLICATION_CREDENTIALS (service-account JSON path)";
  if (!env.GA4_PROPERTY_ID) return "set GA4_PROPERTY_ID (numeric, GA4 Admin → Property details)";
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${env.GA4_PROPERTY_ID}:runReport`;
  const dateRanges = [{ startDate: "28daysAgo", endDate: "yesterday" }];
  const base = ["sessions", "activeUsers", "engagedSessions"];
  const reports = {
    channel: { dimensions: ["sessionDefaultChannelGroup"], metrics: base },
    source: { dimensions: ["sessionSource", "sessionMedium"], metrics: base },
    country: { dimensions: ["country"], metrics: base },
    language: { dimensions: ["language"], metrics: base },
    landing: { dimensions: ["landingPage"], metrics: base },
    events: { dimensions: ["eventName"], metrics: ["eventCount", "totalUsers"] },
    daily: { dimensions: ["date"], metrics: base },
  };
  for (const [name, r] of Object.entries(reports)) {
    const data = await googlePost(url, {
      dateRanges,
      dimensions: r.dimensions.map((n) => ({ name: n })),
      metrics: r.metrics.map((n) => ({ name: n })),
      limit: 1000,
    });
    if (data) save(`ga4-${name}`, data, data.rows ?? []);
  }
}

// ------------------------------------------------------------------------------ Clarity
async function clarity() {
  const token = env.CLARITY_API_TOKEN;
  if (!token) return "set CLARITY_API_TOKEN";
  // Three of the ten requests a day: totals, by page, by channel.
  for (const [name, dim] of [["overview", ""], ["url", "&dimension1=URL"], ["channel", "&dimension1=Channel"]]) {
    const data = await call(`https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=3${dim}`, {
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    });
    if (data) save(`clarity-${name}`, data, Array.isArray(data) ? data : []);
  }
}

// --------------------------------------------------------------------------------- main
const sources = { bing, gsc, ga4, clarity };
let ok = 0;
for (const name of ONLY) {
  console.log(`${name}:`);
  try {
    const skipped = await sources[name]();
    if (skipped) console.log(`  skipped — ${skipped}`);
    else ok++;
  } catch (error) {
    console.log(`  ✗ ${redact(error.message)}`);
  }
}

if (!DRY && saved.length) {
  const preview = (rows) =>
    rows
      .slice(0, 5)
      .map((r) => `    ${redact(JSON.stringify(r)).slice(0, 200)}`)
      .join("\n");
  const md = [
    `# 看板 API 拉取 · ${DATE}`,
    "",
    "由 `node scripts/fetch-dashboards-api.mjs` 生成，只有数字，不写结论。每份完整数据在同目录的 JSON 里。",
    "",
    ...saved.map(({ name, rows }) => `## ${name}\n\n${rows.length} 行\n\n\`\`\`\n${preview(rows)}\n\`\`\`\n`),
  ].join("\n");
  writeFileSync(join(OUT, "API-SUMMARY.md"), md);
  console.log(`\n→ ${OUT}/API-SUMMARY.md`);
}
process.exit(ok > 0 || DRY ? 0 : 1);
