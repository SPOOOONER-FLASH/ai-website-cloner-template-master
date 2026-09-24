/**
 * 规格覆盖率:HYDE 目录里每个关键字段有多少产品真的发布了。
 * content/products 同时包含雷茵专属记录；本报告给 cantonlock.com 的指南引用，
 * 因此必须采用与 src/data/products.ts 相同的 HYDE 站点过滤规则。
 *
 * 为什么要有这个脚本,而不是临时敲个正则:
 * 2026-09-21 我用 /hand/i 量 handing,把 "Handle Material" 和 "Handle Design"
 * 一起算了进去,得到 186,并把这个数写进了一篇已发布的文章。真实值是 188 行 /
 * 187 个产品,而且其中 5 行的标签是拼错的 "Handling"。用 /cent(re|er)/ 量中心距
 * 同样扫进了 "Fixing centre" 和 "Spindle centre" —— 那是完全不同的尺寸。
 *
 * 所以这里用**显式标签白名单**,不用正则。加一个新标签必须在这里登记,
 * 这本身就是一道拼写与同义词的检查。
 *
 * 用法:
 *   node scripts/spec-coverage.mjs            打印表格并写 docs/research/SPEC_COVERAGE.json
 *   node scripts/spec-coverage.mjs --check    只校验已提交的 JSON 是否过期(CI 用)
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const PRODUCTS = "content/products";
const OUT = "docs/research/SPEC_COVERAGE.json";

/** 显式白名单。键是字段,值是准确的 spec label(大小写不敏感比较)。 */
const FIELDS = {
  backset: {
    title: "Backset",
    labels: ["Backset"],
  },
  centreDistance: {
    title: "Centre distance (lever to cylinder/keyhole)",
    labels: [
      "Centre distance",
      "Center Distance",
      "Centre distances",
      "Centre distance, horizontal",
      "Centre distance, vertical",
    ],
    // 刻意排除:Fixing centre / Fixing centres / Spindle centre / Grip centre
    // distance / Faceplate to cylinder centre / Cylinder centre to back /
    // Second centre —— 都是别的尺寸,不能拿来回答「这把锁换得上吗」。
    //
    // 2026-09-22:光看标签还不够。同一个 "Centre distance" 标签被两件事共用 ——
    // 锁的执手到圆柱中心距,和拉手的安装孔距(值写成 "P=425mm")。144 行里
    // 103 行是拉手。所以这里额外按**值**排除 P= 开头的行,并把它们单独计到
    // pullHandlePitch。一个标签两个含义,是这个目录里第二次出现的同类缺陷
    // (第一次是 /hand/i 扫进了 Handle Material)。
    excludeValue: /^P\s*=/i,
  },
  pullHandlePitch: {
    title: "Pull handle fixing pitch (P=)",
    labels: [
      "Centre distance",
      "Center Distance",
      "Centre distances",
      "Centre distance, horizontal",
      "Centre distance, vertical",
    ],
    onlyValue: /^P\s*=/i,
  },
  doorThickness: {
    title: "Door thickness",
    labels: [
      "Door thickness",
      "Minimum door thickness",
      "Min door thickness",
      "Max door thickness",
      "Door leaf thickness",
      "Suitable Door Thickness",
      "Door Thickness Range",
      "Applicable Door Thickness",
      "Glass door thickness",
    ],
    // 排除裸的 "Thickness"(81 行,不知道量的是哪儿)、Rose/Tube/Lever/Plate
    // thickness 和 "Glass thickness"(玻璃本身,不是门扇)。
  },
  handing: {
    title: "Handing",
    labels: ["Handing", "Handling"],
    // "Handling" 是拼错的标签,5 条,值确实是分手别信息。
  },
  forend: {
    title: "Forend / faceplate size",
    labels: ["Faceplate", "Face plate"],
    // 排除 "Faceplate to cylinder centre" —— 那是一个中心距,不是面板尺寸。
  },
  finish: {
    title: "Finish",
    labels: [
      "Finish",
      "Finishes",
      "Finish & Color",
      "Finishes Available",
      "Hardware Finish",
      "Surface Finish",
      "Surface Finish Options",
    ],
    // 排除 "Finishing process" —— 说的是工艺,不是颜色。
  },
};

/** 已知但刻意不计入的标签,列在这里是为了让下一个人知道这是决定而不是遗漏。 */
const DELIBERATELY_EXCLUDED = [
  "Thickness",
  "Rose thickness",
  "Tube Thickness",
  "Lever thickness",
  "Plate thickness",
  "Glass thickness",
  "Fixing centre",
  "Fixing centres",
  "Spindle centre",
  "Grip centre distance",
  "Second centre",
  "Faceplate to cylinder centre",
  "Cylinder centre to back",
  "Finishing process",
  "Handle",
  "Handle Material",
  "Handle Design",
  "Outside Handle",
];

const lower = (s) => String(s ?? "").trim().toLowerCase();

