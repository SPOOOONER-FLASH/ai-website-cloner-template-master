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

const ROOTS = ["src/app/zh", "src/app/zh-en", "src/components/rayen"];

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

test("内部链接一律经过 localePath()，不手写 href", () => {
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

test("英文站的 root layout 不能声明中文 lang", () => {
  /*
    这个 root layout 存在的**唯一**理由就是 lang 属性。

    英文页不能嵌在 src/app/zh 下面，因为 <html lang> 只有 root layout 能设，而 root
    layout 不能嵌套 —— 所以才多了第四个 root layout。2026-09-10 它自己却写着
    lang="zh-Hans"（从中文 layout 复制过来忘了改），正上方的注释还在解释为什么那样是错的。
    构建不报错，页面照出，只有读屏软件和搜索引擎会用中文去念一整页英文。

    这种错误人眼看不出来（注释说得对，代码写得错），所以交给测试。
  */
  const source = readFileSync("src/app/zh-en/layout.tsx", "utf8");
  const lang = source.match(/<html\s+lang=([^\s]+)/)?.[1];
  assert.ok(lang, "src/app/zh-en/layout.tsx 里找不到 <html lang=…>");
  assert.ok(
    !/zh/i.test(lang),
    `英文站 root layout 的 lang 是 ${lang}，那是中文。应当是 {htmlLang.en}。`,
  );
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
