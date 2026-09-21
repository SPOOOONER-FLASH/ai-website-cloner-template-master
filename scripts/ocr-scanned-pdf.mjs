#!/usr/bin/env node
/**
 * 给扫描件 PDF 加一层**看不见的**文本层，让它可搜索。
 *
 * ---------------------------------------------------------------------------
 * 最重要的一条设计约束：OCR 绝不改变买家看到的东西
 *
 * OCR 会认错字。在这个行业里认错一个字符不是排版瑕疵 —— `LC08` 认成 `LCO8`、
 * `45/50` 认成 `4550`，买家据此下的是错的单。所以这里做的是**隐形文本层**：
 * 页面上那张图一个像素都不动，OCR 出来的文字以不可见的方式叠在它上面，只供
 * 搜索和复制。读者永远读的是原图上的字，机器读的是 OCR 的字。
 *
 * 认错的代价因此从"买家订错货"降到"某个词搜不到"。前者是一整批货，后者是一次
 * 失败的搜索 —— 这是可以接受的交换，而"把 OCR 结果印在页面上"不是。
 *
 * ---------------------------------------------------------------------------
 * 为什么用 tesseract.js 而不是装 Tesseract
 *
 * tesseract.js 是 WASM，作为 devDependency 装进 node_modules，不需要管理员
 * 权限、不改系统 PATH、不留全局配置。慢一些（每页几秒），但这是一次性的批处理，
 * 而且脚本是增量的：产物比源文件新就跳过。
 *
 * ---------------------------------------------------------------------------
 * 它不做什么
 *
 * 不重排、不压缩、不改页数、不动书签、不动已有的真文本 PDF。
 * 已经有 /Font 的文件直接跳过 —— hyde-export-catalogue-2026.pdf 是从
 * content/products 生成的，每个字都是真的，对它做 OCR 只会把真文本换成猜的。
 *
 * 用法:
 *   node scripts/ocr-scanned-pdf.mjs <pdf> [--lang eng] [--dpi 200] [--out <pdf>]
 *   node scripts/ocr-scanned-pdf.mjs --all            处理 public/downloads 下所有扫描件
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { createWorker } from "tesseract.js";

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? (args[i + 1] ?? fallback) : fallback;
};

const LANG = flag("lang", "eng");
const DPI = Number(flag("dpi", "200"));
const DOWNLOADS = "public/downloads";
const WORK = "tmp/claude-ocr";

/** Files whose text is generated, not scanned. Never OCR these. */
const GENERATED = new Set(["hyde-export-catalogue-2026.pdf"]);

function hasTextLayer(file) {
  const out = execFileSync(
    "py",
    [
      "-c",
      `import sys,pymupdf
d=pymupdf.open(sys.argv[1])
n=sum(1 for i in range(min(d.page_count,8)) if d[i].get_text().strip())
print(n)`,
      file,
    ],
    { encoding: "utf8" },
  );
  return Number(out.trim()) > 0;
}

function targets() {
  const explicit = args.filter((a) => a.endsWith(".pdf"));
  if (explicit.length) return explicit;
  if (!args.includes("--all")) return [];
  return readdirSync(DOWNLOADS)
    .filter((f) => f.endsWith(".pdf") && !GENERATED.has(f))
    .map((f) => join(DOWNLOADS, f));
}

const files = targets();
if (!files.length) {
  console.error("用法: node scripts/ocr-scanned-pdf.mjs <pdf> | --all  [--lang eng|chi_sim] [--dpi 200]");
  process.exit(1);
}

mkdirSync(WORK, { recursive: true });

