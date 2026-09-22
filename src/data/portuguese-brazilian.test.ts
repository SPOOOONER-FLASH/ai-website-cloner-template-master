import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

/**
 * The Portuguese in this tree is BRAZILIAN, and this is the only thing that keeps it so.
 *
 * ---------------------------------------------------------------------------
 * WHY IT MATTERS HERE MORE THAN IT WOULD ELSEWHERE
 *
 * `src/data/news.ts` and the Article markup both declare `pt-BR`, because Brazil is the
 * market this tree was built for. But the copy arrived over several sessions and several
 * hands, and by 2026-09-17 it said `equipa`, `actual`, `selecção`, `Descarregáveis`,
 * `ficheiros`, `contacto` and `está a ser preparada` — European Portuguese, on pages whose
 * own markup says pt-BR.
 *
 * A Brazilian specifier still reads European Portuguese; they just read it as foreign.
 * That is the one thing a site arguing "this factory is careful" cannot afford, and it is
 * invisible to both page audits: `audit:pt:pages` looks for ENGLISH and `audit:pt:spanish`
 * looks for SPANISH. Neither can see a Portuguese page written for the wrong Portugal.
 *
 * ---------------------------------------------------------------------------
 * WHY A TEST RATHER THAN A SWEEP
 *
 * The 2026-09-17 sweep fixed every occurrence by hand. A hand sweep holds until the next
 * paragraph somebody writes — and the words below are exactly the ones a writer reaches
 * for without noticing, which is why nobody's eye is a control either.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS SCANNED, AND WHY IT IS NOT "EVERY FILE"
 *
 * Only text that is definitely Portuguese:
 *
 *   1. files that are entirely Portuguese — `src/app/pt/**`, `src/data/pt-*.ts`,
 *      `src/data/home-pt.ts`;
 *   2. everywhere else, the CONTENTS of a `pt: { … }` block and the VALUE of a `*Pt`
 *      field, in source and in the content JSON alike.
 *
 * The distinction is not fussiness. `actual`, `contacto`, `stock` and `seleccionado` are
 * ordinary words in English or in Spanish, and this repo is full of both — a scan that
 * swept whole files would fail on an English comment and teach the next session to delete
 * the test. Comments are blanked for the same reason: "the actual first question" appears
 * in a code comment in `src/lib/product-faq.ts` and is not a defect.
 */

const ROOT = process.cwd();

/**
 * European forms with no other reading in this codebase.
 *
 * Deliberately short. A word that is also correct Brazilian, or that is a plausible
 * Spanish or English word inside a Portuguese string, does not belong here — the cost of a
 * false positive is that somebody spends an afternoon proving a correct page wrong, and
 * then removes the guard.
 */
