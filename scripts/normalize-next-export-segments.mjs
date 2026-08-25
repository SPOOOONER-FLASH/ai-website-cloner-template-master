import {
  copyFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";

const outRoot = resolve("out");
const checkOnly = process.argv.includes("--check");

if (!existsSync(outRoot)) {
  throw new Error("out/ does not exist. Run npm run build first.");
}

function assertInsideOut(path) {
  const resolved = resolve(path);
  if (resolved !== outRoot && !resolved.startsWith(`${outRoot}${sep}`)) {
    throw new Error(`Refusing to modify a path outside out/: ${resolved}`);
  }
}

function collectMalformedDirectories(directory, results = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const child = join(directory, entry.name);
    if (entry.name.startsWith("__next.")) {
      results.push(child);
    } else {
      collectMalformedDirectories(child, results);
    }
  }
  return results;
}

function collectFiles(directory, results = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const child = join(directory, entry.name);
    if (entry.isDirectory()) collectFiles(child, results);
    else results.push(child);
  }
  return results;
}

const malformedDirectories = collectMalformedDirectories(outRoot);
if (checkOnly && malformedDirectories.length > 0) {
  throw new Error(
    `Found ${malformedDirectories.length} Windows-style nested Next segment directories.`,
  );
}

let normalizedFiles = 0;
for (const segmentDirectory of malformedDirectories) {
  assertInsideOut(segmentDirectory);
  const parent = dirname(segmentDirectory);
  const sources = collectFiles(segmentDirectory);

  // The Next 16.3 Windows regression produces only nested `__PAGE__.txt`
  // payloads. Refuse unfamiliar content instead of flattening and deleting a
  // future legitimate public asset directory that happens to share the prefix.
  if (
    sources.length === 0 ||
    sources.some((source) => basename(source) !== "__PAGE__.txt")
  ) {
    throw new Error(
      `Refusing to normalize an unfamiliar __next.* directory: ${segmentDirectory}`,
    );
  }

  for (const source of sources) {
    assertInsideOut(source);
    const relativeParts = relative(segmentDirectory, source).split(sep);
    const flatName = [basename(segmentDirectory), ...relativeParts].join(".");
    const destination = join(parent, flatName);
    assertInsideOut(destination);

    if (existsSync(destination)) {
      const existing = readFileSync(destination);
      const incoming = readFileSync(source);
      if (!existing.equals(incoming)) {
        throw new Error(`Refusing to overwrite a different segment payload: ${destination}`);
      }
    } else {
      copyFileSync(source, destination);
    }
    normalizedFiles += 1;
  }

  rmSync(segmentDirectory, { recursive: true, force: false });
}

console.log(
  normalizedFiles > 0
    ? `Normalized ${normalizedFiles} Next segment payloads from ${malformedDirectories.length} directories.`
    : "Next segment payload layout is already portable.",
);
