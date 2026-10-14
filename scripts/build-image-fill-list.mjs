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
push("- **规矩（2026-10-13 甲方更新）见 `docs/collaboration/tasks/2026-10-13-codex-scene-compositing.md`：** 可以用实拍产品图合成场景图、安装效果图，**产品本身也可以渲染**（3D 或 AI 重渲染），但要以该型号在网站上的全部实拍图和公布尺寸为依据，并且逐张和实拍图对照：孔位、螺丝、轮廓、比例、零件数都对上才能交。照片里看不到的部分不能补画。场景、搭配、安装位置、朝向、比例要符合五金常识。");
push("- 每张交付图要写清：型号、slug、用的哪张原图（路径 + 哈希）、场景说明、逐张目检结论（对照原图检查孔位轮廓，再检查安装逻辑）。");
push("- **取图位置：网站自己的产品图库** `public/images/products/<slug>[-N].webp`（干净无水印，后台 /admin/ 的媒体目录）；型号对应哪几张看 `content/products/<slug>.json` 的 heroImage / gallery。不要用加了水印的 products-hyde 做合成源，也不再用 G 盘。");
push("- 先给甲方看 5 张样图（每个型号建议 1 张 KANEE 式氛围图 + 1 张安装效果图），方向定了再批量做。KANEE 图册：桌面 hyde/03-研究与方案/KANEE凯理五金2025产品图册.pdf，只学版式和光影。");
push("- 新图作为新增角度加入图库（例如 `<slug>-scene-1.webp`），不覆盖已有实拍白底图；交付后跑水印和 srcset，发布交给工程会话。");
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
