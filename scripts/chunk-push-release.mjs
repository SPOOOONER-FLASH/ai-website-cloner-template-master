#!/usr/bin/env node
/**
 * Push a release whose out/ is too large for one `git push`, without ever deploying half
 * of it (client, 2026-09-28: 「每个目录单独推一次」).
 *
 * r8 was 46,188 files; five single pushes died on GitHub 408s and dropped connections, and
 * one that did finish was rejected because main had moved meanwhile. The server deploys
 * whatever main points at every five minutes, so batches must not land on main.
 *
 * So:
 *   1. Batches go to a side branch (default refs/heads/release-upload-tmp), which nothing
 *      deploys. Batch k is a commit whose out/ holds the release's out/ entries for batches
 *      1..k on top of the base's out/, parented on batch k-1: each push sends only the new
 *      objects. Big directories go alone; small ones are grouped up to --max files.
 *   2. When every object is on GitHub, one commit is made on the CURRENT origin/main with
 *      that tree's out/ replaced by the release's out/ — nothing else changes, so work other
 *      sessions pushed meanwhile is kept — and pushed to main. It is a few KB.
 *   3. The side branch is deleted.
 * Every push is tried three times (the shared rule: three failures, record and move on).
 *
 * Run in the release checkout, with HEAD = the release commit and HEAD~1 = its base:
 *   node scripts/chunk-push-release.mjs --repo <release checkout> [--max 3500] [--dry]
 */
import { execFileSync, spawnSync } from "node:child_process";

const arg = (n, d) => {
  const i = process.argv.indexOf(n);
  return i > -1 ? process.argv[i + 1] : d;
};
const REPO = arg("--repo", ".");
const MAX = Number(arg("--max", 3500));
const BRANCH = arg("--branch", "release-upload-tmp");
const DRY = process.argv.includes("--dry");

const git = (...a) => execFileSync("git", ["-C", REPO, ...a], { encoding: "utf8", maxBuffer: 512 * 1024 * 1024 }).trim();
const gitIn = (input, ...a) => execFileSync("git", ["-C", REPO, ...a], { input, encoding: "utf8", maxBuffer: 512 * 1024 * 1024 }).trim();

function push(refspec, label) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    console.log(`  push ${label} (attempt ${attempt}/3)`);
    if (DRY) return true;
    const r = spawnSync("git", ["-C", REPO, "-c", "http.postBuffer=524288000", "push", "--force", "origin", refspec], {
      encoding: "utf8",
      timeout: 15 * 60 * 1000,
    });
    if (r.status === 0) return true;
    console.log(`    failed: ${(r.stderr || r.error?.message || "").split("\n").filter(Boolean).slice(-2).join(" | ")}`);
  }
  return false;
}

/** Entries of a tree as mktree lines, keyed by name. */
const entries = (tree) =>
  new Map(
    git("ls-tree", tree)
      .split("\n")
      .filter(Boolean)
      .map((line) => [line.split("\t")[1], line]),
  );
const mktree = (map) => gitIn([...map.values()].join("\n") + "\n", "mktree");
const withOut = (rootTree, outTree) => {
  const root = entries(rootTree);
  root.set("out", `040000 tree ${outTree}\tout`);
  return mktree(root);
};

const release = git("rev-parse", "HEAD");
const base = git("rev-parse", "HEAD~1");
const subject = git("log", "-1", "--format=%s", release);
const releaseOut = git("rev-parse", `${release}:out`);
const baseOut = git("rev-parse", `${base}:out`);
console.log(`release ${release.slice(0, 11)} "${subject}"\nbase    ${base.slice(0, 11)}`);

// Size each top-level entry of the release's out/.
const relOut = entries(releaseOut);
const sized = [...relOut.entries()].map(([name, line]) => {
  const isTree = line.split(" ")[1] === "tree";
  const n = isTree ? git("ls-tree", "-r", "--name-only", `${release}:out/${name}`).split("\n").filter(Boolean).length : 1;
  return { name, n };
});
sized.sort((a, b) => b.n - a.n);
const batches = [];
for (const item of sized) {
  const open = batches.find((b) => b.n + item.n <= MAX && item.n < MAX);
  if (open && item.n < MAX) {
    open.names.push(item.name);
    open.n += item.n;
  } else batches.push({ names: [item.name], n: item.n });
}
console.log(`${sized.reduce((s, x) => s + x.n, 0)} files in out/ → ${batches.length} batches`);

// 1. Side-branch batches.
const outMap = entries(baseOut);
let parent = base;
for (const [i, b] of batches.entries()) {
  for (const name of b.names) outMap.set(name, relOut.get(name));
  const tree = withOut(`${base}^{tree}`, mktree(outMap));
  const commit = gitIn(`upload batch ${i + 1}/${batches.length}: ${b.names.slice(0, 4).join(", ")}${b.names.length > 4 ? " …" : ""}\n`, "commit-tree", tree, "-p", parent);
  console.log(`batch ${i + 1}/${batches.length}: ${b.n} files (${b.names.slice(0, 6).join(", ")}${b.names.length > 6 ? ", …" : ""})`);
  if (!push(`${commit}:refs/heads/${BRANCH}`, `batch ${i + 1}`)) {
    console.error(`✗ batch ${i + 1} failed three times. Nothing reached main. Re-run to continue: pushed objects stay on GitHub.`);
    process.exit(75);
  }
  parent = commit;
}

// 2. One small commit on the current main.
if (!DRY) git("fetch", "origin", "main");
const main = git("rev-parse", "origin/main");
const finalTree = withOut(`${main}^{tree}`, releaseOut);
const final = gitIn(`${subject}\n\nPushed in ${batches.length} batches via ${BRANCH} (scripts/chunk-push-release.mjs); out/ from ${release.slice(0, 11)}, everything else from ${main.slice(0, 11)}.\n`, "commit-tree", finalTree, "-p", main);
console.log(`final ${final.slice(0, 11)} on main ${main.slice(0, 11)}`);
if (!push(`${final}:refs/heads/main`, "main")) {
  console.error("✗ the final main push failed three times; the upload branch is complete, re-run to retry.");
  process.exit(75);
}
// 3. Tidy up.
if (!DRY) spawnSync("git", ["-C", REPO, "push", "origin", "--delete", BRANCH], { encoding: "utf8", timeout: 5 * 60 * 1000 });
console.log(`✓ released: main is ${final.slice(0, 11)}`);
