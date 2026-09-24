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

const POSITIONING = JSON.parse(
  readFileSync("src/data/category-positioning.json", "utf8"),
);

/**
 * 品类定位。子品类没登记就退到父品类，两者都没有就返回 null。
 *
 * 单个产品可以用 `positioning` 字段整体覆盖（同样的六个键）。2026-09-23 加的：
 * 9088 SS 是「带插芯锁体和欧标锁芯的执手套装」，而 stainless-steel-handles 的品类
 * 定位是「入户门与玻璃门、全截面实心不锈钢」—— 插芯锁装不上无框玻璃门，
 * 执手本体的材质图上也没写。品类文案对大多数成员成立，对它不成立，
 * 就给它自己的一份，而不是把 114 个产品的品类文案改成最小公约数。
 */
function positioning(product) {
  if (product.positioning) return product.positioning;
  const path = product.categoryPath ?? [];
  if (!path.length) return null;
  return POSITIONING[path.join("/")] ?? POSITIONING[path[0]] ?? null;
}

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

/**
 * 型号里的中文后缀，在标题里译成对应语言。
 *
 * 25 个合页型号带着中文变体后缀。型号字段本身不改 —— 它是订货依据。这里只
 * 负责让英西葡三语的标题不出现中文，因为对买家那看起来像页面坏了。
 */
const MODEL_SUFFIX_GLOSS = {
  美标: { en: "US Standard", es: "norma EE.UU.", pt: "norma EUA" },
  圆角: { en: "Radiused", es: "esquina redonda", pt: "canto redondo" },
  偏轴: { en: "Offset Pivot", es: "eje descentrado", pt: "eixo descentrado" },
  中轴: { en: "Centre Pivot", es: "eje central", pt: "eixo central" },
  焊头: { en: "Welded Knuckle", es: "nudillo soldado", pt: "nó soldado" },
  拉手: { en: "Pull", es: "tirador", pt: "puxador" },
  双钉防盗合页: { en: "Twin-Pin Security", es: "antirrobo 2 pasadores", pt: "antirroubo 2 pinos" },
  单钉防盗合页: { en: "Single-Pin Security", es: "antirrobo 1 pasador", pt: "antirroubo 1 pino" },
};

/** 把型号里的中文后缀换成本语言说法。没有中文就原样返回。 */
function glossModel(model, locale) {
  let out = String(model ?? "");
  if (!/[\u4e00-\u9fa5]/.test(out)) return out;
  // 长的先换，否则「防盗合页」会被拆开
  for (const key of Object.keys(MODEL_SUFFIX_GLOSS).sort((a, b) => b.length - a.length)) {
    if (out.includes(key)) out = out.split(key).join(` ${MODEL_SUFFIX_GLOSS[key][locale]}`);
  }
  return out.replace(/\s{2,}/g, " ").trim();
}

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
/**
 * 组一条标题。
 *
 * 顺序就是价值顺序：型号 → 品类名 → **用途场景** → 尺寸 → 材质 → 供应商限定词。
 *
 * 场景排在材质和 OEM 之前，是 2026-09-22 改的。依据:392 条真实查询里纯型号查询
 * 只有 61 条、176 次展示，而全站 2,217 次展示绝大多数来自**不认识我们型号的人**。
 * 对那个人，「for Fire Escape & Exit Doors」比「Zinc Alloy」和「OEM」都值钱 ——
 * 他要先知道这东西是干什么的，才会看规格。
 *
 * 型号仍然留在最前面，因为它只占六到十个字符，而且搜型号的人需要一眼认出。
 */
/**
 * 组一条标题。
 *
 * 顺序就是价值顺序：型号 → 品类名 → **用途场景** → 尺寸 → 材质 → 供应商限定词。
 *
 * 场景是 2026-09-22 加的。依据：392 条真实查询里纯型号查询只有 61 条、176 次
 * 展示，而全站 2,217 次展示绝大多数来自**不认识我们型号的人**。对那个人，
 * 「for Wall & Floor Mounting」比「Zinc Alloy」值钱 —— 他要先知道这东西是干
 * 什么的，才会看规格。
 *
 * 但场景有两条约束，都是看了第一版输出之后加的：
 *
 * 1. **同义反复就不要。** "Glass Door Handle for Frameless Glass Doors" 和
 *    "Panic Exit Device for Fire Escape & Exit Doors" 都是废话 —— 名字已经说了。
 *    场景只在名字含糊时才有价值：Lever Handle、Door Stopper、Lock Case、Grab Bar。
 *
 * 2. **尺寸优先于「只有场景」。** 尺寸是这个产品独有的，场景是整个品类共享的。
 *    一个搜 "glass door handle" 的人面前有十条结果，全都是给玻璃门的；
 *    决定他点哪一条的是长度，不是场景。
 *
 * 型号仍然留在最前，因为它只占六到十个字符，而搜型号的人需要一眼认出。
 */
