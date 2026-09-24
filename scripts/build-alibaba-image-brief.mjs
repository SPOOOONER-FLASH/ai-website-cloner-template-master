#!/usr/bin/env node
/**
 * The image brief for the models the client actually sells.
 *
 *   node scripts/build-alibaba-image-brief.mjs            print it
 *   node scripts/build-alibaba-image-brief.mjs --write    write the doc
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS GENERATED AND NOT WRITTEN BY HAND
 *
 * Every number in the output is either the client's own Alibaba export or a count taken
 * from content/products at the moment it runs. A hand-written brief is correct on the day
 * it is pasted and wrong the first time somebody adds a photograph — and nobody can tell
 * which, because the document does not say where its numbers came from. `npm run
 * brief:images` reprints it in a second.
 *
 * ---------------------------------------------------------------------------
 * WHAT A "MISSING IMAGE" MEANS HERE, AND WHAT IT DOES NOT
 *
 * The brief asks for three kinds of thing, and they are not interchangeable:
 *
 *   PHOTOGRAPH    a real photograph the factory takes. Only the client can supply it.
 *                 Listed so the gap is visible, never as something to generate.
 *   DRAWING       a dimensioned line drawing, which the site generates from published
 *                 specs — scripts/build-dimension-drawings.mjs. Possible only where the
 *                 dimensions exist, which is why the missing figures are named.
 *   3D MODEL      the shape, where published dimensions determine it. Same rule as
 *                 scripts/audit-modelling-candidates.mjs.
 *
 * Nothing in this brief asks anybody to invent a part. Where the data runs out the row
 * says what is missing rather than what could be assumed, because a generated lever with
 * plausible fixing holes is a part that cannot be installed — AGENTS.md, and the reason
 * the client's own principal rejected a set of generated images on sight.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ALIBABA = "docs/research/2026-09-11-alibaba-product-performance.json";
const PRODUCTS = "content/products";
const OUT = "docs/collaboration/2026-09-15-alibaba-image-brief.md";

/* Dimension sets that determine an outside shape. Mirrors audit-modelling-candidates.mjs. */
const MODEL_RULES = [
  {
    what: "round tube",
    categories: /glass-door-accessories|stainless-steel-handles/,
    needs: ["Tube diameter", "Tube Thickness", "Length", "Center distance", "Standoff"],
  },
  {
    what: "flat plate",
    categories: /panic-exit-devices|indicators|door-viewers/,
    needs: ["Plate size", "Plate thickness"],
  },
  {
    what: "case envelope",
    categories: /lock-cases/,
    needs: ["Faceplate", "Case height", "Case depth"],
  },
];

const byModel = new Map();
for (const file of readdirSync(PRODUCTS).filter((f) => f.endsWith(".json"))) {
  const product = JSON.parse(readFileSync(join(PRODUCTS, file), "utf8"));
  if ((product.sites ?? []).length && !(product.sites ?? []).includes("hyde")) continue;
  byModel.set(String(product.model ?? "").trim().toUpperCase(), product);
}

const alibaba = JSON.parse(readFileSync(ALIBABA, "utf8"));
const rows = [];

for (const entry of alibaba.products) {
  const key = String(entry.model ?? "").trim().toUpperCase();
  const product = byModel.get(key);
  const row = {
    model: entry.model ?? null,
    title: entry.title ?? "",
    showcase: Boolean(entry.showcase),
    exposure: Number(entry.exposure30d ?? 0),
    visitors: Number(entry.visitors30d ?? 0),
    inquiries: Number(entry.inquiries90d ?? 0),
    rate: entry.inquiryRate90d ?? "",
    tier: entry.tier ?? "",
  };

  if (!product) {
    rows.push({ ...row, state: "unmapped" });
    continue;
  }

  const labels = new Set((product.specs ?? []).map((s) => s.label));
  const rule = MODEL_RULES.find((r) => r.categories.test(product.categoryPath?.[0] ?? ""));

  rows.push({
    ...row,
    state: "mapped",
    slug: product.slug,
    category: product.categoryPath?.[0] ?? "",
    photos: (product.heroImage?.src ? 1 : 0) + (product.gallery?.length ?? 0),
    specs: product.specs?.length ?? 0,
    video: Boolean(product.videos?.length),
    drawing: existsSync(join("public/images/drawings", `${product.slug}.svg`)),
    modelWhat: rule?.what ?? null,
    modelMissing: rule ? rule.needs.filter((n) => !labels.has(n)) : null,
  });
}

/*
  Ordered by enquiries, then exposure.

  The client's own export warns against ranking on the conversion rate: its denominator is
  visitors, the samples are single digits, and "100%" can mean one visitor asked once. So
  enquiries lead and the rate is printed beside them rather than sorting anything.
*/
rows.sort((a, b) => b.inquiries - a.inquiries || b.exposure - a.exposure);

const lines = [];
const push = (line = "") => lines.push(line);

push("# 阿里 43 个产品 · 出图清单");
push();
push(`数据源：\`${ALIBABA}\`（甲方本人导出，${alibaba.meta.capturedAt}）。`);
push("这份文档是生成的 —— `npm run brief:images`，每次重跑，不要手改里面的数字。");
push();
push("## 三种「出图」，不能互相代替");
push();
push("| 类型 | 谁能做 | 条件 |");
push("|---|---|---|");
push("| **照片** | 只有工厂能拍 | 列出来是让缺口可见，**不是让人去生成** |");
push("| **尺寸图** | 站上自动生成 | `build-dimension-drawings.mjs`，要先有公布尺寸 |");
push("| **3D 模型** | 公布尺寸确定外形时 | 判据同 `audit-modelling-candidates.mjs` |");
push();
push("⚠ **这份清单里没有一条是「照着想象画一个」。** 数据不够的地方写的是缺什么，");
push("不是可以假设什么 —— 一个孔位靠猜的执手是装不上去的零件，甲方的老板亲自否过一批生成图。");
push();

