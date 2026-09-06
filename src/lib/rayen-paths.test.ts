import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

/**
 * Guards the one assumption that makes the RAYEN 雷茵 site work.
 *
 * The pages are built at /zh/... and deployed at the root of RAYEN's own host.
 * scripts/build-rayen-site.mjs bridges the two by rewriting "/zh/" out of the built HTML,
 * and that rewrite is only complete because EVERY internal href is produced by zhPath().
 *
 * A hand-written href="/products/" would work perfectly in `next dev` (where the pages
 * live under /zh, so it would 404 — actually the reverse: it would 404 in dev and work in
 * production) or href="/zh/products/" written literally would survive fine — the failure
 * mode is subtle in both directions and neither shows up in a build. So the rule is
 * mechanical and checked here rather than remembered.
 *
 * Also asserts that no RAYEN source file references the HYDE-watermarked image directory.
 * That one is not a routing bug, it is a branding one: /images/products-hyde/ carries
 * another company's mark burned into the pixels.
 */

const ROOTS = ["src/app/zh", "src/components/rayen"];

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full));
    else if (/\.tsx?$/.test(full)) out.push(full);
  }
  return out;
}

const files = ROOTS.flatMap(sourceFiles);

test("RAYEN 源码里存在页面文件", () => {
  assert.ok(files.length >= 8, `只找到 ${files.length} 个文件，路径规则大概是配错了`);
});

test("内部链接一律经过 zhPath()，不手写 href", () => {
  // Matches href="/…" with a literal string. External links start with http, and every
  // legitimate internal link is href={zhPath(...)}, which is a JSX expression, not a string.
  const literalHref = /href="\/(?!\/)/;
  const offenders: string[] = [];

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    source.split("\n").forEach((line, index) => {
      if (literalHref.test(line)) offenders.push(`${file}:${index + 1}  ${line.trim()}`);
    });
  }

  assert.deepEqual(
    offenders,
    [],
    `这些 href 写死了路径，build-rayen-site.mjs 的 /zh 重写会漏掉它们：\n${offenders.join("\n")}`,
  );
});

test("不引用 HYDE 水印图目录", () => {
  const offenders = files.filter((file) => readFileSync(file, "utf8").includes("products-hyde"));
  assert.deepEqual(offenders, [], `雷茵页面不能用带 HYDE 水印的产品图：\n${offenders.join("\n")}`);
});

test("zh-terms 覆盖全部规格标签", async () => {
  // The generator exits non-zero on a missing label; running it in --check mode here means
  // a new product record with a new spec label fails CI instead of shipping a half-Chinese
  // table nobody reads.
  const { execFileSync } = await import("node:child_process");
  execFileSync(process.execPath, ["scripts/build-chinese-mirror.mjs", "--check"], {
    stdio: "pipe",
  });
});
