#!/usr/bin/env node
/**
 * Which of our products can actually be shot in the KANEE-style scenes, and in which one.
 *
 *   node scripts/build-scene-shortlist.mjs
 *   node scripts/build-scene-shortlist.mjs --write    write the markdown for Codex
 *
 * ---------------------------------------------------------------------------
 * THE QUESTION
 *
 * The client supplied twenty-odd catalogue spreads and asked for the style to be broken down so
 * Codex can produce the same kind of picture. The style analysis is in
 * docs/collaboration/2026-09-15-catalogue-scene-style.md. This script answers the part of
 * it that cannot be written by hand: WHICH MODELS.
 *
 * ---------------------------------------------------------------------------
 * WHAT MAKES A MODEL SUITABLE, AND WHY IT IS NOT "THE ONES WITH THE MOST ENQUIRIES"
 *
 * Every one of those spreads is built on the same move: two or three units of ONE shape in
 * DIFFERENT FINISHES, arranged so the dark one absorbs and the light one reflects. The
 * picture needs the finishes to exist as separate photographed products. Without that the
 * scene collapses into "one object on a nice background", which is a different and much
 * weaker picture.
 *
 * So the gate is: does this shape exist in two or more finishes, each with its own
 * photograph? Enquiries then order what passes the gate, not the other way round — a
 * model nobody asks about is a poor use of a shoot, but a model with fifty enquiries and
 * one finish cannot be given this treatment at all.
 *
 * The second gate is SIZE. A 1050mm panic bar does not sit on a stone plinth beside a
 * branch; it is architecture, not an object. Those models are excluded with a reason
 * rather than silently, because their enquiry numbers are the highest on the storefront
 * and somebody will otherwise ask why they are missing.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PRODUCTS = "content/products";
const ALIBABA = "docs/research/2026-09-11-alibaba-product-performance.json";
const OUT = "docs/collaboration/2026-09-15-scene-shortlist.md";

/**
 * Categories that hold an object small enough for a still life.
 *
 * Panic exit devices and door closers are deliberately absent: a 1050mm push bar or a
 * closer with its arm extended is a piece of architecture. It needs a door, not a plinth.
 */
const STILL_LIFE = new Set([
  "lever-handles",
  "knob-locks",
  "lock-cylinders",
  "deadbolts",
  "brass-steel-hinges",
  "bathroom-accessories",
  "night-latches-rim-locks",
  "glass-door-accessories",
  "stainless-steel-handles",
  "grip-handle-sets",
  "sliding-hook-locks",
]);

/** Too long or too architectural for a table-top scene; needs a door. */
const NEEDS_A_DOOR = new Set(["panic-exit-devices", "door-closers", "lock-cases"]);

const published = [];
for (const file of readdirSync(PRODUCTS).filter((f) => f.endsWith(".json"))) {
  const product = JSON.parse(readFileSync(join(PRODUCTS, file), "utf8"));
  if ((product.sites ?? []).length && !(product.sites ?? []).includes("hyde")) continue;
  if (!product.heroImage?.src) continue;
  published.push(product);
}

/*
  Group by shape.

  The model number's leading letters+digits are the shape; what follows is the finish —
  `607 SSET` and `607 PBBK` are one lever in two finishes. This is the same reading the
  order-code page documents, so it is not a guess about naming: it is the naming.
*/
const shapes = new Map();
for (const product of published) {
  const model = String(product.model ?? "").trim();
  const stem = (model.match(/^([A-Za-z]*\d+)/) ?? [])[1];
  if (!stem) continue;
  const list = shapes.get(stem) ?? [];
  list.push(product);
  shapes.set(stem, list);
}

const alibaba = JSON.parse(readFileSync(ALIBABA, "utf8")).products;
const enquiriesByStem = new Map();
for (const entry of alibaba) {
  const stem = (String(entry.model ?? "").trim().match(/^([A-Za-z]*\d+)/) ?? [])[1];
  if (!stem) continue;
  enquiriesByStem.set(
    stem,
    (enquiriesByStem.get(stem) ?? 0) + Number(entry.inquiries90d ?? 0),
  );
}
const exposureByStem = new Map();
for (const entry of alibaba) {
  const stem = (String(entry.model ?? "").trim().match(/^([A-Za-z]*\d+)/) ?? [])[1];
  if (!stem) continue;
  exposureByStem.set(stem, (exposureByStem.get(stem) ?? 0) + Number(entry.exposure30d ?? 0));
}

const candidates = [];
const excluded = [];

for (const [stem, group] of shapes) {
  const category = group[0].categoryPath?.[0] ?? "";
  const finishes = group.length;
  const photos = group.reduce((n, p) => n + 1 + (p.gallery?.length ?? 0), 0);
  const enquiries = enquiriesByStem.get(stem) ?? 0;
  const exposure = exposureByStem.get(stem) ?? 0;

  if (finishes < 2) continue;

  if (NEEDS_A_DOOR.has(category)) {
    if (enquiries > 0 || exposure > 0) {
      excluded.push({ stem, category, finishes, enquiries, exposure });
    }
    continue;
  }
  if (!STILL_LIFE.has(category)) continue;

  candidates.push({ stem, category, finishes, photos, enquiries, exposure, models: group.map((p) => p.model) });
}

