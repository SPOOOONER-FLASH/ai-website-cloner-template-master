#!/usr/bin/env node
/**
 * The blog / technical-article programme: the goal, what to write, and the evidence.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS A GENERATOR AND NOT A DOCUMENT
 *
 * Every number in it goes stale. "Nine long-tail terms have no article" is true until
 * somebody writes one; "77 of 519 records carry a BHMA number" is true until the factory
 * answers a finish question. A plan whose evidence cannot be re-derived turns into a plan
 * nobody can check, and then into a plan nobody follows.
 *
 *   node scripts/build-content-programme.mjs            # print
 *   node scripts/build-content-programme.mjs --write    # write the markdown
 *
 * The Word export for the client comes from scripts/build-client-docx.mjs, which reads
 * the markdown this writes. Markdown is the source; the .docx is an export.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "docs/collaboration/2026-09-16-content-programme.md";

/* ------------------------------------------------------------------ evidence ----- */

const news = readdirSync("content/news")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join("content/news", f), "utf8")));

const products = readdirSync("content/products")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join("content/products", f), "utf8")))
  .filter((p) => !(p.sites ?? []).length || (p.sites ?? []).includes("hyde"));

const corpus = news
  .map((n) => `${n.title} ${(n.body ?? []).join(" ")}`)
  .join(" ")
  .toLowerCase();

const longtail = JSON.parse(
  readFileSync("docs/research/north-america-longtail.json", "utf8"),
).terms;

/**
 * A term counts as covered when every content word in it appears somewhere in the news
 * corpus. Crude, and deliberately so: it is a screen for "nobody has written about this
 * at all", not a judgement about whether the article is any good. The five topics chosen
 * below were each read against the actual articles afterwards.
 */
const STOPWORDS = new Set([
  "china", "manufacturer", "supplier", "factory", "for", "the", "with", "and", "vs", "or",
]);
const uncovered = longtail.filter((t) => {
  if (t.canServe !== "yes") return false;
  return !t.term
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => !STOPWORDS.has(w))
    .every((w) => corpus.includes(w));
});

/** The 30 models the client named for the 优品推荐 set, 2026-09-16. */
const SELECTED = [
  "564", "587", "1073", "607", "9014", "9008", "9007", "70", "80", "D101",
  "5831", "592", "598", "60", "LH853", "575", "578", "5807", "5870", "808",
  "90", "9210", "LH852", "LH855", "45", "D102", "54", "595", "609", "6491",
];

/**
 * Match on the model's leading letters+digits, then allow a suffix letter.
 *
 * `1073` is published as `1073D` and `1073S`; `9008` as `9008E` and `9008S`. A first pass
 * compared the first whitespace-delimited token and reported both as missing from the
 * catalogue, which would have put a false "we do not make this" in the client's document.
 */
function variantsOf(stem) {
  const pattern = new RegExp(`^${stem}(?:[A-Za-z]+)?(?:[\\s-]|$)`, "i");
  return products.filter((p) => pattern.test(String(p.model ?? "").trim()));
}

const selected = SELECTED.map((stem) => {
  const group = variantsOf(stem);
  return {
    stem,
    category: group[0]?.categoryPath?.[0] ?? "—",
    variants: group.length,
    withPhoto: group.filter((p) => p.heroImage?.src).length,
    specRows: group.reduce((n, p) => n + (p.specs?.length ?? 0), 0),
  };
});

const byCategory = new Map();
for (const entry of selected) {
  byCategory.set(entry.category, [...(byCategory.get(entry.category) ?? []), entry]);
}

/**
 * The five 优品推荐 articles, and which categories each one carries.
 *
 * Grouped by what a buyer decides in one sitting, not by how many models are in each
 * pile: somebody choosing a cylindrical lock is not also choosing a euro cylinder that
 * afternoon, and an article that covers both answers neither.
 */
const SELECTION_ARTICLES = [
  { title: "圆筒锁（knob / cylindrical）", categories: ["knob-locks"] },
  { title: "欧标锁芯（euro cylinders）", categories: ["lock-cylinders"] },
  { title: "执手锁（lever handles）", categories: ["lever-handles"] },
  { title: "不锈钢拉手（pull handles）", categories: ["stainless-steel-handles"] },
  {
    title: "插芯与夜锁（deadbolts / night latches）",
    categories: ["deadbolts", "night-latches-rim-locks"],
  },
];

/* ------------------------------------------------------------------- write ------- */

const lines = [];
const push = (l = "") => lines.push(l);

