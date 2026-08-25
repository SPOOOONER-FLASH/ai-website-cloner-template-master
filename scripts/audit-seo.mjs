/**
 * Semantic audit of the static HTML crawlers actually receive.
 *
 *   node scripts/audit-seo.mjs             summary + first findings
 *   node scripts/audit-seo.mjs --all       every finding
 *   node scripts/audit-seo.mjs --json      machine-readable result
 *   node scripts/audit-seo.mjs --check     non-zero exit on semantic errors
 */
import { auditBuild } from "./lib/seo-audit.mjs";

const showAll = process.argv.includes("--all");
const asJson = process.argv.includes("--json");
const check = process.argv.includes("--check");
const result = auditBuild({ outDir: "out" });

if (asJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  const { summary, semanticIssues, qualityWarnings, pages } = result;
  const publicPages = pages.filter((page) => page.public);
  const lengths = (key) => publicPages
    .map((page) => page[key]?.length ?? 0)
    .filter(Boolean)
    .sort((left, right) => left - right);
  const stats = (values) => values.length === 0
    ? { min: 0, p50: 0, p90: 0, max: 0 }
    : {
        min: values[0],
        p50: values[Math.floor(values.length * 0.5)],
        p90: values[Math.floor(values.length * 0.9)],
        max: values.at(-1),
      };

  console.log(`release state: ${summary.releaseState}`);
  console.log(`pages built: ${summary.pages} (${summary.publicPages} public content pages)`);
  console.log(`  with JSON-LD: ${summary.jsonLdPages}`);
  console.log(`  with real alternate link tags: ${summary.alternateLinkPages}`);
  console.log(`  semantic issues: ${summary.semanticIssues}`);
  console.log(`  editorial quality warnings: ${summary.qualityWarnings}`);
  console.log(`\ntitle length      ${JSON.stringify(stats(lengths("title")))}`);
  console.log(`description length ${JSON.stringify(stats(lengths("description")))}`);

  console.log("\nsemantic issues (CI-blocking):");
  if (semanticIssues.length === 0) console.log("  none");
  const semanticRows = showAll ? semanticIssues : semanticIssues.slice(0, 40);
  for (const issue of semanticRows) {
    console.log(`  ${issue.route}  ${issue.code}: ${issue.detail}`);
  }
  if (!showAll && semanticIssues.length > semanticRows.length) {
    console.log(`  … ${semanticIssues.length - semanticRows.length} more; re-run with --all`);
  }

  const warningTally = new Map();
  for (const warning of qualityWarnings) {
    warningTally.set(warning.code, (warningTally.get(warning.code) ?? 0) + 1);
  }
  console.log("\neditorial quality warnings (report-only):");
  if (warningTally.size === 0) console.log("  none");
  for (const [code, count] of [...warningTally].sort((left, right) => right[1] - left[1])) {
    console.log(`  ${String(count).padStart(4)}  ${code}`);
  }
}

if (check && result.semanticIssues.length > 0) process.exitCode = 1;
