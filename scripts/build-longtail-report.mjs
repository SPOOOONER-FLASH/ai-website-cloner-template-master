#!/usr/bin/env node
/**
 * 长尾词成果汇报：node scripts/build-longtail-report.mjs [--docx]
 *
 * 甲方 2026-09-24：「你负责优化全栈全页的长尾词吧，搞完了写个成果汇报 docx，加了什么长尾词，
 * 为什么用这个长尾词」。
 *
 * 数字全部现场从 content/ 和查询语料算，所以任何时候重跑都是当时的真实状态；「为什么」一栏是
 * 写死的理由（买家原话或产品事实），和标题放在一起，方便甲方逐条核对。
 *
 * 输出 docs/research/LONGTAIL-REPORT.md；加 --docx 再渲染成桌面 hyde 文件夹里的 Word。
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const OUT = "docs/research/LONGTAIL-REPORT.md";
const today = new Date().toISOString().slice(0, 10);

const categories = JSON.parse(readFileSync("content/categories.json", "utf8")).categories;
const products = readdirSync("content/products")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`content/products/${f}`, "utf8")))
  .filter((p) => !Array.isArray(p.sites) || p.sites.includes("hyde"));

/** 每个品类标题的依据：买家在我们的查询数据里打过的字，或者对该品类每个型号都成立的事实。 */
const WHY = {
  "panic-exit-devices": "买家原话：anti panic door、fire exit door with panic bar double、two point panic bar。单门、双门型号都有。不写 Fire，因为防火等级没有证书。",
  "night-latches-rim-locks": "买家原话：rim night latch、night latch rim lock、rim nightlatch（夜锁 10 条查询，一半带型号数字）。backset 不写进标题：大多数是 60mm，但也有 50、40mm。",
  "stainless-steel-handles": "45 款全部是不锈钢，所以材质可以写进品类标题；「China Manufacturer」对应 china … handle 这类找工厂的查询。",
  "lever-handles": "品类摘要里写明入户、卧室（隐私）、通道三种功能，都是买家按门选执手的叫法。",
  "knob-locks": "买家找这类锁用的是 cylindrical lock / tubular lock，功能词同上。",
  "bathroom-accessories": "55 款全部是不锈钢；酒店和卫生间工程是这一类的主要用途（品类定位）。",
  "brass-steel-hinges": "买家原话：brass door hinge manufacturer、china … steel hinge、ss hinges price list。29 款以不锈钢为主，也有黄铜。",
  "deadbolts": "品类摘要写明的事实：25mm 锁舌行程、单双锁芯。",
  "door-closers": "买家原话：door closer manufacturer、china door closer。",
  "grip-handle-sets": "品类摘要：用于入户门和推拉门。",
  "glass-door-accessories": "无框玻璃门是这类五金唯一的用途；西葡用「vidrio templado / vidro temperado」，因为那边买家就是这么搜玻璃门五金的。",
  "hardware-accessories": "把子类名直接写进标题（门挡、插销、猫眼、门闩），「hardware accessories」这个词没人搜。",
  "lock-cases": "锁体买家按 backset 和中心距选型（锁体查询 57% 带数字）；具体数字写在每个型号的标题里。",
  "lock-cylinders": "品类里有欧标和椭圆两种型材，并且用于主钥匙系统。「master keying system chart」是全站展示最多的一条查询（153 次）。",
  "sliding-hook-locks": "3 款都是锌合金；推拉门是唯一用途。",
};

