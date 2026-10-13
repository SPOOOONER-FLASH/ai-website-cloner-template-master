#!/usr/bin/env node
/**
 * Codex image work list: the Alibaba bestsellers and the newly listed products, with what each
 * one has on the site today and what is missing.
 *
 *   node scripts/build-image-fill-list.mjs            print it
 *   node scripts/build-image-fill-list.mjs --write    write docs/collaboration/2026-10-13-codex-image-fill-list.md
 *
 * Client 2026-10-13: 「整理一下 阿里爆品清单 和新上产品清单 我让 codex 专业生图补图」.
 * Generated so the counts can be re-taken after Codex delivers (same rule as build-alibaba-image-brief.mjs).
 * "New" = a content/products record first added on or after NEW_SINCE that is on the HYDE catalogue,
 * plus the two market collections (Argentina, Brazil), which live in their own generated JSON.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const NEW_SINCE = "2026-09-13";
const OUT = "docs/collaboration/2026-10-13-codex-image-fill-list.md";
const LOW_RES = 800; // px: below this a 1:1 hero is soft on a retina product page
const ALIBABA = JSON.parse(readFileSync("docs/research/2026-09-11-alibaba-product-performance.json", "utf8"));

const products = readdirSync("content/products").filter((f) => f.endsWith(".json")).map((f) => ({ file: f, ...JSON.parse(readFileSync(join("content/products", f), "utf8")) }));
const onHyde = (p) => !p.sites || p.sites.includes("hyde");
/* "587 SS ET" on Alibaba is "587 SSET" here, "9007 E" is "9007E": compare without spaces and hyphens. */
const modelKey = (m) => String(m ?? "").toUpperCase().replace(/[\s-]+/g, "");
const byModel = new Map(products.filter(onHyde).map((p) => [modelKey(p.model), p]));
const num = (n) => (typeof n === "number" ? n : "—");

const width = async (src) => {
  const file = src && join("public", src);
  if (!file || !existsSync(file)) return null;
  return (await sharp(file).metadata()).width ?? null;
};
async function imageState(images) {
  const srcs = images.filter(Boolean);
  const heroWidth = await width(srcs[0]);
  const flags = [];
  if (!srcs.length) flags.push("**无图**");
  else if (srcs.length <= 2) flags.push(`仅 ${srcs.length} 张`);
  if (srcs.length && heroWidth === null) flags.push("主图文件缺失");
  if (heroWidth !== null && heroWidth < LOW_RES) flags.push(`主图 ${heroWidth}px 偏小`);
  return { count: srcs.length, heroWidth, flags, hero: srcs[0] ?? "" };
}
const productImages = (p) => [p.heroImage?.src, ...(p.gallery ?? []).map((g) => g.src)];

/* 1. Alibaba bestsellers: inquiries first, then exposure (the client's own 2026-09-11 export). */
const alibabaRows = [];
for (const entry of [...ALIBABA.products].sort((a, b) => (b.inquiries90d ?? 0) - (a.inquiries90d ?? 0) || (b.exposure30d ?? 0) - (a.exposure30d ?? 0))) {
  const product = entry.model ? byModel.get(modelKey(entry.model)) : undefined;
  const state = product ? await imageState(productImages(product)) : null;
  alibabaRows.push({ entry, product, state });
}

