import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

// Client 2026-09-23: English reads as American. docs/collaboration/2026-09-24-voice-en-es-pt.md
test("English articles use American spelling", () => {
  const r = spawnSync("node", ["scripts/normalize-us-spelling.mjs", "--check"], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
});