/* ── 查询语料里按品类的那张表 ── */
let familyTable = "";
try {
  const corpus = readFileSync("docs/research/QUERY-CORPUS-2026-09-22.md", "utf8");
  const m = corpus.match(/## 按品类：[\s\S]*?(\| 品类 \|[\s\S]*?)\n\n/);
  familyTable = m ? m[1] : "";
} catch {
  /* 语料不在时这一节省略 */
}

/* ── 产品标题统计 ── */
const bodyOf = (t = "") => t.replace(/ \| [^|]+$/, "");
function parts(title, locale) {
  const b = bodyOf(title);
  return {
    number: /\d+\s?(mm|in|"|×)|\d{2,}\/\d{2,}/i.test(b),
    scene: locale === "en" ? / (for|on) /i.test(b) : / (para|en|em) /i.test(b),
    material: /stainless|brass|zinc|alumin|steel|inox|lat[óo]n|lat[ãa]o|zamak|acero|a[çc]o/i.test(b),
  };
}
const pct = (n, d) => (d ? `${Math.round((n / d) * 100)}%` : "—");

const out = [];
const say = (s = "") => out.push(s);

say("# 长尾词成果汇报");
say();
say(`**生成于 ${today}**，由 \`scripts/build-longtail-report.mjs\` 从产品记录、品类表和买家查询数据现场计算。重跑就是最新状态。`);
say();
say("## 一句话");
say();
const withAny = { en: 0, es: 0, pt: 0 };
for (const p of products)
  for (const [loc, key] of [["en", "seoTitle"], ["es", "seoTitleEs"], ["pt", "seoTitlePt"]]) {
    const x = parts(p[key], loc);
    if (x.number || x.scene || x.material) withAny[loc]++;
  }
say(
  `全站 ${products.length} 个 HYDE 产品页、15 个品类页，三种语言的搜索标题都按「买家怎么搜」重写了。` +
    `产品标题里带长尾成分（尺寸、用途场景或材质）的比例：英文 ${pct(withAny.en, products.length)}，西语 ${pct(withAny.es, products.length)}，葡语 ${pct(withAny.pt, products.length)}。` +
    "所有数字都照抄产品记录，没有一个是编的；认证和防火等级一个字都没写。",
);
say();
say("## 为什么要改：被看见了，但没人点");
say();
say("Search Console 2026-06-24 → 09-22 的数据（`docs/research/analytics/2026-09-22/`）：");
say();
say("| 页面 | 展示 | 点击 | 问题 |");
say("|---|---|---|---|");
say("| 主钥匙文章 | 243 | 0 | 买家搜「master keying system chart」153 次，标题里没有 Chart |");
say("| 合页品类页 | 79 | 0 | 标题是「Brass & Steel Door Hinges — Manufacturer」，买家搜的是 brass door hinge manufacturer、ss hinges |");
say("| 闭门器品类页 | 72 | 0 | 买家搜 door closer manufacturer、china door closer |");
say("| 型号查询 fb005 / bh28 / 564mb | 12–17 | 0 | 排第 3–7 名却零点击：标题只有型号和品类名，没有买家要核对的尺寸 |");
say();
say("排名已经有了，缺的是搜索结果里那两行字对上买家的问题。长尾词的任务是**让人点进来**，不只是排上去。");
say();
say("## 规则：哪些可以写，哪些只能照抄");
say();
say("| 成分 | 能不能「组合、生成」 | 例子 |");
say("|---|---|---|");
say("| 买家用语的品类名 | 可以，用买家的叫法 | panic bar、barra antipánico、mola aérea |");
say("| 用途场景 | 可以，前提是这个型号真的装得上 | for Single and Double Doors、para puertas corredizas |");
say("| 供应商词 | 可以，每个标题最多一个 | China Manufacturer、fábrica en China |");
say("| 型号、尺寸、材质 | **只能照抄产品记录** | LC04 的 85mm 中心距、60mm backset |");
say("| 认证、防火等级、标准号 | **永远不写**（没有证书） | 不写 Fire Rated、ANSI、UL |");
say();
say("标题正文不超过 60 个字符（站名放最后，被截掉也无妨）。描述是完整句子，不超过 150 个字符，不用「…」截断。");
say();
say("## 买家先打数字还是先打场景（决定标题顺序）");
say();
if (familyTable) {
  say(familyTable);
  say();
  say("读法：锁体、夜锁、执手先放数字；推杠、合页、闭门器先放场景。大部分查询只有品类名，所以**品类名用买家的叫法**是最重要的一个长尾词。");
  say();
}
say("## 品类页：加了什么词、为什么");
say();
say("| 品类 | 英文 | 西语 | 葡语 | 为什么 |");
say("|---|---|---|---|---|");
for (const c of categories) {
  if (!c.seoTitle && !c.seoTitleEs && !c.seoTitlePt) continue;
  say(`| ${c.name} | ${c.seoTitle ?? "—"} | ${c.seoTitleEs ?? "—"} | ${c.seoTitlePt ?? "—"} | ${WHY[c.slug] ?? ""} |`);
}
say();
say("## 产品页：按品类统计");
say();
say("标题由生成器 `scripts/build-product-titles.mjs` 统一产出：型号 → 买家用语的品类名 → 尺寸或场景 → 材质。按品类的公式见方案第七节。");
say();
say("| 品类 | 产品数 | 英文带尺寸 | 带场景 | 带材质 | 例子 |");
say("|---|---|---|---|---|---|");
for (const c of categories) {
  const ps = products.filter((p) => p.categoryPath?.[0] === c.slug);
  if (!ps.length) continue;
  const st = ps.map((p) => parts(p.seoTitle, "en"));
  const example = ps.find((p) => parts(p.seoTitle, "en").number) ?? ps[0];
  say(
    `| ${c.name} | ${ps.length} | ${pct(st.filter((x) => x.number).length, ps.length)} | ${pct(st.filter((x) => x.scene).length, ps.length)} | ${pct(st.filter((x) => x.material).length, ps.length)} | ${bodyOf(example.seoTitle)} |`,
  );
}
say();
say("三语对照（每类一例）：");
say();
say("| 型号 | 英文 | 西语 | 葡语 |");
say("|---|---|---|---|");
const seen = new Set();
for (const p of products) {
  const cat = p.categoryPath?.[0];
  if (seen.has(cat) || !parts(p.seoTitle, "en").number) continue;
  seen.add(cat);
  say(`| ${p.model} | ${bodyOf(p.seoTitle)} | ${bodyOf(p.seoTitleEs)} | ${bodyOf(p.seoTitlePt)} |`);
}
say();
say("## 顺带修掉的事实错误（改标题时发现的）");
say();
say("| 问题 | 怎么改的 |");
say("|---|---|");
say("| 306 PS 是通道推杠，自己没有锁舌，西葡描述却写「用于逃生与出口门」 | 改成「用于装插芯锁的门」；这是安全问题，不是措辞问题 |");
say("| 网址 ansi-grade-3-keyed-deadbolt-lock-set 写着 ANSI Grade 3，我们没有 ANSI 认证 | 网址改为 keyed-deadbolt-lock-set，旧网址 301 |");
say("| 14 条门闩、插销、猫眼被归在「指示器」下，描述里写着「有人 / 无人」 | 按记录自己的名字移回正确子类，标题描述随之更正 |");
say("| 夜锁品类介绍写「60mm backset」，实际还有 50mm、40mm 的型号 | 三语改为「大多数 60mm」 |");
say("| 所有葡语品类页标题后缀是西语「Fabricante y proveedor」 | 改为「Fabricante e fornecedor」 |");
say("| 西葡描述里同一句出现两次 para（「guarnición exterior para barra antipánico para puertas…」） | 59 处 → 0 |");
say("| 英文全站是英式拼写（centre、catalogue、aluminium），面向美国买家 | 全站改美式，npm test 守着 |");
say();
say("## 怎么知道有没有用");
say();
say("1. **10 月 8 日前后**看上面四类页面在 Search Console 里的点击率（改之前全是 0%）。");
say("2. 以后每周导一次四个看板的数据（`docs/collaboration/DATA-DASHBOARDS.md`），先改「展示 ≥30、点击率 <1%」的页面。");
say("3. GA4 从这次发布起记录阅读方式和产品点击：能看出点进来的人是快速滑过还是认真读，读完有没有点进产品。");
say();
say("## 还没做的");
say();
say("- 新闻和指南的搜索标题：按每周的机会清单逐篇改，不一次性全改（没有数据支撑的改动可能反而掉排名）。");
say("- 约 120 个 HYDE 产品没有任何规格行，标题只能写型号和品类名。要工厂补尺寸（给工厂的问题清单里）。");
say("- 10 个产品名字太长，放不下长尾词（生成器列为警告），要改名字才能改善。");
say();

writeFileSync(OUT, out.join("\n"));
console.log(`✓ ${OUT}`);
if (process.argv.includes("--docx")) {
  const r = spawnSync("node", ["scripts/build-client-runbook-docx.mjs", "--src", OUT], { stdio: "inherit" });
  process.exit(r.status ?? 1);
}
