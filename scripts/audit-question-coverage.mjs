#!/usr/bin/env node
/**
 * Measures how much of docs/research/buyer-questions.json the site actually answers.
 *
 * The point is not more Schema. Product, FAQPage, BreadcrumbList, ItemList, Organization
 * and WebSite already emit on 471 pages, and llms.txt is generated from the catalogue.
 * What no markup can supply is an answer that is not written anywhere. This script says
 * which questions have one.
 *
 * A `spec` question is scored against the real records: if 144 of 435 products carry a
 * Backset row, then "what backset do you have" is answered on 144 product pages and
 * unanswered on the rest. Percentages here are of the CATEGORY, since that is the page a
 * buyer lands on.
 *
 * Usage:
 *   node scripts/audit-question-coverage.mjs            # summary
 *   node scripts/audit-question-coverage.mjs --gaps     # only what is unanswered
 *   node scripts/audit-question-coverage.mjs --markdown # writes the report file
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const bank = read("docs/research/buyer-questions.json");
const categories = read("content/categories.json").categories;
const faq = read("content/faq.json");

const products = readdirSync(join(root, "content/products"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => read(`content/products/${f}`));

/** Every FAQ question that has a non-empty answer. An empty answer answers nothing. */
const answeredFaq = faq.groups
  .flatMap((group) => group.items ?? group.questions ?? [])
  .filter((item) => (item.answer ?? "").trim().length > 0)
  .map((item) => item.question.toLowerCase());

const allFaq = faq.groups
  .flatMap((group) => group.items ?? group.questions ?? [])
  .map((item) => item.question.toLowerCase());

/** Share of a category's products carrying a spec label, as a 0–1 fraction. */
function specCoverage(categorySlug, label) {
  const inCategory = categorySlug
    ? products.filter((p) => p.categoryPath[0] === categorySlug)
    : products;
  if (!inCategory.length) return { covered: 0, total: 0, ratio: 0 };

  const covered = inCategory.filter((p) =>
    (p.specs ?? []).some((row) => row.label === label),
  ).length;
  return { covered, total: inCategory.length, ratio: covered / inCategory.length };
}

/**
 * Resolve one question to a verdict.
 *
 * `full` and `none` are unambiguous. `partial` is the interesting bucket: the data exists
 * on some records and not others, which reads to an answer engine as an unreliable source
 * — worse than a clean gap, because it looks answered until it isn't.
 */
function assess(question, categorySlug) {
  const need = question.needs;

  if (need.kind === "gap") {
    return { state: "none", detail: need.why };
  }

  if (need.kind === "faq") {
    const term = need.match.toLowerCase();
    const exists = allFaq.some((q) => q.includes(term));
    const answered = answeredFaq.some((q) => q.includes(term));
    if (answered) return { state: "full", detail: "answered in the FAQ" };
    if (exists) return { state: "none", detail: "FAQ question exists but its answer is empty" };
    return { state: "none", detail: "no FAQ entry on this subject" };
  }

  if (need.kind === "spec") {
    const { covered, total, ratio } = specCoverage(categorySlug, need.label);
    const detail = `${need.label} on ${covered}/${total} records`;
    if (ratio >= 0.9) return { state: "full", detail };
    if (ratio > 0) return { state: "partial", detail };
    return { state: "none", detail: `${detail} — the label is never used here` };
  }

  return { state: "none", detail: `unknown need kind: ${need.kind}` };
}

const rows = [];
for (const question of bank.universal.questions) {
  rows.push({ scope: "universal", category: null, ...question, ...assess(question, null) });
}
for (const group of bank.categories) {
  for (const question of group.questions) {
    rows.push({
      scope: "category",
      category: group.slug,
      ...question,
      ...assess(question, group.slug),
    });
  }
}

const tally = (list) => ({
  full: list.filter((r) => r.state === "full").length,
  partial: list.filter((r) => r.state === "partial").length,
  none: list.filter((r) => r.state === "none").length,
  total: list.length,
});

const overall = tally(rows);
const gapsOnly = process.argv.includes("--gaps");
const markdown = process.argv.includes("--markdown");

const ICON = { full: "✓", partial: "~", none: "✗" };

if (!markdown) {
  console.log(
    `buyer questions: ${overall.total} · answered ${overall.full} · partial ${overall.partial} · unanswered ${overall.none}`,
  );
  console.log("");

  for (const scope of ["universal", ...bank.categories.map((c) => c.slug)]) {
    const list = rows.filter((r) => (r.category ?? "universal") === scope);
    const t = tally(list);
    console.log(`== ${scope}  (${t.full}✓ ${t.partial}~ ${t.none}✗ of ${t.total})`);
    for (const row of list) {
      if (gapsOnly && row.state === "full") continue;
      console.log(`   ${ICON[row.state]} ${row.q}`);
      console.log(`       ${row.detail}`);
    }
    console.log("");
  }
  process.exit(0);
}

/* ---- Markdown report ---------------------------------------------------- */

const name = (slug) => categories.find((c) => c.slug === slug)?.name ?? slug;
const lines = [];

lines.push("# 买家问题覆盖审计");
lines.push("");
lines.push("<!-- 由 scripts/audit-question-coverage.mjs --markdown 生成，请勿手改。 -->");
lines.push("");
lines.push(
  "题库在 `docs/research/buyer-questions.json`。**这不是要再补 Schema** —— " +
    "Product / FAQPage / BreadcrumbList / ItemList / Organization / WebSite 已经在 471 页上输出，" +
    "`llms.txt` 也是从目录生成的。任何标记都无法提供一个**没有写在任何地方的答案**。",
);
lines.push("");
lines.push(
  `**${overall.total} 个问题：完整回答 ${overall.full} · 部分 ${overall.partial} · 无答案 ${overall.none}**`,
);
lines.push("");
lines.push(
  "「部分」是最值得先处理的一档：数据在一部分记录上有、另一部分没有。" +
    "对答案引擎来说这比干净的空白更糟 —— 它看起来是可引用的来源，直到引到缺的那条为止。",
);
lines.push("");

lines.push("## 汇总");
lines.push("");
lines.push("| 范围 | 完整 | 部分 | 无 | 合计 |");
lines.push("|---|---|---|---|---|");
for (const scope of ["universal", ...bank.categories.map((c) => c.slug)]) {
  const t = tally(rows.filter((r) => (r.category ?? "universal") === scope));
  const label = scope === "universal" ? "通用（每个类目都问）" : name(scope);
  lines.push(`| ${label} | ${t.full} | ${t.partial} | ${t.none} | ${t.total} |`);
}
lines.push("");

for (const scope of ["universal", ...bank.categories.map((c) => c.slug)]) {
  const list = rows.filter((r) => (r.category ?? "universal") === scope);
  const label = scope === "universal" ? "通用" : name(scope);
  lines.push(`## ${label}`);
  lines.push("");
  lines.push("| | 买家会怎么问 | 现状 |");
  lines.push("|---|---|---|");
  for (const row of list) {
    const q = row.q.replace(/\|/g, "\\|");
    const d = row.detail.replace(/\|/g, "\\|");
    lines.push(`| ${ICON[row.state]} | ${q} | ${d} |`);
  }
  lines.push("");
}

const out = "docs/research/BUYER_QUESTION_COVERAGE.md";
writeFileSync(join(root, out), `${lines.join("\n")}\n`);
console.log(`wrote ${out} — ${overall.full}✓ ${overall.partial}~ ${overall.none}✗ of ${overall.total}`);
