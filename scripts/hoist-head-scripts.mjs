#!/usr/bin/env node
/**
 * 把 GTM 的加载器从 <body> 提到 </head> 之前。
 *
 * 为什么需要这一步 —— 三次失败，三个不同的原因，这是第三个：
 *
 *   1. 2026-09-20  next/script 的 afterInteractive 在 hydration 之后才由客户端注入，
 *                  加载器根本不在服务器发出的 HTML 里。改成真的内联 <script> 解决。
 *   2. 2026-09-21  甲方测的是 https://www.cantonlock.com，www 是 301 到裸域的，
 *                  而 GTM 的检测器不跟 301，拿到一个空的跳转响应。
 *   3. 2026-09-21  内联之后它在 <body> 里 —— out/index.html 中 </head> 在第 5,711 字节，
 *                  stub 在第 89,539 字节，页脚之后。Google 的检测器按它自己的说明书
 *                  在 head 区域里找，找不到就报未安装。
 *
 * 标签本身一直是好的：GTM 从第 1 步修完就在收数据了。坏的只是「装没装」这个判定。
 *
 * 为什么用构建后处理而不是 next/script 的 beforeInteractive：App Router 里组件渲染在
 * body，没有可以直接写入的 <head> 元素，而 beforeInteractive 要求写在 app/layout.tsx
 * 本身、且对内联脚本的行为在不同版本间变过。静态导出是一堆 HTML 文件，一次确定性的
 * 字符串搬运覆盖全部 2,082 个页面，可以逐个 grep 验证 —— 这比赌框架的行为可靠。
 *
 * 容器 ID 仍然只有一个出处：src/data/site.ts。这里不认识任何 ID，只搬运已经渲染好的
 * 那一段。渲染不出来它就什么都不做。
 *
 * 用法: node scripts/hoist-head-scripts.mjs [--check]
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["out", "out-rayen"];
const CHECK = process.argv.includes("--check");

/** The rendered GTM stub, whatever container ID it carries. */
const GTM_RE =
  /<script>\(function\(w,d,s,l,i\)\{w\[l\]=w\[l\]\|\|\[\];w\[l\]\.push\(\{'gtm\.start'[\s\S]*?\}\)\(window,document,'script','dataLayer','[^']+'\);<\/script>/;

function* htmlFiles(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    // _next holds hashed build assets, never documents worth rewriting.
    if (entry === "_next") continue;
    const st = statSync(full);
    if (st.isDirectory()) yield* htmlFiles(full);
    else if (entry.endsWith(".html")) yield full;
  }
}

let scanned = 0;
let hoisted = 0;
let alreadyInHead = 0;
const stale = [];

for (const root of ROOTS) {
  for (const file of htmlFiles(root)) {
    scanned += 1;
    const html = readFileSync(file, "utf8");

    const match = GTM_RE.exec(html);
    if (!match) continue; // no container on this page — the Rayen tree, for instance

    const headEnd = html.indexOf("</head>");
    if (headEnd < 0) continue;

    if (match.index < headEnd) {
      alreadyInHead += 1;
      continue;
    }

    if (CHECK) {
      stale.push(file);
      continue;
    }

    const stub = match[0];
    const without = html.slice(0, match.index) + html.slice(match.index + stub.length);
    // Recompute: removing the stub from the body never moves </head>, which is earlier,
    // but reading it again costs nothing and survives someone reordering this file.
    const at = without.indexOf("</head>");
    writeFileSync(file, without.slice(0, at) + stub + without.slice(at));
    hoisted += 1;
  }
}

if (CHECK) {
  if (stale.length) {
    console.error(
      `${stale.length} 个页面的 GTM 加载器还在 <body> 里 —— Google 的检测器在 head 里找不到它。`,
    );
    for (const f of stale.slice(0, 5)) console.error(`  ${f}`);
    console.error("  运行: node scripts/hoist-head-scripts.mjs");
    process.exit(1);
  }
  console.log(`GTM 加载器全部在 <head> 里（${alreadyInHead} 个页面，扫描 ${scanned} 个）。`);
} else {
  console.log(
    `GTM 加载器提升到 <head>：改写 ${hoisted} 个页面，${alreadyInHead} 个本来就在里面，扫描 ${scanned} 个 HTML。`,
  );
}
