#!/usr/bin/env node
/**
 * Measures how much of docs/research/buyer-questions.json the site actually answers.
 *
 * The point is not more Schema. Product, FAQPage, BreadcrumbList, ItemList, Organization
 * and WebSite already emit on 471 pages, and llms.txt is generated from the catalogue.
 * What no markup can supply is an answer that is not written anywhere. This script says
 * which questions have one.
 *
 * This is the progress metric only — console output, nothing written. The document a
 * human fills in is docs/research/SUPPLIER_WORKBOOK.html, built by
 * scripts/build-supplier-workbook.mjs from the same verdicts (see scripts/lib/
 * question-coverage.mjs). There used to be a --markdown report as well; it asked the
 * same person for the same facts the gap sheet already asked for, so it was merged in.
 *
 * Usage:
 *   node scripts/audit-question-coverage.mjs          # summary
 *   node scripts/audit-question-coverage.mjs --gaps   # only what is unanswered
 */

import { assessQuestions, tally } from "./lib/question-coverage.mjs";

const { rows, bank } = assessQuestions(process.cwd());
const overall = tally(rows);
const gapsOnly = process.argv.includes("--gaps");
const ICON = { full: "✓", partial: "~", none: "✗" };

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
