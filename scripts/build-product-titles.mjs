/**
 * 产品页标题与描述:为点击率重写,三语。
 *
 * ---------------------------------------------------------------------------
 * 为什么
 *
 * 两个月复盘(docs/research/SEO-GEO-REVIEW-2026-09-22.md)里最刺眼的一组数:
 * 展示涨了 6.1 倍,点击只涨 2.3 倍。型号查询 fb005 / bh28 / 564mb / d102 排在
 * 3–8 名,**一次点击都没有**;`patch fitting` 排第 1 名,同样零点击。
 *
 * 排名已经到手了。差的是搜索结果页上那两行字。
 *
 * `FB005 Door Flush Bolt — Brass | Canton Hyland` 对一个搜 FB005 的人几乎零
 * 信息量 —— 他手里已经有那个零件,他要确认的是**尺寸对不对、能不能买**。
 *
 * ---------------------------------------------------------------------------
 * 长尾词从哪来:读买家实际打进去的字,不猜
 *
 * tmp 里的挖掘脚本从 GSC + Bing + Clarity 的 392 条真实查询里跑出这些句式:
 *
 *   china scalloped edge steel hinge        产地 + 特征 + 材质 + 类型
 *   brass hinges manufacturing plant cost   材质 + 类型 + 供应商意图
 *   fire door with panic hardware           应用 + 产品
 *   rim night latch (zinc alloy) 564        类型 + 材质 + 型号
 *   standard euro cylinder installation…    标准 + 类型 + 意图
 *
 * 所以买家搜的是「类型 + 材质 + 尺寸 + 产地/供应商」。标题按这个顺序装。
 *
 * ---------------------------------------------------------------------------
 * 一条硬边界
 *
 * 文案可以组合、可以写得有吸引力,**但标题里的每个规格数字都必须来自该产品
 * 自己的 specs 行**。没有就不写,不估、不套用同族的值。
 *
 * 这不是洁癖,是转化率:买五金的人会拿标题里的尺寸去比对手上的零件。对不上,
 * 他不只是不下单,是不会再回来 —— 而一个对不上的尺寸会让他把这一页上所有
 * 数字都打折,包括对的那些。客户方 principal 2026-09-04 定的红线也在这里。
 *
 * 「工厂直供 / OEM / China」这类限定词**不是规格**,而且它们是事实(我们是
 * 工厂,目录里就写着 OEM & ODM available),所以可以用,而且应该用 —— 那正是
 * `manufacturing plant cost` 这类查询在找的东西。
 *
 * ---------------------------------------------------------------------------
 * 用法
 *
 *   node scripts/build-product-titles.mjs            只看会改成什么(dry run)
 *   node scripts/build-product-titles.mjs --write    实际写入
 *   node scripts/build-product-titles.mjs --check    CI:检查是否过期
 *   node scripts/build-product-titles.mjs --sample 40  多看几条样例
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/products";
const WRITE = process.argv.includes("--write");
const CHECK = process.argv.includes("--check");
const sampleAt = process.argv.indexOf("--sample");
const SAMPLE = sampleAt !== -1 ? Number(process.argv[sampleAt + 1]) : 12;

/** 标题目标长度。Google 大约 600px 截断,拉丁文约 60–65 字符。 */
const MAX = 65;
/** 描述目标长度。Google 大约 920px,约 155–160 字符。 */
const DESC_MAX = 158;

const BRAND = { en: "Canton Hyland", es: "Canton Hyland", pt: "Canton Hyland" };

/** 供应商限定词。都是事实,不是规格。按长度从长到短,装得下哪个用哪个。 */
const QUALIFIER = {
  en: ["China Factory Direct", "China Factory", "Factory Direct", "OEM"],
  es: ["Fábrica en China", "Fábrica directa", "OEM"],
  pt: ["Fábrica na China", "Fábrica direta", "OEM"],
};