/* 2. New products: first commit that added the file. */
const log = execFileSync("git", ["log", `--since=${NEW_SINCE}`, "--diff-filter=A", "--name-only", "--format=@%ad", "--date=short", "--", "content/products"], { encoding: "utf8" });
const added = new Map();
let day = "";
for (const line of log.split("\n")) {
  if (line.startsWith("@")) day = line.slice(1);
  else if (line.trim()) added.set(line.trim().replace(/^content\/products\//, ""), day); // log is newest first: keep overwriting → earliest add
}
const newRows = [];
for (const p of products.filter((p) => onHyde(p) && added.has(p.file))) newRows.push({ p, day: added.get(p.file), state: await imageState(productImages(p)) });
newRows.sort((a, b) => (a.state.count - b.state.count) || b.day.localeCompare(a.day) || String(a.p.model).localeCompare(String(b.p.model)));

const collections = [];
for (const [name, file, page] of [["阿根廷专栏", "src/data/generated/argentina-collection.json", "/products/argentina/"], ["巴西专栏", "src/data/generated/brazil-collection.json", "/products/brazil/"]]) {
  const items = JSON.parse(readFileSync(file, "utf8"));
  const rows = [];
  for (const item of items) rows.push({ item, state: await imageState([item.image, ...(item.images ?? [])]) });
  collections.push({ name, page, rows });
}

/* ---- document ---- */
const out = [];
const push = (s = "") => out.push(s);
const cell = (s) => String(s ?? "").replace(/\|/g, "/");
push("# 给 Codex 的补图清单：阿里爆品 + 新上产品");
push();
push(`生成：\`node scripts/build-image-fill-list.mjs --write\`（数字每次重跑重取，不要手改）。阿里数据：甲方 2026-09-11 导出；「新上」= ${NEW_SINCE} 以后新建、在 HYDE 站上的产品记录，加阿根廷、巴西两个专栏。`);
push();
push("## Codex 开工前必读（AGENTS.md 硬规则）");
push();
push("- **不生成产品。** 孔位、螺丝、执手轮廓、锁体都必须来自真实照片的像素。允许：抠图、白底/灰底、曝光、拉直、去灰去反光、统一阴影、按 KANEE 风格把真实产品放进生成的背景（产品像素不动）。");
push("- 每张交付图要写清：型号、原图路径、原图哈希、逐张目检结论。对比原图检查孔位和轮廓，「提示词里写了保留」不算证据。");
push("- 照片来源：甲方原图库 **G:/新网站资料**。本机今天没挂载 G 盘，开工前先确认路径。没有原图的型号不要补，在下表里标「缺原图」，交回甲方去拍。");
push("- 现状参照：KANEE 二十张样图内部 QA 已完成，**甲方还没批准任何一张**（tasks/2026-09-28-kanee-real-products.json：clientApprovedImages 0）。先给甲方看五张样，方向通过再批量替换线上图。");
push("- 换图只换文件，文件名和路径保持不变（产品页、srcset、水印清单都按路径引用）；交付后跑水印和 srcset 生成，由工程会话发布。");
push();

const alibabaMapped = alibabaRows.filter((r) => r.product);
push(`## 一、阿里爆品（${ALIBABA.products.length} 个，按询盘、再按曝光排）`);
push();
push("| # | 型号 | 站上文件名 slug | 询盘(90天) | 曝光(30天) | 站上照片 | 主图宽 | 要补什么 |");
push("|---:|---|---|---:|---:|---:|---:|---|");
alibabaMapped.forEach((r, i) => push(`| ${i + 1} | **${cell(r.entry.model)}** | \`${r.product.slug}\` | ${num(r.entry.inquiries90d)} | ${num(r.entry.exposure30d)} | ${r.state.count} | ${r.state.heroWidth ?? "—"} | ${r.state.flags.join("、") || "可做 KANEE 精修/多角度"} |`));
push();
const unmapped = alibabaRows.filter((r) => !r.product);
if (unmapped.length) {
  push(`站上没有对应页面的阿里产品（${unmapped.length} 个）—— 先建页面再谈图，这不是 Codex 的活：`);
  push();
  for (const r of unmapped) push(`- ${cell(r.entry.model) || "（无型号）"}：${cell(r.entry.title).slice(0, 80)}（询盘 ${num(r.entry.inquiries90d)}，曝光 ${num(r.entry.exposure30d)}）`);
  push();
}

push(`## 二、新上产品（${newRows.length} 个，照片最少的排前面）`);
push();
const summary = { none: newRows.filter((r) => r.state.count === 0).length, one: newRows.filter((r) => r.state.count === 1).length, low: newRows.filter((r) => r.state.flags.some((f) => f.includes("偏小"))).length };
push(`无图 ${summary.none} 个；仅 1 张 ${summary.one} 个；主图小于 ${LOW_RES}px ${summary.low} 个。`);
push();
push("| 型号 | 站上文件名 slug | 类目 | 上架 | 照片 | 主图宽 | 要补什么 |");
push("|---|---|---|---|---:|---:|---|");
for (const r of newRows) push(`| ${cell(r.p.model)} | \`${r.p.slug}\` | ${cell(r.p.categoryPath?.[0])} | ${r.day} | ${r.state.count} | ${r.state.heroWidth ?? "—"} | ${r.state.flags.join("、") || "—"} |`);
push();

push("## 三、两个市场专栏（客户授权的 OEM 照片，已去字加 HYDE 水印）");
push();
push("这些图来自下游客户的产品照，每个型号只有 1 张。补图同样只能用真实照片：要么我们工厂自己拍同款，要么在现有照片上精修，**不要换成生成图**。");
push();
for (const c of collections) {
  const thin = c.rows.filter((r) => r.state.count <= 1).length;
  push(`### ${c.name}（${c.rows.length} 款，页面 ${c.page}）`);
  push();
  push(`只有 1 张或没有图：${thin} 款。主图小于 ${LOW_RES}px：${c.rows.filter((r) => r.state.flags.some((f) => f.includes("偏小"))).length} 款。`);
  push();
  push("| 型号 | 照片 | 主图宽 | 备注 |");
  push("|---|---:|---:|---|");
  for (const r of c.rows) push(`| ${cell(r.item.model)} | ${r.state.count} | ${r.state.heroWidth ?? "—"} | ${r.state.flags.filter((f) => f !== "仅 1 张").join("、") || ""} |`);
  push();
}

const doc = `${out.join("\n")}\n`;
if (process.argv.includes("--write")) {
  writeFileSync(OUT, doc);
  console.log(`wrote ${OUT}: alibaba ${alibabaMapped.length}/${ALIBABA.products.length}, new ${newRows.length} (none ${summary.none}, one ${summary.one}, low ${summary.low})`);
} else process.stdout.write(doc);