function composeTitle(product, locale) {
  const model = glossModel(product.model, locale).trim();
  const name =
    locale === "en"
      ? String(product.name ?? "").trim()
      : String(product[locale === "es" ? "nameEs" : "namePt"] ?? product.name ?? "").trim();
  if (!model || !name) return null;

  const head = name.toLowerCase().startsWith(model.toLowerCase()) ? name : `${model} ${name}`;
  const dim = dimensionPhrase(product, locale);
  const mat = materialPhrase(product, locale);
  const tail = ` | ${BRAND[locale]}`;

  const pos = positioning(product);
  const FOR = { en: "for", es: "para", pt: "para" };
  let useRaw = pos ? pos[locale === "en" ? "use" : locale === "es" ? "useEs" : "usePt"] : null;

  /* 同义反复检测：场景里的实词已经出现在名字里，就不要这个场景。 */
  if (useRaw) {
    const STOP = new Set(["for", "and", "&", "the", "of", "para", "y", "e", "de", "la", "las", "los"]);
    const inName = new Set(
      name.toLowerCase().split(/[^a-zÀ-ɏ]+/).filter((w) => w && !STOP.has(w)),
    );
    const words = useRaw.toLowerCase().split(/[^a-zÀ-ɏ]+/).filter((w) => w && !STOP.has(w));
    // 去复数再比，否则 door / doors 不相等，"Glass Door Handle for Frameless
    // Glass Doors" 这种废话就漏过去了。
    const stem = (w) => w.replace(/s$/, "");
    const stems = new Set([...inName].map(stem));
    const overlap = words.filter((w) => stems.has(stem(w))).length;
    if (words.length && overlap / words.length >= 0.4) useRaw = null;
  }

  const use = useRaw ? `${FOR[locale]} ${useRaw}` : null;
  // 场景接在品类名后面，用空格而不是破折号 —— 它读起来是名字的一部分。
  const withUse = use ? `${head} ${use}` : head;

  const build = (stem, parts) => stem + (parts.length ? `, ${parts.join(", ")}` : "") + tail;

  /*
    退让顺序。场景 + 尺寸最好；装不下时先保尺寸（产品独有），再保场景（品类共享）。
    规格永远排在营销限定词前面。
  */
  const candidates = [];
  if (use) {
    candidates.push([withUse, [dim, mat]]);
    candidates.push([withUse, [dim]]);
  }
  for (const q of QUALIFIER[locale]) candidates.push([head, [dim, mat, q]]);
  candidates.push([head, [dim, mat]]);
  for (const q of QUALIFIER[locale]) candidates.push([head, [dim, q]]);
  candidates.push([head, [dim]]);
  if (use) {
    candidates.push([withUse, [mat]]);
    candidates.push([withUse, []]);
  }
  for (const q of QUALIFIER[locale]) candidates.push([head, [mat, q]]);
  candidates.push([head, [mat]]);
  for (const q of QUALIFIER[locale]) candidates.push([head, [q]]);
  candidates.push([head, []]);

  for (const [stem, parts] of candidates) {
    const title = build(stem, parts.filter(Boolean));
    if (title.length <= MAX) return title;
  }
  return build(head, []);
}

/**
 * 描述。**前半段必须由这个产品自己的事实构成** —— 最多三条,按对买家的价值排序。
 *
 * 旧版是每个产品一句同样的「工厂直供」,924 条几乎一模一样。那既是重复内容,
 * 也把结果页上最值钱的一百个字符浪费在了一句谁都能说的话上。搜 FB005 的人要看到
 * 的是 FB005 的事,不是我们公司的事。
 */
