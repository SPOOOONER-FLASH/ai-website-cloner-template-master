#!/usr/bin/env node
/**
 * Brazilian Portuguese: `trinco` is the sprung latch, never the deadbolt.
 * `npm run copy:pt-latch` (`--check` in test:export)
 *
 * WHAT WAS WRONG
 *
 * src/data/pt-glossary.ts's header declared the opposite convention —
 *
 *   "`trinco` is the deadbolt and `picaporte`/`lingueta` the sprung latch — Brazilian
 *    usage varies, and `lingueta` is used here because it is the word on ABNT NBR
 *    11742's own vocabulary for the sprung element."
 *
 * — and both halves of that are wrong. NBR 11742 is the fire-door standard; the ABNT
 * terminology standard for locks is NBR 12927 (Fechaduras — Terminologia). And Brazilian
 * trade usage is not in fact divided:
 *
 *   - AROUCA FECHADURAS' own installation manual, supplied by the client 2026-09-29:
 *     "Insira o TRINCO na furação inferior com o lado CHANFRADO voltado pra o batente"
 *     (a bevelled face is a sprung latch), "Ajuste do TRINCO … 60mm (2-3/8") … 70mm
 *     (2 3/4")" (an adjustable backset is a sprung latch), and in the finishing step the
 *     knob spindle passes through "o cubo central do TRINCO" while the cylinder blade
 *     passes through "o cubo central da LINGUETA".
 *   - pro-reforma.com: "Trinco: acionada por meio da maçaneta… Lingueta: também
 *     conhecida como tranca, acionada pela chave."
 *
 * So: the handle moves the trinco, the key moves the deadbolt. Our own catalogue already
 * agreed with that in 72 places and followed the bad header in 21 — the header lost.
 *
 * WHY IT MATTERED ENOUGH TO REWRITE 159 RECORDS
 *
 * On model 1073D a Brazilian buyer read, in one spec table, "Saída da lingueta = 13 mm"
 * and "Curso do trinco = 25 mm". Reading those with the manual in his other hand, he gets
 * both numbers backwards — and 13 mm versus 25 mm of throw is the difference between
 * hardware that fits his door preparation and hardware that does not. This is the exact
 * failure the glossary's own header warns about: "A plausible Portuguese row that means
 * something slightly different … on a door it costs a container."
 *
 * WHY THIS IS SAFE TO AUTOMATE, WHEN THE es TRANSLATOR WAS NOT
 *
 * AGENTS.md's rule is that a generator with a "fall back to the source" branch silently
 * undoes hand-improved text. This one has no such branch. It never translates: it rewrites
 * one noun, and only in a row whose ENGLISH counterpart at the same index already says
 * `latch` or `deadbolt`. A row it cannot pair with English is left untouched, and a noun
 * it does not recognise stops the run rather than guessing.
 *
 * `ferrolho` is deliberately not touched — it is the throw bolt in mortise and aluminium
 * bodies, the Bolts label uses it, and it is not part of the confusion.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const CHECK = process.argv.includes("--check");
const DIR = "content/products";

/** The sprung latch: handle-operated. Anything here becomes `trinco`. */
const LATCH_NOUN = /\blingueta(s)?\b/gi;
/** The dead bolt: key-operated. Anything here becomes `trava`. */
const DEAD_NOUN = /\btrinco(s)?\b/gi;

const isLatch = (en) => /\blatch(es)?\b/i.test(en) && !/\bdead\s?bolt/i.test(en);
const isDead = (en) => /\bdead\s?bolt(s)?\b/i.test(en) && !/\blatch(es)?\b/i.test(en);

/**
 * Keep the plural and the capitalisation the source had.
 *
 * `lingueta`/`trinco`/`trava` are all -s plurals, so the plural is just the captured `s`.
 * The capital matters more than it looks: a standalone spec label is "Lingueta", and the
 * first version of this script turned it into "trinco" — a lower-case word alone in the
 * label column of a spec table, on 159 pages. That is not a typo a buyer forgives on a
 * page whose whole argument is that this factory is careful.
 */