/** 尺寸取哪一行,以及在标题里怎么读。顺序即优先级。 */
const DIMENSION_SOURCES = [
  { label: "Size", en: (v) => v, es: (v) => v, pt: (v) => v },
  // 合页买家搜的就是叶片尺寸 —— "china scalloped edge steel hinge" 那类查询
  { label: "Leaf size", en: (v) => v, es: (v) => v, pt: (v) => v },
  { label: "Plate size", en: (v) => v, es: (v) => v, pt: (v) => v },
  { label: "Overall length", en: (v) => v, es: (v) => v, pt: (v) => v },
  { label: "Available lengths", en: (v) => v, es: (v) => v, pt: (v) => v },
  { label: "Length", en: (v) => v, es: (v) => v, pt: (v) => v },
  { label: "Grip length", en: (v) => `${v} grip`, es: (v) => `agarre ${v}`, pt: (v) => `pega ${v}` },
  { label: "Lever length", en: (v) => v, es: (v) => v, pt: (v) => v },
  { label: "Plate length", en: (v) => `${v} plate`, es: (v) => `placa ${v}`, pt: (v) => `placa ${v}` },
  { label: "Backset", en: (v) => `${v} backset`, es: (v) => `entrada ${v}`, pt: (v) => `distância ${v}` },
  {
    label: "Door thickness",
    en: (v) => `for ${v} doors`,
    es: (v) => `para puertas de ${v}`,
    pt: (v) => `para portas de ${v}`,
  },
];

const MATERIAL_LABELS = ["Material", "Materials", "Body material", "Case material"];

const spec = (product, label) =>
  (product.specs ?? []).find((r) => String(r.label).trim().toLowerCase() === label.toLowerCase());

const specIn = (product, key, label) =>
  (product[key] ?? []).find((r) => String(r.label).trim().toLowerCase() === label.toLowerCase());

/**
 * 把一个可能很啰嗦的尺寸值压成标题能用的短形式。
 * "300*135*60mm / 400*135*100mm" → "300–400mm";"6in/8in/10in" → "6–24in"
 */
