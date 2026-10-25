#!/usr/bin/env node
/**
 * 四个看板的 API 拉数（2026-10-25，甲方给了 Bing Webmaster API Key，问 GSC / Clarity / GA4 怎么接）。
 *
 * 凭据只放本机 .env.local（已在 .gitignore），永远不进 git：
 *   BING_WEBMASTER_API_KEY=…                       Bing Webmaster → 设置 → API 访问 → API 密钥
 *   GOOGLE_SERVICE_ACCOUNT_JSON=E:/hyde-keys/xxx.json Google Cloud 服务账号密钥文件（GSC 与 GA4 共用；放在仓库外）
 *   GA4_PROPERTY_ID=123456789                       GA4 → 管理 → 媒体资源设置 → 媒体资源 ID（纯数字，不是 G-RBTE7KF82P）
 *   CLARITY_API_TOKEN=…                             Clarity → 设置 → 数据导出 → 生成新的 API 令牌
 * 缺哪个就跳过哪个，并说明还差什么。
 *
 *   node scripts/pull-analytics-api.mjs                 拉最近 28 天（Clarity 只能拉最近 3 天）
 *   node scripts/pull-analytics-api.mjs --days 7
 * 输出 docs/research/analytics/<今天>/raw/api/<来源>-<报表>.json，原样保存接口返回，不改数。
 */
import { createSign } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

// 这台电脑访问 Google 要走代理；Node 的 fetch 默认不读 HTTPS_PROXY，检测到就带 NODE_USE_ENV_PROXY=1 重跑自己。
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const r = spawnSync(process.execPath, process.argv.slice(1), { stdio: "inherit", env: { ...process.env, NODE_USE_ENV_PROXY: "1" } });
  process.exit(r.status ?? 1);
}

const SITE = "https://cantonlock.com/";
const GSC_SITE = "sc-domain:cantonlock.com";
const daysArg = process.argv.indexOf("--days");
const DAYS = daysArg !== -1 ? Number(process.argv[daysArg + 1]) : 28;
const today = new Date().toISOString().slice(0, 10);
const OUT = join("docs/research/analytics", today, "raw/api");

const env = {};
for (const f of [".env.local", ".env"]) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in env)) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const get = (k) => process.env[k] || env[k] || "";

const save = (name, data) => {
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(data, null, 1));
  const rows = Array.isArray(data?.d) ? data.d.length : Array.isArray(data?.rows) ? data.rows.length : Array.isArray(data) ? data.length : "?";
  console.log(`  ✓ ${name}.json (${rows} 行)`);
};
const day = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const results = [];

async function json(url, opts = {}) {
  const r = await fetch(url, { ...opts, signal: AbortSignal.timeout(90_000) });
  const text = await r.text();
  if (!r.ok) throw new Error(`${r.status} ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

// ── Bing Webmaster（API Key，GET，按日数据，最近约 6 个月）
async function bing() {
  const key = get("BING_WEBMASTER_API_KEY");
  if (!key) return "缺 BING_WEBMASTER_API_KEY";
  const base = "https://ssl.bing.com/webmaster/api.svc/json";
  const q = `siteUrl=${encodeURIComponent(SITE)}&apikey=${key}`;
  for (const m of ["GetQueryStats", "GetPageStats", "GetRankAndTrafficStats", "GetCrawlStats", "GetCrawlIssues"]) {
    save(`bing-${m}`, await json(`${base}/${m}?${q}`));
  }
  return "ok";
}

// ── Google 服务账号 → access token（RS256 JWT，不依赖第三方包）
async function googleToken(scope) {
  const file = get("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (!file) return null;
  const sa = JSON.parse(readFileSync(file, "utf8"));
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: sa.client_email, scope, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const sig = createSign("RSA-SHA256").update(unsigned).sign(sa.private_key, "base64url");
  const r = await json("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${unsigned}.${sig}`,
  });
  return r.access_token;
}