const EUROPEAN: { pattern: RegExp; brazilian: string }[] = [
  { pattern: /\bequipas?\b/i, brazilian: "equipe" },
  { pattern: /\bactual(mente)?\b/i, brazilian: "atual / atualmente" },
  { pattern: /\bselec[cç][ãa]o\b/i, brazilian: "seleção" },
  { pattern: /\bselec[cç]ionad[ao]s?\b/i, brazilian: "selecionado(s)" },
  { pattern: /\binspec[cç][ãa]o\b/i, brazilian: "inspeção" },
  { pattern: /\bdirect[ao](mente)?\b/i, brazilian: "direto / diretamente" },
  { pattern: /\bcontact[oa]s?\b/i, brazilian: "contato(s)" },
  { pattern: /\bcontactar\b/i, brazilian: "entrar em contato" },
  /*
    `projectos?`, not `projecto?s?`. The second also matches the English word "project",
    and this repo has a /projects/ route — the first draft of this list reported twenty
    English identifiers as European Portuguese.
  */
  { pattern: /\bprojectos?\b/i, brazilian: "projeto(s)" },
  { pattern: /\bficheiros?\b/i, brazilian: "arquivo(s)" },
  { pattern: /\bdescarreg(ar|ável|áveis)\b/i, brazilian: "baixar / downloads" },
  { pattern: /\bregisto\b/i, brazilian: "registro" },
  { pattern: /\bfacto\b/i, brazilian: "fato" },
  { pattern: /\bplaneado\b/i, brazilian: "planejado" },
  { pattern: /\bpercentagem\b/i, brazilian: "porcentagem" },
  { pattern: /\becrã\b/i, brazilian: "tela" },
  { pattern: /\butilizador(es)?\b/i, brazilian: "usuário(s)" },
  { pattern: /\bcasa de banho\b/i, brazilian: "banheiro" },
  { pattern: /\bautocarro\b/i, brazilian: "ônibus" },
  { pattern: /\bcomboio\b/i, brazilian: "trem" },
  { pattern: /\bcorrec[cç][ãa]o\b/i, brazilian: "correção" },
  { pattern: /\bexcep[cç][ãa]o\b/i, brazilian: "exceção" },
  /*
    The European progressive. Brazilian uses the gerund: "está sendo preparada".

    The word after `a` must be an INFINITIVE, and "ends in r" is not that test. Portuguese
    comparatives end in r too, so `[a-zà-ÿ]+r` reported "entre esses dois casos está a
    maior parte do mundo" — correct Brazilian Portuguese, in a published article — as a
    European construction. A guard that cries over good prose is a guard somebody deletes,
    so the comparatives are excluded by name and the ending is narrowed to real verb endings.
  */
  {
    pattern: /\best(á|ão) a (?!(?:maior|menor|melhor|pior|[a-zà-ÿ]*erior)\b)[a-zà-ÿ]+(?:ar|er|ir|ôr)\b/i,
    brazilian: "está/estão + gerúndio",
  },
  /* Brazilian drops the initial h in these two; European keeps it. */
  { pattern: /\bhumidade\b/i, brazilian: "umidade" },
  /*
    Added 2026-09-21 after the second guides batch. Each of these was written by an
    agent drafting Portuguese directly rather than translating, which is where European
    forms leak in — they are the spelling that comes to hand, not a mistake anybody
    would make consciously. `crómio` appeared eight times across two finish articles
    before anybody looked.
  */
  { pattern: /\bcrómio\b/i, brazilian: "cromo" },
  { pattern: /\btelemóve(l|is)\b/i, brazilian: "celular(es)" },
  { pattern: /\balcatifas?\b/i, brazilian: "carpete" },
];

/** Blanks comments, keeping line numbers intact so a report points at the real line. */
function withoutComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, (match) =>
    match.replace(/[^\n]/g, " "),
  );
}

function filesUnder(dir: string, match: (name: string) => boolean): string[] {
  const root = path.join(ROOT, dir);
  if (!fs.existsSync(root)) return [];
  const found: string[] = [];
  const walk = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (match(entry.name)) found.push(full);
    }
  };
  walk(root);
  return found;
}

/** Every file whose entire contents are Portuguese copy. */
function portugueseFiles(): string[] {
  const appPt = filesUnder("src/app/pt", (n) => n.endsWith(".tsx") || n.endsWith(".ts"));
  const data = fs
    .readdirSync(path.join(ROOT, "src/data"))
    .filter((n) => /^(pt-|home-pt)/.test(n) && n.endsWith(".ts") && !n.endsWith(".test.ts"))
    .map((n) => path.join(ROOT, "src/data", n));
  return [...appPt, ...data];
}

/**
 * The Portuguese TEXT of a mixed file.
 *
 * Two shapes, and the difference matters. A `pt: { … }` block is Portuguese from brace to
 * brace, so its lines are taken whole. A `*Pt` field is one Portuguese value on a line
 * that usually has its Spanish sibling beside it — taking the LINE there reported
 * `labelEs: "Contacto"` as European Portuguese, which is correct Spanish and exactly the
 * false positive that gets a guard deleted. So the value is extracted, not the line.
 */
