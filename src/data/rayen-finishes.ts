import type { RayenLocale } from "./rayen-i18n";

/**
 * The finish swatches shown on RAYEN product cards and in the category filter.
 *
 * WHY SWATCHES AND NOT A SECOND PHOTOGRAPH
 * Buyers of door hardware pick a colour before they pick a shape — 玫瑰金, 枪灰, 黄铜 — and
 * until now the catalogue buried that in a line of the spec table. UNION's own catalogues put
 * a row of finishes under every product, and the RAYEN 图册 does the same (ET4022 lists five).
 * The information exists on both sides of this business; only our site was hiding it.
 *
 * WHAT THESE SWATCHES DELIBERATELY DO NOT DO: change the photograph.
 * We have one set of photographs per model. There is no 玫瑰金 shot of T1050, so a swatch that
 * looked clickable would promise a view we cannot produce, and the buyer who clicks it and
 * sees the same satin picture learns that our colour information is decorative. They are
 * labels, not controls, until the factory sends per-finish photography.
 *
 * WHY THE MAP CARRIES BOTH LANGUAGES, AND WHY IT DOES NOT SUPPLY THE NAME
 * The first version keyed on English only and drew nothing on the Chinese site, because
 * scripts/build-chinese-mirror.mjs has already translated `finishes` by the time a page
 * renders: the record says 「缎面不锈钢」, not "Satin stainless". Worse, that version also
 * carried its own Chinese names, and had invented 「砂面不锈钢」 for a catalogue that says
 * 「缎面」 everywhere else (zh-terms has SC=缎面铬, SN=缎面镍). Two words for one finish on one
 * site is exactly the kind of drift a glossary exists to prevent.
 *
 * So: the map recognises both spellings and supplies only the COLOUR. The name on screen is
 * the record's own, which keeps one vocabulary and one place to change it. The `zh` field is
 * a fallback used only where the mirror left a finish in English — five models say "Satin
 * stainless with timber" on the Chinese site today.
 *
 * WHY THE COLOURS ARE APPROXIMATE, AND SAID TO BE
 * A hex value stands in for a metal finish; real antique brass varies with the batch and the
 * light. These are picked to be told apart at a glance — brass from copper from graphite —
 * not to be matched against, and the UI says so rather than implying a colour standard nobody
 * has given us. A finish that is not in this map gets NO swatch, only its name: inventing a
 * colour for a finish nobody has described is the same error as inventing a dimension.
 */

export interface FinishSwatch {
  /** One colour, or two for a finish that is visibly two materials. */
  colors: string[];
  /** Fallback name, used only when the record still carries the English on a Chinese page. */
  zh: string;
  en: string;
}

interface FinishEntry extends FinishSwatch {
  /** Every spelling seen in the data, lowercased. Both languages. */
  match: string[];
}