// ── Google Search Console（searchanalytics.query；数据约有 2–3 天延迟）
async function gsc() {
  const token = await googleToken("https://www.googleapis.com/auth/webmasters.readonly");
  if (!token) return "缺 GOOGLE_SERVICE_ACCOUNT_JSON";
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`;
  const body = (dimensions) => JSON.stringify({ startDate: day(DAYS + 3), endDate: day(3), dimensions, rowLimit: 25000 });
  for (const [name, dims] of [["query", ["query"]], ["page", ["page"]], ["date", ["date"]], ["country", ["country"]], ["query-page", ["query", "page"]]]) {
    save(`gsc-${name}`, await json(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: body(dims) }));
  }
  return "ok";
}

// ── GA4 Data API（runReport）
async function ga4() {
  const id = get("GA4_PROPERTY_ID");
  if (!id) return "缺 GA4_PROPERTY_ID";
  const token = await googleToken("https://www.googleapis.com/auth/analytics.readonly");
  if (!token) return "缺 GOOGLE_SERVICE_ACCOUNT_JSON";
  const run = (dimensions, metrics, dimensionFilter) =>
    json(`https://analyticsdata.googleapis.com/v1beta/properties/${id}:runReport`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ dateRanges: [{ startDate: `${DAYS}daysAgo`, endDate: "yesterday" }], dimensions: dimensions.map((name) => ({ name })), metrics: metrics.map((name) => ({ name })), ...(dimensionFilter ? { dimensionFilter } : {}), limit: 10000 }),
    });
  save("ga4-landing", await run(["landingPage"], ["sessions", "engagedSessions", "keyEvents"]));
  save("ga4-source", await run(["sessionSourceMedium"], ["sessions", "engagedSessions"]));
  save("ga4-country", await run(["country"], ["sessions", "engagedSessions"]));
  save("ga4-events", await run(["eventName"], ["eventCount"]));
  save("ga4-landing-source", await run(["landingPage", "sessionSourceMedium"], ["sessions", "engagedSessions", "keyEvents"]));
  save("ga4-lead-pages", await run(["pagePath", "eventName"], ["eventCount"]));
  // 询盘漏斗按「落地页 × 来源」：哪篇文章、哪个来源真正带来询盘（2026-10-25）。会话数被自动流量灌水
  // （28 天 5,369 个 direct 会话参与率 9%，新加坡 1,293 个参与率 3%），事件数不会；tagassistant 与 127.0.0.1 是自测，读数时剔除。
  // inquiry_fail_*：表单没发出去的四种原因（src/lib/analytics-events.ts trackInquiryFailure，2026-10-25 起才有）。
  const funnel = ["generate_lead", "form_start", "contact_click", "file_download", "inquiry_fail_captcha_unsolved", "inquiry_fail_captcha_unavailable", "inquiry_fail_send", "inquiry_fail_timeout"];
  save("ga4-funnel-landing", await run(["eventName", "landingPage", "sessionSourceMedium"], ["eventCount"], { filter: { fieldName: "eventName", inListFilter: { values: funnel } } }));
  // 按天：2026-10-14 起询盘强制 hCaptcha，这张表看「开始填表 → 发出」在那天前后有没有断。
  save("ga4-funnel-date", await run(["date", "eventName"], ["eventCount"], { filter: { fieldName: "eventName", inListFilter: { values: funnel } } }));
  return "ok";
}

// ── Clarity Data Export（只能拉最近 1–3 天，每个项目每天 10 次）
async function clarity() {
  const token = get("CLARITY_API_TOKEN");
  if (!token) return "缺 CLARITY_API_TOKEN";
  const n = Math.min(3, DAYS);
  const base = "https://www.clarity.ms/export-data/api/v1/project-live-insights";
  for (const [name, dims] of [["summary", ""], ["url", "&dimension1=URL"], ["country", "&dimension1=Country"]]) {
    save(`clarity-${name}`, await json(`${base}?numOfDays=${n}${dims}`, { headers: { Authorization: `Bearer ${token}` } }));
  }
  return "ok";
}

for (const [name, fn] of [["Bing", bing], ["GSC", gsc], ["GA4", ga4], ["Clarity", clarity]]) {
  console.log(`${name}:`);
  try {
    const r = await fn();
    results.push([name, r]);
    if (r !== "ok") console.log(`  – 跳过：${r}`);
  } catch (e) {
    results.push([name, `失败 ${e.message}`]);
    console.log(`  ✗ ${e.message}`);
  }
}
console.log(`\n输出：${OUT}`);
console.log(results.map(([n, r]) => `${n}: ${r}`).join("\n"));
