#!/usr/bin/env node
/**
 * 指南首图：用 Codex 2026-09-23 交付的两套图库，给 32 篇还在用同一张占位图的指南配首图。
 *
 *   node scripts/import-guide-heroes.mjs            只打印计划
 *   node scripts/import-guide-heroes.mjs --write    写图、写说明文件、改 content/guides
 *
 * 甲方 2026-09-23：「把 guide 里面用 codex 共享的图片填上首图」。
 * 图库与规矩：docs/design-references/2026-09-09-style-batches/README.md
 *
 * ---------------------------------------------------------------------------
 * 两类图，两种说法
 *
 * 产品静物（product-final-composites/）：产品像素全部来自目录里的真实照片，AI 只生成了
 * 空台面，没有画任何零件。来源型号与哈希在 product-provenance.json。说明文字写「目录照片，
 * 置于棚拍台面」，不说「拍摄于」—— 它是合成的。
 *
 * 建筑场景（architecture-originals/）：虚构地点，画面里没有五金件。**永远不能说成 HYDE 的
 * 安装案例或真实项目**。甲方 2026-09-23：生成的建筑场景不打标记，突出唯美与设计格调 ——
 * 所以说明文字只描写空间本身（不加声明，也不暗示是谁的项目），来源记录留在 .webp.json 里。
 *
 * ---------------------------------------------------------------------------
 * 配图的几条判断（每一条都写在表里对应行）
 *
 * - 标题里带标准号的指南（EN 1125/179、EN 1906、EN 1670、消防门、认证）一律配建筑场景。
 *   把某款产品放在一个标准名旁边，读者会读成「这款通过了这个标准」，而我们没有那些证书。
 * - 讲材质的指南，只配材质记录吻合的产品：黄铜脱锌 → B024（Brass）；不锈钢牌号 →
 *   5807 SSCR（Stainless 304/201）；锌合金压铸 → F001（Zinc Alloy）。
 * - 粉末喷涂不配黑色 1073D：它的黑是不是粉末喷涂没有记录，配了就是用图替它下结论。
 * - 32 张互不重复（src/lib/editorial-image-uniqueness.test.ts 守着）。
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const WRITE = process.argv.includes("--write");
const LIB = "docs/design-references/2026-09-09-style-batches";
const OUT_DIR = "public/images/editorial/guides";
const WIDTH = 1600;

const PRODUCT = (n) => ({ kind: "product", n });
const SCENE = (n, en, es, pt) => ({ kind: "scene", n, en, es, pt });

/** guide slug → image. */
const PLAN = {
  "brass-alloys-and-dezincification-2026": PRODUCT(3),
  "hinge-grades-and-count-2026": PRODUCT(17),
  "stainless-grade-selection-201-304-316-2026": PRODUCT(9),
  "commercial-lock-function-decision-2026": PRODUCT(12),
  "strike-plates-and-keeps-2026": PRODUCT(10),
  "dimensional-interchangeability-2026": PRODUCT(11),
  "chrome-finish-differences-2026": PRODUCT(16),
  "samples-and-incoming-inspection-2026": PRODUCT(20),
  "zinc-alloy-die-cast-hardware-2026": PRODUCT(15),
  "moq-tooling-and-lead-time-2026": PRODUCT(13),
  "material-traceability-mill-certs-2026": PRODUCT(14),
  "key-blanks-and-restricted-profiles-2026": PRODUCT(6),
  "door-thickness-to-cylinder-length-2026": PRODUCT(19),
  "spindle-sizes-and-length-2026": PRODUCT(1),
  "universal-vs-handed-hardware-2026": PRODUCT(5),
  "hardware-warranty-what-it-covers-2026": PRODUCT(4),
  "door-preparation-161-and-86-2026": PRODUCT(2),
  "glass-door-thickness-and-cutouts-2026": PRODUCT(8),
  "door-hardware-hs-codes-2026": PRODUCT(7),
  // Shared ju-088 with door-closer-power-size until 2026-09-23; the uniqueness test caught it.
  "door-closer-mounting-positions-2026": PRODUCT(18),

  "corrosion-resistance-en-1670-2026": SCENE(1, "a limestone vestibule open to the sea", "un vestíbulo de piedra caliza abierto al mar", "um vestíbulo de pedra calcária aberto para o mar"),
  "master-key-hierarchy-planning-2026": SCENE(3, "an oak-lined civic atrium", "un atrio cívico revestido de roble", "um átrio cívico revestido de carvalho"),
  "exit-device-outside-trim-functions-2026": SCENE(7, "a basalt entrance in northern daylight", "una entrada de basalto con luz del norte", "uma entrada de basalto com luz do norte"),
  "certification-and-test-validation-2026": SCENE(8, "a limestone gallery hall", "una sala de galería de piedra caliza", "um salão de galeria em pedra calcária"),
  "en-1125-vs-en-179-2026": SCENE(9, "an oak-lined corridor leading to daylight", "un pasillo revestido de roble hacia la luz", "um corredor revestido de carvalho rumo à luz"),
  "lever-return-and-en-1906-2026": SCENE(13, "a lime-plaster garden court", "un patio de jardín de revoque de cal", "um pátio-jardim de reboco de cal"),
  "specification-section-08-71-00-2026": SCENE(11, "a travertine stair hall", "un hall de escalera de travertino", "um hall de escada em travertino"),
  "technical-drawings-what-to-expect-2026": SCENE(12, "a zinc-clad passage beside concrete", "un pasaje revestido de zinc junto al hormigón", "uma passagem revestida de zinco junto ao concreto"),
  "qualifying-a-hardware-supplier-2026": SCENE(16, "a concrete library atrium", "un atrio de biblioteca de hormigón", "um átrio de biblioteca em concreto"),
  "fire-door-hardware-what-must-be-rated-2026": SCENE(19, "a frosted-glass stairwell", "una caja de escalera de vidrio esmerilado", "uma caixa de escada de vidro jateado"),
  "hardware-refurbishment-survey-2026": SCENE(18, "a brick conversion passage", "un pasaje en un edificio de ladrillo rehabilitado", "uma passagem num prédio de tijolo reabilitado"),
  "submittal-package-contents-2026": SCENE(4, "a ribbed-glass gallery", "una galería de vidrio acanalado", "uma galeria de vidro canelado"),
  "powder-coating-and-ral-2026": SCENE(6, "a terracotta-plaster courtyard", "un patio de revoque terracota", "um pátio de reboco terracota"),
};

