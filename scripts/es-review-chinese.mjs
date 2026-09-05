/**
 * The Chinese column of the Spanish review workbook.
 *
 * It lives here and not in src/data because the SITE has no Chinese — it is EN/ES only,
 * and adding a third locale to the runtime glossary to serve one spreadsheet would be a
 * data model built for a document. This column exists for one reader: the client, who
 * has to approve a terminology decision without reading Spanish.
 *
 * Coverage is deliberately partial and ordered by consequence: every spec label that
 * appears on more than a handful of products, every category, the canonical finishes,
 * and every term that is currently untranslated. The long tail of one-off labels is left
 * blank — a translator reads the English, and a blank cell is honest about what has not
 * been checked in a way an auto-translated one would not be.
 */

/** Spec labels, ordered by how many product pages carry them. */
export const SPEC_LABELS_ZH = {
  Material: "材质",
  Finish: "表面处理",
  Application: "适用场景",
  Function: "功能",
  "Door thickness": "适用门厚",
  Chassis: "锁体底盘",
  Handing: "开向（左右手）",
  Backset: "锁舌中心距（backset）",
  Trim: "外装饰件",
  Cylinder: "锁芯",
  "Cycle life": "循环寿命",
  Keying: "钥匙编码 / 通开",
  Latch: "斜舌",
  Size: "尺寸",
  Feature: "特点",
  Length: "长度",
  Strike: "锁扣板",
  "Deadbolt throw": "方舌伸出长度",
  "Centre distance": "中心距",
  "Latch extension": "斜舌伸出长度",
  Thickness: "厚度",
  Installation: "安装方式",
  "Key options": "钥匙选项",
  Color: "颜色",
  Projection: "凸出高度",
  "Spindle Hole": "方轴孔",
  "Strike Plate Material": "锁扣板材质",
  "Opening Angle": "开启角度",
  "Lever length": "执手长度",
  "Cross bore": "主开孔",
  Width: "宽度",
  "Tube diameter": "管径",
  "Rose diameter": "圆座直径",
  Customization: "定制",
  "Lever section": "执手截面",
  Type: "类型",
  Spindle: "方轴",
  "Rose thickness": "圆座厚度",
  Diameter: "直径",
  "Viewing Angle": "可视角度",
  "Rosette Diameter": "圆座直径",
  Standoff: "垫高件",
  "Door Type": "门型",
  Packing: "包装",
  "Door Width": "门宽",
  Capacity: "承重",
  "Max opening angle": "最大开启角度",
  "Handle Material": "执手材质",
  Operation: "操作方式",
  Height: "高度",
  "Tube Thickness": "管壁厚",
  "Fixing centre": "固定孔中心距",
  "Glass gap": "玻璃夹口",
  Opening: "开启",
  "OEM / ODM": "OEM / ODM",
  "Rose depth": "圆座深度",
  Lens: "镜片",
  Faceplate: "面板",
  "Plate size": "面板尺寸",
  "Product Type": "产品类型",
  Structure: "结构",
  "Color Options": "可选颜色",
  Deadbolt: "方舌",
  "Surface Finish": "表面处理",
  "Trim Material": "装饰件材质",
  "Included Accessories": "随附配件",
  "Installation Method": "安装方法",
  "Factory reference": "工厂型号",
  Bolts: "锁舌",
  "Fire Rating": "耐火等级",
  "Lock Type": "锁具类型",
  "Country of Origin": "原产地",
  Weight: "重量",
  Model: "型号",
  /* The five that are still English on Spanish pages — packing data, added recently. */
  "Pieces per carton": "每箱数量",
  "Carton size": "外箱尺寸",
  "Carton volume": "外箱体积",
  "Gross weight": "毛重",
  "Net weight": "净重",
};

export const CATEGORY_NAMES_ZH = {
  "panic-exit-devices": "逃生推杠 / 紧急疏散装置",
  "lock-cases": "锁体（插芯锁）",
  "lever-handles": "执手（把手）",
  "knob-locks": "球形锁",
  "stainless-steel-handles": "不锈钢拉手",
  "glass-door-accessories": "玻璃门配件",
  deadbolts: "单体锁 / 方舌锁",
  "door-closers": "闭门器",
  "door-hinges": "合页",
  "brass-steel-hinges": "铜 / 钢合页",
  "night-latches-rim-locks": "外装门锁",
  "lock-cylinders": "锁芯",
  "bathroom-accessories": "卫浴配件",
  "grip-handle-sets": "连体执手锁",
  "hardware-accessories": "五金配件",
  "sliding-hook-locks": "移门钩锁",
};

