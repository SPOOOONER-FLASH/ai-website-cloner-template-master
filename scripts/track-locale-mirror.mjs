#!/usr/bin/env node
/**
 * The progress board of the seven-locale mirror: docs/collaboration/LOCALE-MIRROR-STATUS.md.
 *
 * Counts, per locale and per kind of content, how much of the English source has a
 * translation in content/i18n/<code>/ — and, when an export exists, how many English
 * phrases still show on the built pages (scripts/audit-locale-pages.mjs). Written by the
 * Stop hook in .claude/settings.json at the end of every session and by `npm run status`,
 * so the board can never be older than the last person to touch the repository.
 *
 * Every number is derived: nothing on the board is typed by hand, which is the rule of
 * AGENTS.md ("write the generator, then run it"). A cell under 100% is unfinished work.
 *
 *   node scripts/track-locale-mirror.mjs           write the board
 *   node scripts/track-locale-mirror.mjs --quiet   same, no console output
 *   node scripts/track-locale-mirror.mjs --check   exit 1 unless every cell is 100%
 */
import { cognate, untranslatable } from "./lib/i18n-untranslatable.mjs";
import { staleFields } from "./lib/i18n-source-hash.mjs";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const LOCALES = ["fr", "de", "ja", "ko", "tr", "ru", "ar"];
const OUT = "docs/collaboration/LOCALE-MIRROR-STATUS.md";
const quiet = process.argv.includes("--quiet");
const check = process.argv.includes("--check");
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const today = new Date().toISOString().slice(0, 10);