function collect() {
  const files = readdirSync(PRODUCTS).filter((f) => f.endsWith(".json"));
  // 一个标签可能映射到多个字段(值不同,含义不同),所以是 label → [key…]。
  const wanted = new Map();
  for (const [key, def] of Object.entries(FIELDS)) {
    for (const label of def.labels) {
      const k = lower(label);
      wanted.set(k, [...(wanted.get(k) ?? []), key]);
    }
  }

  /** 该行的值是否属于这个字段。没有值规则就一律属于。 */
  const valueFits = (key, value) => {
    const def = FIELDS[key];
    const v = String(value ?? "").trim();
    if (def.onlyValue && !def.onlyValue.test(v)) return false;
    if (def.excludeValue && def.excludeValue.test(v)) return false;
    return true;
  };

  const products = {};
  const rows = {};
  const distinctValues = {};
  let totalProducts = 0;
  for (const key of Object.keys(FIELDS)) {
    products[key] = 0;
    rows[key] = 0;
    distinctValues[key] = new Set();
  }

  const unknownHits = new Map();

  for (const file of files) {
    const product = JSON.parse(readFileSync(join(PRODUCTS, file), "utf8"));
    if (product.sites && !product.sites.includes("hyde")) continue;
    totalProducts += 1;
    const seen = new Set();
    for (const row of product.specs ?? []) {
      const keys = (wanted.get(lower(row.label)) ?? []).filter((k) => valueFits(k, row.value));
      if (keys.length) {
        for (const key of keys) {
          rows[key] += 1;
          distinctValues[key].add(String(row.value ?? "").trim());
          seen.add(key);
        }
        continue;
      }
      // 标签登记过但值不符合任何一个字段的规则 —— 不该静默丢掉。
      if (wanted.has(lower(row.label))) {
        const label = `${row.label} = ${String(row.value ?? "").slice(0, 30)}`;
        unknownHits.set(label, (unknownHits.get(label) ?? 0) + 1);
        continue;
      }
      // 没登记的标签,但看着像我们关心的字段 —— 提醒登记,不静默丢掉。
      if (/backset|cent(re|er)|thick|hand|faceplate|face plate|forend|finish/i.test(row.label ?? "")) {
        const label = String(row.label);
        if (!DELIBERATELY_EXCLUDED.some((x) => lower(x) === lower(label))) {
          unknownHits.set(label, (unknownHits.get(label) ?? 0) + 1);
        }
      }
    }
    for (const key of seen) products[key] += 1;
  }

  return {
    generatedBy: "scripts/spec-coverage.mjs",
    site: "hyde",
    totalProducts,
    fields: Object.fromEntries(
      Object.entries(FIELDS).map(([key, def]) => [
        key,
        {
          title: def.title,
          labels: def.labels,
          products: products[key],
          rows: rows[key],
          distinctValues: distinctValues[key].size,
        },
      ]),
    ),
    unregisteredLabels: Object.fromEntries([...unknownHits].sort((a, b) => b[1] - a[1])),
  };
}

const data = collect();
const serialised = `${JSON.stringify(data, null, 2)}\n`;

if (process.argv.includes("--check")) {
  if (!existsSync(OUT)) {
    console.error(`spec-coverage: ${OUT} 不存在 —— 先跑一次 node scripts/spec-coverage.mjs`);
    process.exit(1);
  }
  if (readFileSync(OUT, "utf8") !== serialised) {
    console.error(`spec-coverage: ${OUT} 已过期 —— 跑 node scripts/spec-coverage.mjs 重新生成。`);
    console.error("目录动过了,所以还要检查这几篇引用了这些数字的文章是否也要改:");
    console.error("  content/guides/hardware-refurbishment-survey-2026.json   五个字段的覆盖表");
    console.error("  content/guides/powder-coating-and-ral-2026.json          finish 行数与不同取值数");
    console.error("  content/guides/qualifying-a-hardware-supplier-2026.json  图纸数(另由两个 build-*-drawings 生成)");
    console.error("  content/guides/technical-drawings-what-to-expect-2026.json  同上");
    process.exit(1);
  }
  console.log("spec-coverage: 覆盖率数字与目录一致");
  process.exit(0);
}

writeFileSync(OUT, serialised);

const pad = (s, n) => String(s).padEnd(n);
console.log(`spec-coverage: ${data.totalProducts} 个产品\n`);
console.log(`${pad("字段", 44)}${"产品".padStart(6)}${"行".padStart(6)}${"不同取值".padStart(10)}`);
for (const f of Object.values(data.fields)) {
  console.log(
    `${pad(f.title, 44)}${String(f.products).padStart(6)}${String(f.rows).padStart(6)}${String(f.distinctValues).padStart(10)}`,
  );
}
const unknown = Object.entries(data.unregisteredLabels);
if (unknown.length) {
  console.log("\n未登记但看着相关的标签(要么加进白名单,要么加进排除表):");
  for (const [label, n] of unknown) console.log(`  ${String(n).padStart(4)}  ${JSON.stringify(label)}`);
}
console.log(`\n写入 ${OUT}`);
