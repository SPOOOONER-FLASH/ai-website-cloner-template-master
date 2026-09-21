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
const ZH_EN = join(OUT, "zh-en");
const TARGET = join(root, "out-rayen");
const PUBLIC = join(root, "public");

if (!existsSync(ZH)) {
  console.error("out/zh 不存在 —— 先跑 npm run build。");
  process.exit(1);
}

/* --------------------------------------------------------- 1. lift out/zh */

rmSync(TARGET, { recursive: true, force: true });
cpSync(ZH, TARGET, { recursive: true });

/*
  英文版：/zh-en 抬到 out-rayen/en。

  甲方 2026-09-10 选了同域名子路径，所以英文站的地址是 <域名>/en/，不是另一个域名。
  它在 Next 里必须是自己的 root layout（<html lang> 只有 root layout 能设，
  一个英文页继承 lang="zh-Hans" 对读屏和搜索引擎都是错的），而 root layout 不能嵌套，
  所以源码在 src/app/zh-en，构建产物在这里搬到 en/ 下面。
*/
if (existsSync(ZH_EN)) {
  cpSync(ZH_EN, join(TARGET, "en"), { recursive: true });
}

/* ------------------------------------------------ 2. rewrite the /zh prefix */

const REWRITABLE = new Set([".html", ".txt", ".json", ".xml", ".js", ".css"]);
const ZH_HREF = /(?<=["'(])\/zh\//g;

/*
  英文前缀，必须在 /zh/ 之前替换。

  反过来的话 /zh/ 会先把 "/zh-en/" 的前四个字符吃掉，剩下 "-en/"，每一条英文链接都会坏
  —— 而且坏得很安静：构建不报错，页面照样生成，只有点下去才 404。
*/
const ZH_EN_HREF = /(?<=["'(])\/zh-en\//g;

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
    .replace(ZH_EN_HREF, "/en/")
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
/* 加上 downloads：图册 PDF 是 <a href> 而不是 <img src>，2026-09-15 第一次上线时
   页面生成了、链接指过去了，文件却没被带过来 —— 扫描器只认这几个前缀。
   新增一个能下载的目录时，这里要一起加。 */
const ASSET_REF = /["'(](\/(?:images|videos|fonts|downloads)\/[^"')\s]+?\.[a-z0-9]{2,5})["')]/gi;

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

/* ------------------------------------------------ 4b. the search indexes */

/*
  Copied by name, because nothing can discover them.

  Step 3 finds assets by scanning the built HTML for /images, /videos and /fonts paths. The
  search index is neither: it is fetched by scripts/../SearchBox on first open, so its path
  exists only inside a JavaScript bundle, and it lives at the document root rather than under
  an asset directory. Left to the scanner it would simply never be copied, and the search box
  would open, spin, and find nothing — on the production host only, since `next dev` serves
  public/ directly and would look perfectly fine.

  Both languages are copied into the one tree: out-rayen serves 中文 at / and English at /en/,
  and each fetches its own file.
*/
const SEARCH_INDEXES = ["search-index-rayen-zh.json", "search-index-rayen-en.json"];
for (const name of SEARCH_INDEXES) {
  const source = join(PUBLIC, name);
  if (!existsSync(source)) {
    console.error(`缺少 ${name} —— 先跑 node scripts/build-search-index.mjs`);
    process.exit(1);
  }
  copyFileSync(source, join(TARGET, name));
}

/* ------------------------------------------------------------- 5. robots */

/*
  Indexing is open as of 2026-09-15, because the site is now on its own domain.

  It was Disallow: / for as long as the site lived on a preview subdomain of stahlock.com —
  a RAYEN page indexed under that hostname would have ranked for this factory's name at an
  address belonging to a different company, and would have kept ranking there long after the
  move. That block was written to be lifted in the same commit that set the real host, and
  this is that commit: rayen.cn, see rayen.host.domain.

  Lighthouse scored SEO 69 on https://rayen.cn/ with a single finding — "Page is blocked from
  indexing" — which is what sent us here.
*/
const site = JSON.parse(readFileSync(join(root, "content", "rayen", "site.json"), "utf8"));
const canonicalOrigin = `https://${site.host.domain}`;
writeFileSync(
  join(TARGET, "robots.txt"),
  ["User-agent: *", "Allow: /", "", `Sitemap: ${canonicalOrigin}/sitemap.xml`, ""].join("\n"),
  "utf8",
);

/* ---------------------------------------------------------- 5b. sitemap.xml */

/*
  Written here rather than by Next, because the paths Next knows are /zh/… and /zh-en/… and
  the ones that exist on this host are / and /en/. A sitemap generated before the lift would
  list 420 URLs that 404.

  Built from the files actually on disk after the lift, so it cannot disagree with what was
  published. robots.txt names it, and until now there was no sitemap at all — the site went
  live pointing crawlers at nothing.
*/
const pagePaths = walk(TARGET)
  .filter((file) => file.endsWith("index.html"))
  .map((file) => {
    const rel = relative(TARGET, dirname(file)).replaceAll("\\", "/");
    return rel === "" ? "/" : `/${rel}/`;
  })
  .sort();

/*
  Every entry carries its language alternates, the same pair the pages declare in <head>.

  Google reads hreflang from either place and wants them to agree; declaring it in one and
  not the other is how a bilingual site ends up with the two versions treated as duplicates.
  The pairing is computed from the path, because that is the whole rule: the English tree is
  the Chinese tree under /en.
*/
const zhOf = (path) => (path.startsWith("/en/") ? path.slice(3) : path === "/en/" ? "/" : path);
const enOf = (path) => `/en${zhOf(path)}`;
const loc = (path) => `${canonicalOrigin}${path}`;

writeFileSync(
  join(TARGET, "sitemap.xml"),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...pagePaths.flatMap((path) => [
      "  <url>",
      `    <loc>${loc(path)}</loc>`,
      `    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${loc(zhOf(path))}"/>`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${loc(enOf(path))}"/>`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc(zhOf(path))}"/>`,
      "  </url>",
    ]),
    "</urlset>",
    "",
  ].join("\n"),
  "utf8",
);

/* --------------------------------------------------------------- 5c. llms.txt */

/*
  A plain-text map of the site for language models, in the emerging llms.txt convention.
  Buyers increasingly reach a factory by asking an assistant rather than a search box, and an
  assistant that cannot tell which of 418 pages holds the spec table quotes the wrong one.

  It states only what the site already says, in the order a buyer needs it, and it names what
  we do NOT publish — prices, and dimensions for the models whose drawings we have not been
  given. A model that reads "no price is published here" asks the reader to enquire; one that
  reads nothing invents a number.
*/
const categoryLines = walk(TARGET)
  .filter((file) => file.endsWith("index.html"))
  .map((file) => relative(TARGET, dirname(file)).replaceAll("\\", "/"))
  .filter((rel) => /^products\/[^/]+$/.test(rel))
  .sort()
  .map((rel) => `- [${rel.split("/")[1]}](${canonicalOrigin}/${rel}/)`);

writeFileSync(
  join(TARGET, "llms.txt"),
  [
    `# ${site.brand.legalName}`,
    "",
    `> ${site.brand.positioning}`,
    "",
    `中山市小榄镇的门控五金制造商。中文站 ${canonicalOrigin}/ ，英文站 ${canonicalOrigin}/en/ 。`,
    "",
    "## 产品类目",
    "",
    ...categoryLines,
    "",
    "## 站点说明",
    "",
    "- 每个型号页有独立规格表：材质、尺寸、中心距、安装孔径、表面处理。",
    "- 规格表里的短横线表示该项我们没有依据，不是零或未知 —— 请直接问我们要图纸。",
    "- 本站不公布价格。报价随数量、表面处理与包装变化，请通过联系页询价。",
    "- 图片上的 RAYEN 雷茵 标记是我们自己的产品照，不代表第三方认证。",
    "",
    "## 联系",
    "",
    `- [联系我们](${canonicalOrigin}/contact/)`,
    `- [工厂与产能](${canonicalOrigin}/company/)`,
    `- [来图来样加工](${canonicalOrigin}/oem/)`,
    "",
  ].join("\n"),
  "utf8",
);

/* -------------------------------- 6. take /zh back out of the HYDE export */

rmSync(ZH, { recursive: true, force: true });
rmSync(ZH_EN, { recursive: true, force: true });

/* ------------------------------------------------------------------ report */

const pages = targetFiles.filter((file) => file.endsWith(".html")).length;
console.log(
  `out-rayen/：${pages} 个页面（含 /en 英文版），重写 ${rewritten} 个文件的语言前缀，` +
    `复制 ${copiedAssets} 个静态资源。已从 out/ 移除 zh/ 与 zh-en/。`,
);
if (missingAssets.length) {
  console.error(`⚠ ${missingAssets.length} 个引用的资源在 public/ 里找不到：`);
  for (const ref of missingAssets.slice(0, 15)) console.error(`  ${relative(root, ref)}`);
  process.exit(1);
}
