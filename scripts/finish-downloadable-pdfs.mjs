#!/usr/bin/env node
/**
 * 给 public/downloads 里那些**不是我们生成的** PDF 设置阅读器版式。
 *
 * 甲方 2026-09-21 要的是 MIWA 那种双页阅读体验。他们买的是日本的一套 SaaS
 * （jscatalogview / iCata，见 docs/collaboration 的分析）。双页这一件本身
 * 是 PDF 自己的查看器首选项，两个字典项就够，不需要订阅，也不需要一个爬虫
 * 读不到任何文字的 canvas 播放器。
 *
 *   /PageLayout /TwoPageRight   跨页阅读，封面单独成页
 *   /PageMode   /UseOutlines    打开就展开书签面板
 *
 * TwoPageRight 而不是 TwoPageLeft：这几本都是单张封面，从右侧配对才能让每一个
 * 跨页保持设计者排的样子（奇数页在右、偶数页在左），否则整本平移一页，封面会
 * 和目录页配成一对。
 *
 * ⚠ 这个脚本**不添加文本层，也不会去猜页面上印着什么**。
 * canton-hyland 与 rayen 两本是图片扫描件（没有 /Font），要让它们可搜索只能
 * 做 OCR，而 OCR 的错字会变成买家搜不到或搜错的型号。HYDE 的导出目录
 * (hyde-export-catalogue-2026.pdf) 本来就是从 content/products 生成的、
 * 每个字都是真文本，书签和版式由 scripts/build_catalogue.py 自己产出。
 *
 * 用法: node scripts/finish-downloadable-pdfs.mjs [--check]
 */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "public/downloads";
const CHECK = process.argv.includes("--check");

// build_catalogue.py 自己设置版式与书签，这里不要再动它。
const GENERATED = new Set(["hyde-export-catalogue-2026.pdf"]);

const targets = readdirSync(DIR)
  .filter((f) => f.endsWith(".pdf") && !GENERATED.has(f))
  .sort();

if (!targets.length) {
  console.log("public/downloads 里没有需要处理的 PDF。");
  process.exit(0);
}

const py = `
import sys, pymupdf
paths = sys.argv[1:]
check = ${CHECK ? "True" : "False"}
stale = []
for p in paths:
    d = pymupdf.open(p)
    layout = d.pagelayout
    mode = d.pagemode
    toc = len(d.get_toc())
    has_text = any(d[i].get_text().strip() for i in range(min(d.page_count, 8)))
    ok = layout == "TwoPageRight" and mode == "UseOutlines"
    print(f"{p}|{d.page_count}|{layout}|{mode}|{toc}|{'text' if has_text else 'image-only'}|{'ok' if ok else 'stale'}")
    if not ok:
        if check:
            stale.append(p)
        else:
            d.set_pagelayout("TwoPageRight")
            d.set_pagemode("UseOutlines")
            d.saveIncr()
    d.close()
sys.exit(1 if stale else 0)
`;

let out = "";
let failed = false;
try {
  out = execFileSync("py", ["-c", py, ...targets.map((f) => join(DIR, f))], {
    encoding: "utf8",
  });
} catch (error) {
  out = error.stdout ?? "";
  failed = true;
}

const rows = out.trim().split(/\r?\n/).filter(Boolean);
console.log("文件".padEnd(42), "页数".padEnd(6), "版式".padEnd(14), "面板".padEnd(12), "书签", "文本层");
for (const row of rows) {
  const [path, pages, layout, mode, toc, text, state] = row.split("|");
  const name = path.split(/[\\/]/).pop();
  console.log(
    name.padEnd(42),
    String(pages).padEnd(6),
    String(layout).padEnd(14),
    String(mode).padEnd(12),
    String(toc).padEnd(4),
    text,
    state === "ok" ? "" : CHECK ? "  ← 待处理" : "  ← 已写入",
  );
}

const imageOnly = rows.filter((r) => r.includes("|image-only|")).map((r) => r.split("|")[0]);
if (imageOnly.length) {
  console.log(
    `\n⚠ ${imageOnly.length} 本没有文本层（是扫描图片），本脚本不会替它们编造文字。` +
      `\n  要可搜索只能 OCR，而 OCR 的错字会让买家搜不到或搜错型号 —— 那是一个决定，不是一个脚本。`,
  );
}

if (CHECK && failed) {
  console.error("\n有 PDF 的阅读器版式未设置。运行: node scripts/finish-downloadable-pdfs.mjs");
  process.exit(1);
}