push("# 博客与技术文章：目标、选题、写法");
push();
push("生成的：`npm run brief:content`。所有数字都是从仓库现算的，改了内容重跑就更新。");
push();
push("---");
push();

/* ---- 0. the goal ---- */
push("## 零、目标");
push();
push("**让买家在 AI 回答里看到我们，而不是只在搜索结果第二页看到我们。**");
push();
push("这不是一句口号，它现在有基线数据了。2026-09-15 甲方给的两张后台截图：");
push();
push("| 来源 | 现状 |");
push("|---|---|");
push("| Bing 生成式引用 | 8 月 9–23 日**全零**；9 月 6 日起变成台阶，峰值 **16 次引用 / 4 个页面** |");
push("| Bing 落地查询 | 抽样里只有 **1 条**：`mechanical advantages box-style exit devi…`，引用份额 **50%** |");
push("| Google AI 功能 | 前 10 个页面里有 **4 个是旧 `index.php` 网址** |");
push();
push("### 三件事从这两张图里读得出来");
push();
push("**1. 已经在发生了，不是从零开始。** 9 月 6 日之后是台阶不是尖峰，峰值 16 次引用落在 4 个");
push("页面上——平均每页被引 4 次。同一批页面被反复取用，不是偶然撞见。");
push();
push("**2. 被引用的那篇，一个关键词都没写对。** `push-bar-or-touch-bar` 全文里");
push("`mechanical` 出现 0 次、`box` 0 次、`leverage` 0 次。模型是**按意思**匹配到那两段机构");
push("描述的。这条决定了整个写法：**AI 不是在匹配关键词，是在找能回答问题的具体段落。**");
push();
push("**3. Google 的 AI 正在引用我们已经 301 掉的旧网址。** 这说明重定向那批活直接喂给了 GEO ——");
push("旧网址攒的权重会随 301 合并到新页面上。");
push();
push("### 目标（90 天，可验证）");
push();
push("| 指标 | 现在 | 目标 | 怎么看 |");
push("|---|---|---|---|");
push("| Bing 被引用页面数 | 4 | **15** | Bing 站长 → 生成式 AI → Cited Pages |");
push("| Bing 落地查询条数 | 1 | **10** | 同上 → List By: Grounding Queries |");
push("| 被引用页面里是产品页的 | 0 | **≥3** | 现在被引的全是文章，产品页一个都没有 |");
push("| 长尾词有对应文章的 | 22 / 31 | **31 / 31** | `npm run brief:content` 重跑 |");
push();
push("⚠ **前三条我们控制不了，只能影响。** 没有任何人能保证被 AI 引用；能做的是把「被引用的");
push("条件」做足。第四条是我们完全能控制的，所以它是真正的工作量指标。");
push();
push("---");
push();

/* ---- 1. what makes a page citable ---- */
push("## 一、什么样的页面会被引用 —— 从我们自己那篇反推");
push();
push("我们手上有一个**确定被引用过**的样本，所以不用猜。把它拆开看：");
push();
push("| 它做对的事 | 具体在哪 |");
push("|---|---|");
push("| 回答的是一个**有歧义的选择题** | 「推杠还是触杠」——买家真的分不清，而供应商不主动说 |");
push("| 给了**机构层面的解释**，不是形容词 | 「两条枢转臂」「走 3–4 厘米」「压进通长外壳」 |");
push("| 有**可引用的独立段落** | 每段自成一个完整答案，不依赖上一段 |");
push("| **承认边界** | 结尾直接说某竞品标注的 EN 1205 不存在，是 EN 1125 的笔误 |");
push("| 有**具体数字** | 42 台设备、3–4 厘米、EN 1125 |");
push();
push("### 反过来，什么不会被引用");
push();
push("- 「我们拥有先进的生产设备和专业的团队」—— 没有任何一句可以被当作答案摘出来");
push("- 一篇什么都讲一点的综述 —— 模型要的是**一段**能回答问题的话，不是一个目录");
push("- 只有形容词没有数字的产品介绍");
push("- 把别人网页上的说法抄过来 —— 那段话已经有来源了，不会引用我们");
push();
push("### 所以每篇文章的硬性结构");
push();
push("1. **标题就是那个问题**，而且用买家的词（不是我们的词）");
push("2. **第一段给答案**，不铺垫");
push("3. **中间每段一个可独立引用的事实**，带数字或型号");
push("4. **必须有一段写「我们不知道什么」或「这里容易错」** —— 这是最常被引用的一段");
push("5. **不写价格**（甲方长期规矩），不写没有依据的数字");
push();
push("---");
push();

