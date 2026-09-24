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
 * 「for / para」接场景。名字里已经有一个「para」时换成「en / em / on」：
 * 「001 guarnición exterior para barra antipánico para puertas de evacuación」读起来像机翻，
 * 09-24 数到西语 29 条、葡语 30 条（015 有三个 para）。
 */
function connector(name, locale) {
  const FOR = { en: "for", es: "para", pt: "para" };
  const ALT = { en: "on", es: "en", pt: "em" };
  return new RegExp(`\\b${FOR[locale]}\\b`, "i").test(name) ? ALT[locale] : FOR[locale];
}

/** 同理：门厚短语「para portas de 12mm」跟在带 para 的名字后面时，改说「门厚 12mm」。 */
function thicknessAfter(name, dim, locale) {
  if (!dim || connector(name, locale) !== { en: "on", es: "en", pt: "em" }[locale]) return dim;
  const m = dim.match(/^(?:for|para) (?:puertas|portas) de (.+)$|^for (.+) doors$/);
  if (!m) return dim;
  const v = m[1] ?? m[2];
  return { en: `${v} door thickness`, es: `espesor de puerta ${v}`, pt: `espessura de porta ${v}` }[locale];
}

/**
 * 品类定位。子品类没登记就退到父品类，两者都没有就返回 null。
 *
 * 单个产品可以用 `positioning` 字段整体覆盖（同样的六个键）。2026-09-23 加的：
 * 9088 SS 是「带插芯锁体和欧标锁芯的执手套装」，而 stainless-steel-handles 的品类
 * 定位是「入户门与玻璃门、全截面实心不锈钢」—— 插芯锁装不上无框玻璃门，
 * 执手本体的材质图上也没写。品类文案对大多数成员成立，对它不成立，
 * 就给它自己的一份，而不是把 114 个产品的品类文案改成最小公约数。
 *
 * 2026-09-24：306 PS 是通道推杠，自己没有锁舌，靠另配的插芯锁体锁闭。品类场景
 * 「逃生与出口门」会把它说成逃生装置 —— 安全问题，所以它有自己的一份。
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
/*
  标题正文（不含「 | Canton Hyland」）的上限。2026-09-24 起按方案第七节：型号和最关键的长尾词
  必须落在前 60 个字符里，站名放最后，被 Google 截掉也无妨。原来是整条 65（含站名 16 个字符），
  正文只剩 49 个字符，LC04 的标题因此装不下「85mm centre」。
*/
const MAX = 60;
/** 描述上限（方案 7.3）：完整句子、≤150 字符、以下一步收尾，不用「…」截断。 */
const DESC_MAX = 150;

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
  中轴: { en: "Center Pivot", es: "eje central", pt: "eixo central" },
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
function dimensionPhrase(product, locale, full = false) {
  const key = locale === "en" ? "specs" : locale === "es" ? "specsEs" : "specsPt";
  /*
    锁体：中心距和 backset 一起写（方案 7.2，插芯锁体 57% 的查询是数字型）。瑞士买家从 ChatGPT
    落到 LC04 85×60，问的就是这两个数；原来只取第一个可用尺寸，标题里只有 backset。
  */
  if ([].concat(product.categoryPath ?? [])[0] === "lock-cases") {
    const mm = (label) => (String(spec(product, label)?.value ?? "").match(/^(\d+(?:\.\d+)?)\s*mm$/i) ?? [])[1];
    const c = mm("Center distance");
    const b = mm("Backset");
    if (c && b) {
      /* 标题用短写（西葡的品类名长，全称放不进 60 个字符），描述用全称 */
      return (full
        ? { en: `${c}mm center distance, ${b}mm backset`, es: `distancia entre ejes de ${c} mm, entrada de ${b} mm`, pt: `distância entre centros de ${c} mm, distância ao eixo de ${b} mm` }
        : { en: `${c}mm center, ${b}mm backset`, es: `ejes ${c} mm, entrada ${b} mm`, pt: `centros ${c} mm, eixo ${b} mm` })[locale];
    }
  }
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

/*
  产品名只是品类名时，换成买家搜的叫法（方案 7.4 第 2 条）。
  47 个锁体三语都只叫「Lock Case」，27 个合页都叫品类名「Brass and Steel Hinges」，其中大半是不锈钢
  （SSH018 就是 —— 标题写着 Brass and Steel，材质行写着 Stainless Steel）。
  只换名字里的叫法；型号、材质都来自记录本身。
*/
const GENERIC_NAMES = {
  "lock-cases": {
    match: { en: "Lock Case", es: "Cerradura de embutir", pt: "Caixa de fechadura" },
    buyer: () => ({ en: "Mortise Lock Case", es: "Cerradura de embutir", pt: "Fechadura de embutir" }),
  },
  "brass-steel-hinges": {
    match: { en: "Brass and Steel Hinges", es: "Bisagras de latón y acero", pt: "Dobradiças de latão e aço" },
    buyer: (m) => ({
      en: m.en ? `${m.en} Door Hinge` : "Door Hinge",
      es: m.es ? `Bisagra de ${m.es.toLowerCase()}` : "Bisagra de puerta",
      pt: m.pt ? `Dobradiça de ${m.pt.toLowerCase()}` : "Dobradiça de porta",
    }),
  },
};

/** 型号字段填的其实是英文名（没有型号的记录）。 */
const modelIsName = (product) => String(product.model ?? "").trim().toLowerCase() === String(product.name ?? "").trim().toLowerCase();
const cap0 = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);