const records = (folder) => readdirSync(`content/${folder}`).filter((f) => f.endsWith(".json")).map((f) => readJson(`content/${folder}/${f}`));
const products = records("products").filter((p) => (!p.sites || p.sites.includes("hyde")) && p.heroImage?.src);
const published = (a) => !a.draft && a.publishedAt <= today;
const news = records("news").filter(published);
const guides = records("guides").filter(published);
const projects = records("projects");
const categories = readJson("content/categories.json").categories;
const faqItems = readJson("content/faq.json").groups.flatMap((g) => g.items).filter((i) => i.answer);
const uiKeys = (existsSync("content/i18n/ui-keys.json") ? Object.keys(readJson("content/i18n/ui-keys.json")) : []).filter((k) => !untranslatable(k));
const esGlossary = readFileSync("src/data/es-glossary.ts", "utf8");
const glossaryKeysRaw = (name) => {
  const m = esGlossary.match(new RegExp(`export const ${name}: Record<string, string> = \\{([\\s\\S]*?)\\n\\};`));
  return m ? [...m[1].matchAll(/^\s*(?:"((?:[^"\\]|\\.)*)"|([A-Za-z_]\w*)):\s*\n?\s*"/gm)].map((x) => (x[1] ?? x[2]).replace(/\\"/g, '"')) : [];
};
const glossaryKeys = (name) => glossaryKeysRaw(name).filter((k) => !untranslatable(k) && !cognate(k));
const GLOSSARY = { specLabels: "SPEC_LABELS_ES", specValues: "SPEC_VALUES_ES", finishNames: "FINISH_NAMES_ES", materialNames: "MATERIAL_NAMES_ES", categoryNames: "CATEGORY_NAMES_ES", productNames: "PRODUCT_NAMES_ES" };

const full = (t) => t && typeof t === "string" && t.trim();
const rows = [];
for (const code of LOCALES) {
  const dir = `content/i18n/${code}`;
  const ov = (n) => (existsSync(`${dir}/${n}.json`) ? readJson(`${dir}/${n}.json`) : {});
  const P = ov("products"), C = ov("categories"), N = ov("news"), G = ov("guides"), J = ov("projects"), F = ov("faq"), U = ov("ui"), GL = ov("glossary");
  const cell = (done, total) => ({ done, total, pct: total ? Math.round((100 * done) / total) : 100 });
  const productFields = ["name", "summary", "specs", "features", "seoTitle", "seoDescription"];
  const productsDone = products.filter((p) => P[p.slug] && full(P[p.slug].name) && full(P[p.slug].summary) && Array.isArray(P[p.slug].specs)).length;
  const productFieldCount = products.reduce((n, p) => {
    const t = P[p.slug] ?? {};
    return n + productFields.filter((f) => (f === "specs" || f === "features" ? Array.isArray(t[f]) && (f === "features" ? !(p.features ?? []).length || t[f].length : true) : full(t[f]))).length;
  }, 0);
  const childCount = categories.reduce((n, c) => n + (c.children ?? []).length, 0);
  const categoriesDone = categories.filter((c) => full(C[c.slug]?.name) && full(C[c.slug]?.summary)).length;
  const childrenDone = categories.reduce((n, c) => n + (c.children ?? []).filter((ch) => full(C[c.slug]?.children?.[ch.slug]?.name)).length, 0);
  const articleDone = (list, T) => list.filter((a) => T[a.slug] && full(T[a.slug].title) && full(T[a.slug].summary) && Array.isArray(T[a.slug].body) && T[a.slug].body.length === a.body.length).length;
  const glossaryTotal = Object.values(GLOSSARY).reduce((n, name) => n + glossaryKeys(name).length, 0);
  const glossaryDone = Object.entries(GLOSSARY).reduce((n, [sec, name]) => n + glossaryKeys(name).filter((k) => full(GL[sec]?.[k])).length, 0);

  let leftovers = null;
  if (existsSync(`out/${code}/index.html`)) {
    try {
      const json = JSON.parse(execFileSync("node", ["scripts/audit-locale-pages.mjs", "--locale", code, "--json"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }));
      leftovers = { pages: json.pages, withEnglish: json.withEnglish, phrases: json.phrases };
    } catch {
      leftovers = null;
    }
  }
  rows.push({
    code,
    routes: existsSync(`src/app/${code}`) ? execFileSync("node", ["-e", `process.stdout.write(String(require("fs").readdirSync("src/app/${code}",{recursive:true}).filter(f=>String(f).endsWith("page.tsx")).length))`], { encoding: "utf8" }) : "0",
    glossary: cell(glossaryDone, glossaryTotal),
    categories: cell(categoriesDone + childrenDone, categories.length + childCount),
    ui: cell(uiKeys.filter((k) => full(U[k])).length, uiKeys.length),
    /* Entries whose English moved since they were merged (scripts/lib/i18n-source-hash.mjs). */
    stale:
      products.filter((p) => P[p.slug] && staleFields("products", p, P[p.slug]).length).length +
      news.filter((a) => N[a.slug] && staleFields("news", { ...a, faq: a.faq?.en ?? [] }, N[a.slug]).length).length +
      guides.filter((g) => G[g.slug] && staleFields("guides", { ...g, faq: g.faq?.en ?? [] }, G[g.slug]).length).length +
      projects.filter((j) => J[j.slug] && staleFields("projects", j, J[j.slug]).length).length,
    faq: cell(faqItems.filter((i) => full(F[i.question]?.answer)).length, faqItems.length),
    products: cell(productsDone, products.length),
    productFields: cell(productFieldCount, products.length * productFields.length),
    news: cell(articleDone(news, N), news.length),
    guides: cell(articleDone(guides, G), guides.length),
    projects: cell(projects.filter((p) => full(J[p.slug]?.name) && Array.isArray(J[p.slug]?.body)).length, projects.length),
    leftovers,
  });
}

const pct = (c) => `${c.pct}% (${c.done}/${c.total})`;
const lines = [
  "# 七语种全栈镜像：进度看板",
  "",
  `> 由 \`scripts/track-locale-mirror.mjs\` 生成于 ${new Date().toISOString().replace("T", " ").slice(0, 16)} UTC。**不要手改**；每个会话结束时的 Stop 钩子和 \`npm run status\` 会重写它。`,
  `> 任务与架构：\`docs/collaboration/tasks/2026-09-25-seven-locale-full-mirror.md\`。任何一格低于 100% 都是未完成的工作。`,
  "",
  `基准：${products.length} 个在售 HYDE 产品，${categories.length} 个品类 + ${categories.reduce((n, c) => n + (c.children ?? []).length, 0)} 个子类，${news.length} 篇新闻，${guides.length} 篇指南，${projects.length} 个案例，${faqItems.length} 条问答，${uiKeys.length} 句界面文案，${Object.values(GLOSSARY).reduce((n, name) => n + glossaryKeys(name).length, 0)} 条术语。`,
  "",
  "| 语种 | 路由 | 术语表 | 品类 | 界面 | 问答 | 产品（三字段齐） | 产品字段 | 新闻 | 指南 | 案例 | 过期 | 页面英文残留 |",
  "|---|---|---|---|---|---|---|---|---|---|---|---|---|",
  ...rows.map((r) =>
    `| ${r.code} | ${r.routes} | ${pct(r.glossary)} | ${pct(r.categories)} | ${pct(r.ui)} | ${pct(r.faq)} | ${pct(r.products)} | ${pct(r.productFields)} | ${pct(r.news)} | ${pct(r.guides)} | ${pct(r.projects)} | ${r.stale} | ${r.leftovers ? `${r.leftovers.phrases} 句 / ${r.leftovers.withEnglish} 页（共 ${r.leftovers.pages} 页）` : "未构建"} |`,
  ),
  "",
  "## 读法",
  "",
  "- **术语表**：`content/i18n/<code>/glossary.json` 六张表相对 `es-glossary.ts` 的键。规格值在构建时查表，所以这一列先于产品。",
  "- **产品（三字段齐）**：name + summary + specs 都有译文的在售产品；**产品字段**把 features、seoTitle、seoDescription 也算进去。",
  "- **过期**：英文源在译文合入后又改过的记录数（`sourceHash` 对不上）；`node scripts/i18n-batch.mjs --locale <code> --kind <kind> --stale --all` 只切变过的字段（数组精确到下标）。",
  "- **页面英文残留**：`scripts/audit-locale-pages.mjs --locale <code>`，以西语为对照组读构建出的 HTML；只有构建过（out/<code>/ 存在）才有数字。",
  "- 下一批怎么切：`node scripts/i18n-batch.mjs --locale <code> --kind <kind>`；合并：`node scripts/i18n-merge.mjs tmp/i18n/<job>.json`。",
  "",
];
writeFileSync(OUT, lines.join("\n"));
if (!quiet) console.log(lines.slice(6, 8 + rows.length).join("\n"));
if (check) {
  const incomplete = rows.filter((r) => r.stale > 0 || [r.glossary, r.categories, r.ui, r.faq, r.products, r.productFields, r.news, r.guides, r.projects].some((c) => c.pct < 100));
  if (incomplete.length) {
    console.error(`✗ ${incomplete.map((r) => r.code).join(", ")} below 100%`);
    process.exit(1);
  }
}
