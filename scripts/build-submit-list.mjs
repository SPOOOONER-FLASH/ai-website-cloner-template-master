#!/usr/bin/env node
/**
 * The short list of URLs worth submitting BY HAND in Search Console and Bing Webmaster.
 *
 * IndexNow (scripts/indexnow-submit.mjs) pushes the whole sitemap to Bing, Yandex, Naver
 * and Seznam in one request and costs nothing, so it is never the thing to ration.
 * Google has no IndexNow: the only manual lever there is "Request indexing" in URL
 * Inspection, and that is rate-limited to a handful a day. Sending a human at 977 URLs
 * one at a time is therefore not a plan — the list has to be short and ordered, or the
 * quota gets spent on pages that were already indexed.
 *
 * WHAT RANKS FIRST. A URL that did not exist at the previous release. It has no crawl
 * history at all, nothing links to it from outside, and it is the only class of page
 * where a manual request measurably beats waiting. New URLs are found by diffing this
 * build's sitemap against the one in the last commit, so the list is empty on a release
 * that added no pages — which is the correct answer, not a failure.
 *
 * Then the homepage, because Bing's stored index record for it predates the rebuild, and
 * then the category pages, which are the pages the rest of the site links into.
 *
 * THE BASELINE IS A FLAG FOR A REASON. `--since` defaults to `HEAD`, which answers "what
 * did this build add that the last committed build did not". Run it right after the
 * release build is committed and that reads zero — correctly, because HEAD is now the
 * build you just made. To list what a release added, name the release before it:
 * `--since 2d20cafc`. Google's manual quota is spent over several days, so the list often
 * has to be regenerated against a baseline further back than yesterday.
 *
 * Usage: node scripts/build-submit-list.mjs [--since <git-ref>] [--out <dir>]
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const SITEMAP = "out/sitemap.xml";
const HOST = "https://cantonlock.com";

const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const current = locs(readFileSync(SITEMAP, "utf8"));

/*
  The previous sitemap comes from git, not from a copy on disk, because a copy is exactly
  the sort of file that goes stale without anyone noticing. If out/sitemap.xml is not in
  HEAD yet — first build of a new checkout — every URL reads as new, so we say so rather
  than printing a 977-line "priority" list.
*/
const sinceFlag = process.argv.indexOf("--since");
const since = sinceFlag > -1 && process.argv[sinceFlag + 1] ? process.argv[sinceFlag + 1] : "HEAD";

let previous = [];
let comparable = true;
try {
  previous = locs(execFileSync("git", ["show", `${since}:${SITEMAP}`], { encoding: "utf8" }));
} catch {
  comparable = false;
}

const known = new Set(previous);
const fresh = comparable ? current.filter((u) => !known.has(u)) : [];

/** Pages everything else links into; worth a manual nudge after a structural change. */
const strategic = [
  `${HOST}/`,
  `${HOST}/products/`,
  `${HOST}/product-finder/`,
  `${HOST}/contact/`,
];

const categoryPages = current.filter((u) =>
  /^https:\/\/cantonlock\.com\/products\/[a-z0-9-]+\/$/.test(u),
);

const groups = [
  {
    title: "1. 新增的页面（优先级最高）",
    why:
      `与 \`${since}\` 相比新增的 URL：它们没有任何抓取历史，站外也没有任何链接指向它们。` +
      "手动提交对这一类的效果最明显。",
    urls: fresh,
  },
  {
    title: "2. 首页与几个枢纽页",
    why:
      "Bing 存的首页索引记录还停留在旧站时代（显示为 redirect），需要它重新抓一次；" +
      "其余几页是站内链接汇聚的地方，重抓一次会连带发现下游页面。",
    urls: strategic.filter((u) => current.includes(u)),
  },
  {
    title: "3. 15 个类目页（有余额再提交）",
    why: "类目页是新页面的入链来源。Google 每天配额有限，前两组提交完再轮到这里。",
    urls: categoryPages,
  },
];

const lines = [];
lines.push("# 需要手动提交的网址");
lines.push("");
lines.push("<!-- 由 scripts/build-submit-list.mjs 生成，请勿手改。 -->");
lines.push("");
lines.push(
  "**先看这一段。** Bing / Yandex / Naver / Seznam **不需要手动做任何事** —— " +
    "`node scripts/indexnow-submit.mjs` 一次把整份 sitemap（" +
    `${current.length} 条）推过去，几秒钟完成，也不限量。**每次部署后跑一次就够了。**`,
);
lines.push("");
lines.push(
  "**Google 没有 IndexNow。** 唯一的手动办法是 Search Console → 网址检查 → " +
    "「请求编入索引」，每天只能提交十几条。所以下面这份表是**排过序**的：" +
    "从第 1 组开始，配额用完就停，第二天接着做。不要从 sitemap 顶上一条条往下点。",
);
lines.push("");

for (const group of groups) {
  lines.push(`## ${group.title}`);
  lines.push("");
  lines.push(group.why);
  lines.push("");
  if (!group.urls.length) {
    lines.push(
      comparable
        ? "_本次没有这一类的网址。_"
        : "_无法与上一版对比（out/sitemap.xml 尚未提交过），跳过。_",
    );
  } else {
    lines.push(`共 ${group.urls.length} 条：`);
    lines.push("");
    for (const url of group.urls) lines.push(`- ${url}`);
  }
  lines.push("");
}

lines.push("## 提交完之后");
lines.push("");
lines.push(
  "Google 收到请求不代表当天就收录 —— 通常几天到两周。**不要重复提交同一条**，" +
    "重复提交不会加快，只会把配额用掉。",
);
lines.push("");
lines.push(
  "Bing 面板上如果还写着 `Not indexed as this page is a redirect`，看 **Live URL** 标签页，" +
    "那才是当前状态；**Bing Index** 标签页显示的是它存档里的旧记录。",
);
lines.push("");

const markdown = lines.join("\n") + "\n";
const OUT = "docs/research/MANUAL_SUBMIT_LIST.md";
writeFileSync(OUT, markdown);
console.log(
  `wrote ${OUT} — 新增 ${fresh.length} · 枢纽 ${groups[1].urls.length} · 类目 ${categoryPages.length} · sitemap 共 ${current.length}`,
);

const outFlag = process.argv.indexOf("--out");
if (outFlag > -1 && process.argv[outFlag + 1]) {
  const dir = process.argv[outFlag + 1];
  mkdirSync(dir, { recursive: true });
  const copy = join(dir, "需要手动提交的网址.md");
  writeFileSync(copy, markdown);
  console.log(`copied to ${copy}`);
}