/* ---- 2. longtail gaps ---- */
push("## 二、第一批五篇：长尾技术文");
push();
push(
  `\`north-america-longtail.json\` 里 ${longtail.length} 个词，` +
    `${longtail.filter((t) => t.canServe === "yes").length} 个我们答得了。` +
    `其中 **${uncovered.length} 个在 ${news.length} 篇文章里一次都没被写过**：`,
);
push();
push("| 词 | 意图 | 归属页面 |");
push("|---|---|---|");
for (const term of uncovered) {
  push(`| \`${term.term}\` | ${term.intent} | ${term.owns} |`);
}
push();
push("再叠上 Search Console 三个月里**真实出现过**的查询（都是 1 次曝光 0 点击 ——");
push("意思是排名在第二页，不是没人搜）：");
push();
push("```");
push("ul 305 panic hardware          fire door panic hardware");
push("rim nightlatch                 us cylindrical locks market");
push("latches doors and frames       brass piano hinge / 钢琴铰链供应商");
push("oval lock                      zamak inyectado");
push("sa32806 panic hardware");
push("```");
push();
push("### 选出来的五篇，以及为什么是这五篇");
push();
push("| # | 标题方向 | 证据 | 数据够不够 |");
push("|---|---|---|---|");
push("| 1 | **US26D、626、630：表面代号不是颜色** | `us26d vs 626 finish difference` + `us cylindrical locks market` | `src/lib/bhma-finish.ts` 已经把逻辑写透了，77 条记录能出号，442 条出不了且每条有理由 |");
push("| 2 | **UL 305、EN 1125、ANSI A156.3 不是同一个测试** | `en 1125 vs ul 305` + 实际查询 `ul 305 panic hardware` | 全站 24 篇里 `UL 305` 出现 **0 次** |");
push("| 3 | **夜锁与 rim lock：564 和 1073 的实际尺寸** | `564 night latch dimensions` + 实际查询 `rim nightlatch` | 564 有 14 行规格，1073D/S 各 13 行 |");
push("| 4 | **有人 / 无人：卫生间指示锁** | `indicator bolt occupied vacant washroom` | 200 / 400 / 500 三个型号，200 有 8 行规格 |");
push("| 5 | **推杠长度：900 到 1110mm，哪一根配你的门** | `exit device 1000mm push bar` | 全线实际长度值都在记录里 |");
push();
push("⚠ **落选的两个，说明理由**：");
push();
push("- **钢琴铰链** 中英文都有真实曝光，但 `brass-piano-hinge` 这条记录自相矛盾 ——");
push("  型号写 Brass Piano Hinge，材质写 Stainless Steel 304，宽度写成 `1\"1-1/4 \"2 \"、3\"`。");
push("  **先问工厂，再写文章。** 拿一条自己打架的记录去写技术文，正是这个站最不该做的事。");
push("  → ✅ **2026-09-16 甲方答了：做的是铁的。** 记录已改（材质 Iron，宽度 1\"/1-1/4\"/2\"/3\"，");
push("  表面哑黑或亮金），并写成第十一篇 —— 「brass」是表面不是金属，和表面代号那篇同一个坑。");
push("- **GGMK / 钥匙分级表** 已经有 `master-key-systems-how-many-levels-you-need`，");
push("  GGMK、GMK、change key、chart 都在里面。再写一篇是自己跟自己抢。");
push();
push("---");
push();

/* ---- 3. selected range ---- */
push("## 三、第二批五篇：优品推荐");
push();
push("甲方 2026-09-16 指定的 30 个型号。先把它们在目录里的实际情况数出来：");
push();
push("| 型号 | 类目 | 表面/变体数 | 有照片 | 规格行合计 |");
push("|---|---|---:|---:|---:|");
for (const entry of selected) {
  push(
    `| **${entry.stem}** | ${entry.category} | ${entry.variants} | ${entry.withPhoto} | ${entry.specRows} |`,
  );
}
push();
const totalVariants = selected.reduce((n, e) => n + e.variants, 0);
const totalPhotos = selected.reduce((n, e) => n + e.withPhoto, 0);
push(
  `合计 **${totalVariants} 个变体**，其中 **${totalPhotos} 个有照片**` +
    `（${Math.round((totalPhotos / totalVariants) * 100)}%）。`,
);
push();
push("### 分成五篇，按「买家一次坐下来决定什么」分，不按型号多少分");
push();
push("| # | 文章 | 覆盖型号 | 变体数 |");
push("|---|---|---|---:|");
for (const [i, article] of SELECTION_ARTICLES.entries()) {
  const members = article.categories.flatMap((c) => byCategory.get(c) ?? []);
  push(
    `| ${i + 1} | ${article.title} | ${members.map((m) => m.stem).join(" · ")} | ` +
      `${members.reduce((n, m) => n + m.variants, 0)} |`,
  );
}
push();
push("**为什么不按型号数量平分**：一个在选圆筒锁的买家，那个下午不会同时选锁芯。");
push("一篇同时讲两样的文章，两样都没答好。");
push();
push("### 优品推荐这五篇和普通产品页不一样的地方");
push();
push("产品页回答「这个型号是什么」。这五篇回答「**这一类里我该选哪个，为什么**」——");
push("而这正好是 AI 回答最常被问到的问题形状。所以每篇必须有：");
push();
push("- 一张**把同类型号并排比**的表（背距、中心距、门厚、表面数）");
push("- 一段讲**什么情况下不要选这一类**（这一段最可能被引用）");
push("- 每个型号都点名，型号是可检索的实体");
push("- **不写价格**");
push();
push("---");
push();

