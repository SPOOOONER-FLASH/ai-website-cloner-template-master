import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/*
 * Every duration on the HYDE site comes from the four --motion-* tokens in globals.css
 * (fast / medium / slow / enter). This guard used to cover five components and one block
 * of globals.css; on 2026-09-24 twenty bare values had crept in around it (180ms written
 * out ten times, configurator entrances at 320 / 380 / 420ms, dialogs at duration-200,
 * the capability chain at duration-300). It now covers every component and stylesheet
 * under src/components/site plus all of globals.css.
 *
 * Allowed: the token definitions themselves, and the 0.01ms reduced-motion override.
 * Comments are stripped before checking, so prose may still say "180ms".
 */

const SITE = "src/components/site";
const files = readdirSync(SITE)
  .filter((f) => /\.(tsx|ts|css)$/.test(f) && !/\.test\.ts$/.test(f))
  .map((f) => join(SITE, f));
files.push("src/app/globals.css");

const BARE_MS = /(?<![\w.-])\d+(?:\.\d+)?ms\b/g;
const TW_DURATION = /\bduration-(?:\d+|\[\d)/g;

const failures = [];
for (const file of files) {
  const source = readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  const lines = source.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (/^\s*--motion-[a-z-]+:\s*\d+ms;/.test(line)) return; // token definitions
    if (/0\.01ms\s*!important/.test(line)) return; // reduced-motion override
    const hits = [...(line.match(BARE_MS) ?? []), ...(line.match(TW_DURATION) ?? [])];
    if (hits.length) failures.push(`${file}:${i + 1}: ${hits.join(", ")} → use var(--motion-fast|medium|slow|enter)`);
  });
}

if (failures.length) {
  console.error(failures.join("\n"));
  console.error(`\n${failures.length} bare motion value(s). Tokens live in src/app/globals.css (-- Motion).`);
  process.exitCode = 1;
} else {
  console.log(`Motion token guard passed: ${files.length} files, every duration uses a --motion-* token.`);
}
