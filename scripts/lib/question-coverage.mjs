/**
 * Shared verdict logic for docs/research/buyer-questions.json.
 *
 * Two consumers need the same answer to "does the site answer this question":
 *   scripts/audit-question-coverage.mjs   — the progress metric, console only
 *   scripts/build-supplier-workbook.mjs   — the fill-in workbook for the supplier
 *
 * It lives here so the two can never drift. Changing a threshold changes both.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const read = (root, p) => JSON.parse(readFileSync(join(root, p), "utf8"));

/**
 * Loads the bank, the catalogue and the FAQ, and returns every question with a verdict.
 *
 * `state` is one of full / partial / none. `partial` is the interesting bucket: the data
 * exists on some records and not others, which reads to an answer engine as an unreliable
 * source — worse than a clean gap, because it looks answered until it isn't.
 */
export function assessQuestions(root = process.cwd()) {
  const bank = read(root, "docs/research/buyer-questions.json");
  const categories = read(root, "content/categories.json").categories;
  const faq = read(root, "content/faq.json");

  const products = readdirSync(join(root, "content/products"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => read(root, `content/products/${f}`));

  const faqItems = faq.groups.flatMap((group) => group.items ?? group.questions ?? []);
  const allFaq = faqItems.map((item) => item.question.toLowerCase());
  const answeredFaq = faqItems
    .filter((item) => (item.answer ?? "").trim().length > 0)
    .map((item) => item.question.toLowerCase());

  /** Share of a category's products carrying a spec label. Null slug = whole catalogue. */
  const specCoverage = (slug, label) => {
    const inCategory = slug ? products.filter((p) => p.categoryPath[0] === slug) : products;
    if (!inCategory.length) return { covered: 0, total: 0, ratio: 0 };
    const covered = inCategory.filter((p) =>
      (p.specs ?? []).some((row) => row.label === label),
    ).length;
    return { covered, total: inCategory.length, ratio: covered / inCategory.length };
  };

  const assess = (question, slug) => {
    const need = question.needs;

    if (need.kind === "gap") return { state: "none", detail: need.why, coverage: null };

    if (need.kind === "faq") {
      const term = need.match.toLowerCase();
      const answered = answeredFaq.some((q) => q.includes(term));
      if (answered) return { state: "full", detail: "answered in the FAQ", coverage: null };
      const exists = allFaq.some((q) => q.includes(term));
      return {
        state: "none",
        detail: exists ? "FAQ question exists but its answer is empty" : "no FAQ entry on this subject",
        coverage: null,
      };
    }

    if (need.kind === "spec") {
      const cov = specCoverage(slug, need.label);
      const detail = `${need.label} on ${cov.covered}/${cov.total} records`;
      if (cov.ratio >= 0.9) return { state: "full", detail, coverage: cov };
      if (cov.ratio > 0) return { state: "partial", detail, coverage: cov };
      return { state: "none", detail: `${detail} — the label is never used here`, coverage: cov };
    }

    return { state: "none", detail: `unknown need kind: ${need.kind}`, coverage: null };
  };

  const rows = [];
  for (const question of bank.universal.questions) {
    rows.push({ scope: "universal", category: null, ...question, ...assess(question, null) });
  }
  for (const group of bank.categories) {
    for (const question of group.questions) {
      rows.push({ scope: "category", category: group.slug, ...question, ...assess(question, group.slug) });
    }
  }

  return { rows, bank, categories, products };
}

export const tally = (list) => ({
  full: list.filter((r) => r.state === "full").length,
  partial: list.filter((r) => r.state === "partial").length,
  none: list.filter((r) => r.state === "none").length,
  total: list.length,
});
