#!/usr/bin/env node
/**
 * 把 body 数组里连续的 Markdown 表格行合并成一个字符串。
 *
 * 为什么需要：Codex 的渲染合同规定「一张表是 body 数组里的**一个**字符串，
 * 行与行用换行分隔」。手写文章时很容易把每一行写成一个数组元素 ——
 * 看起来一模一样，JSON 也合法，但渲染出来是一串独立段落而不是一张表，
 * 而且 `| --- | --- |` 那一行会原样显示给读者。
 *
 * 第一批 20 篇是脚本生成表格的，没踩到；手写的第二批第一篇就踩了，16 行表格
 * 变成了 16 个段落。这个脚本把它们合回去，并且 `--check` 可以进 CI，
 * 让下一次手写不必依赖记性。
 *
 * 只合并**连续**的以 `|` 开头的元素。中间隔了正文的两张表不会被粘在一起。
 *
 * 幂等。`--check` 只报告、不写入。
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/guides";
const KEYS = ["body", "bodyEs", "bodyPt"];

const check = process.argv.includes("--check");
const touched = [];

/** 连续的 `|` 行 → 一个字符串。 */
function merge(body) {
  const out = [];
  let run = [];
  const flush = () => {
    if (!run.length) return;
    out.push(run.join("\n"));
    run = [];
  };
  for (const entry of body) {
    if (typeof entry === "string" && entry.startsWith("|") && !entry.includes("\n")) {
      run.push(entry);
    } else {
      flush();
      out.push(entry);
    }
  }
  flush();
  return out;
}

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const path = join(DIR, file);
  const article = JSON.parse(readFileSync(path, "utf8"));
  let changed = 0;

  for (const key of KEYS) {
    const body = article[key];
    if (!Array.isArray(body)) continue;
    const merged = merge(body);
    if (merged.length !== body.length) {
      article[key] = merged;
      changed += body.length - merged.length;
    }
  }

  if (changed) {
    touched.push(`${file} (${changed} 行并入表格)`);
    if (!check) writeFileSync(path, `${JSON.stringify(article, null, 2)}\n`);
  }
}

if (check && touched.length) {
  console.error(
    "merge-table-rows: 下面这些文章的表格被写成了一行一个数组元素，" +
      "渲染出来会是散段落而不是表格：",
  );
  for (const f of touched) console.error(`  ${f}`);
  process.exit(1);
}

console.log(
  touched.length
    ? `merge-table-rows: 合并了 ${touched.length} 篇\n  ${touched.join("\n  ")}`
    : "merge-table-rows: 每张表都已经是单个字符串",
);
