/**
 * 买家到底搜了什么 —— 把一次导出里所有带查询的 CSV 读成一份语料,并按意图分类。
 *
 * ---------------------------------------------------------------------------
 * 为什么要有这个脚本
 *
 * 客户 2026-09-22:「长尾词这个,我讲了很多,不一定对,但是我们要明白的就是要以
 * 数据为支撑,一定要以给你的 42 个 csv 为支持。」
 *
 * 他是对的,而且这句话也适用于我自己。之前我为了定标题模板,从三个文件里快速
 * 抓了 392 条查询就下了结论。那不是系统性的 —— 42 个文件里有五个不同平台的
 * 查询数据,写法各不相同,漏掉哪个都会让结论偏。
 *
 * 更重要的是:手抓一次,下个月还要再抓一次,而且抓法可能不一样,于是两次结论
 * 没法比较。脚本读目录、输出分类语料,才能回答「这个月比上个月多了什么查询」。
 *
 * ---------------------------------------------------------------------------
 * 意图分类是干什么用的
 *
 * 一条查询的**意图**决定该用什么内容接它:
 *
 *   model       已经拿着零件在找替代品 —— 产品页标题要有尺寸
 *   comparison  在两个选项之间犹豫 —— 「A vs B」文章,被引最多的那类
 *   spec        在查一个代码或数值的含义 —— 查表文
 *   howto       卡在一个具体操作上 —— 步骤文
 *   category    还在找品类 —— 品类页
 *   supplier    在找工厂/报价/起订量 —— 公司页与采购类文章
 *   brand       在找我们 —— 已经赢了,别挡路
 *
 * 分类规则写在下面的 INTENT 表里,是**可以吵的**。吵的时候改表,重跑,看分布
 * 怎么变 —— 这比争论「买家是不是这么想的」有用。
 *
 * ---------------------------------------------------------------------------
 * 用法
 *
 *   node scripts/build-query-corpus.mjs "C:/Users/johns/Downloads/SEOGEO 922"
 *   node scripts/build-query-corpus.mjs <dir> --out docs/research/QUERY-CORPUS.md
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, basename } from "node:path";

const args = process.argv.slice(2);
const DIR = args.find((a) => !a.startsWith("--"));
const outAt = args.indexOf("--out");
if (!DIR || !existsSync(DIR)) {
  console.error('用法: node scripts/build-query-corpus.mjs "<导出目录>" [--out <md>]');
  process.exit(1);
}
const today = new Date().toISOString().slice(0, 10);
const OUT = outAt !== -1 ? args[outAt + 1] : `docs/research/QUERY-CORPUS-${today}.md`;

/* ── CSV ─────────────────────────────────────────────────────────────── */