function portugueseText(source: string): [number, string][] {
  const lines = withoutComments(source).split("\n");
  const picked: [number, string][] = [];
  let blockDepth = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (blockDepth > 0) {
      blockDepth += (line.match(/[{[]/g) ?? []).length - (line.match(/[}\]]/g) ?? []).length;
      if (blockDepth > 0) picked.push([i + 1, line]);
      continue;
    }

    if (/^\s{2,}"?pt"?:\s*\{/.test(line)) {
      blockDepth = 1;
      continue;
    }

    /* `namePt: "…"` / `"summaryPt": "…"` — the value only. */
    for (const match of line.matchAll(/[A-Za-z]+Pt"?\s*:\s*"((?:[^"\\]|\\.)*)"/g)) {
      picked.push([i + 1, match[1]]);
    }

    /* The same field with its value wrapped onto the next line, as prettier does. */
    if (/[A-Za-z]+Pt"?\s*:\s*$/.test(line)) {
      const value = (lines[i + 1] ?? "").match(/^\s*"((?:[^"\\]|\\.)*)"/);
      if (value) picked.push([i + 2, value[1]]);
    }
  }

  return picked;
}

function offences(text: string): string[] {
  const hits: string[] = [];
  for (const { pattern, brazilian } of EUROPEAN) {
    const found = text.match(pattern);
    if (found) hits.push(`"${found[0]}" → ${brazilian}`);
  }
  return hits;
}

/**
 * The Portuguese strings of a content JSON, found by PARSING rather than by line regex.
 *
 * The line-based reader above cannot see most of them, and the gap was invisible until it
 * cost something. `"bodyPt": [` has no string after the colon, so the `*Pt` pattern misses,
 * and the fallback that reads the NEXT line picks up the first array element and stops —
 * so a 27-paragraph article was being checked one paragraph deep. `faq.pt` is worse: the
 * key is bare `pt`, not `*Pt`, so the whole FAQ was never read at all.
 *
 * That let `registos` through fourteen times across three guide articles on 2026-09-21.
 * Parsing the JSON and walking it removes the entire class: every string under a key ending
 * in `Pt`, and every string anywhere beneath a `pt` key, whatever the nesting.
 */
function portugueseStringsInJson(source: string): [string, string][] {
  let root: unknown;
  try {
    root = JSON.parse(source);
  } catch {
    return []; // Not our problem to report here; the content loader will fail louder.
  }

  const found: [string, string][] = [];
  const walk = (node: unknown, path: string, inPortuguese: boolean) => {
    if (typeof node === "string") {
      if (inPortuguese) found.push([path, node]);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((child, i) => walk(child, `${path}[${i}]`, inPortuguese));
      return;
    }
    if (node && typeof node === "object") {
      for (const [key, value] of Object.entries(node)) {
        const portuguese = inPortuguese || key === "pt" || /Pt$/.test(key);
        walk(value, path ? `${path}.${key}` : key, portuguese);
      }
    }
  };

  walk(root, "", false);
  return found;
}

test("the Portuguese tree is written in Brazilian Portuguese", () => {
  const failures: string[] = [];
  const whole = portugueseFiles();

  for (const file of whole) {
    const relative = path.relative(ROOT, file).replace(/\\/g, "/");
    withoutComments(fs.readFileSync(file, "utf8"))
      .split("\n")
      .forEach((line, index) => {
        for (const hit of offences(line)) failures.push(`${relative}:${index + 1}  ${hit}`);
      });
  }

  /*
    Everywhere else Portuguese can hide: the locale blocks of shared components, the `*Pt`
    fields of the data modules, and the content JSON — where the FAQ, the categories, the
    applications and 35 article bodies live.
  */
  const isSource = (n: string) =>
    (n.endsWith(".ts") || n.endsWith(".tsx")) && !n.endsWith(".test.ts");
  const mixed = [
    ...filesUnder("src/components", isSource),
    ...filesUnder("src/lib", isSource),
    ...filesUnder("src/data", isSource),
    ...filesUnder("src/app", isSource),
    ...filesUnder("content", (n) => n.endsWith(".json")),
  ];

  for (const file of mixed) {
    if (whole.includes(file)) continue;
    const relative = path.relative(ROOT, file).replace(/\\/g, "/");
    const source = fs.readFileSync(file, "utf8");

    if (file.endsWith(".json")) {
      for (const [where, text] of portugueseStringsInJson(source)) {
        for (const hit of offences(text)) failures.push(`${relative}  ${where}  ${hit}`);
      }
      continue;
    }

    for (const [lineNumber, text] of portugueseText(source)) {
      for (const hit of offences(text)) failures.push(`${relative}:${lineNumber}  ${hit}`);
    }
  }

  assert.deepEqual(
    failures,
    [],
    "European Portuguese in a tree that declares pt-BR. A Brazilian specifier reads these " +
      "as foreign, and neither page audit can see them — audit:pt:pages looks for English " +
      "and audit:pt:spanish looks for Spanish.",
  );
});