/**
 * The canonical finishes.
 *
 * The catalogue currently spells these 83 different ways — "Antique Brass (AB)",
 * "antique brass", "Antique brass (US5)" are one finish written three times — and the
 * Spanish glossary matches whole comma-joined strings, so 95 of its 593 entries are
 * near-duplicate lists. Deciding the twenty terms below once, and joining them in code,
 * replaces all of that and keeps working when a new combination appears.
 */
export const FINISHES = [
  ["Polished Brass (PB)", "Latón pulido", "抛光黄铜"],
  ["Satin Brass (SB)", "Latón satinado", "缎面黄铜"],
  ["Antique Brass (AB)", "Latón antiguo", "仿古黄铜"],
  ["Antique Copper (AC)", "Cobre antiguo", "仿古红铜"],
  ["Chrome Plated (CP)", "Cromado", "镀铬"],
  ["Satin Chrome (SC)", "Cromo satinado", "缎面铬"],
  ["Satin Nickel (SN)", "Níquel satinado", "缎面镍"],
  ["Nickel Plated (NP)", "Niquelado", "镀镍"],
  ["Black Nickel (BN)", "Níquel negro", "黑镍"],
  ["Stainless Steel (SS)", "Acero inoxidable", "不锈钢本色"],
  ["Satin Stainless Steel (SSS / US32D)", "Acero inoxidable satinado", "缎面不锈钢"],
  ["Polished Stainless Steel (PSS / US32)", "Acero inoxidable pulido", "镜面不锈钢"],
  ["Bright Polished (SP)", "Pulido brillante", "亮光抛光"],
  ["Gold Plated (GP)", "Dorado", "镀金"],
  ["Oil Rubbed Bronze (ORB)", "Bronce envejecido", "油磨青铜"],
  ["Matt Black", "Negro mate", "哑光黑"],
  ["Powder Coated", "Recubrimiento en polvo", "粉末喷涂"],
  ["Spray Painted", "Pintado", "喷漆"],
  ["Zinc Plated", "Zincado", "镀锌"],
  ["PVD", "PVD", "PVD 真空镀"],
];

/*
  Untranslated values. Anything that is a finish list is marked rather than translated —
  it is superseded by the FINISHES sheet, and asking a translator to render the same
  eight finishes in nine different orders is how a glossary acquires nine spellings of
  one term.
*/
const FINISH_LIST = "→ 由「表面处理 Acabados」表统一决定，本行无需逐条翻译";

export const SPEC_VALUES_ZH = {
  "35mm to 45mm adjustable": "35–45mm 可调",
  "60mm / 70mm adjustable": "60/70mm 可调",
  "35mm to 55mm standard; 30mm to 60mm on request": "标准 35–55mm；可定制 30–60mm",
  "60mm / 70mm adjustable, latch and deadbolt both": "60/70mm 可调，斜舌与方舌同",
  "stainless steel": "不锈钢",
  "304 stainless steel": "304 不锈钢",
  "Stainless steel 304": "304 不锈钢",
  "304 Stainless steel": "304 不锈钢",
  "Aluminum Alloy": "铝合金",
  aluminium: "铝",
  "zinc alloy": "锌合金",
  iron: "铁",
  ABS: "ABS 工程塑料",
  "Brass Cylinder": "黄铜锁芯",
  "Nickel-plated brass, solid brass, brushed nickel": "镀镍黄铜、实心黄铜、拉丝镍",
  "Wall Mounted": "壁挂式",
  "Double door": "双开门",
  "Spray painting": "喷漆",
  painting: "喷漆",
  "Matt black": "哑光黑",
  "180 Degrees": "180 度",
  "180 degree/200 degree": "180 度 / 200 度",
  "180° or 200°": "180° 或 200°",
  CHINA: "中国",
  "1.0 mm (Optional: 0.8 mm)": "1.0mm（可选 0.8mm）",
  "110 mm (L) × 66 mm (W)": "长 110mm × 宽 66mm",
  "115 mm (L) × 53 mm (W)": "长 115mm × 宽 53mm",
  SS: FINISH_LIST,
  SN: FINISH_LIST,
  BN: FINISH_LIST,
  BL: FINISH_LIST,
};

/** Prose is reviewed as sentences; the Chinese gloss is only for the client's spot check. */
export const PROSE_ZH = {};

/** Rows whose Chinese cell should carry the finish-list note rather than a translation. */
export const FINISH_LIST_NOTE = FINISH_LIST;
