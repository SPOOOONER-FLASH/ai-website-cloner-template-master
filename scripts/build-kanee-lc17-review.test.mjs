import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import sharp from "sharp";

test("LC17 review retains every cropped source pixel under the stated uniform exposure", async () => {
  const output = await mkdtemp(resolve("tmp/codex-lc17-test-"));
  const run = spawnSync(process.execPath, ["scripts/build-kanee-lc17-review.mjs", output], { encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr);
  const master = await sharp(resolve(output, "lc17-pale-native-photo.png")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(master.info.width, 1000);
  assert.equal(master.info.height, 850);
  const original = await sharp("docs/design-references/kanee-lc17-native-photo-2026-10-09/sources/lc17-view-3.webp").ensureAlpha().raw().toBuffer();
  for (let i = 0; i < master.data.length; i++) {
    const channel = i % 4;
    const source = original[i + 150 * 1000 * 4];
    assert.equal(master.data[i], channel === 3 ? source : Math.round(source * 0.94), `channel offset ${i}`);
  }
  const provenance = JSON.parse(await readFile(resolve(output, "provenance.json"), "utf8"));
  assert.equal(provenance.source.sha256, "2dbb3cee9f1b486bf7cc280e4f6da5348deb2a8723e2bbfc9d76fe5c587a9af3");
  assert.equal(provenance.qa.verifiedRgbaChannels, 3400000);
  assert.equal(provenance.clientApproval, "pending");
  const webp = await sharp(resolve(output, "lc17-pale-native-photo.webp")).metadata();
  assert.equal(webp.width, 1000);
  assert.equal(webp.height, 850);
});