function splitRow(line) {
  const out = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const num = (v) => {
  const n = Number(String(v ?? "").replace(/[",%\s]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

/**
 * 哪些列名装的是「查询」。五个平台各写各的,而且中英混用。
 * 加一个新来源时在这里登记 —— 登记本身就是一次「这一列真的是查询吗」的检查。
 */
const QUERY_COLUMNS = [
  "热门查询",
  "查询",
  "关键字",
  "关键词",
  "Grounding Query",
  "Query",
  "Google 搜索自然查询",
  "搜索查询",
];

/** 哪些列装的是「这条查询有多重要」。按优先级,取第一个找得到的。 */
const WEIGHT_COLUMNS = ["展示", "印象数", "Citations", "引用", "Impressions", "点击次数"];

/* ── 读目录 ──────────────────────────────────────────────────────────── */

const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)],
  );

const rows = [];
const sources = [];

for (const file of walk(DIR).filter((f) => /\.csv$/i.test(f))) {
  let text;
  try {
    text = readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  } catch {
    continue;
  }
  const lines = text.split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#"));
  let found = 0;

  // 一个文件里可能有多张表(Clarity),所以逐行找表头
  let header = null;
  let qi = -1;
  let wi = -1;
  for (const line of lines) {
    const cells = splitRow(line);
    const qIndex = cells.findIndex((c) => QUERY_COLUMNS.includes(c));
    if (qIndex !== -1) {
      header = cells;
      qi = qIndex;
      wi = -1;
      for (const w of WEIGHT_COLUMNS) {
        const i = cells.indexOf(w);
        if (i !== -1) {
          wi = i;
          break;
        }
      }
      continue;
    }
    if (!header || qi === -1) continue;
    const q = cells[qi];
    if (!q || q === header[qi]) continue;
    // 明显不是查询的行(URL、分节标题)跳过
    if (/^https?:\/\//i.test(q) || q === "Metric") continue;
    rows.push({
      q: q.trim(),
      weight: wi === -1 ? 1 : num(cells[wi]) || 1,
      src: basename(file, ".csv"),
    });
    found++;
  }
  if (found) sources.push({ file: relative(DIR, file).split("\\").join("/"), found });
}

/* ── 合并同一条查询 ──────────────────────────────────────────────────── */

const merged = new Map();
for (const r of rows) {
  const key = r.q.toLowerCase();
  const prev = merged.get(key) ?? { q: r.q, weight: 0, srcs: new Set() };
  prev.weight += r.weight;
  prev.srcs.add(r.src);
  merged.set(key, prev);
}
const queries = [...merged.values()].sort((a, b) => b.weight - a.weight);

/* ── 意图分类 ────────────────────────────────────────────────────────── */

/**
 * 顺序即优先级 —— 一条查询命中第一个就归到那一类。
 * brand 放最前,因为 "canton hyland lock co.,ltd 联系方式" 同时像 supplier。
 */
const INTENT = [
  /*
    noise 必须排在最前。别的品牌型号会撞上我们的型号 —— `hp officejet pro 9012e`
    撞的是我们的 9012E。把它留在 category 里会让「品类需求」虚高，而那个数正是
    用来决定下一批写什么的。
  */
  ["noise", /\b(hp|canon|epson|brother|samsung|lg|dell|lenovo)\b|officejet|printer|laptop/i],
  ["brand", /canton\s*hyland|cantonlock|海狄|广州海狄|hyland\s*hardware|7lock|lockland/i],
  ["comparison", /\bvs\b|\bversus\b|比较|哪个好|difference between|same as|\bor\b.{0,20}\b(better|instead)\b/i],
  [
    "howto",
    /how (to|do)|install|removal|remove|replace|fitting|adjust|manual|instruction|安装|更换|c(ó|o)mo |instalaci(ó|o)n|instala(ç|c)(ã|a)o/i,
  ],
  /*
    spec 要能接住「这个代码/数值是什么意思」和「给我一张表」两种问法，三种语言。
    第一版漏了 chart / schedule / terms / significa，于是 master keying system chart
    —— 全语料权重最高的一条 —— 掉进了兜底类。
  */
  [
    "spec",
    /\b(us\s?\d{2}[a-z]?|6\d{2}|backset|centre distance|center distance|dimension|thickness|grade|chart|schedule|terms used|code meaning|what does|what is)\b|significa|qu(é|e) significa|o que significa|significado|lengths?\b|\bsize chart\b/i,
  ],
  /*
    产地词是采购意图，不是品类意图。`china scalloped edge steel hinge` 的人在找
    供应商，不是在学什么是合页。
  */
  [
    "supplier",
    /\bchina\b|\bchinese\b|manufactur|factory|supplier|wholesale|oem|odm|moq|\bprice\b|\bcost\b|catalog|catalogue|distributor|export|f(á|a)brica|proveedor|fabricante/i,
  ],
  ["model", /^[a-z]{0,5}[\s-]?\d{2,5}[a-z.\-\s]{0,8}$/i],
  ["category", /.*/],
];

function classify(q) {
  for (const [name, re] of INTENT) if (re.test(q)) return name;
  return "category";
}

for (const q of queries) q.intent = classify(q.q);

const byIntent = {};
for (const q of queries) {
  byIntent[q.intent] = byIntent[q.intent] ?? { n: 0, weight: 0, top: [] };
  byIntent[q.intent].n += 1;
  byIntent[q.intent].weight += q.weight;
  if (byIntent[q.intent].top.length < 25) byIntent[q.intent].top.push(q);
}

/* ── 输出 ────────────────────────────────────────────────────────────── */

const totalWeight = queries.reduce((s, q) => s + q.weight, 0);
const out = [];
const say = (s = "") => out.push(s);

say(`# 买家实际搜了什么 — ${today}`);
say();
say(`由 \`scripts/build-query-corpus.mjs\` 从 \`${DIR}\` 生成。**这是数据，不是结论。**`);
say();
say(`读了 **${sources.length} 个含查询的 CSV**，合并后 **${queries.length} 条不同查询**，加权合计 ${totalWeight}。`);
say(`权重是展示数、印象数或引用数，取每个文件里第一个能找到的那一列。`);
say();

say(`## 意图分布`);
say();
say(`| 意图 | 查询数 | 加权 | 占比 | 该用什么接 |`);
say(`| --- | --- | --- | --- | --- |`);
const WHAT = {
  noise: "别的品牌撞号，忽略",
  brand: "已经赢了，别挡路",
  comparison: "「A vs B」文章 —— 被引最多的那类",
  howto: "步骤文",
  spec: "查表文",
  supplier: "公司页、采购类文章",
  model: "产品页标题要有尺寸",
  category: "品类页与场景文案",
};
for (const [k, v] of Object.entries(byIntent).sort((a, b) => b[1].weight - a[1].weight))
  say(`| **${k}** | ${v.n} | ${v.weight} | ${((v.weight / totalWeight) * 100).toFixed(1)}% | ${WHAT[k] ?? ""} |`);
say();

for (const [k, v] of Object.entries(byIntent).sort((a, b) => b[1].weight - a[1].weight)) {
  say(`## ${k} — ${v.n} 条，加权 ${v.weight}`);
  say();
  say(`| 权重 | 查询 | 来源 |`);
  say(`| --- | --- | --- |`);
  for (const q of v.top) say(`| ${q.weight} | ${q.q} | ${[...q.srcs].join(", ")} |`);
  if (v.n > v.top.length) say(`\n_共 ${v.n} 条，上面是权重最高的 ${v.top.length} 条_`);
  say();
}

/*
  按品类拆「数字型」与「场景型」—— 决定标题里数字先还是场景先（方案 2026-09-24 第七节）。
  数字型：查询里有数字（型号、尺寸、backset）。场景型：查询里有用途或门型词。
  两者都有的记数字型，因为那位买家已经知道要什么规格。
*/
const FAMILIES = [
  ["推杠 / 逃生", /panic|exit|push ?bar|crash ?bar|antip[aá]nico|antip[aâ]nico|barra/i],
  ["插芯锁体", /mortis|lock ?case|lockcase|embutir|fechadura de encaixe|cerradura/i],
  ["合页", /hinge|bisagra|dobradi[cç]a|pivot/i],
  ["锁芯", /cylinder|cilindro|master ?key|key(ed)? alike/i],
  ["外装锁 / 夜锁", /rim|night ?latch/i],
  ["把手 / 执手", /lever|handle|pull|manija|manilla|ma[cç]aneta|puxador|tirador/i],
  ["闭门器 / 门挡 / 插销", /closer|cierrapuertas|door ?stop|bolt|flush|pasador|fechos?/i],
];
const SCENE =
  /fire|double|single|hospital|clean ?room|school|office|commercial|residential|exterior|outdoor|glass|alumin|wood|timber|metal door|steel door|heavy|bath|toilet|marine|hotel|puerta|porta|door/i;

const fam = {};
for (const q of queries) {
  if (q.intent === "brand" || q.intent === "noise") continue;
  const hit = FAMILIES.find(([, re]) => re.test(q.q));
  if (!hit) continue;
  const f = (fam[hit[0]] ??= { n: 0, weight: 0, number: 0, scene: 0, plain: 0 });
  const kind = /\d/.test(q.q) ? "number" : SCENE.test(q.q) ? "scene" : "plain";
  f.n += 1;
  f.weight += q.weight;
  f[kind] += q.weight;
}

say(`## 按品类：买家先打数字，还是先打场景`);
say();
say(`加权占比。数字型 = 查询含数字；场景型 = 含用途或门型词（fire、double、glass…）；泛称 = 只有品类名。`);
say(`样本小的行只能当方向，不能当定论。`);
say();
say(`| 品类 | 查询数 | 加权 | 数字型 | 场景型 | 泛称 | 标题先放 |`);
say(`| --- | --- | --- | --- | --- | --- | --- |`);
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : "—");
for (const [k, v] of Object.entries(fam).sort((a, b) => b[1].weight - a[1].weight)) {
  const lead = v.n < 5 ? "样本不足，默认数字" : v.number >= v.scene ? "数字" : "场景";
  say(`| ${k} | ${v.n} | ${v.weight} | ${pct(v.number, v.weight)} | ${pct(v.scene, v.weight)} | ${pct(v.plain, v.weight)} | ${lead} |`);
}
say();

say(`## 读到了哪些文件`);
say();
say(`| 文件 | 取到查询 |`);
say(`| --- | --- |`);
for (const s of sources.sort((a, b) => b.found - a.found)) say(`| \`${s.file}\` | ${s.found} |`);
say();

writeFileSync(OUT, out.join("\n"));
console.log(`query-corpus: ${OUT}`);
console.log(`  ${sources.length} 个文件 → ${queries.length} 条不同查询，加权 ${totalWeight}`);
for (const [k, v] of Object.entries(byIntent).sort((a, b) => b[1].weight - a[1].weight))
  console.log(`    ${k.padEnd(11)} ${String(v.n).padStart(4)} 条  加权 ${String(v.weight).padStart(5)}  ${((v.weight / totalWeight) * 100).toFixed(1)}%`);
