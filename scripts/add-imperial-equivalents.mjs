#!/usr/bin/env node
/**
 * 给英文文章里的公制尺寸补上英制等值：`1110mm` → `1110mm (43-11/16")`。
 *
 * ---------------------------------------------------------------------------
 * 为什么
 *
 * 2026-09-21 读了四个对手之后实测的数字：
 *
 *   exit-device-push-bar-length                     mm  46 | inch 0
 *   mortise-lock-backset-and-centre-distance-guide  mm 116 | inch 0
 *
 * 全站技术文章一个英寸都没有。而我们输掉的机会簇，榜上是 usglassmag、
 * allegion、usmadesupply、fairfaxcounty.gov —— 全是美国站，全用英寸。
 * doorwaysplus 对同一个问题答的是 "24 to 48 inches"、"4-1/2 inches"。
 *
 * 一个用英寸提问的买家，够不到一篇只有毫米的文章。
 *
 * ---------------------------------------------------------------------------
 * 三条约束，每一条都有理由
 *
 * 1. 只动英文（body / summary）。西语和葡语市场用公制，给他们补英寸是噪音。
 *    补英寸的理由是北美语境的问题，而那些问题是用英文问的。
 *
 * 2. 每篇文章每个不同数值只换算第一次。backset 那篇有 116 处毫米，
 *    全部加括号会把文章变成一张换算表。读者（和引擎）需要的是这个映射
 *    出现过，不是出现 116 次。
 *
 * 3. 不碰标题与 SEO 描述。标题有长度预算，而《650 to 1110mm: Which Push Bar
 *    Length Your Door Takes》已经是好标题。
 *
 * ---------------------------------------------------------------------------
 * 它绝不做的事
 *
 * ⚠ 不添加任何"离地 41 英寸"这类安装高度。那是北美规范要求，不是我们的产品
 * 尺寸，我们没有核实过。doorwaysplus 敢写是因为他们是北美分销商，天天照着
 * ICC A117.1 报价。这个脚本只做单位换算 —— **算术，不是新事实**。
 *
 * 换算到最接近的 1/16 英寸，因为那是美国五金规格书用的精度。
 *
 * 用法: node scripts/add-imperial-equivalents.mjs [--check] [--dry]
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const DIR = "content/news";
const CHECK = process.argv.includes("--check");
const DRY = process.argv.includes("--dry");

/** Nearest 1/16", rendered the way a US hardware schedule writes it. */
export function mmToImperial(mm) {
  const inches = mm / 25.4;
  const sixteenths = Math.round(inches * 16);
  if (sixteenths === 0) return null;
  const whole = Math.floor(sixteenths / 16);
  let num = sixteenths % 16;
  let den = 16;
  while (num % 2 === 0 && num > 0) {
    num /= 2;
    den /= 2;
  }
  if (num === 0) return `${whole}"`;
  return whole === 0 ? `${num}/${den}"` : `${whole}-${num}/${den}"`;
}

/**
 * `650 to 1110mm` and `650-1110mm` become one bracket covering the range, not two.
 * A range is a single fact and splitting it reads as two unrelated numbers.
 */
const RANGE = /(\d+(?:\.\d+)?)\s*(?:to|–|—|-)\s*(\d+(?:\.\d+)?)\s?mm(?!\s*\()/g;
const SINGLE = /(?<![\d.\-–—/])(\d+(?:\.\d+)?)\s?mm(?!\s*\()/g;

let filesTouched = 0;
let inserted = 0;
const stale = [];

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const path = `${DIR}/${file}`;
  const raw = readFileSync(path, "utf8");
  const article = JSON.parse(raw);

  /** Values already converted in THIS article, so each one is bracketed once. */
  const seen = new Set();
  let localInserted = 0;

  const convert = (text) => {
    if (typeof text !== "string") return text;

    let out = text.replace(RANGE, (match, a, b) => {
      const key = `${a}-${b}`;
      if (seen.has(key)) return match;
      const lo = mmToImperial(Number(a));
      const hi = mmToImperial(Number(b));
      if (!lo || !hi) return match;
      seen.add(key);
      seen.add(a);
      seen.add(b);
      localInserted += 1;
      return `${match} (${lo} to ${hi})`;
    });

    out = out.replace(SINGLE, (match, value) => {
      if (seen.has(value)) return match;
      const imp = mmToImperial(Number(value));
      if (!imp) return match;
      seen.add(value);
      localInserted += 1;
      return `${match} (${imp})`;
    });

    return out;
  };

  // English prose only. bodyEs / bodyPt are metric markets; title and SEO fields
  // have a length budget and are already good.
  if (typeof article.summary === "string") article.summary = convert(article.summary);
  if (Array.isArray(article.body)) article.body = article.body.map(convert);
  else if (typeof article.body === "string") article.body = convert(article.body);
  if (Array.isArray(article.faq)) {
    article.faq = article.faq.map((entry) =>
      entry && typeof entry === "object"
        ? { ...entry, answer: convert(entry.answer) }
        : entry,
    );
  }

  if (!localInserted) continue;

  filesTouched += 1;
  inserted += localInserted;

  if (CHECK) {
    stale.push(`${file} (${localInserted} 处待补)`);
    continue;
  }
  if (DRY) {
    console.log(`  ${file.padEnd(52)} ${localInserted} 处`);
    continue;
  }
  writeFileSync(path, `${JSON.stringify(article, null, 2)}\n`);
  console.log(`  ${file.padEnd(52)} ${localInserted} 处`);
}

if (CHECK) {
  if (stale.length) {
    console.error(`${stale.length} 篇文章的公制尺寸还没有英制等值：`);
    for (const s of stale.slice(0, 8)) console.error(`  ${s}`);
    console.error("  运行: node scripts/add-imperial-equivalents.mjs");
    process.exit(1);
  }
  console.log("英文文章里每个公制尺寸都有英制等值。");
} else {
  console.log(`\n${filesTouched} 篇文章、${inserted} 处补上英制等值${DRY ? "（未写入）" : ""}。`);
  console.log("⚠ 只做单位换算。安装高度、规范要求这类没核实过的数字，这个脚本不会添加。");
}