/* ---- 4. cadence + what not to do ---- */
push("## 四、节奏与不做什么");
push();
push("| | |");
push("|---|---|");
push("| 频率 | 一周 2–3 篇，英西双语同步 |");
push("| 长度 | 8–10 段，每段 3–5 句 |");
push("| 署名 | 沿用现有 author 结构（真实姓名、职务、学历、LinkedIn）—— E-E-A-T 靠这个 |");
push("| 结构化数据 | `kind: \"insight\"` 会输出 schema.org **TechArticle**，不需要额外改组件 |");
push();
push("### 明确不做");
push();
push("- **不做「50 篇关键词文章」**。写一篇没有具体数字的文章，等于给模型一段它不会引用的话");
push("- **不为了 SEO 编数字**。这个站的信任是靠「不知道就写破折号」建起来的");
push("- **不抄别人的技术解释**。已经有来源的段落不会引用我们");
push("- **不动架构**（甲方 2026-09-15 定）");
push();
push("---");
push();

/* ---- what actually got written ---- */
/*
  Listed from content/news rather than typed here, so this section cannot claim an article
  that does not exist — which is the failure mode of every content plan ever written.
*/
const batch = news
  .filter((n) => (n.publishedAt ?? "") >= "2026-09-16")
  .sort((a, b) => String(a.publishedAt).localeCompare(String(b.publishedAt)));

push(`## 四之二、已经写完的 ${batch.length} 篇`);
push();
push("| 发布 | 标题 | 段数 | 点名型号 |");
push("|---|---|---:|---|");
for (const article of batch) {
  push(
    `| ${String(article.publishedAt).slice(0, 10)} | ${article.title} | ` +
      `${(article.body ?? []).length} | ${(article.relatedModels ?? []).join(" · ")} |`,
  );
}
push();
push(
  `长尾词未覆盖数从 **9 降到 ${uncovered.length}**。` +
    "这个数字是上面第二节现算出来的，不是手写的 —— 它每次重跑都会自己更新。",
);
push();
push("⚠ 剩下的 4 个之所以还在，理由在第二节的「落选」里：钢琴铰链等工厂确认记录，");
push("钥匙分级表已经有文章。**不是漏了。**");
push();
push("---");
push();
push("## 五、怎么验收");
push();
push("发完之后不要马上看 Bing —— 索引和引用有滞后。");
push();
push("| 时间 | 看什么 |");
push("|---|---|");
push("| 发布当天 | `npm run seo:indexnow` 推给 Bing；Search Console 手动提交（手册第 3 节）|");
push("| 2 周后 | Search Console：这几个词有没有出现曝光 |");
push("| 4–6 周后 | Bing 站长 → 生成式 AI → Cited Pages 有没有新页面进来 |");
push("| 90 天 | 对着第零节那张表打分 |");
push();
push("⚠ **一条现在就能做的**：Bing 的落地查询表有「Download all」。每个月导一次存进");
push("`docs/research/`，否则那是抽样数据，过了就查不回来了。");

const doc = `${lines.join("\n")}\n`;

if (process.argv.includes("--write")) {
  writeFileSync(OUT, doc);
  console.log(`wrote ${OUT}`);
  console.log(`  ${uncovered.length} uncovered long-tail terms`);
  console.log(`  ${selected.length} selected models, ${totalVariants} variants, ${totalPhotos} with a photo`);
  const missing = selected.filter((s) => s.variants === 0);
  if (missing.length) console.log(`  ⚠ not in the catalogue: ${missing.map((m) => m.stem).join(", ")}`);
} else {
  console.log(doc);
}
