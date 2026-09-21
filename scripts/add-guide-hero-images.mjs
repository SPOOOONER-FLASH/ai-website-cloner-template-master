#!/usr/bin/env node
/**
 * 给缺 heroImage 的 guide 补一张中性封面。
 *
 * 为什么需要这个脚本：`src/data/guides.ts` 里 `applyImageAltOverride(article.heroImage)`
 * 和 Codex 的 `GuideCover` 都直接读 `heroImage.src`，缺字段会在草稿过滤之前就抛错，
 * 整个构建停在那里。见 docs/collaboration/agent-updates/2026-09-21-codex-article-rendering-contract.md。
 *
 * 为什么用这张图：`/images/editorial/guides-reference-desk-*.webp` 的 provenance 写明
 * “Generated empty architectural reference desk; contains no hardware.” —— 里面没有任何产品。
 * 这是唯一能安全用作通用封面的生成图：AGENTS.md 禁止生成想象出来的五金件，
 * 但不禁止一张空桌面背景。标签如实说它是什么，不暗示它展示了任何产品。
 *
 * 已经有 heroImage 的文章不动 —— 那些是真实产品照片，优先级高于这张通用封面。
 *
 * 幂等：重复运行不会改变任何东西。`--check` 只报告、不写入，供 CI 使用。
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/guides";
const HERO = {
  src: "/images/editorial/guides-reference-desk-1600.webp",
  ratio: "16 / 10",
  label: "Reference desk — an empty drawing surface; this article's figures are in the tables below",
  labelEs:
    "Mesa de consulta — una superficie de dibujo vacía; las cifras de este artículo están en las tablas",
  labelPt:
    "Mesa de consulta — uma superfície de desenho vazia; os números deste artigo estão nas tabelas",
};

const check = process.argv.includes("--check");
const touched = [];

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const path = join(DIR, file);
  const raw = readFileSync(path, "utf8");
  const article = JSON.parse(raw);
  if (article.heroImage) continue;

  // 插在 publishedAt 之后、author 之前，让文件顺序和已有文章一致。
  const next = {};
  for (const [key, value] of Object.entries(article)) {
    next[key] = value;
    if (key === "author") next.heroImage = HERO;
  }
  if (!next.heroImage) next.heroImage = HERO;

  touched.push(file);
  if (!check) writeFileSync(path, `${JSON.stringify(next, null, 2)}\n`);
}

/**
 * 第二道检查：src 指向的文件必须真的在 public/ 下。
 *
 * 这条是被一个真实错误换来的 —— 我给 door-closer-power-size-2026 写了
 * `/images/products-hyde/ju-088-door-closer-16x9.webp`，那个 `-16x9` 后缀是我按
 * 命名习惯推出来的，磁盘上根本没有这个文件。真图是 `ju-088-door-closer.webp`，
 * 1000×1000 的方图，连 16/9 这个比例也是错的。静态导出不会因为图 404 而构建失败，
 * 所以这种错误会一路走到线上，表现为文章顶部一个空洞。
 */
const missing = [];
for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const article = JSON.parse(readFileSync(join(DIR, file), "utf8"));
  const src = article.heroImage?.src;
  if (src && !existsSync(join("public", src))) missing.push(`${file} → ${src}`);
}

if (check && (touched.length || missing.length)) {
  if (touched.length) {
    console.error(`guide-hero: ${touched.length} 篇缺 heroImage，构建会在 applyImageAltOverride 抛错：`);
    for (const file of touched) console.error(`  ${file}`);
  }
  if (missing.length) {
    console.error(`guide-hero: ${missing.length} 张 heroImage 在磁盘上不存在：`);
    for (const row of missing) console.error(`  ${row}`);
  }
  process.exit(1);
}

if (missing.length) {
  console.error(`guide-hero: ⚠ ${missing.length} 张 heroImage 在磁盘上不存在：`);
  for (const row of missing) console.error(`  ${row}`);
  process.exitCode = 1;
}

console.log(
  touched.length
    ? `guide-hero: 补了 ${touched.length} 篇 — ${touched.join(", ")}`
    : "guide-hero: 每篇都有 heroImage",
);
