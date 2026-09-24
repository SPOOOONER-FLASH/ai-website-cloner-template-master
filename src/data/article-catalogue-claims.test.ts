import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

/**
 * Catalogue facts written into article prose, recomputed from the catalogue on every test
 * run — TODO-MASTER item 10.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * Twelve stale numbers were found on 2026-09-22, all the same pattern: counted once by
 * hand, written into a file, left behind when the catalogue moved. A day later the same
 * thing happened in a new way. content/products is SHARED with the RAYEN site — a record
 * whose `sites` omits "hyde" never appears on cantonlock.com — and five expanded articles
 * quoted whole-directory counts (924 entries, 105 hinges, 120 lever handles) and even
 * recommended RAYEN-only door stops by model number to buyers who could not find them.
 * One of those "corrections" replaced a figure that had been right (29 hinges on this site)
 * with a wrong one.
 *
 * So two checks:
 *   1. no article on this site names a model that exists only on RAYEN;
 *   2. every counted claim registered below matches a count taken with the HYDE filter.
 *
 * When a claim fails, the message prints the sentence as it should now read. Update the
 * article (and its date) — do not loosen the test.
 */

type Record = { model: string; slug: string; sites?: string[]; categoryPath?: string | string[]; specs?: { label: string; value: string }[]; heroImage?: { src?: string } };

const products: Record[] = readdirSync("content/products")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join("content/products", f), "utf8")));

/** Same rule as src/data/products.ts: absent `sites` means every site. */
const onHyde = (p: Record) => !p.sites || p.sites.includes("hyde");
const hyde = products.filter(onHyde);
const coverage = JSON.parse(readFileSync("docs/research/SPEC_COVERAGE.json", "utf8"));
const hydeSlugs = new Set(hyde.map((p) => p.slug));
const visibleSlugs = new Set(hyde.filter((p) => p.heroImage?.src).map((p) => p.slug));
const drawingSlugs = Object.keys(JSON.parse(readFileSync("public/images/drawings/index.json", "utf8")));
const prepSlugs = Object.keys(JSON.parse(readFileSync("public/images/door-prep/index.json", "utf8")));
const hydeDrawings = drawingSlugs.filter((slug) => hydeSlugs.has(slug)).length;
const visibleHydeDrawings = drawingSlugs.filter((slug) => visibleSlugs.has(slug)).length;
const hydePrepDrawings = prepSlugs.filter((slug) => hydeSlugs.has(slug)).length;
const top = (p: Record) => ([] as string[]).concat(p.categoryPath ?? [])[0];
const spec = (p: Record, label: string) => p.specs?.find((s) => s.label === label)?.value;
const inFamily = (family: string) => hyde.filter((p) => top(p) === family);

test("the published spec coverage report uses the HYDE catalogue", () => {
  assert.equal(coverage.site, "hyde");
  assert.equal(coverage.totalProducts, hyde.length);
});

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const word = (n: number) => WORDS[n] ?? String(n);
const Word = (n: number) => word(n).charAt(0).toUpperCase() + word(n).slice(1);

function articleText(dir: string, slug: string): string {
  const a = JSON.parse(readFileSync(join(dir, `${slug}.json`), "utf8"));
  return [a.title, a.summary, ...(a.body ?? []), ...((a.faq?.en ?? []) as { question: string; answer: string }[]).flatMap((f) => [f.question, f.answer])].join("\n");
}

