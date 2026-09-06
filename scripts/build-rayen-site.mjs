/**
 * Assemble out-rayen/ — the RAYEN 雷茵 site as its own document root.
 *
 * WHY THIS EXISTS
 * The RAYEN pages are built as /zh/... inside cantonlock.com's Next app, because that is
 * how they reuse the 435-model catalogue without a second copy of the toolchain. But
 * RAYEN is a different company on a different host, and its home page must live at "/",
 * not at "/zh/". So after `next build` this script lifts out/zh/ to the root of a separate
 * tree, brings the assets it references, and rewrites the "/zh/" prefix out of the links.
 *
 * Two consequences worth knowing before editing:
 *
 *   1. It DELETES out/zh afterwards. Otherwise cantonlock.com would serve a Chinese site
 *      for a different legal entity at /zh/ — discoverable, indexable, and confusing to
 *      exactly the buyers both sites are for.
 *
 *   2. The link rewrite only matches "/zh/" directly after a quote or paren, because
 *      every internal href on the site is produced by zhPath() in src/data/rayen.ts. A
 *      hand-written href would slip through this and 404 in production while working
 *      perfectly in `next dev`. src/lib/rayen-paths.test.ts is what stops that.
 *
 * Assets are copied by reference rather than wholesale: public/images/products holds 1596
 * files and this site cites a few hundred of them.
 *
 * Usage: node scripts/build-rayen-site.mjs
 */

import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "out");
const ZH = join(OUT, "zh");
const TARGET = join(root, "out-rayen");
const PUBLIC = join(root, "public");

if (!existsSync(ZH)) {
  console.error("out/zh 不存在 —— 先跑 npm run build。");
  process.exit(1);
}

/* --------------------------------------------------------- 1. lift out/zh */

rmSync(TARGET, { recursive: true, force: true });
cpSync(ZH, TARGET, { recursive: true });

/* ------------------------------------------------ 2. rewrite the /zh prefix */

const REWRITABLE = new Set([".html", ".txt", ".json", ".xml", ".js", ".css"]);
const ZH_HREF = /(?<=["'(])\/zh\//g;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

/*
  HYDE's favicon.ico lives at src/app/favicon.ico, which Next treats as app-wide and links
  from every route including /zh. It is the wrong mark for this site and it is not in this
  tree, so the tag would 404 on every page. The RAYEN mark ships as src/app/zh/icon.svg,
  which Next emits into this tree correctly; this drops the inherited ico link.
*/
const HYDE_FAVICON = /<link[^>]*rel="icon"[^>]*href="\/favicon\.ico[^"]*"[^>]*\/?>/g;

/*
  The same link again, inside the serialised RSC payload. Stripping only the <link> in the
  head leaves this copy, React re-creates the element on hydration, and every page quietly
  requests a /favicon.ico that is not in this tree. Both forms or neither.
*/
const HYDE_FAVICON_PAYLOAD =
  /,?\[\\"\$\\",\\"link\\",\\"\d+\\",\{\\"rel\\":\\"icon\\",\\"href\\":\\"\/favicon\.ico[^}]*\}\]/g;

const targetFiles = walk(TARGET);
let rewritten = 0;
/* Files another process held open; collected so the run reports them instead of dying. */
const unreadable = [];

for (const file of targetFiles) {
  const ext = file.slice(file.lastIndexOf("."));
  if (!REWRITABLE.has(ext)) continue;
  /*
    A FAILED READ MUST NOT KILL THE RELEASE.

    On 2026-09-06 this threw `UNKNOWN, errno -4094` on a file that plainly existed, and
    because `npm run build` chains this after `next build`, the whole deploy:prep aborted
    before a single release check ran — 1,029 pages built and thrown away over one
    cosmetic find-and-replace on a secondary site.

    The cause is two agents building in one checkout: Windows returns that errno when
    another process has the file open. It is transient, so one retry clears it. What must
    never happen again is a whole release dying for it, so a file that still cannot be
    read is counted and skipped rather than thrown.
  */
  let before;
  try {
    before = readFileSync(file, "utf8");
  } catch {
    try {
      before = readFileSync(file, "utf8");
    } catch (error) {
      unreadable.push(`${file} (${error.code ?? "unknown"})`);
      continue;
    }
  }

  const after = before
    .replace(ZH_HREF, "/")
    .replace(HYDE_FAVICON, "")
    .replace(HYDE_FAVICON_PAYLOAD, "");
  if (after !== before) {
    try {
      writeFileSync(file, after, "utf8");
      rewritten += 1;
    } catch (error) {
      unreadable.push(`${file} (write: ${error.code ?? "unknown"})`);
    }
  }
}

if (unreadable.length) {
  console.warn(`\n⚠ ${unreadable.length} file(s) could not be rewritten — another process holds them:`);
  for (const line of unreadable.slice(0, 5)) console.warn(`   ${line}`);
  console.warn("   Re-run this script alone when the tree is quiet; the main build is unaffected.\n");
}

/* ------------------------------------- 3. bring the assets the pages cite */

const assetRefs = new Set();
const ASSET_REF = /["'(](\/(?:images|videos|fonts)\/[^"')\s]+?\.[a-z0-9]{2,5})["')]/gi;

for (const file of targetFiles) {
  if (!file.endsWith(".html")) continue;
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(ASSET_REF)) assetRefs.add(match[1]);
}

let copiedAssets = 0;
const missingAssets = [];
for (const ref of assetRefs) {
  const source = join(PUBLIC, ref);
  if (!existsSync(source)) {
    missingAssets.push(ref);
    continue;
  }
  const destination = join(TARGET, ref);
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(source, destination);
  copiedAssets += 1;
}

/* --------------------------------------------- 4. _next runtime and favicon */

cpSync(join(OUT, "_next"), join(TARGET, "_next"), { recursive: true });

/* ------------------------------------------------------------- 5. robots */

/*
  Disallow everything while the site is on the temporary host. The preview lives at a
  subdomain of stahlock.com, and a RAYEN page indexed under that hostname would rank for
  the factory's own name at an address belonging to a different brand — and would keep
  ranking there long after the real domain is live. Loosen this in the same commit that
  changes rayen.preview.host, not before.
*/
writeFileSync(
  join(TARGET, "robots.txt"),
  ["User-agent: *", "Disallow: /", "", "# 预览域名期间全站不收录。正式域名上线时改这里。", ""].join("\n"),
  "utf8",
);

/* -------------------------------- 6. take /zh back out of the HYDE export */

rmSync(ZH, { recursive: true, force: true });

/* ------------------------------------------------------------------ report */

const pages = targetFiles.filter((file) => file.endsWith(".html")).length;
console.log(
  `out-rayen/：${pages} 个页面，重写 ${rewritten} 个文件的 /zh 前缀，复制 ${copiedAssets} 个静态资源。` +
    `已从 out/ 移除 zh/。`,
);
if (missingAssets.length) {
  console.error(`⚠ ${missingAssets.length} 个引用的资源在 public/ 里找不到：`);
  for (const ref of missingAssets.slice(0, 15)) console.error(`  ${relative(root, ref)}`);
  process.exit(1);
}
