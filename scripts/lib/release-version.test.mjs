import assert from "node:assert/strict";
import test from "node:test";
import { assignVersions, nextVersion, releaseType } from "./release-version.mjs";

const r = (when, subject = "发布（HYDE（cantonlock.com））：构建 abc1234") => ({ sha: when, when, subject });

test("versions count within the release-clock day and restart the next day", () => {
  const v = assignVersions([r("2026-10-13T08:00:00Z"), r("2026-10-13T20:00:00Z"), r("2026-10-14T09:00:00Z")]);
  assert.deepEqual(v.map((x) => x.version), ["v2026.10.13.1", "v2026.10.13.2", "v2026.10.14.1"]);
});

test("a version stamped in the subject wins, and nextVersion continues the day", () => {
  const v = assignVersions([r("2026-10-13T08:00:00Z", "发布（HYDE（cantonlock.com）） v2026.10.13.7：构建 abc1234")]);
  assert.equal(v[0].version, "v2026.10.13.7");
  assert.equal(nextVersion([r("2026-10-13T08:00:00Z")], "2026-10-13T23:00:00Z"), "v2026.10.13.2");
});

test("hotfix only when every change is a fix", () => {
  assert.equal(releaseType(["首页链接 404 修复", "补 srcSet 解开阻断"]), "Hotfix");
  assert.equal(releaseType(["首页链接 404 修复", "新指南：防火门年检"]), "Update");
  assert.equal(releaseType([]), "Update");
});