test("no article on cantonlock.com names a model that exists only on the RAYEN site", () => {
  const hydeModels = new Set(hyde.map((p) => p.model));
  /*
    Only codes with a letter in them, or of four digits or more. Three-digit RAYEN codes
    such as 209 or 270 collide with ordinary numbers in prose ("209 citations", "270mm"),
    and a guard that cries wolf gets deleted. Those were checked by hand on 2026-09-23;
    the RAYEN stops 1328, 209, 215, 220, 270–280 were removed from the door-stop article.
  */
  const rayenOnly = [...new Set(products.filter((p) => !onHyde(p)).map((p) => p.model))]
    .filter((m) => !hydeModels.has(m))
    .filter((m) => /[A-Za-z]/.test(m) ? m.replace(/[^A-Za-z0-9]/g, "").length >= 4 : /^\d{4,}$/.test(m));
  const hits: string[] = [];
  for (const dir of ["content/news", "content/guides"]) {
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      const text = articleText(dir, file.replace(/\.json$/, ""));
      for (const m of rayenOnly) {
        const escaped = m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        if (new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`).test(text)) hits.push(`${dir}/${file}: ${m}`);
      }
    }
  }
  assert.deepEqual(hits, [], "these models are RAYEN-only and cannot be found by a cantonlock.com reader");
});

type Claim = { where: string; expect: () => string };
const NEWS = (slug: string) => ["content/news", slug] as const;
const GUIDE = (slug: string) => ["content/guides", slug] as const;

const claims: Claim[] = [];
function claim(at: readonly [string, string], expect: () => string) {
  claims.push({ where: `${at[0]}/${at[1]}`, expect });
}

// why-the-catalogue-is-this-wide
claim(NEWS("why-the-catalogue-is-this-wide"), () => {
  const families = new Set(hyde.map(top));
  return `${hyde.length} entries in ${word(families.size)} product families`;
});
claim(NEWS("why-the-catalogue-is-this-wide"), () => `${hyde.filter((p) => !(p.specs ?? []).length).length} of those ${hyde.length} entries carry no specification rows at all, and ${hyde.filter((p) => !p.heroImage?.src).length} have no photograph`);
claim(NEWS("why-the-catalogue-is-this-wide"), () => `knob locks (${inFamily("knob-locks").length} entries), lever handles (${inFamily("lever-handles").length}), hardware accessories such as stops, flush bolts and viewers (${inFamily("hardware-accessories").length}), lock cases (${inFamily("lock-cases").length}), bathroom accessories (${inFamily("bathroom-accessories").length}) and panic exit devices (${inFamily("panic-exit-devices").length})`);
claim(NEWS("why-the-catalogue-is-this-wide"), () => `sliding hook locks (${inFamily("sliding-hook-locks").length}), door closers (${inFamily("door-closers").length}) and deadbolts (${inFamily("deadbolts").length})`);

// brass-piano-hinge-is-a-finish-not-a-metal
claim(NEWS("brass-piano-hinge-is-a-finish-not-a-metal"), () => {
  const hinges = inFamily("brass-steel-hinges");
  const mat = (p: Record) => spec(p, "Material") ?? "";
  const iron = hinges.filter((p) => /iron/i.test(mat(p))).length;
  const brass = hinges.filter((p) => /brass/i.test(mat(p)) && !/stainless/i.test(mat(p))).length;
  const none = hinges.filter((p) => !mat(p)).length;
  const stainless = hinges.length - iron - brass - none;
  return `this site publishes ${hinges.length} hinge records. ${Word(stainless)} are stainless steel in various grades, ${word(iron)} are iron (the Brass Piano Hinge, BL027, IH01 and F100 SS), ${word(brass)} are solid brass (B024 and B025), and ${word(none)} carry no material row yet`;
});

// lever-handle-range-lh852-lh853-lh855
claim(NEWS("lever-handle-range-lh852-lh853-lh855"), () => {
  const levers = inFamily("lever-handles");
  return `Of the ${levers.length} lever-handle entries on this site, ${levers.filter((p) => spec(p, "Cycle life")).length} are tubular lever sets`;
});

// euro-cylinder-range-45-to-90
claim(NEWS("euro-cylinder-range-45-to-90"), () => {
  const byLength = (n: number) => inFamily("lock-cylinders").filter((p) => p.model.startsWith(String(n))).length;
  return `The 70mm length has ${word(byLength(70))} variants; the 80 has ${word(byLength(80))}; the 60 has ${word(byLength(60))}; the 90 ${word(byLength(90))}; the 45 ${word(byLength(45))}`;
});

// what-documents-you-can-actually-get
claim(NEWS("what-documents-you-can-actually-get"), () => `HYDE currently publishes ${hydePrepDrawings} door-preparation SVGs`);
claim(NEWS("what-documents-you-can-actually-get"), () => `Dimensioned SVG assets: ${hydeDrawings} for HYDE model slugs among ${hyde.length} catalogue records`);

// mortise-lock-case-comparison-2026
function lockCasesWithBoth() {
  const mm = (v?: string) => Number((v ?? "").match(/(\d+(?:\.\d+)?)\s*mm/)?.[1] ?? NaN);
  return inFamily("lock-cases")
    .map((p) => ({ c: mm(spec(p, "Centre distance")), b: mm(spec(p, "Backset")) }))
    .filter((r) => r.c && r.b);
}
claim(GUIDE("mortise-lock-case-comparison-2026"), () => `${lockCasesWithBoth().length} of the ${inFamily("lock-cases").length} lock-case records`);
claim(GUIDE("mortise-lock-case-comparison-2026"), () => {
  const rows = lockCasesWithBoth();
  return `${rows.filter((r) => r.c === 85).length} of the ${rows.length}, including ${word(rows.filter((r) => r.c === 85 && r.b <= 35).length)} of the ${word(rows.filter((r) => r.b <= 35).length)} narrow-stile cases`;
});

// exit-device-comparison-2026 — counts over PUBLISHED records (the page only shows those)
function exitFamily() {
  const all = inFamily("panic-exit-devices").filter((p) => p.heroImage?.src);
  const trims = all.filter((p) => /^Trim handle/i.test(spec(p, "Type") ?? ""));
  const cases = all.filter((p) => /lock case/i.test(spec(p, "Type") ?? ""));
  const coordinators = all.filter((p) => /sequencing|automatic closing/i.test(spec(p, "Function") ?? ""));
  const devices = all.filter((p) => !trims.includes(p) && !cases.includes(p) && !coordinators.includes(p));
  const withLength = devices.filter((p) => spec(p, "Length") || spec(p, "Bar Length") || spec(p, "Size"));
  return { all, trims, cases, coordinators, devices, withLength };
}
claim(GUIDE("exit-device-comparison-2026"), () => {
  const f = exitFamily();
  return `There are ${f.all.length} published records in our panic exit device family, and ${f.devices.length} of them are exit devices. The other ${f.all.length - f.devices.length} are the parts that go with them: ${f.trims.length} outside trims`;
});
claim(GUIDE("exit-device-comparison-2026"), () => {
  const f = exitFamily();
  return `Of the ${f.devices.length} devices, ${f.withLength.length} publish a length.`;
});

// cylindrical-and-tubular-lock-comparison-2026 — published records only
function knobFamily() {
  const all = inFamily("knob-locks").filter((p) => p.heroImage?.src);
  const sub = (s: string) => all.filter((p) => ([] as string[]).concat(p.categoryPath ?? [])[1] === s).length;
  return { all, sub, cycles: all.filter((p) => spec(p, "Cycle life")), cycles200: all.filter((p) => /200,000/.test(spec(p, "Cycle life") ?? "")) };
}
claim(GUIDE("cylindrical-and-tubular-lock-comparison-2026"), () => {
  const f = knobFamily();
  return `The family has ${f.all.length} published records: ${f.sub("tubular-locks")} tubular locks, ${f.sub("light-duty-cylindrical-locks")} light-duty cylindrical locks, ${f.sub("heavy-duty-cylindrical-locks")} heavy-duty cylindrical locks and ${f.sub("commercial-locks")} commercial locks`;
});
claim(GUIDE("cylindrical-and-tubular-lock-comparison-2026"), () => {
  const f = knobFamily();
  assert.equal(f.cycles.length, f.cycles200.length, "a lock now publishes a cycle life other than 200,000: the guide's central claim needs rewriting");
  return `${f.cycles.length} of the ${f.all.length} records publish a cycle life, and every one of them says 200,000 cycles`;
});

// door-closer-power-size-2026 — published closer records; the JU table rows are read from their specs
claim(GUIDE("door-closer-power-size-2026"), () => {
  const pub = inFamily("door-closers").filter((p) => p.heroImage?.src);
  const ju = pub.filter((p) => /^JU-/.test(p.model));
  return `Our catalogue publishes ${word(pub.length)} door closer records: ${word(ju.length)} JU overhead closers`;
});
for (const model of ["JU-051", "JU-061", "JU-072", "JU-073", "JU-088", "JU-093"]) {
  claim(GUIDE("door-closer-power-size-2026"), () => {
    const p = hyde.find((r) => r.model === model);
    const width = (spec(p!, "Door Width") ?? "").replace(/\s*mm$/i, "");
    return `| ${model} | ${width}mm (`;
  });
  claim(GUIDE("door-closer-power-size-2026"), () => {
    const p = hyde.find((r) => r.model === model);
    const [lo, hi] = (spec(p!, "Capacity") ?? "").match(/\d+/g) ?? [];
    return `| ${lo} to ${hi} kg |`;
  });
}

// Four articles that quoted the old whole-directory 924 as a denominator (fixed 2026-09-24).
const mm = (v?: string) => Number((v ?? "").match(/(\d+(?:\.\d+)?)\s*mm/)?.[1] ?? NaN);
const isAdjustable6070 = (v: string) => /60\s*(mm)?\s*\/\s*70|60\s*(mm)?\s*(or|and|-|–)\s*70/i.test(v) && !/80/.test(v);
claim(NEWS("mortise-lock-backset-and-centre-distance-guide"), () => {
  const withBackset = hyde.filter((p) => spec(p, "Backset"));
  return `${withBackset.length} of the ${hyde.length} records in our catalogue publish a backset. Of those, ${withBackset.filter((p) => isAdjustable6070(spec(p, "Backset")!)).length} are 60mm / 70mm adjustable`;
});
claim(NEWS("mortise-lock-backset-and-centre-distance-guide"), () => {
  const lockCd = hyde.filter((p) => spec(p, "Centre distance") && (top(p) === "lock-cases" || /lock case/i.test(spec(p, "Type") ?? "")));
  return `Only ${lockCd.length} of the ${hyde.length} records in our catalogue publish a lock centre distance, and ${lockCd.filter((p) => mm(spec(p, "Centre distance")) === 85).length} of those ${lockCd.length} say 85mm`;
});
claim(GUIDE("commercial-lock-function-decision-2026"), () => `Function counts across the ${hyde.length} records in our catalogue`);
claim(GUIDE("commercial-lock-function-decision-2026"), () => `| Entrance, keyed outside | ${hyde.filter((p) => /^Entrance, keyed outside$/.test(spec(p, "Function") ?? "")).length} |`);
claim(GUIDE("commercial-lock-function-decision-2026"), () => `| Privacy, bathroom, turn button inside | ${hyde.filter((p) => /^Privacy, bathroom/.test(spec(p, "Function") ?? "")).length} |`);
claim(GUIDE("cycle-testing-durability-grades-2026"), () => {
  const c = hyde.filter((p) => /200,000/.test(spec(p, "Cycle life") ?? ""));
  return `appears on ${c.length} records in our catalogue, ${c.filter((p) => p.heroImage?.src).length} of them on published product pages`;
});
claim(GUIDE("dimensional-interchangeability-2026"), () => {
  const lockCats = new Set(["knob-locks", "lock-cases", "lock-cylinders", "deadbolts", "night-latches-rim-locks", "sliding-hook-locks"]);
  const locks = hyde.filter((p) => lockCats.has(top(p)) || /\b(lock|latch|cylinder|deadbolt)\b/i.test((p as { name?: string }).name ?? ""));
  const has = (p: Record, re: RegExp) => (p.specs ?? []).some((s) => re.test(s.label));
  const pct = (n: number) => `${Math.round((100 * n) / locks.length)}%`;
  const cd = locks.filter((p) => has(p, /^centre distances?$/i)).length;
  const cs = locks.filter((p) => has(p, /^case (size|height|depth)/i)).length;
  return `${locks.length} lock products: backset ${locks.filter((p) => has(p, /^backset$/i)).length} (${pct(locks.filter((p) => has(p, /^backset$/i)).length)}), door thickness ${locks.filter((p) => has(p, /^door thickness$/i)).length} (${pct(locks.filter((p) => has(p, /^door thickness$/i)).length)}), centre distance ${cd} (${pct(cd)}), forend ${locks.filter((p) => has(p, /^(faceplate|face plate|forend)/i)).length} (${pct(locks.filter((p) => has(p, /^(faceplate|face plate|forend)/i)).length)}), case size ${cs} (${pct(cs)})`;
});

test("every counted catalogue claim in an article matches the catalogue as this site sees it", () => {
  const wrong: string[] = [];
  for (const { where, expect } of claims) {
    const [dir, slug] = where.split(/\/(?=[^/]+$)/);
    const expected = expect();
    if (!articleText(dir, slug).includes(expected)) wrong.push(`${where}\n    should now read: "${expected}"`);
  }
  assert.deepEqual(wrong, [], "update these sentences (and their date) to the current catalogue");
});

test("HYDE coverage articles use site-filtered counts in all three languages", () => {
  const inventory = [
    hyde.length,
    visibleSlugs.size,
    hydeDrawings,
    visibleHydeDrawings,
    hydePrepDrawings,
  ];
  const targets = [
    { dir: "content/guides", slug: "hardware-refurbishment-survey-2026", counts: [
      hyde.length,
      coverage.fields.doorThickness.products,
      coverage.fields.handing.products,
      coverage.fields.backset.products,
      coverage.fields.centreDistance.products,
      coverage.fields.forend.products,
    ] },
    { dir: "content/guides", slug: "powder-coating-and-ral-2026", counts: [
      hyde.length,
      coverage.fields.finish.products,
    ] },
    { dir: "content/guides", slug: "qualifying-a-hardware-supplier-2026", counts: inventory },
    { dir: "content/guides", slug: "technical-drawings-what-to-expect-2026", counts: inventory },
    { dir: "content/news", slug: "what-documents-you-can-actually-get", counts: inventory },
  ];
  const bodyKeys = { en: "body", es: "bodyEs", pt: "bodyPt" } as const;

  for (const { dir, slug, counts } of targets) {
    const article = JSON.parse(readFileSync(join(dir, `${slug}.json`), "utf8"));
    assert.doesNotMatch(JSON.stringify(article), /\b(?:964|973|95|79)\b/, `${slug} still quotes a shared-site or stale drawing count`);
    for (const [locale, bodyKey] of Object.entries(bodyKeys)) {
      const body = (article[bodyKey] as string[]).join("\n");
      const missing = counts.filter((count) => !new RegExp(`(?<!\\d)${count}(?!\\d)`).test(body));
      assert.deepEqual(missing, [], `${slug}/${locale} must state the current HYDE counts`);
    }
  }
});