const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const sha = (buf) => createHash("sha256").update(buf).digest("hex");
const provenance = JSON.parse(readFileSync(join(LIB, "product-provenance.json"), "utf8"));
const entries = Array.isArray(provenance) ? provenance : provenance.files ?? provenance.entries ?? Object.values(provenance);
const byIndex = new Map(entries.map((e) => [Number(e.index), e]));

const used = new Set();
const rows = [];
for (const [slug, pick] of Object.entries(PLAN)) {
  const key = `${pick.kind}:${pick.n}`;
  if (used.has(key)) throw new Error(`${key} 被用了两次`);
  used.add(key);
  const guidePath = join("content/guides", `${slug}.json`);
  if (!existsSync(guidePath)) throw new Error(`没有这篇指南：${slug}`);
  rows.push({ slug, pick, guidePath });
}

let written = 0;
for (const { slug, pick, guidePath } of rows) {
  const guide = JSON.parse(readFileSync(guidePath, "utf8"));
  const name = slug.replace(/-2026$/, "");
  const src = `/images/editorial/guides/${name}.webp`;
  let sourceFile;
  let sidecar;
  let label;

  if (pick.kind === "product") {
    const e = byIndex.get(pick.n);
    if (!e) throw new Error(`provenance 里没有 ${pick.n}`);
    sourceFile = join(LIB, "product-final-composites", `${String(pick.n).padStart(2, "0")}-${e.slug}.webp`);
    const product = JSON.parse(readFileSync(join("content/products", `${e.slug}.json`), "utf8"));
    const nm = (loc) => (loc === "es" ? product.nameEs : loc === "pt" ? product.namePt : product.name) || product.name;
    label = { label: `HYDE ${product.model} ${nm("en")}`, labelEs: `HYDE ${product.model} · ${nm("es")}`, labelPt: `HYDE ${product.model} · ${nm("pt")}` };
    sidecar = {
      kind: "real-photograph-composition",
      sources: [{ model: product.model, slug: e.slug, original: e.source, sha256: e.sourceSha256 }],
      stage: { file: e.scene, sha256: e.sceneSha256, note: "AI-generated EMPTY studio stage: no hardware, tools, text or logos were generated." },
      method: e.method,
      scope: "One catalogue photograph placed on a studio backdrop. No installation, scale, kit or compatibility claim.",
      usedFor: `/guides/${slug}/ hero`,
      library: `${LIB}/README.md`,
    };
  } else {
    sourceFile = join(LIB, "architecture-originals", `${String(pick.n).padStart(2, "0")}-architecture.png`);
    label = { label: cap(pick.en), labelEs: cap(pick.es), labelPt: cap(pick.pt) };
    sidecar = {
      kind: "generated-architectural-scene",
      scene: pick.en,
      limitation:
        "Generated image of an invented location. No hardware is depicted. Never caption it as a HYDE installation, a customer project, or dimensional or installation evidence.",
      usedFor: `/guides/${slug}/ hero`,
      library: `${LIB}/README.md`,
    };
  }

  const input = readFileSync(sourceFile);
  sidecar.librarySha256 = sha(input);
  const heroImage = { src, ratio: "16 / 10", ...label };
  const before = guide.heroImage?.src;
  console.log(`${slug.padEnd(46)} ${pick.kind === "product" ? "产品" : "场景"} ${String(pick.n).padStart(2)}  ${before === src ? "(已是)" : ""}`);

  if (WRITE) {
    mkdirSync(OUT_DIR, { recursive: true });
    const outFile = join(OUT_DIR, `${name}.webp`);
    await sharp(input).resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: 82 }).toFile(outFile);
    writeFileSync(`${outFile}.json`, `${JSON.stringify(sidecar, null, 2)}\n`);
    guide.heroImage = heroImage;
    writeFileSync(guidePath, `${JSON.stringify(guide, null, 2)}\n`);
    written++;
  }
}
console.log(WRITE ? `\n写入 ${written} 篇。` : `\n计划 ${rows.length} 篇（dry run，加 --write 写入）。`);
