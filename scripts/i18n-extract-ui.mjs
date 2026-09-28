#!/usr/bin/env node
/**
 * The interface-copy key set: every English sentence the seven overlay locales can translate.
 *
 * Reads the TypeScript AST of src/ (excluding the RAYEN lane, tests and generated files)
 * and collects:
 *   - the second argument of every `tx(locale, "…")` call, when it is a string literal;
 *   - every string leaf under an `en:` property of an object literal — the `{ en, es, pt }`
 *     copy dictionaries that `dict()` reads through the overlay;
 *   - the first argument of `localeMetadata(locale, "/path", "title", "description")`.
 *
 * Writes content/i18n/ui-keys.json: `{ "<sentence>": ["src/…:line", …] }`, sorted. This is
 * what scripts/i18n-batch.mjs cuts into translation jobs and what
 * scripts/track-locale-mirror.mjs measures coverage against. Committed, so a reviewer can
 * diff which sentences appeared or vanished with a code change.
 *
 * Not extracted: `href` values, class names, model numbers, anything not a sentence a
 * reader sees. A string that is all digits, a path, or shorter than two characters is
 * skipped; `dict()` passes those through untouched anyway.
 */
import ts from "typescript";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { safeWrite } from "./lib/safe-write.mjs";
import { join, relative } from "node:path";

const ROOT = "src";
const OUT = "content/i18n/ui-keys.json";
const keys = new Map();

function files(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const rel = p.replace(/\\/g, "/");
    if (statSync(p).isDirectory()) {
      if (/\/rayen$|\/generated$|\/zh(-en)?$/.test(rel)) continue;
      out.push(...files(p));
    } else if (/\.(ts|tsx)$/.test(entry) && !/\.test\.tsx?$/.test(entry) && !/\.d\.ts$/.test(entry)) {
      if (/rayen/i.test(entry)) continue;
      /* Locale TABLES, not copy: LOCALE_TAG / LANGUAGE_LABELS / LOCALE_DIR are keyed `en:` too,
         and on 2026-09-25 "en-GB" and "English" reached the German writer, who dutifully
         turned them into "de-DE" and "Deutsch". Nothing in these files is a sentence. */
      if (/^src\/lib\/(i18n|i18n-core|i18n-client|language-choices)\.ts$|^src\/data\/locales\.ts$/.test(rel)) continue;
      out.push(p);
    }
  }
  return out;
}

/* Modules whose every export is English copy that a caller maps through the overlay whole
   (src/data/home-locale.ts: `dict({ en }, locale)`). */
const ENGLISH_MODULES = new Set(["src/data/home.ts"]);
/* Data modules whose named fields are English copy read through tx(locale, entry.<field>). */
const FIELD_MODULES = {
  "src/data/finish-codes.ts": /^(name|note)$/,
  "src/data/hardware-terms.ts": /^(term|definition|consequence)$/,
  "src/data/capability.ts": /^(title|label|body)$/,
};
/* Named top-level constants that are English copy read through dict()/tx(): */
const NAMED_CONSTS = {
  "src/lib/configurator.ts": /^OPTION_NOTES$/,
  "src/data/company.ts": /^stats$/,
};

const skipKey =/^(href|ctaHref|src|ratio|slug|model|id|key|kind|variant|code|url|email|phone|reference|coversModel|issuer|address|city|format|tag|type|number|ordinal)$/;
function worth(text) {
  if (typeof text !== "string") return false;
  const t = text.trim();
  if (t.length < 2) return false;
  if (/^[\d\s.,:/×x%+\-–—]+$/.test(t)) return false;
  if (t.startsWith("/") || t.startsWith("http") || t.startsWith("#")) return false;
  if (/^[a-z0-9-]+$/.test(t) && !t.includes(" ")) return false;
  return true;
}

function add(text, file, node, sf) {
  if (!worth(text)) return;
  const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
  const where = `${relative(process.cwd(), file).replace(/\\/g, "/")}:${line + 1}`;
  const list = keys.get(text) ?? [];
  if (!list.includes(where)) list.push(where);
  keys.set(text, list);
}