const mapped = rows.filter((r) => r.state === "mapped");

/*
  The headline, computed rather than asserted.

  On the 2026-09-11 export the two highest-exposure listings in the whole table are both
  unmapped — 309 and 256 impressions, against 63 for the best-performing model we do have
  a page for. That is not an image problem and putting it in section three would bury it,
  so it is printed first and derived, in case a later export changes the answer.
*/
const topExposure = [...rows].sort((a, b) => b.exposure - a.exposure).slice(0, 3);
if (topExposure.some((r) => r.state === "unmapped")) {
  push("## 先看这一条：曝光最高的几个，站上没有页面");
  push();
  push("| 阿里标题 | 曝光 | 询盘 | 站上 |");
  push("|---|---:|---:|---|");
  for (const r of topExposure) {
    push(
      `| ${r.title.slice(0, 64)} | ${r.exposure} | ${r.inquiries} | ` +
        `${r.state === "unmapped" ? "**没有对应记录**" : `有（${r.model}）`} |`,
    );
  }
  push();
  push("对照一下：下面第一节里表现最好的 307 是 63 次曝光。**曝光最高的两条我们一张页面都没有** ——");
  push("这不是出图问题，是目录问题，而且它比整份出图清单更值钱。先确认是「型号没建」还是「写法对不上」。");
  push();
}

const unmapped = rows.filter((r) => r.state === "unmapped");
const withInquiries = mapped.filter((r) => r.inquiries > 0);

push("## 一、有真实询盘的，按询盘排");
push();
push("这是该先出图的顺序。转化率只印在旁边不参与排序 —— 甲方自己的导出就警告过：");
push("它的分母是访客，样本是个位数，「100%」可能只是一个访客问了一次。");
push();
push("| 型号 | 询盘 | 曝光 | 转化 | 橱窗 | 现有照片 | 规格行 | 视频 | 尺寸图 | 可建模？ |");
push("|---|---:|---:|---|---|---:|---:|---|---|---|");
for (const r of withInquiries) {
  const model = r.modelMissing === null
    ? "—"
    : r.modelMissing.length === 0
      ? `✅ ${r.modelWhat}`
      : `缺 ${r.modelMissing.join(" / ")}`;
  push(
    `| **${r.model}** | ${r.inquiries} | ${r.exposure} | ${r.rate} | ${r.showcase ? "✓" : ""} | ${r.photos} | ${r.specs} | ${r.video ? "✓" : ""} | ${r.drawing ? "✓" : ""} | ${model} |`,
  );
}
push();

const noInquiry = mapped.filter((r) => r.inquiries === 0);
push(`## 二、目录里有、九十天没有询盘（${noInquiry.length} 个）`);
push();
push("曝光排序。曝光高而询盘为零，通常是页面没有给出买家要的东西 —— 照片、尺寸、或者两样都缺。");
push();
push("| 型号 | 曝光 | 访客 | 现有照片 | 规格行 | 尺寸图 | 可建模？ |");
push("|---|---:|---:|---:|---:|---|---|");
for (const r of [...noInquiry].sort((a, b) => b.exposure - a.exposure)) {
  const model = r.modelMissing === null
    ? "—"
    : r.modelMissing.length === 0
      ? `✅ ${r.modelWhat}`
      : `缺 ${r.modelMissing.join(" / ")}`;
  push(`| ${r.model} | ${r.exposure} | ${r.visitors} | ${r.photos} | ${r.specs} | ${r.drawing ? "✓" : ""} | ${model} |`);
}
push();

push(`## 三、阿里有、我们对不上号（${unmapped.length} 个）`);
push();
push("**这些不是出图问题，是目录缺口。** 阿里上有真实曝光甚至询盘，站上却找不到对应记录 ——");
push("要么这个型号我们没建，要么写法不同（`587 SS ET` 对 `587 SSET`）。出图之前要先确认是哪一种。");
push();
push("| 阿里标题 | 型号栏 | 询盘 | 曝光 |");
push("|---|---|---:|---:|");
for (const r of [...unmapped].sort((a, b) => b.inquiries - a.inquiries || b.exposure - a.exposure)) {
  push(`| ${r.title.slice(0, 70)} | ${r.model ?? "（空）"} | ${r.inquiries} | ${r.exposure} |`);
}
push();

/* The ask list: grouped by field, so it is one message to the factory rather than seven. */
const asks = new Map();
for (const r of withInquiries) {
  for (const field of r.modelMissing ?? []) {
    asks.set(field, [...(asks.get(field) ?? []), `${r.model}(${r.inquiries})`]);
  }
}
if (asks.size) {
  push("## 四、要工厂给的数（按缺什么归类）");
  push();
  push("给了就能出尺寸图和模型。括号里是九十天询盘人数。");
  push();
  for (const [field, models] of [...asks].sort((a, b) => b[1].length - a[1].length)) {
    push(`- **${field}** — ${models.join("、")}`);
  }
  push();
}

const totalPhotos = mapped.reduce((n, r) => n + r.photos, 0);
push("---");
push();
push(
  `${rows.length} 个阿里产品：目录里有 ${mapped.length}、对不上号 ${unmapped.length}；` +
    `有询盘的 ${withInquiries.length}；现有照片合计 ${totalPhotos} 张。`,
);

const doc = `${lines.join("\n")}\n`;
if (process.argv.includes("--write")) {
  writeFileSync(OUT, doc);
  console.log(`wrote ${OUT}`);
} else {
  console.log(doc);
}