function condense(value) {
  const v = String(value ?? "").trim();
  if (!v) return null;

  /** 一段像 "300 × 75mm" / "100*85*25mm" / '4" x 3"' 的复合尺寸 → "300×75mm"。 */
  const compound = (s) => {
    const t = s.trim();
    // 带引号的英寸，每个数字后各一个引号：4" x 3"
    const inches = t.match(/^(\d+(?:\.\d+)?)\s*"\s*[×*x]\s*(\d+(?:\.\d+)?)\s*"?$/i);
    if (inches) return inches[1] + "×" + inches[2] + "in";
    const m = t.match(
      /^(\d+(?:\.\d+)?)\s*[×*x]\s*(\d+(?:\.\d+)?)(?:\s*[×*x]\s*(\d+(?:\.\d+)?))?\s*(mm|cm|in|")?$/i,
    );
    if (!m) return null;
    const unit = (m[4] ?? "mm").toLowerCase().replace('"', "in");
    return [m[1], m[2], m[3]].filter(Boolean).join("×") + unit;
  };

  /*
    「最大 / 至多」必须留住语气。目录里 "Up to 80mm" 压成 "80mm" 之后，标题会
    变成 "for 80mm doors" —— 意思从「最厚 80」变成了「就是 80」，方向反了。
  */
  const atMost = v.match(/^(?:up\s+to|max(?:imum)?)\s*(\d+(?:\.\d+)?)\s*(mm|cm|in)?/i);
  if (atMost) return "≤" + atMost[1] + (atMost[2] ?? "mm").toLowerCase();

  /*
    可调尺寸："60/70mm" 是一把可以设成两者之一的锁，不是 70mm。目录里约 109 条
    backset 是这个写法，压成 "70mm" 会丢掉「可调」这个卖点，也会让要 60 的人
    以为不合适。
  */
  const adjustable = v.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*(mm|cm|in)\b/i);
  if (adjustable) return adjustable[1] + "/" + adjustable[2] + adjustable[3].toLowerCase();

  const direct = compound(v);
  if (direct) return direct;

  /*
    斜杠分隔的多个**可选尺寸**。取第一个，不跨维度取极值 ——
    "300*135*60mm / 400*135*100mm" 压成 "60–100mm" 会被读成某一个维度的区间，
    那是假的。第一个尺寸是真的，页面上列着全部。
  */
  const parts = v.split(/\s*\/\s*/).map((s) => s.trim()).filter(Boolean);
  if (parts.length > 1) {
    const first = compound(parts[0]);
    if (first) return first;
  }

  const hasCross = /[×*x]/i.test(v);

  /* 同一维度的多个值，区间在这里是真的：6in/8in/10in/12in/24in → 6–24in */
  const inch = [...v.matchAll(/(\d+(?:\.\d+)?)\s*(?:in\b|")/gi)].map((x) => Number(x[1]));
  if (!hasCross && inch.length > 1) {
    return Math.min(...inch) + "–" + Math.max(...inch) + "in";
  }
  const mm = [...v.matchAll(/(\d+(?:\.\d+)?)\s*mm/gi)].map((x) => Number(x[1]));
  if (!hasCross && mm.length > 1) {
    const lo = Math.min(...mm);
    const hi = Math.max(...mm);
    return lo === hi ? lo + "mm" : lo + "–" + hi + "mm";
  }
  if (!hasCross && mm.length === 1) return mm[0] + "mm";
  if (!hasCross && inch.length === 1) return inch[0] + "in";

  if (v.length <= 14 && /\d/.test(v)) return v.replace(/\s*[*×x]\s*/gi, "×").replace(/\s+/g, " ");
  return null;
}

/** 材质值压短。"Iron+stainless steel" → "Iron & Stainless" 之类。 */
function shortMaterial(value) {
  let v = String(value ?? "").trim();
  if (!v) return null;
  /*
    目录里材质常写成 "304SS / 304 Stainless Steel with Plated and suit for…"。
    整串太长,但**第一个备选就是买家要看的那个词**。所以先取斜杠/逗号前的部分,
    而不是整串放弃 —— 001 就是这样丢掉 "304SS" 的。
  */
  if (v.length > 30) v = v.split(/\s*[/,;]\s*/)[0].trim();
  v = v.replace(/\s*\+\s*/g, " & ").replace(/\s+/g, " ");
  v = v.replace(/\s*\((?:[^)]*)\)\s*$/, "").trim();
  v = v.replace(/[.,;:\s]+$/, "");
  if (!v || v.length > 26) return null;
  return v;
}

/** 该产品在这个语言里的尺寸短语,没有就 null。 */
function dimensionPhrase(product, locale) {
  const key = locale === "en" ? "specs" : locale === "es" ? "specsEs" : "specsPt";
  for (const source of DIMENSION_SOURCES) {
    // 尺寸的**数值**永远取自英文 specs(唯一权威),只有读法按语言换
    const row = spec(product, source.label);
    if (!row) continue;
    const c = condense(row.value);
    if (!c) continue;
    // 如果本地化 specs 里有同一行,用它的值(可能单位写法不同)
    const localRow = key === "specs" ? row : specIn(product, key, source.label);
    const localC = localRow ? condense(localRow.value) : null;
    return source[locale](localC ?? c);
  }
  return null;
}

/**
 * 只对英文做大小写归一。目录里同一材质有 "Zinc Alloy" 和 "zinc alloy" 两种写法。
 *
 * 刻意不碰西班牙语和葡萄牙语：它们来自 specsEs / specsPt，本来就是对的。而且用
 * \b 做归一会把 "latón" 变成 "LatóN" —— \b 把重音字母当成非单词字符，于是认为
 * ó 之后是一个新词的开头。这个 bug 在 2026-09-22 真的发生过。
 */
function titleCaseEn(v) {
  return v
    .split(/(\s+|-)/)
    .map((w) => (/^[a-z]/.test(w) ? w[0].toUpperCase() + w.slice(1) : w))
    .join("")
    .replace(/\bSs\b/g, "SS")
    .replace(/\bPvd\b/g, "PVD");
}

function materialPhrase(product, locale) {
  const key = locale === "en" ? "specs" : locale === "es" ? "specsEs" : "specsPt";
  for (const label of MATERIAL_LABELS) {
    const row = key === "specs" ? spec(product, label) : specIn(product, key, label) ?? spec(product, label);
    if (!row) continue;
    const m = shortMaterial(row.value);
    if (m) return locale === "en" ? titleCaseEn(m) : m;
  }
  return null;
}

/**
 * 组一条标题。装不下就按优先级往下丢:限定词 → 材质 → 尺寸。
 * 型号和品类名永远保留 —— 那是搜型号的人用来认出「就是这个」的两样东西。
 */
function composeTitle(product, locale) {
  const model = String(product.model ?? "").trim();
  const name =
    locale === "en"
      ? String(product.name ?? "").trim()
      : String(product[locale === "es" ? "nameEs" : "namePt"] ?? product.name ?? "").trim();
  if (!model || !name) return null;

  const head = name.toLowerCase().startsWith(model.toLowerCase()) ? name : `${model} ${name}`;
  const dim = dimensionPhrase(product, locale);
  const mat = materialPhrase(product, locale);
  const tail = ` | ${BRAND[locale]}`;

  const build = (parts) => head + (parts.length ? ` — ${parts.join(", ")}` : "") + tail;

  /*
    退让顺序。规格永远排在营销词前面 —— 对一个搜型号的买家,`304SS` 比
    `China Factory Direct` 有用得多。限定词只填剩下的空间,不跟规格抢。
  */
  const candidates = [];
  for (const q of QUALIFIER[locale]) candidates.push([dim, mat, q]);
  candidates.push([dim, mat]);
  for (const q of QUALIFIER[locale]) candidates.push([dim, q]);
  candidates.push([dim]);
  for (const q of QUALIFIER[locale]) candidates.push([mat, q]);
  candidates.push([mat]);
  for (const q of QUALIFIER[locale]) candidates.push([q]);
  candidates.push([]);

  for (const parts of candidates) {
    const title = build(parts.filter(Boolean));
    if (title.length <= MAX) return title;
  }
  return build([]);
}

/**
 * 描述。**前半段必须由这个产品自己的事实构成** —— 最多三条,按对买家的价值排序。
 *
 * 旧版是每个产品一句同样的「工厂直供」,924 条几乎一模一样。那既是重复内容,
 * 也把结果页上最值钱的一百个字符浪费在了一句谁都能说的话上。搜 FB005 的人要看到
 * 的是 FB005 的事,不是我们公司的事。
 */
function composeDescription(product, locale) {
  const model = String(product.model ?? "").trim();
  const name =
    locale === "en"
      ? String(product.name ?? "").trim()
      : String(product[locale === "es" ? "nameEs" : "namePt"] ?? product.name ?? "").trim();

  const facts = [];
  const push = (v) => {
    if (v && facts.length < 3) facts.push(v);
  };

  const dim = dimensionPhrase(product, locale);
  const mat = materialPhrase(product, locale);

  const row = (label) => {
    const r = spec(product, label);
    return r ? String(r.value).trim() : null;
  };
  /*
    目录里的值常带尾部句点和空格("Fire door , panic door .")。原样拼进描述
    会出现 "panic door .." 这种。这里统一清洗,顺便把内部的空格-逗号收紧。
  */
  const short = (v, n = 44) => {
    if (!v) return null;
    const c = String(v)
      .replace(/\s+([,;.])/g, "$1")
      .replace(/\s{2,}/g, " ")
      .replace(/[.,;:\s]+$/, "")
      .trim();
    return c && c.length <= n ? c : null;
  };

  const finishRaw = row("Finish");
  const finishCount = finishRaw
    ? finishRaw.split(/\s*[\/,]\s*/).filter((x) => x.trim()).length
    : 0;

  const fn = short(row("Function"));
  const handing = short(row("Handing"), 38);
  const thickness = short(row("Door thickness"), 38);
  const backset = short(row("Backset"), 24);
  const application = short(row("Application"), 48);

  if (locale === "en") {
    push(mat ? `${mat} construction` : null);
    push(dim);
    push(fn);
    push(backset && !String(dim ?? "").includes("backset") ? `${backset} backset` : null);
    push(thickness && !String(dim ?? "").includes("doors") ? `fits ${thickness} doors` : null);
    push(handing && /revers|non-?hand/i.test(handing) ? "fully reversible" : null);
    push(finishCount > 1 ? `${finishCount} finishes` : null);
    push(application);
  } else if (locale === "es") {
    push(mat ? `construcción en ${mat.toLowerCase()}` : null);
    push(dim);
    push(backset && !String(dim ?? "").includes("entrada") ? `entrada ${backset}` : null);
    push(thickness ? `para puertas de ${thickness}` : null);
    push(handing && /revers|non-?hand/i.test(handing) ? "totalmente reversible" : null);
    push(finishCount > 1 ? `${finishCount} acabados` : null);
  } else {
    push(mat ? `construção em ${mat.toLowerCase()}` : null);
    push(dim);
    push(backset && !String(dim ?? "").includes("distância") ? `distância ${backset}` : null);
    push(thickness ? `para portas de ${thickness}` : null);
    push(handing && /revers|non-?hand/i.test(handing) ? "totalmente reversível" : null);
    push(finishCount > 1 ? `${finishCount} acabamentos` : null);
  }

  const CTA = {
    en: "Specifications and a quotation direct from the factory.",
    es: "Especificaciones y cotización directas de fábrica.",
    pt: "Especificações e orçamento direto da fábrica.",
  };

  const head = `${model} ${name.toLowerCase()}`;
  const body = facts.length ? `: ${facts.join(", ")}` : "";
  let out = `${head}${body}. ${CTA[locale]}`.replace(/\s{2,}/g, " ").trim();
  if (out.length > DESC_MAX) out = `${out.slice(0, DESC_MAX - 1).replace(/[\s,;:—-]+$/, "")}…`;
  return out;
}


const FIELDS = [
  ["en", "seoTitle", "seoDescription"],
  ["es", "seoTitleEs", "seoDescriptionEs"],
  ["pt", "seoTitlePt", "seoDescriptionPt"],
];

const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
let changed = 0;
let withDim = 0;
let withQual = 0;
const samples = [];
const overLong = [];

for (const file of files) {
  const path = join(DIR, file);
  const product = JSON.parse(readFileSync(path, "utf8"));
  let touched = false;

  for (const [locale, titleKey, descKey] of FIELDS) {
    const title = composeTitle(product, locale);
    if (!title) continue;
    const desc = composeDescription(product, locale);
    if (product[titleKey] !== title || product[descKey] !== desc) {
      if (locale === "en" && samples.length < SAMPLE) {
        samples.push({ before: product[titleKey], after: title, desc });
      }
      product[titleKey] = title;
      product[descKey] = desc;
      touched = true;
    }
    if (locale === "en") {
      if (dimensionPhrase(product, "en")) withDim++;
      if (QUALIFIER.en.some((q) => title.includes(q))) withQual++;
      if (title.length > MAX) overLong.push(`${title.length}  ${title}`);
    }
  }

  if (touched) {
    changed++;
    if (WRITE) writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
  }
}

if (CHECK) {
  if (changed) {
    console.error(`product-titles: ${changed} 个产品的标题/描述与生成器不一致 —— 跑 --write 重新生成`);
    process.exit(1);
  }
  console.log("product-titles: 标题与描述都是最新的");
  process.exit(0);
}

console.log(`产品总数 ${files.length}`);
console.log(`  需要更新: ${changed}`);
console.log(`  标题里带到尺寸: ${withDim}`);
console.log(`  标题里装下供应商限定词: ${withQual}`);
console.log(`  超过 ${MAX} 字符: ${overLong.length}`);
if (overLong.length) for (const l of overLong.slice(0, 5)) console.log(`      ${l}`);
console.log(WRITE ? "\n已写入。" : "\n这是 dry run,加 --write 才会写。\n");

for (const s of samples) {
  console.log(`旧  ${s.before}`);
  console.log(`新  ${s.after}   (${s.after.length})`);
  console.log(`描述 ${s.desc}   (${s.desc.length})\n`);
}
