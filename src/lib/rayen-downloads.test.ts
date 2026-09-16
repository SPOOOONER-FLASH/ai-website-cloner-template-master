import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { downloads, megabytes } from "../data/rayen-downloads.ts";

const OUT = "out-rayen";
const built = existsSync(OUT);

/**
 * Every advertised download exists and is the size we say it is.
 *
 * The page prints "PDF · 84 页 · 8.4 MB" next to the link. A buyer on mobile data decides
 * whether to tap based on that number, so it is a promise, not decoration — and it is the
 * kind of promise that rots quietly the next time the catalogue is re-exported.
 */

test("每个下载文件都真实存在", () => {
  for (const file of downloads) {
    const path = join("public", file.href.replace(/^\//, ""));
    assert.ok(existsSync(path), `${file.id}: ${path} 不存在`);
  }
});

test("标注的体积与文件实际大小一致", () => {
  for (const file of downloads) {
    const path = join("public", file.href.replace(/^\//, ""));
    const actual = statSync(path).size;
    assert.equal(
      file.bytes,
      actual,
      `${file.id}: 页面写着 ${megabytes(file.bytes)}，文件实际是 ${megabytes(actual)}`,
    );
  }
});

test("下载文件真的被带进了构建产物", { skip: !built }, () => {
  /* out-rayen is assembled by copying the assets the built HTML cites, and that scanner
     only ever looked for /images, /videos and /fonts. The first version of this page
     shipped a link to a PDF that was never copied: the page rendered, the button was
     there, and the download 404'd. Nothing else in the build would have noticed. */
  for (const file of downloads) {
    const path = join(OUT, file.href.replace(/^\//, ""));
    assert.ok(existsSync(path), `${file.id}: 页面链到 ${file.href}，但构建产物里没有这个文件`);
    assert.equal(statSync(path).size, file.bytes, `${file.id}: 构建产物里的文件大小不对`);
  }
});
