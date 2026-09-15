/**
 * Decides which editorial and company images may carry the HYDE mark.
 *
 *   node scripts/build-branded-editorial-list.mjs           print the decision
 *   node scripts/build-branded-editorial-list.mjs --write   write the two list files
 *   node scripts/build-branded-editorial-list.mjs --check    fail if the lists are stale
 *
 * ---------------------------------------------------------------------------
 * THE CLIENT ASKED FOR "图片都铺 logo". THIS IS WHY THE ANSWER IS NOT "ALL OF THEM".
 *
 * Product photographs were straightforward: every file under public/images/products/ is a
 * photograph of a part we make, so all 3,956 derivatives carry the mark, and so do the
 * responsive candidates, because product-images.config.json points at the branded root.
 *
 * The editorial library is a different kind of thing, and the repository already says so.
 * Most of it was generated, and each generated file carries a sidecar recording the brief
 * that produced it — ending, in the factory's own words:
 *
 *   "This is illustrative editorial imagery, not evidence of a specific sellable model or
 *    certification."
 *
 * Those same briefs explicitly forbid a watermark inside the frame. Putting our mark on
 * one afterwards would assert the opposite of what the file says about itself: that this
 * is our photograph, of our goods. That is the exact claim the client's principal rejected
 * on sight in 2026-09-04 — 「AI 可以把现有的图片清晰化、白化，但是它不能想象产品」 — and
 * a mark is a stronger claim than the image, because a mark is a signature.
 *
 * ---------------------------------------------------------------------------
 * SO THE RULE IS: EVIDENCE OF A REAL PHOTOGRAPH, OR NO MARK
 *
 * An image qualifies when a tracked record in this repository says it came from a real
 * photograph of our product or our factory:
 *
 *   - a sidecar `<file>.webp.json` whose `kind` begins with "real-photograph", or is
 *     "client-selected-source-photo-edit" (the client's own supplied images)
 *   - a named entry in a design-reference README that records the file as a real
 *     photograph — the two factory shots below
 *
 * Everything else is absent from the list. Absent is the default, and adding a file means
 * adding evidence, not adding a filename. A generated scene never becomes markable by
 * sitting here long enough.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EDITORIAL_DIR = "public/images/editorial";
const COMPANY_DIR = "public/images/company";
const EDITORIAL_LIST = "docs/design-references/branded-editorial-list.json";
const COMPANY_LIST = "docs/design-references/branded-company-list.json";

/** Sidecar `kind` values that assert a real photograph underneath. */
const REAL_PHOTOGRAPH_KINDS = [
  /^real-photograph/,
  /^client-selected-source-photo-edit$/,
];

/**
 * Factory photographs whose evidence is a README rather than a sidecar.
 *
 * Both are recorded in docs/design-references/codex-home-realism-preview-2026-09-02/README.md:
 * `08-real-cnc-machining` as "real Canton Hyland CNC photograph — approved edit removes only
 * the old oval mark; machine branding is factual", and `09-real-assembly-line` as an
 * "untouched real assembly photograph" that replaced a rejected AI-cleaned attempt.
 *
 * The other eighteen files in public/images/company/ have no such record. They are not
 * listed, and the report says so by name, which is how the client can confirm them one at
 * a time instead of approving a directory.
 */
const DOCUMENTED_FACTORY_PHOTOGRAPHS = [
  "factory-cnc-machining.webp",
  "assembly-line.webp",
];

/**
 * What the file's own sidecar says it is.
 *
 * Three answers, and the middle one matters: a sidecar carrying a generation `prompt` and
 * no `kind` is not missing evidence — it IS the evidence, and what it says is "generated".
 * Lumping those in with files that have no record at all would report 89 unknowns where
 * the truth is 20 declared-generated and 69 undocumented, and the client would reasonably
 * read the first number as something we could clear up by looking harder.
 */
function sidecarKind(directory, file) {
  const sidecar = join(directory, `${file}.json`);
  if (!existsSync(sidecar)) return undefined;
  try {
    const record = JSON.parse(readFileSync(sidecar, "utf8"));
    if (record.kind) return record.kind;
    if (record.prompt) return "generated";
    return undefined;
  } catch {
    return undefined;
  }
}