for (const file of files) {
  if (!existsSync(file)) {
    console.error(`x 找不到 ${file}`);
    process.exitCode = 1;
    continue;
  }
  if (hasTextLayer(file)) {
    console.log(`跳过 ${file} —— 已经有真文本层，OCR 只会把真的换成猜的`);
    continue;
  }

  const stem = file.split(/[\\/]/).pop().replace(/\.pdf$/, "");
  const pageDir = join(WORK, stem);
  rmSync(pageDir, { recursive: true, force: true });
  mkdirSync(pageDir, { recursive: true });

  // 1. 渲染每一页为 PNG（只给 OCR 看，不进产物）
  console.log(`[${stem}] 渲染 ${DPI}dpi …`);
  execFileSync(
    "py",
    [
      "-c",
      `import sys,pymupdf
src,out,dpi=sys.argv[1],sys.argv[2],int(sys.argv[3])
d=pymupdf.open(src)
for i in range(d.page_count):
    d[i].get_pixmap(dpi=dpi).save(f"{out}/{i:04d}.png")
print(d.page_count)`,
      file,
      pageDir,
      String(DPI),
    ],
    { stdio: "inherit" },
  );

  // 2. OCR，产出每页的词框 JSON
  const pages = readdirSync(pageDir).filter((f) => f.endsWith(".png")).sort();
  const worker = await createWorker(LANG);
  const perPage = [];
  let words = 0;
  let lowConfidence = 0;

  for (const [i, png] of pages.entries()) {
    const { data } = await worker.recognize(join(pageDir, png), {}, { blocks: true });
    const blocks = data.blocks ?? [];
    const flat = [];
    for (const block of blocks)
      for (const para of block.paragraphs ?? [])
        for (const line of para.lines ?? [])
          for (const w of line.words ?? []) {
            if (!w.text?.trim()) continue;
            flat.push({ t: w.text, b: w.bbox, c: w.confidence });
            words += 1;
            if (w.confidence < 70) lowConfidence += 1;
          }
    perPage.push(flat);
    if ((i + 1) % 10 === 0 || i === pages.length - 1)
      console.log(`  OCR ${i + 1}/${pages.length}`);
  }
  await worker.terminate();

  const jsonPath = join(WORK, `${stem}.words.json`);
  const { writeFileSync } = await import("node:fs");
  writeFileSync(jsonPath, JSON.stringify({ dpi: DPI, pages: perPage }));

  // 3. 把词框写回 PDF，render_mode=3（不可见）
  const out = flag("out", file);
  console.log(`[${stem}] 写入隐形文本层 → ${out}`);
  execFileSync(
    "py",
    [
      "-c",
      `import sys,json,pymupdf
src,words_json,out=sys.argv[1],sys.argv[2],sys.argv[3]
payload=json.load(open(words_json,encoding="utf8"))
scale=72.0/payload["dpi"]
d=pymupdf.open(src)
placed=0
for i,page_words in enumerate(payload["pages"]):
    if i>=d.page_count: break
    page=d[i]
    for w in page_words:
        x0,y0,x1,y1=[v*scale for v in (w["b"]["x0"],w["b"]["y0"],w["b"]["x1"],w["b"]["y1"])]
        h=y1-y0
        if h<=1: continue
        # render_mode=3 -> 既不描边也不填充：文字在那里，但看不见。
        page.insert_text((x0,y1-h*0.18), w["t"], fontsize=h*0.82,
                         fontname="helv", render_mode=3)
        placed+=1
d.save(out, incremental=(out==src), encryption=pymupdf.PDF_ENCRYPT_KEEP) if out==src else d.save(out, garbage=4, deflate=True)
print(placed)`,
      file,
      jsonPath,
      out,
    ],
    { stdio: "inherit" },
  );

  const pct = words ? ((lowConfidence / words) * 100).toFixed(1) : "0.0";
  console.log(
    `[${stem}] 完成：${pages.length} 页、${words} 个词，其中置信度 <70 的 ${lowConfidence} 个（${pct}%）`,
  );
  console.log(
    `  ⚠ 这一层是不可见的：页面上显示的仍然是原图。OCR 认错只会造成"搜不到"，不会造成"读到错的数字"。`,
  );
}
