/**
 * Guard against the one real hazard of committing build output: source changes that
 * were committed without a rebuild, so the deployed site silently lags the code.
 *
 * Compares the newest mtime under the source directories against the newest under out/.
 * Not a cryptographic guarantee — just enough to catch the ordinary mistake.
 *
 *   node scripts/predeploy-check.mjs
 */
import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const SOURCES = ["src", "content", "public", "next.config.ts", "package.json"];
const OUT = "out";

function newestMtime(path) {
  if (!existsSync(path)) return 0;
  const stats = statSync(path);
  if (!stats.isDirectory()) return stats.mtimeMs;

  let newest = 0;
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    // Never let a stray dot-directory decide the answer.
    if (entry.name.startsWith(".")) continue;
    newest = Math.max(newest, newestMtime(join(path, entry.name)));
  }
  return newest;
}

if (!existsSync(OUT)) {
  console.error("❌ out/ does not exist. Run: npm run build");
  process.exit(1);
}

const newestSource = Math.max(...SOURCES.map(newestMtime));
const newestBuild = newestMtime(OUT);

if (newestSource > newestBuild) {
  const minutes = Math.round((newestSource - newestBuild) / 60000);
  console.error(`❌ Source is ${minutes} minute(s) newer than out/.`);
  console.error("   The committed build would not match the committed source.");
  console.error("   Run: npm run build");
  process.exit(1);
}

console.log("✅ out/ is newer than every source file — safe to commit and deploy.");
