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
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
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
      if (/^src\/lib\/(i18n|language-choices)\.ts$|^src\/data\/locales\.ts$/.test(rel)) continue;
      out.push(p);
    }
  }
  return out;
}

const skipKey = /^(href|ctaHref|src|ratio|slug|model|id|key|kind|variant|code|url|email|phone|reference|coversModel|issuer|address|city|format|tag|type|number|ordinal)$/;
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
  const visit = (node) => {
    if (ts.isCallExpression(node)) {
      const callee = node.expression.getText(sf);
      if (callee === "tx" && node.arguments[1] && (ts.isStringLiteral(node.arguments[1]) || ts.isNoSubstitutionTemplateLiteral(node.arguments[1]))) {
        add(node.arguments[1].text, file, node.arguments[1], sf);
      }
      if (callee === "localeMetadata") {
        for (const arg of node.arguments.slice(2, 4)) {
          if (arg && (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg))) add(arg.text, file, arg, sf);
        }
      }
    }
    if (ts.isPropertyAssignment(node) && node.name.getText(sf) === "en") {
      stringLeaves(node.initializer, file, sf, "en");
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

const sorted = Object.fromEntries([...keys.entries()].sort(([a], [b]) => a.localeCompare(b, "en")));
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n");
console.log(`${OUT}: ${keys.size} interface sentences from src/`);