const FINISHES: Record<string, FinishEntry> = {
  "satin-stainless": {
    colors: ["#b9bdbf"],
    zh: "缎面不锈钢",
    en: "Satin stainless",
    match: ["satin stainless", "缎面不锈钢"],
  },
  "polished-stainless": {
    colors: ["#d7dadc"],
    zh: "抛光不锈钢",
    en: "Polished stainless",
    match: ["polished stainless", "抛光不锈钢"],
  },
  "matt-black": { colors: ["#2b2b2d"], zh: "哑黑", en: "Matt black", match: ["matt black", "哑黑"] },
  "antique-brass": {
    colors: ["#8c7042"],
    zh: "仿古铜",
    en: "Antique brass",
    match: ["antique brass", "仿古铜"],
  },
  "polished-brass": {
    colors: ["#c9a227"],
    zh: "抛光铜",
    en: "Polished brass",
    match: ["polished brass", "抛光铜"],
  },
  "satin-brass": {
    colors: ["#b5a16b"],
    zh: "缎面黄铜",
    en: "Satin brass",
    match: ["satin brass", "缎面 黄铜", "缎面黄铜"],
  },
  "antique-copper": {
    colors: ["#8a5a3b"],
    zh: "仿古红铜",
    en: "Antique copper",
    match: ["antique copper", "仿古红铜"],
  },
  "anodised-silver": {
    colors: ["#c6c9cb"],
    zh: "阳极氧化银",
    en: "Anodised silver",
    match: ["anodised silver", "anodized silver", "阳极氧化银"],
  },
  white: { colors: ["#f1f1ef"], zh: "白色", en: "White", match: ["white", "白色"] },

  /*
    凯撒系列 vocabulary, from the catalogue's own captions (code + Chinese name are printed
    under every shot, so both spellings are read rather than guessed). The English names are
    ours: the book prints none, and the code — DBN, COF, GCF — is what a buyer actually
    orders, which is why the record keeps it.
  */
  "polished-chrome": { colors: ["#d9dcde"], zh: "亮铬", en: "Polished chrome", match: ["polished chrome", "亮铬"] },
  "black-nickel": { colors: ["#3e4145"], zh: "黑镍", en: "Black nickel", match: ["black nickel", "黑镍"] },
  "matt-nickel": { colors: ["#b6b9b8"], zh: "哑镍", en: "Matt nickel", match: ["matt nickel", "哑镍"] },
  "brushed-nickel": { colors: ["#c2c5c4"], zh: "镍拉丝", en: "Brushed nickel", match: ["brushed nickel", "镍拉丝"] },
  "zirconium-gold": { colors: ["#d9b64a"], zh: "锆金", en: "Zirconium gold", match: ["zirconium gold", "锆金"] },
  "antique-bronze": { colors: ["#7c7a5e"], zh: "青古铜", en: "Antique bronze", match: ["antique bronze", "青古铜"] },
  "antique-yellow-brass": {
    colors: ["#a98a4b"],
    zh: "黄古铜",
    en: "Antique yellow brass",
    match: ["antique yellow brass", "黄古铜"],
  },
  "brushed-rose-gold": {
    colors: ["#bd8368"],
    zh: "玫瑰金拉丝",
    en: "Brushed rose gold",
    match: ["brushed rose gold", "玫瑰金拉丝"],
  },
  red: { colors: ["#c8322f"], zh: "红色", en: "Red", match: ["red", "红色"] },
  grey: { colors: ["#8d9094"], zh: "灰色", en: "Grey", match: ["grey", "灰色"] },

  /* The coverings. 凯撒 wraps the grip in leather or a wood-grain film, and the catalogue
     writes the pair as 黑镍/棕皮 — metal first, covering second. They are finishes in their
     own right here so the second half of such a pair can be looked up and coloured. */
  "brown-leather": { colors: ["#6b4a3a"], zh: "棕皮", en: "Brown leather", match: ["brown leather", "棕皮"] },
  "black-leather": { colors: ["#2f2d2c"], zh: "黑皮", en: "Black leather", match: ["black leather", "黑皮"] },
  "tan-leather": { colors: ["#c2a887"], zh: "驼皮", en: "Tan leather", match: ["tan leather", "驼皮"] },
  "orange-leather": { colors: ["#c2683a"], zh: "橘皮", en: "Orange leather", match: ["orange leather", "橘皮"] },
  "wood-grain": { colors: ["#6f4b32"], zh: "木纹", en: "Wood grain", match: ["wood grain", "木纹"] },
  /* Two materials, so two halves — the timber inlay is the reason to choose it. The Chinese
     mirror has not translated this one, so the zh name here is doing real work. */
  "stainless-timber": {
    colors: ["#b9bdbf", "#9a7748"],
    zh: "缎面不锈钢配木饰",
    en: "Satin stainless with timber",
    match: ["satin stainless with timber"],
  },
  "pvd-graphite": {
    colors: ["#4a4d52"],
    zh: "PVD 枪灰",
    en: "PVD graphite",
    match: ["pvd graphite"],
  },
  "pvd-french-gold": {
    colors: ["#b99a5c"],
    zh: "PVD 法兰金",
    en: "PVD French gold",
    match: ["pvd french gold"],
  },
  "pvd-rose-gold": {
    colors: ["#b98a72"],
    zh: "PVD 玫瑰金",
    en: "PVD rose gold",
    match: ["pvd rose gold"],
  },
  "pvd-nickel": { colors: ["#aeb3b6"], zh: "PVD 镍", en: "PVD nickel", match: ["pvd nickel"] },

  /*
    The 意式极简系列 finish codes, from the 雷茵 catalogue's own captions. The book prints the
    code and the Chinese name together under every shot — ET4009A RGS / 表面处理：淡金拉丝 —
    so both spellings are known rather than guessed, and the colours are read off those shots.
    BL (哑黑) and PC (白色) already have entries above and are not repeated here.
  */
  "brushed-black-nickel": {
    colors: ["#55575a"],
    zh: "黑镍拉丝",
    en: "Brushed black nickel",
    match: ["brushed black nickel", "黑镍拉丝"],
  },
  "brushed-light-gold": {
    colors: ["#cbab6d"],
    zh: "淡金拉丝",
    en: "Brushed light gold",
    match: ["brushed light gold", "淡金拉丝"],
  },
  "brushed-satin-nickel": {
    colors: ["#c6c8c5"],
    zh: "哑光镍拉丝",
    en: "Brushed satin nickel",
    match: ["brushed satin nickel", "哑光镍拉丝"],
  },
  /*
    锌合金分体门锁系列 adds one code the earlier books never printed: CS, printed 「铬拉丝」 on A9-894
    (p51). The shot is a cool blue-grey satin, visibly bluer than 哑光镍拉丝 beside it — the
    colour is read off that photograph. Its own entry, because without one "brushed chrome"
    would fall through to nothing and the swatch would be blank.
  */
  "brushed-chrome": {
    colors: ["#aeb6bd"],
    zh: "拉丝铬",
    en: "Brushed chrome",
    /* 甲方 2026-09-23 定名「拉丝铬」（与合页那本、zh-terms.json 一致）；图册 p51 印的「铬拉丝」也认。 */
    match: ["brushed chrome", "拉丝铬", "铬拉丝"],
  },
  /*
    豪华氧化铝门锁系列（《雷茵五金》p57–p60）的三个表面。图册印的是「铝氧化亚黑 / 砂白 / 砂金」，
    颜色取自那三页的产品照片：亚黑比锌合金的哑黑略灰、砂白是冷银白、砂金偏橙。
    「砂白+亚黑」（OXB）是两种材料，按上面的双色规则拆成两半各取一个颜色，不单列。
    各给一条自己的条目，否则「砂金」会落进别的金色、「亚黑」认不出来。
  */
  /*
    不锈钢空管分体锁系列（《雷茵五金》p61–p64）按这本的中文叫法：SS「不锈钢拉丝」、RG「玫瑰金」。
    镜面抛光（Mirror Polished Stainless）已经落在 polished-stainless 上，锆金拉丝落在 zirconium-gold 上，
    不另加。拉丝不锈钢的颜色同缎面不锈钢；玫瑰金取自 p63 S-K210 RG 的照片。
  */
  "brushed-stainless": {
    colors: ["#c9ccce"],
    zh: "不锈钢拉丝",
    en: "Brushed stainless",
    match: ["brushed stainless", "不锈钢拉丝"],
  },
  "rose-gold": {
    colors: ["#c99078"],
    zh: "玫瑰金",
    en: "Rose gold",
    match: ["rose gold", "玫瑰金"],
  },
  /* 三维可调节合页（《雷茵五金》p72）：砂白、茶色。颜色取自那一页的产品照片。砂金落在 satin-gold 上。 */
  "sand-white": { colors: ["#e4e5e3"], zh: "砂白", en: "Sand white", match: ["sand white", "砂白"] },
  "tea-brown": { colors: ["#8c7b67"], zh: "茶色", en: "Tea brown", match: ["tea brown", "茶色"] },
  "anodised-matt-black": {
    colors: ["#343537"],
    zh: "铝氧化亚黑",
    en: "Anodised matt black",
    match: ["anodised matt black", "铝氧化亚黑"],
  },
  "anodised-sand-white": {
    colors: ["#d5d8da"],
    zh: "铝氧化砂白",
    en: "Anodised sand white",
    match: ["anodised sand white", "铝氧化砂白"],
  },
  "anodised-sand-gold": {
    colors: ["#d2a24c"],
    zh: "铝氧化砂金",
    en: "Anodised sand gold",
    match: ["anodised sand gold", "铝氧化砂金"],
  },
  /*
    《雷茵-铰链和门吸》的表面处理词汇。颜色取自图册的产品照片本身，不是猜的。

    这一批里有五个名字原来会**误中**别的条目：LOOKUP 按拼写由长到短匹配，
    在加进来之前「哑白」落到 white、「米白」也落到 white（275 两个都有，
    一张卡上会并排画出两个一模一样的白点）、「星空灰」落到 grey（星空灰是深枪灰，
    不是中灰）、「黑红古」落到仿古红铜（差了三档深浅）。各给一条自己的条目。

    PVD 图册只印这三个字母，没有印颜色 —— 工艺不是颜色。这里给的是金色，
    依据是这本书里每一张标 PVD 的照片都是亮金的（271、275、220、1328）；
    规格和名称一侧仍然照原样写 PVD，不替甲方改成「PVD 金」。
  */
  "brushed-gunmetal": {
    colors: ["#6e7176"],
    zh: "枪灰拉丝",
    en: "Brushed gunmetal",
    match: ["brushed gunmetal", "枪灰拉丝"],
  },
  "true-gold": {
    colors: ["#e0b33c"],
    zh: "真金",
    en: "True gold",
    match: ["true gold", "真金"],
  },
  "brushed-brass": {
    colors: ["#c8a45e"],
    zh: "铜拉丝",
    en: "Brushed brass",
    match: ["brushed brass", "铜拉丝"],
  },
  "matt-white": {
    colors: ["#ededea"],
    zh: "哑白",
    en: "Matt white",
    match: ["matt white", "哑白"],
  },
  "brushed-matt-nickel": {
    colors: ["#b6b9b8"],
    zh: "哑镍拉丝",
    en: "Brushed matt nickel",
    match: ["brushed matt nickel", "哑镍拉丝"],
  },
  "satin-silver": {
    colors: ["#c4c7c9"],
    zh: "砂银",
    en: "Satin silver",
    match: ["satin silver", "砂银"],
  },
  "satin-gold": {
    colors: ["#c9a33f"],
    zh: "砂金",
    en: "Satin gold",
    match: ["satin gold", "砂金"],
  },
  "space-grey": {
    colors: ["#4f5257"],
    zh: "星空灰",
    en: "Space grey",
    match: ["space grey", "星空灰"],
  },
  "cream-white": {
    colors: ["#ece4d6"],
    zh: "米白",
    en: "Cream white",
    match: ["cream white", "米白"],
  },
  "black-antique-copper": {
    colors: ["#4a3128"],
    zh: "黑红古",
    en: "Black antique copper",
    match: ["black antique copper", "黑红古"],
  },
  pvd: {
    colors: ["#e8c04a"],
    zh: "PVD",
    en: "PVD",
    match: ["pvd"],
  },
};


