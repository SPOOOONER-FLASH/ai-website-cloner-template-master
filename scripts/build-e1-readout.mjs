#!/usr/bin/env node
/**
 * E1 标题实验读数（09-30 r21 改英文 seoTitle/seoDescription；西葡为对照组，原定 10-14 读数）。
 * 直接问 GSC API：三篇 × 英/西/葡，按天的点击、曝光、排名，切成改前（09-02–09-29）和改后（10-01–最新）。
 *   node scripts/build-e1-readout.mjs [--write]
 * 凭据与代理同 scripts/pull-analytics-api.mjs。
 */
import { createSign } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  process.exit(spawnSync(process.execPath, process.argv.slice(1), { stdio: "inherit", env: { ...process.env, NODE_USE_ENV_PROXY: "1" } }).status ?? 1);
}
const env = Object.fromEntries(readFileSync(".env.local", "utf8").split(/\r?\n/).map((l) => l.match(/^([A-Z0-9_]+)=(.*)$/)).filter(Boolean).map((m) => [m[1], m[2]]));
const sa = JSON.parse(readFileSync(env.GOOGLE_SERVICE_ACCOUNT_JSON, "utf8"));
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const now = Math.floor(Date.now() / 1000);
const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/webmasters.readonly", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
const jwt = `${unsigned}.${createSign("RSA-SHA256").update(unsigned).sign(sa.private_key, "base64url")}`;
const { access_token } = await (await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}` })).json();

const SLUGS = ["door-hardware-hs-codes-2026", "door-preparation-161-and-86-2026", "glass-door-thickness-and-cutouts-2026"];
const LOCALES = ["", "es/", "pt/"];
const end = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10);
const rows = [];
for (const slug of SLUGS) {
  // GSC 的 dimensionFilterGroups 只支持 and，所以每篇单独查一次。
  const res = await (await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent("sc-domain:cantonlock.com")}/searchAnalytics/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ startDate: "2026-09-02", endDate: end, dimensions: ["page", "date"], rowLimit: 25000,
      dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "contains", expression: `/guides/${slug}/` }] }] }),
  })).json();
  if (res.error) throw new Error(JSON.stringify(res.error).slice(0, 300));
  for (const r of res.rows ?? []) rows.push({ page: r.keys[0].replace("https://cantonlock.com/", ""), date: r.keys[1], c: r.clicks, i: r.impressions, pos: r.position });
}
const last = rows.map((r) => r.date).sort().at(-1);
const seg = (list) => { const c = list.reduce((s, r) => s + r.c, 0), i = list.reduce((s, r) => s + r.i, 0), p = i ? list.reduce((s, r) => s + r.pos * r.i, 0) / i : 0; return { c, i, ctr: i ? (100 * c) / i : 0, pos: p }; };
const fmt = (x) => `${x.c} / ${x.i} · ${x.ctr.toFixed(2)}% · ${x.pos.toFixed(1)}`;
const out = [`# E1 标题实验读数（GSC API，09-02 → ${last}）`, "", "改前 = 09-02–09-29（28 天），改后 = 10-01–" + last + "。每格：点击 / 曝光 · 点击率 · 平均排名。英文是实验组（09-30 改了 seoTitle/seoDescription），西葡是对照组（没改）。", "", "| 文章 | 语言 | 改前 | 改后 |", "|---|---|---|---|"];
for (const s of SLUGS) for (const l of LOCALES) {
  const page = `${l}guides/${s}/`;
  const mine = rows.filter((r) => r.page === page);
  out.push(`| ${s.replace(/-2026$/, "")} | ${l ? l.slice(0, 2) : "en（实验）"} | ${fmt(seg(mine.filter((r) => r.date <= "2026-09-29")))} | ${fmt(seg(mine.filter((r) => r.date >= "2026-10-01")))} |`);
}
const text = out.join("\n") + "\n";
console.log(text);
if (process.argv.includes("--write")) { mkdirSync("docs/research/analytics/2026-10-25", { recursive: true }); writeFileSync("docs/research/analytics/2026-10-25/E1-READOUT.md", text); }