/** 名字里已经有这个材质（「9015 Stainless Steel Handle」），标题和描述就不再重复一遍。 */
function unlessNamed(mat, name) {
  if (!mat) return mat;
  const n = String(name).toLowerCase();
  const m = String(mat).toLowerCase();
  if (n.includes(m)) return null;
  /* 同一种材质的不同写法：Puxador em inox ↔ Aço inoxidável，Brass ↔ Solid Brass */
  const ROOTS = [/inox|stainless/, /brass|lat[óã]o?n?|latão/, /zinc|zamak|zamac/, /alumin/];
  return ROOTS.some((r) => r.test(n) && r.test(m)) ? null : mat;
}

function displayName(product, locale) {
  const raw =
    locale === "en"
      ? String(product.name ?? "").trim()
      : String(product[locale === "es" ? "nameEs" : "namePt"] ?? product.name ?? "").trim();
  /* 西葡品类名里最长的两个，标题放不下任何规格；换成同义的短写 */
  const SHORT = {
    "Cerradura cilíndrica de servicio ligero": "Cerradura cilíndrica ligera",
    "Cerradura cilíndrica de servicio pesado": "Cerradura cilíndrica reforzada",
    "Fechadura cilíndrica de serviço leve": "Fechadura cilíndrica leve",
    "Fechadura cilíndrica de serviço pesado": "Fechadura cilíndrica reforçada",
  };
  if (SHORT[raw]) return SHORT[raw];
  const rule = GENERIC_NAMES[[].concat(product.categoryPath ?? [])[0]];
  if (!rule || raw !== rule.match[locale]) return raw;
  const mat = { en: materialPhrase(product, "en"), es: materialPhrase(product, "es"), pt: materialPhrase(product, "pt") };
  return rule.buyer(mat)[locale];
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
  const name = displayName(product, locale);
  if (!model || !name) return null;

  /*
    有些记录没有型号，model 填的就是英文名（「Tubular Knob Lock」）。西葡标题里再把它放在前面，
    就成了「Tubular Knob Lock Cerradura tubular de perilla」。这种只用本语言的名字。
  */
  const head = modelIsName(product) || name.toLowerCase().startsWith(model.toLowerCase()) ? name : `${model} ${name}`;
  const dim = thicknessAfter(displayName(product, locale), dimensionPhrase(product, locale), locale);
  const mat = unlessNamed(materialPhrase(product, locale), name);
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

  const use = useRaw ? `${connector(name, locale)} ${useRaw}` : null;
  // 场景接在品类名后面，用空格而不是破折号 —— 它读起来是名字的一部分。
  const withUse = use ? `${head} ${use}` : head;
  /*
    短场景：整句场景放不进 60 个字符时，只取含「门」的那一段（「entradas y puertas de vidrio」→
    「puertas de vidrio」，「Fire Escape & Exit Doors」→「Exit Doors」），都没有就取第一段。
    09-24 加：否则 186 条标题只剩型号和品类名，没有任何长尾成分（方案 7.4 第 3 条）。
  */
  let useShortRaw = null;
  if (useRaw) {
    const parts = useRaw.split(/\s*(?:,|&|\by\b|\be\b|\band\b)\s*/).filter(Boolean);
    const door = parts.find((p) => /door|puerta|porta/i.test(p));
    /* 段内含「门」时从门字起取（「seguridad en puertas de entrada」→「puertas de entrada」） */
    const fromDoor = door ? door.slice(door.search(/doors?|puertas?|portas?/i)) : null;
    /* 没有「门」字且只有一段时，去掉第一个修饰词（「Frameless Glass Entrances」→「Glass Entrances」） */
    const pick = fromDoor ?? (parts.length === 1 ? parts[0].split(" ").slice(1).join(" ") : parts[0]);
    if (pick && pick !== useRaw) useShortRaw = pick;
  }
  const withUseShort = useShortRaw ? `${head} ${connector(name, locale)} ${useShortRaw}` : null;

  const build = (stem, parts) => stem + (parts.length ? `, ${parts.join(", ")}` : "") + tail;

  /*
    退让顺序。场景 + 尺寸最好；装不下时先保尺寸（产品独有），再保场景（品类共享）。
    规格永远排在营销限定词前面。
  */
  /*
    2026-09-24（方案 7.1）：供应商限定词（China Factory / OEM）不再和规格、场景抢标题位置，
    「工厂直供」改由描述最后一句承担。只有一个产品既没有尺寸、材质，也没有场景可写时，
    标题才用限定词补位，免得只剩型号和品类名。
  */
  const candidates = [];
  if (use) {
    candidates.push([withUse, [dim, mat]]);
    candidates.push([withUse, [dim]]);
  }
  if (dim || mat) {
    candidates.push([head, [dim, mat]]);
    candidates.push([head, [dim]]);
  }
  if (use) {
    candidates.push([withUse, [mat]]);
    candidates.push([withUse, []]);
  }
  if (withUseShort) {
    candidates.push([withUseShort, [mat]]);
    candidates.push([withUseShort, []]);
  }
  if (mat) candidates.push([head, [mat]]);
  if (!dim && !mat && !use) for (const q of QUALIFIER[locale]) candidates.push([head, [q]]);
  candidates.push([head, []]);

  for (const [stem, parts] of candidates) {
    const title = build(stem, parts.filter(Boolean));
    if (title.length - tail.length <= MAX) return title;
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
/** 材质进句子：普通单词转小写，全大写缩写（ABS、304SS、PVD）保留原样。 */
const inSentence = (m) => String(m).split(/(\s+)/).map((w) => (/^[A-ZÀ-Ý][a-zà-ÿ]+$/.test(w) ? w.toLowerCase() : w)).join("");

function composeDescription(product, locale) {
  const model = glossModel(product.model, locale).trim();
  const name = displayName(product, locale);

  const pos = positioning(product);
  const pitch = pos ? pos[locale === "en" ? "pitch" : locale === "es" ? "pitchEs" : "pitchPt"] : null;
  let useRaw = pos ? pos[locale === "en" ? "use" : locale === "es" ? "useEs" : "usePt"] : null;
  /*
    和标题一样去掉同义反复：名字里已经说了场景，开头句就不再「for …」一遍。
    09-24 之前描述没有这一步，出现过「barra antipánico para puerta cortafuego para puertas cortafuegos」。
  */
  if (useRaw) {
    const STOP = new Set(["for", "and", "&", "the", "of", "para", "y", "e", "de", "la", "las", "los", "do", "da", "das", "dos"]);
    const stem = (w) => w.replace(/e?s$/, "");
    const inName = new Set(name.toLowerCase().split(/[^a-zà-ɏ]+/).filter((w) => w && !STOP.has(w)).map(stem));
    const words = useRaw.toLowerCase().split(/[^a-zà-ɏ]+/).filter((w) => w && !STOP.has(w));
    if (words.length && words.filter((w) => inName.has(stem(w))).length / words.length >= 0.4) useRaw = null;
  }
  const FOR = { en: "for", es: "para", pt: "para" };

  const facts = [];
  const push = (v) => {
    if (v && facts.length < 3) facts.push(v);
  };

  const dim = thicknessAfter(name, dimensionPhrase(product, locale, true), locale);
  const mat = unlessNamed(materialPhrase(product, locale), name);

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
  /*
    功能值形如「Entrance, keyed outside」「Privacy, bathroom, turn button inside」。放进逗号分隔的
    事实句里会读成三件事，所以只取功能名，写成「entrance function」（仅英文句用到）。
  */
  const fnRaw = short(row("Function"));
  const fn = fnRaw
    ? /^(entrance|privacy|passage|classroom|storeroom|communication|dummy)\b/i.test(fnRaw)
      ? `${fnRaw.split(/[,;(]/)[0].trim().toLowerCase()} function`
      : fnRaw
    : null;
  const handing = short(row("Handing"), 38);
  const backset = short(row("Backset"), 24);

  if (locale === "en") {
    push(mat ? inSentence(mat) : null);
    push(dim);
    push(fn);
    push(backset && !String(dim ?? "").includes("backset") ? `${backset} backset` : null);
    push(handing && /revers|non-?hand/i.test(handing) ? "fully reversible" : null);
    push(finishCount > 1 ? `${finishCount} finishes` : null);
  } else if (locale === "es") {
    push(mat ? inSentence(mat) : null);
    push(dim);
    push(backset && !String(dim ?? "").includes("entrada") ? `entrada ${backset}` : null);
    push(handing && /revers|non-?hand/i.test(handing) ? "totalmente reversible" : null);
    push(finishCount > 1 ? `${finishCount} acabados` : null);
  } else {
    push(mat ? inSentence(mat) : null);
    push(dim);
    push(backset && !String(dim ?? "").includes("distância") ? `distância ${backset}` : null);
    push(handing && /revers|non-?hand/i.test(handing) ? "totalmente reversível" : null);
    push(finishCount > 1 ? `${finishCount} acabamentos` : null);
  }

  const lead = modelIsName(product) ? cap0(name) : `${model} ${name.toLowerCase()}`;
  const opener = useRaw ? `${lead} ${connector(name, locale)} ${useRaw.toLowerCase()}.` : `${lead}.`;

  /*
    事实在前，卖点在后。卖点是整个品类共享的一句话，如果排在前面，同品类的
    三十七条描述前一百个字符就一模一样 —— 那正是旧版的毛病。
    产品自己的规格必须先出现，卖点被截断没关系。
  */
  /*
    2026-09-24（方案 7.3）：描述只由完整句子组成。原来是「拼好再在第 158 个字符处砍一刀加 …」，
    1,217 条描述断在半个单词上（「…not a plated shell, the finis…」）；事实句以小写材质开头，
    1,109 条出现「句号 + 小写」。现在按句取舍：开头 + 事实 + 卖点 + 下一步，装不下先丢卖点，
    再丢下一步，再从后往前丢事实。任何情况下都不截断句子。
  */
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const NEXT = {
    en: "Factory direct, samples and quotation on request.",
    es: "Directo de fábrica, muestras y cotización a pedido.",
    pt: "Direto da fábrica, amostras e orçamento sob consulta.",
  };
  const join = (...s) => s.filter(Boolean).join(" ").replace(/\s{2,}/g, " ").replace(/\.\./g, ".").trim();
  for (let f = facts.slice(); ; f = f.slice(0, -1)) {
    const factSentence = f.length ? `${cap(f.join(", "))}.` : "";
    for (const combo of [
      [opener, factSentence, pitch, NEXT[locale]],
      [opener, factSentence, NEXT[locale]],
      [opener, factSentence, pitch],
      [opener, factSentence],
    ]) {
      const out = join(...combo);
      if (out.length <= DESC_MAX) return out;
    }
    if (!f.length) break;
  }
  /* 只有开头一句且仍超长（极少见）：在词边界收住，句号结尾，不加 … */
  const o = join(opener);
  return o.length <= DESC_MAX ? o : `${o.slice(0, DESC_MAX - 1).replace(/[\s,;:]+\S*$/, "")}.`;
}


const FIELDS = [
  ["en", "seoTitle", "seoDescription"],
  ["es", "seoTitleEs", "seoDescriptionEs"],
  ["pt", "seoTitlePt", "seoDescriptionPt"],
];

/*
  方案 7.4 的四条断言，只看已发布的 HYDE 产品，任何一条不过 `--check` 就失败、发布停下：
    1. 标题含型号；
    2. 标题含买家用语的品类名；
    3. 前 60 个字符里有长尾成分（型号以外的数字、「for / para」场景、或逗号后的规格/材质），
       产品本身没有尺寸、材质、场景可写时除外（那是数据缺口，要工厂补，不是生成器的错）；
    4. 标题和描述不出现认证、防火等级、小时数、标准号 —— 这些只有证书在手才写。
*/
const BUYER_NOUN = {
  en: /lock|latch|hinge|handle|lever|knob|bar|device|trim|closer|cylinder|bolt|stop|viewer|number|accessor|grab|hook|guard|indicator|fitting|pull|patch|spring|pivot|set|case|body|plate|escutcheon|rose|chain|key|damper|holder|bracket|sign|house no|numeral|coordinator|hook/i,
  es: /cerradura|pestillo|picaporte|bisagra|manija|perilla|barra|guarnici|cierrapuertas|cilindro|cerrojo|pasador|tope|mirilla|n[úu]mero|accesorio|agarradera|gancho|indicador|herraje|tirador|pinza|pivote|juego|caja|cuerpo|placa|roseta|cadena|llave|amortiguador|soporte|se[ñn]al|selector|pasacables|percha|numeral|coordinador/i,
  pt: /fechadura|lingueta|dobradi|ma[çc]aneta|barra|guarni|mola|cilindro|trava|ferrolho|fecho|batedor|olho|n[úu]mero|acess[óo]rio|gancho|indicador|ferragem|puxador|pin[çc]a|piv[ôo]|conjunto|caixa|corpo|placa|roseta|corrente|chave|amortecedor|suporte|espelho|trinco|ferragens|batedor|transfer[êe]ncia|coordenador|numera/i,
};
const CERT = /\b(EN\s?\d{3,5}|UL\s?\d{2,4}|ANSI|BHMA|ISO\s?\d{3,5}|CE[- ]certified|fire[- ]?rated|\d+(?:\.\d+)?\s?(?:hours?|hrs?|horas?)\b)/i;
const issues = [];
const warnings = [];
function audit(product, locale, title, desc) {
  const body = title.replace(/ \| [^|]+$/, "");
  const model = glossModel(product.model, locale).trim();
  const tag = `${locale} ${product.model}: ${title}`;
  if (model && !modelIsName(product) && !body.toLowerCase().includes(model.toLowerCase())) issues.push(`标题缺型号  ${tag}`);
  if (!BUYER_NOUN[locale].test(body)) issues.push(`标题缺品类名  ${tag}`);
  /* 锁芯的长度写在型号里（70PBDK），方案 7.2 定为「标题照旧」，型号里的数字即长尾成分 */
  const cylinder = [].concat(product.categoryPath ?? [])[0] === "lock-cylinders";
  const rest = cylinder ? body.slice(0, MAX) : body.slice(0, MAX).replace(model, "");
  const hasData = dimensionPhrase(product, locale) || materialPhrase(product, locale) || positioning(product);
  if (hasData && !(/\d/.test(rest) || / (for|para|on|en|em) /i.test(rest) || rest.includes(","))) {
    /*
      命名问题（警告，不拦发布）：型号 + 名字 + 连接词 + 这个产品真实的场景，本来就放不进 60 个字符。
      原来是固定的「名字超过 40 个字符」，306 PS 的西语名 36 个字符、真实场景 32 个字符，
      两者相加放不下，却被当成生成器错误拦住发布（2026-09-24）。
    */
    const name = displayName(product, locale);
    const head = modelIsName(product) ? name : `${model} ${name}`;
    const pos = positioning(product);
    const use = pos ? pos[locale === "en" ? "use" : locale === "es" ? "useEs" : "usePt"] : "";
    const fits = !use || head.length + connector(name, locale).length + use.length + 2 <= MAX;
    (head.length > 40 || !fits ? warnings : issues).push(`前 60 字符无长尾成分  ${tag}`);
  }
  if (CERT.test(title) || CERT.test(desc)) issues.push(`出现认证/等级措辞  ${tag}`);
}

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
    if (product.heroImage?.src) audit(product, locale, title, desc);
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
      if (title.replace(/ \| [^|]+$/, "").length > MAX) overLong.push(`${title.length}  ${title}`);
    }
  }

  if (touched) {
    changed++;
    if (WRITE) writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
  }
}

if (warnings.length) console.warn(`product-titles: ${warnings.length} 条命名过长、放不下长尾成分（警告，不拦发布）`);
if (issues.length) {
  console.error(`product-titles: ${issues.length} 条标题/描述不符合方案 7.4：`);
  for (const i of issues.slice(0, process.argv.includes("--all-issues") ? issues.length : 25)) console.error(`  ${i}`);
  if (CHECK) process.exit(1);
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