candidates.sort(
  (a, b) => b.enquiries - a.enquiries || b.exposure - a.exposure || b.finishes - a.finishes,
);

/**
 * Which ground / prop / palette combination suits a category.
 *
 * Named from the kit of parts in 2026-09-15-catalogue-scene-style.md rather than from a
 * numbered scene list: the reference spreads are not twenty set-ups, they are three
 * layers with interchangeable parts, and a category's constraint is usually about ONE of
 * those layers (a long handle needs something to lean on; a small cylinder needs a soft
 * ground so it does not look lost).
 *
 * Judgement, written down so it can be argued with.
 */
function scenesFor(category) {
  switch (category) {
    case "lever-handles":
    case "knob-locks":
      return "石板 / 木框 · 冷灰或暗场";
    case "lock-cylinders":
    case "deadbolts":
      return "皮革 / 布 · 暖裸（小件散置）";
    case "brass-steel-hinges":
    case "sliding-hook-locks":
      return "原木 / 混凝土 · 冷灰";
    case "bathroom-accessories":
      return "罗纹板 / 陶器 · 暖裸";
    case "stainless-steel-handles":
    case "glass-door-accessories":
      return "石板 / 罗纹板 · 冷灰（长件斜倚）";
    case "grip-handle-sets":
    case "night-latches-rim-locks":
      return "木框 / 原木 · 冷灰";
    default:
      return "石板 · 冷灰";
  }
}

const lines = [];
const push = (l = "") => lines.push(l);

push("# 适合拍这种场景的产品 — 选品清单");
push();
push("生成的：`npm run brief:scenes`。配套 `2026-09-15-catalogue-scene-style.md`（零件表与布光配方）。");
push();
push("## 判据");
push();
push("甲方给的二十多个跨页全都建立在同一个动作上：**同一个形状、两个以上表面、放在一起**。");
push("没有这个，画面就塌回成「一个物件放在好看的背景上」——那是另一种、而且弱得多的图。");
push();
push("所以门槛是：**这个形状有没有两个以上表面，而且每个表面都有自己的照片。**");
push("询盘只用来排序通过门槛的，不能反过来 —— 五十个询盘但只有一个表面的型号，");
push("根本做不了这种图。");
push();
push("第二道门槛是**尺寸**。1050mm 的推杠不会摆在石板上跟树枝合影，它是建筑不是物件。");
push();
push(`## 一、可以拍（${candidates.length} 个形状组）`);
push();
push("| 形状 | 类目 | 表面数 | 现有照片 | 询盘 | 曝光 | 建议场景 |");
push("|---|---|---:|---:|---:|---:|---|");
for (const c of candidates.slice(0, 30)) {
  push(
    `| **${c.stem}** | ${c.category} | ${c.finishes} | ${c.photos} | ${c.enquiries || ""} | ${c.exposure || ""} | ${scenesFor(c.category)} |`,
  );
}
if (candidates.length > 30) push(`\n… 另有 ${candidates.length - 30} 个形状组，见脚本输出。`);
push();

push("## 二、不要用这几个（尺寸不对，不是不重要）");
push();
push("**它们的询盘是全店最高的，所以特别要说明为什么不在上面。**");
push("逃生器械和闭门器要的是装在门上的实景，那得工厂拍，不是台面合成。");
push();
push("| 形状 | 类目 | 表面数 | 询盘 | 曝光 |");
push("|---|---|---:|---:|---:|");
for (const e of excluded.sort((a, b) => b.enquiries - a.enquiries || b.exposure - a.exposure)) {
  push(`| ${e.stem} | ${e.category} | ${e.finishes} | ${e.enquiries || ""} | ${e.exposure || ""} |`);
}
push();

const byCat = new Map();
for (const c of candidates) byCat.set(c.category, (byCat.get(c.category) ?? 0) + 1);
push("## 三、按类目看有多少可用");
push();
for (const [cat, n] of [...byCat].sort((a, b) => b[1] - a[1])) {
  push(`- ${cat} — ${n} 个形状组`);
}
push();
push("---");
push();
push(
  `全目录 ${published.length} 个已发布型号，归成 ${shapes.size} 个形状；` +
    `其中 ${candidates.length} 个形状有两个以上表面且尺寸适合台面场景。`,
);

const doc = `${lines.join("\n")}\n`;
if (process.argv.includes("--write")) {
  writeFileSync(OUT, doc);
  console.log(`wrote ${OUT} — ${candidates.length} shapes, ${excluded.length} excluded`);
} else {
  console.log(doc);
}
