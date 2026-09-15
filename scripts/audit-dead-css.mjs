/**
 * Hand-written CSS classes that nothing on the site uses any more.
 *
 *   node scripts/audit-dead-css.mjs            list them
 *   node scripts/audit-dead-css.mjs --check    exit 1 if any are found
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS NOT "GREP THE BUILT HTML"
 *
 * That was the first version, and it reported 59 dead classes. Fifty-nine would have been
 * a satisfying number to delete and about forty of them would have broken the site.
 *
 * The configurator is loaded with `ssr: false` — it has to be, or its Suspense boundary
 * never resolves under `output: "export"` — so every one of its `config-*` classes is
 * absent from the static HTML and present in the running page. The mobile navigation
 * drawer is the same: its markup exists only after a tap. A class that no crawler ever
 * sees is not an unused class, it is a class used by the half of the site that runs in
 * the browser.
 *
 * So a class counts as used if it appears in the built HTML **or** anywhere under src/.
 * What survives both is genuinely orphaned: a rule left behind when the component that
 * used it was deleted.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS IS AND IS NOT WORTH
 *
 * Be honest about the size of the prize. globals.css is ~64KB of the ~86KB main stylesheet,
 * and the orphaned rules found here are a couple of kilobytes of it — which is a few
 * hundred bytes after compression, and will not move a PageSpeed number. The render-blocking
 * cost of that stylesheet is round trips, not bytes.
 *
 * It is worth running anyway for the reason every audit in this repository is worth
 * running: a rule nobody uses is a rule the next person has to reason about. This finds
 * them in a second instead of never.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const CSS_FILE = "src/app/globals.css";
const SOURCE_DIRECTORIES = ["src"];
const BUILD_DIRECTORIES = ["out", "out-rayen"];

/**
 * Class selectors this file defines.
 *
 * Anchored to the start of a line so that a class named inside a comment or a longer
 * selector chain does not register as a definition on its own.
 */
function definedClasses(css) {
  const names = new Set();
  for (const match of css.matchAll(/^\s*\.([a-zA-Z][\w-]*)/gm)) names.add(match[1]);
  return names;
}

function walk(directory, extensions, onFile) {
  let entries;
  try {
    entries = readdirSync(directory, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(path, extensions, onFile);
    } else if (extensions.some((extension) => entry.name.endsWith(extension))) {
      onFile(path);
    }
  }
}

const css = readFileSync(CSS_FILE, "utf8");
const defined = definedClasses(css);

/** Every word that appears in the source. Coarse on purpose — a false "used" is cheap. */
const seen = new Set();
for (const directory of SOURCE_DIRECTORIES) {
  walk(directory, [".tsx", ".ts", ".json", ".css"], (path) => {
    if (path.replaceAll("\\", "/").endsWith(CSS_FILE)) return;
    for (const match of readFileSync(path, "utf8").matchAll(/[a-zA-Z][\w-]*/g)) {
      seen.add(match[0]);
    }
  });
}

let builtPages = 0;
for (const directory of BUILD_DIRECTORIES) {
  try {
    statSync(directory);
  } catch {
    continue;
  }
  walk(directory, [".html"], (path) => {
    builtPages += 1;
    const html = readFileSync(path, "utf8");
    for (const match of html.matchAll(/class="([^"]*)"/g)) {
      for (const name of match[1].split(/\s+/)) if (name) seen.add(name);
    }
  });
}

const orphaned = [...defined].filter((name) => !seen.has(name)).sort();

/** Roughly how much CSS the orphaned rules account for. */
let bytes = 0;
for (const name of orphaned) {
  const escaped = name.replaceAll("-", "\\-");
  const rule = new RegExp(`(^|\\n)[^\\n{]*\\.${escaped}\\b[^{]*\\{[^}]*\\}`, "g");
  for (const match of css.matchAll(rule)) bytes += match[0].length;
}

console.log(
  `globals.css: ${defined.size} class selectors, ${builtPages} built pages scanned, ` +
    `${orphaned.length} used nowhere (~${bytes} bytes of rules)`,
);

if (!orphaned.length) process.exit(0);

for (const name of orphaned) console.log(`  .${name}`);

if (process.argv.includes("--check")) {
  console.error(
    "\n❌ these rules are defined and used nowhere — delete them, or use them.\n" +
      "   A class only used by a client-rendered component still counts as used: it is in src/.",
  );
  process.exit(1);
}
