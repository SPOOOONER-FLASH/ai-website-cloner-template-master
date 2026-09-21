#!/usr/bin/env node
/**
 * 把 Clarity 的 "Top content opportunities" 面板解析成可计算的数据。
 *
 * 为什么是解析而不是手抄：那个面板每个报告有三到四个机会簇，每簇 3–13 个域名，
 * 十个报告加起来约 200 行。手抄一次要半小时，而且下个月重跑报告之后没人分得清
 * 哪些数字是新的。粘贴 + 解析是一分钟，而且下个月还是一分钟。
 *
 * 输入  docs/research/clarity-opportunities.txt   控制台原样粘贴
 * 输出  docs/research/clarity-opportunities.json  结构化
 *
 * 它回答的问题不是"谁在榜上"，而是：
 *   - 哪些域名横跨最多主题（= 真正的对手，不是某一题碰巧出现的）
 *   - 哪些域名只在我们弱的主题里出现（= 针对性最强的分析对象）
 *   - 哪些机会簇完全没有我们（= 内容缺口）
 *
 * 用法: node scripts/parse-clarity-opportunities.mjs [--json]
 */

import { readFileSync, writeFileSync } from "node:fs";

const SRC = "docs/research/clarity-opportunities.txt";
const OUT = "docs/research/clarity-opportunities.json";

/**
 * 每个主题的成绩，从 2026-09-21 的十份报告抄下来。
 * 用来把"对手出现在哪"和"我们在那一题上强不强"连起来 —— 一个只出现在我们
 * 排第 34 的主题里的域名，比一个出现在我们排第 1 的主题里的域名更值得研究。
 */
const STANDING = {
  "International standards comparison": { share: 78.85, rank: 1, cited: 60.0 },
  "Door handing and installation fit": { share: 72.22, rank: 1, cited: 20.0 },
  "Architectural hardware sourcing": { share: 72.73, rank: 4, cited: 13.33 },
  "Finishes, materials and codes": { share: 100.0, rank: 3, cited: 33.33 },
  "Exit device selection and escape hardware": { share: 43.75, rank: 7, cited: 13.33 },
  "Euro cylinder and keying systems": { share: 30.77, rank: 10, cited: 7.14 },
  "OEM, private label and tooling": { share: 40.0, rank: 27, cited: 6.67 },
  "Lock function selection for a building": { share: 33.33, rank: 34, cited: 6.67 },
  "Documentation, test evidence and submittals": { share: 0, rank: null, cited: 0 },
};

const lines = readFileSync(SRC, "utf8").split(/\r?\n/);

const topics = [];
let topic = null;
let cluster = null;
let expectingDomains = false;

for (const raw of lines) {
  const line = raw.trim();
  if (!line || line.startsWith("#") === true) {
    if (line.startsWith("## ")) {
      topic = { title: line.slice(3).trim(), clusters: [] };
      topics.push(topic);
      cluster = null;
      expectingDomains = false;
    }
    continue;
  }
  if (!topic) continue;

  if (line === "Covered by") {
    expectingDomains = true;
    continue;
  }

  // A domain is a bare host: no spaces, at least one dot, a plausible TLD.
  const isDomain = /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(line) && !line.includes(" ");
  if (expectingDomains && isDomain) {
    cluster.domains.push(line.replace(/^www\./, ""));
    continue;
  }

  // Anything else that is not a domain starts a new cluster.
  cluster = { name: line, domains: [] };
  topic.clusters.push(cluster);
  expectingDomains = false;
}

/* ------------------------------------------------------------ 交叉统计 */

const byDomain = new Map();
for (const t of topics) {
  for (const c of t.clusters) {
    for (const d of c.domains) {
      if (!byDomain.has(d)) byDomain.set(d, { domain: d, topics: new Set(), clusters: [] });
      const row = byDomain.get(d);
      row.topics.add(t.title);
      row.clusters.push(`${t.title} › ${c.name}`);
    }
  }
}

/**
 * 优先级 = 出现次数 × 我们在那些主题上的弱势。
 *
 * 一个域名出现在我们排第 34 的主题里，比出现在我们排第 1 的主题里更值得读：
 * 后者我们已经赢了，读它学不到什么。权重取 (100 - 我们的竞争份额)/100，
 * 没有成绩记录的主题按 0.5 计。
 */
const weightOf = (title) => {
  const s = STANDING[title];
  if (!s) return 0.5;
  return (100 - s.share) / 100;
};

const ranked = [...byDomain.values()]
  .map((row) => ({
    domain: row.domain,
    topicCount: row.topics.size,
    clusterCount: row.clusters.length,
    topics: [...row.topics],
    clusters: row.clusters,
    priority: Number(
      [...row.topics].reduce((sum, t) => sum + weightOf(t), 0).toFixed(3),
    ),
  }))
  .sort((a, b) => b.priority - a.priority || b.clusterCount - a.clusterCount);

const payload = {
  capturedAt: "2026-09-21",
  source: SRC,
  standing: STANDING,
  topics: topics.map((t) => ({
    title: t.title,
    standing: STANDING[t.title] ?? null,
    clusters: t.clusters,
  })),
  domains: ranked,
};

writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);

if (process.argv.includes("--json")) process.exit(0);

const clusters = topics.reduce((n, t) => n + t.clusters.length, 0);
console.log(
  `${topics.length} 个主题 · ${clusters} 个机会簇 · ${byDomain.size} 个不同域名 → ${OUT}\n`,
);

console.log("按「值得研究」排序的前 15 个（出现次数 × 我们在那些主题上的弱势）：\n");
console.log("  域名".padEnd(34), "主题数", " 簇数", " 优先级", " 出现在");
for (const row of ranked.slice(0, 15)) {
  console.log(
    `  ${row.domain.padEnd(32)}`,
    String(row.topicCount).padStart(4),
    String(row.clusterCount).padStart(5),
    String(row.priority).padStart(7),
    " ",
    row.topics.map((t) => t.split(/[ ,]/)[0]).join(", ").slice(0, 46),
  );
}

const solo = ranked.filter((r) => r.topicCount === 1).length;
console.log(
  `\n${solo} 个域名只出现在一个主题里 —— 那些是该主题的专门站点，不是跨品类对手。`,
);