const swap = (pt, from, to) =>
  pt.replace(from, (m, s) => {
    const word = s ? `${to}s` : to;
    return m[0] === m[0].toUpperCase() ? word[0].toUpperCase() + word.slice(1) : word;
  });

/*
  Gender. `lingueta` is feminine and `trinco`/`trava` are not both the same, so the article
  in front of the noun has to move with it: "da lingueta" → "do trinco", "o trinco" →
  "a trava". Done as explicit pairs rather than a general agreement rule, because a wrong
  article is the kind of thing a Brazilian reader notices immediately and reads as a
  machine translation — which costs exactly the credibility the spec table is there to buy.
*/
const ARTICLES = [
  [/\bda lingueta\b/g, "do trinco"],
  [/\bDa lingueta\b/g, "Do trinco"],
  [/\bA lingueta\b/g, "O trinco"],
  [/\ba lingueta\b/g, "o trinco"],
  [/\bda(s) lingueta(s)\b/g, "dos trincos"],
  [/\bas linguetas\b/g, "os trincos"],
  [/\buma lingueta\b/g, "um trinco"],
  [/\bdo trinco\b/g, "da trava"],
  [/\bDo trinco\b/g, "Da trava"],
  [/\bO trinco\b/g, "A trava"],
  [/\bo trinco\b/g, "a trava"],
  [/\bdos trincos\b/g, "das travas"],
  [/\bos trincos\b/g, "as travas"],
  [/\bum trinco\b/g, "uma trava"],
];

function fixLatch(pt) {
  let out = pt;
  for (const [re, to] of ARTICLES.slice(0, 7)) out = out.replace(re, to);
  return swap(out, LATCH_NOUN, "trinco");
}

function fixDead(pt) {
  let out = pt;
  for (const [re, to] of ARTICLES.slice(7)) out = out.replace(re, to);
  return swap(out, DEAD_NOUN, "trava");
}

const changed = [];

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const path = `${DIR}/${file}`;
  const raw = readFileSync(path, "utf8");
  const record = JSON.parse(raw);
  if (!Array.isArray(record.specsPt) || !Array.isArray(record.specs)) continue;

  let touched = false;
  record.specsPt = record.specsPt.map((row, i) => {
    const source = record.specs[i];
    /*
      Index pairing, not label matching: specsPt is written as a positional mirror of
      specs, and a label that has been translated no longer matches its English original,
      so matching on the label would skip exactly the rows that need looking at.
    */
    if (!source) return row;
    const en = `${source.label} ${source.value}`;
    const before = `${row.label}\u0000${row.value}`;
    let { label, value } = row;
    if (isLatch(en)) {
      label = fixLatch(label);
      value = fixLatch(value);
    } else if (isDead(en)) {
      label = fixDead(label);
      value = fixDead(value);
    }
    if (`${label}\u0000${value}` !== before) {
      touched = true;
      /* Report whichever half actually moved — most of these are in the value, not the label. */
      const inLabel = label !== row.label;
      changed.push({
        model: record.model,
        en: source.label,
        from: inLabel ? row.label : row.value,
        to: inLabel ? label : value,
      });
    }
    return { ...row, label, value };
  });

  if (!touched) continue;
  /* Preserve the file's own line ending; these records are checked out CRLF on Windows. */
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const next = JSON.stringify(record, null, 2).split("\n").join(eol) + eol;
  if (!CHECK) writeFileSync(path, next, "utf8");
}

if (CHECK) {
  if (changed.length) {
    console.error(`❌ ${changed.length} Portuguese spec rows still use trinco/lingueta the wrong way round.`);
    console.error("   Run: npm run copy:pt-latch");
    for (const c of changed.slice(0, 10)) console.error(`   ${c.model}: ${c.en} — "${c.from}" → "${c.to}"`);
    process.exit(1);
  }
  console.log("✅ Portuguese latch/deadbolt terms are consistent");
} else {
  const models = new Set(changed.map((c) => c.model));
  console.log(`trinco/lingueta: ${changed.length} rows in ${models.size} records`);
}