function isRealPhotograph(kind) {
  return Boolean(kind) && REAL_PHOTOGRAPH_KINDS.some((pattern) => pattern.test(kind));
}

/**
 * Photographs that pass the provenance test and still must not carry the mark.
 *
 * `public/images/editorial/heritage/` holds the principal's own photographs of a padlock
 * he found chained to a statue outside a hotel in Germany. They are real photographs,
 * taken by us, so the rule above would admit them — and marking them would be wrong.
 *
 * On a hardware catalogue the mark does not read as "we took this picture". It reads as
 * "this is ours", because that is what it means on all 3,956 images beside it. The
 * article those photographs illustrate spends four paragraphs establishing that the lock
 * is NOT ours, that we do not know who made it, and that we will not pretend otherwise.
 * A HYDE stamp in the corner would contradict the text it sits next to.
 *
 * This is currently also true by accident — the scan below is not recursive, so a
 * subdirectory is invisible to it. Naming the exclusion makes it survive somebody making
 * the scan recursive, which is a reasonable thing for a future session to do.
 */
const NEVER_MARK_DIRECTORIES = ["heritage"];

function webpFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".webp"))
    .map((entry) => entry.name)
    .sort();
}

const editorial = { marked: [], skipped: [] };
for (const file of webpFiles(EDITORIAL_DIR)) {
  const kind = sidecarKind(EDITORIAL_DIR, file);
  if (isRealPhotograph(kind)) editorial.marked.push({ file, kind });
  else editorial.skipped.push({ file, kind: kind ?? "no provenance record" });
}

/* Report the excluded directories by name, so "why is this one not marked?" has an answer. */
for (const directory of NEVER_MARK_DIRECTORIES) {
  const path = join(EDITORIAL_DIR, directory);
  if (!existsSync(path)) continue;
  for (const file of webpFiles(path)) {
    editorial.skipped.push({
      file: `${directory}/${file}`,
      kind: "not our product — marking it would contradict the article it illustrates",
    });
  }
}

const company = { marked: [], skipped: [] };
for (const file of webpFiles(COMPANY_DIR)) {
  if (DOCUMENTED_FACTORY_PHOTOGRAPHS.includes(file)) {
    company.marked.push({ file, kind: "documented real factory photograph" });
  } else {
    company.skipped.push({ file, kind: "no provenance record" });
  }
}

const write = process.argv.includes("--write");
const check = process.argv.includes("--check");

function sync(listPath, marked) {
  const wanted = `${JSON.stringify(
    marked.map((entry) => entry.file),
    null,
    2,
  )}\n`;
  const current = existsSync(listPath) ? readFileSync(listPath, "utf8") : "";
  if (current === wanted) return true;
  if (write) writeFileSync(listPath, wanted);
  return false;
}

const editorialFresh = sync(EDITORIAL_LIST, editorial.marked);
const companyFresh = sync(COMPANY_LIST, company.marked);

console.log(
  `editorial: ${editorial.marked.length} markable, ${editorial.skipped.length} not marked`,
);
console.log(
  `company:   ${company.marked.length} markable, ${company.skipped.length} not marked`,
);

if (!process.argv.includes("--quiet")) {
  console.log("\nmarkable — a tracked record says these came from a real photograph:");
  for (const entry of [...editorial.marked, ...company.marked]) {
    console.log(`  ${entry.file}  (${entry.kind})`);
  }

  /*
    Printed by reason rather than hidden. "Sixty-nine files are not marked" invites a
    request to mark them; "sixty-nine files say in their own sidecar that they are
    illustrative rather than evidence" answers it.
  */
  const byReason = new Map();
  for (const entry of [...editorial.skipped, ...company.skipped]) {
    const reason =
      entry.kind === "generated"
        ? "the file's own sidecar records a generation brief"
        : entry.kind === "no provenance record"
          ? "no provenance record in the repository"
          : entry.kind;
    byReason.set(reason, (byReason.get(reason) ?? 0) + 1);
  }
  console.log("\nnot marked, by reason:");
  for (const [reason, count] of byReason) console.log(`  ${String(count).padStart(3)}  ${reason}`);
}

if (check && !(editorialFresh && companyFresh)) {
  console.error("\n❌ the branded-image lists are stale.");
  console.error("   Run: node scripts/build-branded-editorial-list.mjs --write");
  process.exit(1);
}