/**
 * 描述。158 个字符是标题装不下的东西的去处 —— **卖点、性能、买家真正在乎的事**。
 *
 * 结构：这个产品是什么和给哪儿用 → 品类卖点 → 它自己的两三条事实。
 *
 * 旧版 924 条几乎一模一样（全是「Direct from the factory in Guangzhou…」），
 * 既是重复内容，又把最值钱的一百个字符浪费在一句谁都能说的话上。
 * 现在开头就分岔：品类给一句卖点，产品给自己的规格。
 */
/**
 * 描述。158 个字符是标题装不下的东西的去处 —— **卖点、性能、买家真正在乎的事**。
 *
 * 结构：这个产品是什么和给哪儿用 → 品类卖点 → 它自己的两三条事实。
 *
 * 旧版 924 条几乎一模一样（全是「Direct from the factory in Guangzhou…」），
 * 既是重复内容，又把最值钱的一百个字符浪费在一句谁都能说的话上。
 * 现在开头就分岔：品类给一句卖点，产品给自己的规格。
 */
function composeDescription(product, locale) {
  const model = glossModel(product.model, locale).trim();
  const name =
    locale === "en"
      ? String(product.name ?? "").trim()
      : String(product[locale === "es" ? "nameEs" : "namePt"] ?? product.name ?? "").trim();

  const pos = positioning(product);
  const pitch = pos ? pos[locale === "en" ? "pitch" : locale === "es" ? "pitchEs" : "pitchPt"] : null;
  const useRaw = pos ? pos[locale === "en" ? "use" : locale === "es" ? "useEs" : "usePt"] : null;
  const FOR = { en: "for", es: "para", pt: "para" };

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
  /* 目录里的值常带尾部句点和空格（"Fire door , panic door ."）。统一清洗。 */
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
  const finishCount = finishRaw ? finishRaw.split(/\s*[/,]\s*/).filter((x) => x.trim()).length : 0;
  const fn = short(row("Function"));
  const handing = short(row("Handing"), 38);
  const backset = short(row("Backset"), 24);

  if (locale === "en") {
    push(mat ? `${mat.toLowerCase()}` : null);
    push(dim);
    push(fn);
    push(backset && !String(dim ?? "").includes("backset") ? `${backset} backset` : null);
    push(handing && /revers|non-?hand/i.test(handing) ? "fully reversible" : null);
    push(finishCount > 1 ? `${finishCount} finishes` : null);
  } else if (locale === "es") {
    push(mat ? mat.toLowerCase() : null);
    push(dim);
    push(backset && !String(dim ?? "").includes("entrada") ? `entrada ${backset}` : null);
    push(handing && /revers|non-?hand/i.test(handing) ? "totalmente reversible" : null);
    push(finishCount > 1 ? `${finishCount} acabados` : null);
  } else {
    push(mat ? mat.toLowerCase() : null);
    push(dim);
    push(backset && !String(dim ?? "").includes("distância") ? `distância ${backset}` : null);
    push(handing && /revers|non-?hand/i.test(handing) ? "totalmente reversível" : null);
    push(finishCount > 1 ? `${finishCount} acabamentos` : null);
  }

  const opener = useRaw
    ? `${model} ${name.toLowerCase()} ${FOR[locale]} ${useRaw.toLowerCase()}.`
    : `${model} ${name.toLowerCase()}.`;

  /*
    事实在前，卖点在后。卖点是整个品类共享的一句话，如果排在前面，同品类的
    三十七条描述前一百个字符就一模一样 —— 那正是旧版的毛病。
    产品自己的规格必须先出现，卖点被截断没关系。
  */
  const parts = [opener];
  if (facts.length) parts.push(`${facts.join(", ")}.`);
  if (pitch) parts.push(pitch);

  let out = parts.join(" ").replace(/\s{2,}/g, " ").replace(/\.\./g, ".").trim();
  if (out.length > DESC_MAX) {
    out = `${out.slice(0, DESC_MAX - 1).replace(/[\s,;:—-]+$/, "")}…`;
  }
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
  // The same content directory also feeds Rayen. Its /zh and /en pages build
  // their own metadata; Canton Hyland titles are only for HYDE catalogue routes.
  // Keep this predicate aligned with onHydeCatalogue in src/data/products.ts.
  if (product.sites && !product.sites.includes("hyde")) continue;
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
