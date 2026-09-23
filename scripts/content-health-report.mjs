#!/usr/bin/env node
/**
 * 内容健康度报告 —— 原先是网站上的 /status/ 页面，2026-09-23 起改成本地命令。
 *
 *   npm run status
 *
 * 为什么从网站上撤下来：
 *
 * 1. 甲方 2026-09-23：「官网永远不要显示中文的任何东西，你可以做镜像或者留存数据」。
 *    那一页整页是中文。
 * 2. 更要紧的是它把内部判断印在了公开域名上：哪几款型号有我们自己的检测报告、
 *    地弹簧那份 EN 1154 报告的申请人是别家、哪些案例只是「代表性应用」。
 *    它有 noindex，但任何人输入网址都能打开。noindex 挡的是搜索引擎，不是人。
 *
 * 数字和原页面完全同源（src/lib/content-health.ts），所以这里不重新计算任何东西，
 * 只是换了一个只在本机显示的出口。
 */
import { createJiti } from "jiti";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("../src", import.meta.url));
const jiti = createJiti(import.meta.url, { alias: { "@": src } });
const { buildHealthReport, categoryBreakdown } = await jiti.import("../src/lib/content-health.ts");

const MARK = { good: "✓", warn: "!", bad: "✗" };

for (const section of buildHealthReport()) {
  console.log(`\n== ${section.title}`);
  console.log(`   ${section.description}`);
  for (const m of section.metrics) {
    const figure = m.total != null ? `${m.value} / ${m.total}` : String(m.value);
    console.log(`  ${MARK[m.tone] ?? " "} ${m.label.padEnd(24)} ${figure}`);
    if (m.action) console.log(`      ${m.action}`);
  }
}

console.log("\n== 各分类产品数");
for (const row of categoryBreakdown()) {
  const cells = Object.values(row).map(String);
  console.log(`   ${cells.join("  ")}`);
}
