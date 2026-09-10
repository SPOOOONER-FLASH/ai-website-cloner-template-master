#!/usr/bin/env node
/**
 * Prints the competitor certification matrix from docs/research/competitor-certifications.json.
 *
 * Written as a generator rather than a hand-kept table because of the rule in AGENTS.md:
 * a sheet pasted into a document is gone the moment its numbers go stale, and no later
 * session can tell whether it is still true. Adding a competitor is a data edit; the
 * report reprints.
 *
 *   node scripts/build-competitor-matrix.mjs            # print
 *   node scripts/build-competitor-matrix.mjs --write    # write the .md next to the data
 */

import { readFileSync, writeFileSync } from "node:fs";

const DATA = "docs/research/competitor-certifications.json";
const OUT = "docs/research/2026-09-10-competitor-certification-matrix.md";
const write = process.argv.includes("--write");

const data = JSON.parse(readFileSync(DATA, "utf8"));
const makers = data.makers;
const us = makers.find((m) => m.us);
const rivals = makers.filter((m) => !m.us);

/**
 * Every certification any rival holds, normalised to a short key.
 *
 * The patterns match the ASSERTION, not one spelling of it. Yale states "UL and cUL panic
 * exit listing (FVSR/FVSR7)" and Cal-Royal states "UL and ULC listed for panic"; neither
 * writes the number 305, and both hold the listing. A matcher keyed on `UL ?305` printed
 * a dash for both — which understated two competitors and, worse, made our own gap look
 * narrower than it is. The verbatim source text stays in the JSON for anybody checking.
 */
const KEY = [
  ["ANSI/BHMA A156.3", /A156\.3/],
  ["UL 逃生器械列名 (panic)", /UL ?305|UL[^.]*panic/i],
  ["UL 防火逃生列名 (fire)", /UL ?10C|fire exit hardware|UL fire rated/i],
  ["cUL / ULC (Canada)", /cUL|ULC/],
  ["ISO 9001", /ISO ?9001/],
  ["ADA operating force", /ADA/],
  ["NFPA 80 / 101", /NFPA/],
  ["California SFM", /California State Fire Marshal|California SFM/],
  ["Miami-Dade NOA", /Miami-Dade/],
  ["EN 1125 / CE", /EN ?1125|CE Certificate/],
];

const has = (maker, re) =>
  [...(maker.holds ?? []), ...(maker.publishes ?? [])].some((line) => re.test(line));

const lines = [];
const p = (s = "") => lines.push(s);

p(`# 竞品认证对照表 — ${data.collected}`);
p();
p("> 由 `scripts/build-competitor-matrix.mjs` 从 `docs/research/competitor-certifications.json`");
p("> 生成。**不要手改这个文件**，改数据然后重新生成。每一条都注明来源。");
p();
p("## 一、谁持有什么");
p();
p(`| 认证 / 标准 | ${rivals.map((m) => m.brand).join(" | ")} | **${us.brand}** |`);
p(`|---|${rivals.map(() => "---").join("|")}|---|`);
for (const [label, re] of KEY) {
  const cells = rivals.map((m) => (has(m, re) ? "✅" : "—"));
  const ours = has(us, re) ? "✅" : "—";
  p(`| ${label} | ${cells.join(" | ")} | ${ours} |`);
}
p();
p(`| 产地 | ${rivals.map((m) => m.madeIn).join(" | ")} | ${us.madeIn} |`);
p();

p("## 二、逐家明细");
p();
for (const maker of makers) {
  p(`### ${maker.brand}${maker.group ? ` (${maker.group})` : ""}`);
  p();
  p(`- **产地**：${maker.madeIn}`);
  if (maker.series) p(`- **对照系列**：${maker.series}`);
  p(`- **持有**：`);
  for (const line of maker.holds ?? []) p(`  - ${line}`);
  if (maker.doesNotHold?.length) {
    p(`- **明确不持有**：`);
    for (const line of maker.doesNotHold) p(`  - ${line}`);
  }
  if (maker.publishes?.length) {
    p(`- **页面上公开的规格**：`);
    for (const line of maker.publishes) p(`  - ${line}`);
  }
  for (const note of maker.notes ?? []) {
    p();
    p(`> ${note}`);
  }
  p();
  p(`来源：${(maker.sources ?? []).map((s) => (s.startsWith("http") ? `<${s}>` : `\`${s}\``)).join("、")}`);
  p();
}

const report = lines.join("\n");
if (write) {
  writeFileSync(OUT, `${report}\n`);
  console.log(`✔ ${OUT}`);
} else {
  console.log(report);
}
