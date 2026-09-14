import { renameSync, writeFileSync } from "node:fs";

/**
 * Writes a file the way this checkout needs it written on Windows: temp file, then rename.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * On 2026-09-14 `npm run deploy:prep` failed six times in a row on this machine, each time
 * with `UNKNOWN: unknown error, open …` (errno -4094) on a different large generated file
 * — `public/search-index.json` one run, `src/data/generated/products.ts` the next. Each
 * file was exclusively writable from a shell a second later.
 *
 * That pattern is a real-time scanner holding the handle, not a bug in any of the
 * generators: the pipeline writes several thousand images and then immediately rewrites a
 * few half-megabyte text files, so those land in the scanner's queue at exactly the wrong
 * moment. Patching one script moved the failure to the next one, which is how it became
 * clear the fix belonged in one place.
 *
 * A direct write exposes the whole operation to interruption. Writing a sibling temp file
 * and renaming it reduces the exposed step to a metadata operation, and the retry covers
 * the case where even that is caught. Three attempts, short backoff; anything still
 * failing after that is a genuine filesystem problem and should stop the build rather than
 * be swallowed.
 *
 * ⚠ This makes the build survive the environment. It does not make the environment right:
 * an antivirus exclusion for the repository removes the failure at source, and that is the
 * client's to set — see docs/collaboration/OPEN-ITEMS.md.
 */
export function writeFileAtomic(target, contents, attempts = 3) {
  const temporary = `${target}.tmp`;
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      writeFileSync(temporary, contents);
      renameSync(temporary, target);
      return;
    } catch (error) {
      lastError = error;
      /* Synchronous by design: every caller is a top-level sync build script. */
      const until = Date.now() + 150 * (attempt + 1);
      while (Date.now() < until) {
        /* wait */
      }
    }
  }

  throw lastError;
}