function stringLeaves(node, file, sf, key = "") {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    if (!skipKey.test(key)) add(node.text, file, node, sf);
  } else if (ts.isArrayLiteralExpression(node)) {
    node.elements.forEach((el) => stringLeaves(el, file, sf, key));
  } else if (ts.isObjectLiteralExpression(node)) {
    for (const prop of node.properties) {
      if (ts.isPropertyAssignment(prop)) {
        const name = prop.name.getText(sf).replace(/["']/g, "");
        stringLeaves(prop.initializer, file, sf, name);
      }
    }
  } else if (ts.isAsExpression(node) || ts.isParenthesizedExpression(node) || ts.isSatisfiesExpression?.(node)) {
    stringLeaves(node.expression, file, sf, key);
  }
}

for (const file of files(ROOT)) {
  const source = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  /* Top-level `const NAME = <literal>` in this file, for `en: NAME` references. */
  const declarations = new Map();
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st)) continue;
    for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name) && d.initializer) declarations.set(d.name.text, d.initializer);
  }
  const visit = (node) => {
    if (ts.isCallExpression(node)) {
      const callee = node.expression.getText(sf);
      /*
        `say(en, es, pt)` / `pick(en, es, pt)` are the per-component wrappers around tx() in the
        header, footer, menu drawer, HardwareTerms and ProjectCard. Their first argument is the
        key; until 2026-09-27 none of the footer's sentences ("Data preferences", "How to buy",
        "Sign-up here") reached ui-keys.json, so all 748 pages of every locale printed them.
      */
      const literal = (arg) => arg && (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg)) ? arg : null;
      const keyArg = callee === "tx" ? literal(node.arguments[1]) : callee === "say" || callee === "pick" ? literal(node.arguments[0]) : null;
      if (keyArg) add(keyArg.text, file, keyArg, sf);
      if (callee === "localeMetadata") {
        for (const arg of node.arguments.slice(2, 4)) {
          if (arg && (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg))) add(arg.text, file, arg, sf);
        }
      }
    }
    const fieldRule = FIELD_MODULES[relative(process.cwd(), file).replace(/\\/g, "/")];
    const underLocaleObject = (n) => { for (let p = n.parent; p; p = p.parent) if (ts.isPropertyAssignment(p) && /^(es|pt)$/.test(p.name.getText(sf))) return true; return false; };
    if (ts.isPropertyAssignment(node) && (/^en[A-Z]?$/.test(node.name.getText(sf)) || (fieldRule && fieldRule.test(node.name.getText(sf)) && !underLocaleObject(node)))) {
      /*
        `en:` (and `enA:`, the FAQ answer templates) may hold a literal or an identifier —
        CompanyOverview writes dict({ en: profile, es: profileEs }) with `profile` declared
        above. Follow the identifier to its declaration in the same file (2026-09-26; the
        company page was English in seven languages because these never reached ui.json).
      */
      const init = node.initializer;
      if (ts.isIdentifier(init)) {
        const decl = declarations.get(init.text);
        if (decl) stringLeaves(decl, file, sf, "en");
      } else {
        stringLeaves(init, file, sf, "en");
      }
    }
    /* Whole English modules read through the overlay as `dict({ en: module }, locale)` — see
       ENGLISH_MODULES. Their exports carry no `en:` key, so without this the home page's
       carousel, cards and editorial modules were never extracted and printed in English
       on all seven overlay locales (found 2026-09-26). */
    const rel = relative(process.cwd(), file).replace(/\\/g, "/");
    const named = NAMED_CONSTS[rel];
    if ((ENGLISH_MODULES.has(rel) || (named && ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && named.test(node.name.text))) && ts.isVariableDeclaration(node) && node.initializer && ts.isSourceFile(node.parent?.parent?.parent)) {
      stringLeaves(node.initializer, file, sf, "");
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

/* Article bylines: content/{news,guides}/*.json author.role is rendered through tx() in NewsDetail. */
for (const folder of ["news", "guides"]) {
  for (const f of readdirSync(`content/${folder}`)) {
    if (!f.endsWith(".json")) continue;
    const article = JSON.parse(readFileSync(`content/${folder}/${f}`, "utf8"));
    /* author.role, attachment.title/note: NewsDetail renders each through tx(locale, en, { es, pt }). */
    for (const text of [article.author?.role, article.attachment?.title, article.attachment?.note]) {
      if (!worth(text)) continue;
      const where = `content/${folder}/${f}`;
      const list = keys.get(text) ?? [];
      if (!list.includes(where)) list.push(where);
      keys.set(text, list);
    }
  }
}

/* Category positioning (src/data/category-positioning.json): pitch is rendered through tx() in CategoryGuide. */
for (const [slug, entry] of Object.entries(JSON.parse(readFileSync("src/data/category-positioning.json", "utf8")))) {
  if (slug.startsWith("_") || !entry || typeof entry !== "object") continue;
  const text = entry.pitch;
  if (!worth(text)) continue;
  const where = "src/data/category-positioning.json";
  const list = keys.get(text) ?? [];
  if (!list.includes(where)) list.push(where);
  keys.set(text, list);
}

/* 3D model scope notes: public/downloads/models/index.json scope.en is rendered through dict() in ProductModel. */
for (const m of JSON.parse(readFileSync("public/downloads/models/index.json", "utf8"))) {
  const en = m?.scope?.en;
  if (worth(en)) {
    const where = "public/downloads/models/index.json";
    const list = keys.get(en) ?? [];
    if (!list.includes(where)) list.push(where);
    keys.set(en, list);
  }
}

const sorted = Object.fromEntries([...keys.entries()].sort(([a], [b]) => a.localeCompare(b, "en")));
safeWrite(OUT, JSON.stringify(sorted, null, 2) + "\n");
console.log(`${OUT}: ${keys.size} interface sentences from src/`);
