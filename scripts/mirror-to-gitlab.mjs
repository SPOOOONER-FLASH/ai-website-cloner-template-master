#!/usr/bin/env node
/*
 * Mirrors the current origin/main SNAPSHOT to GitLab, for the server to pull from.
 *
 * Why (2026-10-12): GitHub hid the SPOOOONER-FLASH account; the server's fetch returns
 * "Repository not found" even with a read-only deploy key. The server now pulls from
 * gitlab.com/cantonlock-hyde-group/CANTONLOCK-HYDE-project instead.
 *
 * Why a snapshot chain and not the history: the local pack is 9.25 GiB, over GitLab's free
 * 10 GiB limit. The server only needs the files at the tip, so each run makes ONE commit
 * whose tree is origin/main's tree and whose parent is the previous GitLab main; a push
 * then carries only the files that changed.
 *
 *   node scripts/mirror-to-gitlab.mjs            # after every release push to origin
 *   node scripts/mirror-to-gitlab.mjs --ref <commit>
 */
import { execFileSync } from "node:child_process";

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 1 << 26 }).trim();
const refArg = process.argv.indexOf("--ref");
const source = refArg > -1 ? process.argv[refArg + 1] : "origin/main";

if (refArg === -1) git("fetch", "-q", "origin", "main");
const tree = git("rev-parse", `${source}^{tree}`);
const sourceSha = git("rev-parse", source);

let parent = null;
try {
  git("fetch", "-q", "gitlab", "main");
  parent = git("rev-parse", "gitlab/main");
} catch {
  console.log("GitLab main does not exist yet: first snapshot.");
}
if (parent && git("rev-parse", `${parent}^{tree}`) === tree) {
  console.log(`GitLab already at ${sourceSha.slice(0, 11)}'s tree; nothing to push.`);
  process.exit(0);
}

const message = `snapshot of ${sourceSha.slice(0, 11)} (origin/main)`;
const args = ["commit-tree", tree, "-m", message, ...(parent ? ["-p", parent] : [])];
const commit = execFileSync("git", args, { encoding: "utf8" }).trim();
execFileSync("git", ["-c", "http.postBuffer=524288000", "push", "gitlab", `${commit}:refs/heads/main`], { stdio: "inherit" });
console.log(`✓ GitLab main = ${commit.slice(0, 11)} (tree of ${sourceSha.slice(0, 11)})`);