/* Longest spelling first, so "pvd rose gold" wins over a bare "gold" in a longer string. */
const LOOKUP: [string, string][] = Object.entries(FINISHES)
  .flatMap(([key, entry]) => entry.match.map((spelling) => [spelling, key] as [string, string]))
  .sort((a, b) => b[0].length - a[0].length);

/**
 * Strip a part number off a raw finish entry.
 *
 * Four entries are whole part numbers written into the field by the UNION import:
 *   "MUL1022-01-513 — Stainless steel, hairline, PVD graphite"
 * That is a part number, a material and a finish in one string, and printing it under a card
 * would be worse than printing nothing. Everything up to the last em dash goes.
 */
const withoutPartNumber = (raw: string) =>
  (raw.includes("—") ? raw.slice(raw.lastIndexOf("—") + 1) : raw)
    /* Runs of whitespace collapse: the data carries 「缎面 黄铜」 with a stray space, which
       renders as a gap mid-word on the card. Fixed here rather than in the record, because
       the record is regenerated from the mirror and would grow it back. */
    .replace(/\s+/g, " ")
    .replace(/\s+([一-鿿])/g, "$1")
    /* 亮铬 / 木纹 → 亮铬/木纹. The rule above only eats the space AFTER the slash, which left
       every 凯撒 two-material finish reading "亮铬 /木纹" with one space stranded in front of
       it. Chinese sets no space around a slash. */
    .replace(/([一-鿿])\s+\//g, "$1/")
    .trim();

/** A stable id for one finish, shared by both languages. Unknown finishes key on themselves. */
export function finishKey(raw: string): string {
  const text = withoutPartNumber(raw).toLowerCase();
  const hit = LOOKUP.find(([spelling]) => text === spelling || text.includes(spelling));
  return hit ? hit[1] : text;
}

/**
 * The swatch for one finish, including the two-material ones.
 *
 * 凯撒 writes a wrapped lever as 黑镍/棕皮 — the metal, then the covering. Looked up whole,
 * that string matches "黑镍" and draws a single dark dot for a handle whose grip is brown
 * leather, which is worse than no dot: it is a colour statement that contradicts the
 * photograph next to it. So a pair is split and both halves are looked up, and the swatch
 * carries both colours — which is what `colors` was always for ("two for a finish that is
 * visibly two materials").
 *
 * Splitting rather than enumerating the pairs: this catalogue alone has seventeen of them,
 * and the next series will invent more.
 */
export function finishSwatch(raw: string): FinishSwatch | null {
  const whole = FINISHES[finishKey(raw)];
  if (whole) return whole;

  const parts = withoutPartNumber(raw).split("/").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  const hits = parts.map((part) => FINISHES[finishKey(part)]).filter(Boolean) as FinishEntry[];
  if (!hits.length) return null;
  return {
    colors: hits.flatMap((hit) => hit.colors).slice(0, 2),
    zh: hits.map((hit) => hit.zh).join("/"),
    en: hits.map((hit) => hit.en).join(" / "),
  };
}

/**
 * The name to print.
 *
 * The record's own wording wins, because the Chinese mirror is the site's glossary and a
 * second vocabulary here would drift from it. The map's name is used only when the record
 * still holds English on a Chinese page — otherwise a Chinese reader meets "Satin stainless
 * with timber" in the middle of a Chinese page.
 */
export function finishLabel(raw: string, locale: RayenLocale): string {
  const cleaned = withoutPartNumber(raw);
  const entry = FINISHES[finishKey(raw)];
  if (!entry) return cleaned;

  /*
    An entry that arrived WITH a part number is raw import text, not glossary text, and the
    map's short name wins on both sides. "Stainless steel, hairline, PVD French gold" states
    the material twice over — the record already has a material field — and it is three times
    the width of any other chip in the row. The glossary rule below is about the mirror's
    curated Chinese; it was never meant to protect a string the importer happened to paste.
  */
  if (raw.includes("—")) return locale === "zh" ? entry.zh : entry.en;

  /* Otherwise the record's own wording wins, so the site keeps one vocabulary. The map's
     name is the fallback for the finishes the Chinese mirror has not translated. */
  if (locale === "zh") return /[一-鿿]/.test(cleaned) ? cleaned : entry.zh;
  return /[一-鿿]/.test(cleaned) ? entry.en : cleaned;
}

/** The finishes of one product, de-duplicated, in the order the record lists them. */
export function finishesOf(raw: string[] | undefined, locale: RayenLocale) {
  const seen = new Set<string>();
  const out: { key: string; label: string; swatch: FinishSwatch | null }[] = [];
  for (const entry of raw ?? []) {
    const key = finishKey(entry);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ key, label: finishLabel(entry, locale), swatch: finishSwatch(entry) });
  }
  return out;
}

/**
 * The finish keys to tag a card with, so the client filter can match on them.
 *
 * Lives here rather than in FinishFilter.tsx because that file is "use client": a function
 * exported from a client module cannot be CALLED on the server, only rendered. The category
 * page calls this while rendering the grid, so it belongs in a plain module both can import.
 */
export function finishKeysOf(finishes: string[] | undefined): string {
  return [...new Set((finishes ?? []).map(finishKey))].join(" ");
}
