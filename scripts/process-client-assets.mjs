/**
 * Converts the client's own asset pack (delivered via WeChat) into web-ready WebP.
 *
 * Source is first-party material from Canton Hyland — no stock library, no Alibaba CDN
 * hotlinking, no platform watermarks.
 *
 * Rules: WebP q=78, <= 300 KB, cover-crop to the slot's aspect ratio, centre gravity.
 * NEVER upscales — several sources are smaller than 2x the display size, and inventing
 * pixels would just hide that. The report prints the effective scale for every file so
 * the under-sized ones can be listed for reshoot.
 *
 *   node scripts/process-client-assets.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const SOURCE_CANDIDATES = [
  "C:/Users/johns/Desktop/202608首页装修资料",
  "C:/Users/johns/xwechat_files/wxid_kslpb8pv4u1c12_ba05/msg/file/2026-08/202608首页装修资料",
];
const SRC = SOURCE_CANDIDATES.find((candidate) => existsSync(`${candidate}/15张产品图➕产品名称➕两张背景产品图➕名称`));
if (!SRC) throw new Error("Canton client asset pack was not found in the known source locations.");
const MAX_BYTES = 300 * 1024;
const QUALITY = 78;

const P15 = `${SRC}/15张产品图➕产品名称➕两张背景产品图➕名称`;
const P4 = `${SRC}/2)四张分类产品➕分类名称`;
const P5 = `${SRC}/4)五张产品图➕产品名称➕视频➕四张证书➕六张旺旺头像➕名称`;
const CO = `${SRC}/3)四张公司图➕公司简介`;
const P1 = `${SRC}/1)一张产品➕产品名称➕一张背景图`;
const CERT = `${P5}/证书`;
const NEW_FACTORY =
  "C:/Users/johns/xwechat_files/wxid_kslpb8pv4u1c12_ba05/temp/RWTemp/2026-08/97b9ed2c0425bf523ecd62e874b0d5a0";

/** dest, source, aspect ratio (w/h), CSS width the slot renders at (for the scale report) */
const JOBS = [
  // ---- Products (1:1, source is already 1000x1000) ----
  ["products/305-fire-door-panic-exit-device.webp", `${P15}/305 Fire Door Panic Exit Device .jpg`, 1, 680],
  ["products/309-d-double-door-panic-exit-device.webp", `${P15}/309-D Double Door Panic Exit Device.jpg`, 1, 680],
  ["products/314-alarm-panic-bar-exit-device.webp", `${P15}/    314 Alarm Panic Bar Exit Device.jpg`, 1, 680],
  ["products/320-two-point-locking-exit-device.webp", `${P15}/    320 Two Point Locking Exit Device.jpg`, 1, 680],
  ["products/023-etan-anti-pick-panic-exit-device.webp", `${P15}/023 ETAN Anti-Pick Panic Exit Device.jpg`, 1, 680],
  ["products/317-cold-room-push-bar-exit-device.webp", `${P15}/317 Cold Room Push Bar Exit Device.jpg`, 1, 680],
  ["products/lc14-8550-mortise-lock-case.webp", `${P15}/LC14 85×50 Four Bolt Mortise Lock Case.jpg`, 1, 680],
  ["products/black-tubular-lever-lock-set.webp", `${P15}/    Black Tubular Lever Lock Set.jpg`, 1, 680],
  ["products/stainless-steel-lever-handle-lock.webp", `${P15}/    Stainless Steel Lever Handle Lock.jpg`, 1, 680],
  ["products/ansi-grade-3-keyed-deadbolt.webp", `${P15}/ANSI Grade 3 Keyed Deadbolt Lock Set.jpg`, 1, 680],
  ["products/glass-door-patch-fitting-set.webp", `${P15}/Glass Door Patch Fitting Set.jpg`, 1, 680],
  ["products/stainless-steel-glass-door-pull-handle.webp", `${P15}/ Stainless Steel Glass Door Pull Handle.jpg`, 1, 680],
  ["products/600-concealed-sliding-door-handle.webp", `${P15}/600 Concealed Sliding Door Handle.jpg`, 1, 680],
  ["products/stainless-steel-wall-hook.webp", `${P15}/Stainless Steel Wall Hook.jpg`, 1, 680],
  ["products/tubular-knob-lock.webp", `${P5}/Tubular Knob Lock.jpg`, 1, 680],
  ["products/cylindrical-knob-lock.webp", `${P5}/Cylindrical Knob Lock.jpg`, 1, 680],
  ["products/night-latch-rim-lock.webp", `${P5}/Night Latch & Rim Lock.jpg`, 1, 680],
  ["products/stainless-steel-flush-bolt.webp", `${P5}/Bolt.jpg`, 1, 680],
  ["products/wooden-door-floor-hinge.webp", `${P4}/Wooden Door Floor Hinges.jpg`, 1, 680],
  ["products/stainless-steel-door-hinge.webp", `${P4}/Hinge.jpg`, 1, 680],
  // ---- Category cards (1:1) ----
  ["products/cat-panic-exit-device.webp", `${P4}/Panic Exit Device.jpg`, 1, 680],
  ["products/cat-lever-handle-lock.webp", `${P4}/Lever Handle Lock.jpg`, 1, 680],
  // ---- Company (3:2) ----
  ["company/press-shop.webp", `${CO}/1.jpg`, 3 / 2, 1440],
  ["company/polishing-line.webp", `${CO}/2.jpg`, 3 / 2, 1440],
  ["company/assembly-line.webp", `${CO}/3.jpg`, 3 / 2, 1440],
  ["company/facility-yard.webp", `${CO}/大图.jpg`, 3 / 2, 1440],
  // ---- Homepage heroes: widest sources available ----
  ["company/hero-panic-exit-banner.webp", `${P15}/大图一.jpg`, 2880 / 1391, 1440],
  ["company/hero-grip-handle-banner.webp", `${P15}/大图二.jpg`, 2880 / 1481, 1440],
  ["company/hero-storefront-banner.webp", `${P1}/未标题-1.jpg`, 2880 / 1757, 1440],
  ["company/hero-modern-tubular-lock.webp", `${P1}/未标题-1.jpg`, 1920 / 754, 1440],
  ["company/hero-designed-for.webp", `${P15}/Storefront Door Push Pull Handle Lock.jpg`, 970 / 646, 970],
  // ---- Client-supplied 2026-08 factory/showroom set (3:2 crops) ----
  ["company/factory-polishing-workshop.webp", `${NEW_FACTORY}/e60a1601b2c6b071aa91c296e630d63e.png`, 3 / 2, 680],
  ["company/factory-assembly-quality-line.webp", `${NEW_FACTORY}/f0315c17368e1f6d95cc8c3f5885e041.png`, 3 / 2, 680],
  ["company/showroom-product-gallery.webp", `${NEW_FACTORY}/ef4f1112b496c2b8cbce6551409cf25b.png`, 3 / 2, 680],
  ["company/showroom-emergency-hardware.webp", `${NEW_FACTORY}/ba72e86166bcbc0c6a5d247c819bd3c2.png`, 3 / 2, 680],
  ["company/factory-cnc-production.webp", `${NEW_FACTORY}/6363332303cf1a1f08cb71a851d372e6.png`, 3 / 2, 680],
  ["company/factory-cnc-machining.webp", `${NEW_FACTORY}/423b142324065050bd287c2ac3090670.png`, 3 / 2, 680],
  // ---- Decorative slot (306:156). No CAD line art in the pack — see BUILD_PLAN. ----
  ["company/decorative-hinge-detail.webp", `${P4}/Hinge.jpg`, 306 / 156, 306],
  // ---- Certificates (portrait 604x800, kept whole — cropping a document is wrong) ----
  ["certificates/intertek-en1154-floor-spring.webp", `${CERT}/01.jpg`, 604 / 800, 604],
  ["certificates/intertek-en1125-panic-device.webp", `${CERT}/02.jpg`, 604 / 800, 604],
  ["certificates/intertek-tubular-lock-durability.webp", `${CERT}/03.jpg`, 604 / 800, 604],
  ["certificates/celab-ce-panic-exit-device.webp", `${CERT}/04.jpg`, 604 / 800, 604],
];

const OUT = "public/images";
for (const d of ["products", "company", "certificates"]) {
  await mkdir(join(OUT, d), { recursive: true });
}

/**
 * Several source filenames carry stray leading spaces ("    314 Alarm...jpg").
 * Resolve by normalised name rather than hard-coding whitespace.
 */
const index = new Map();
for (const dir of [P15, P4, P5, CO, P1, CERT, NEW_FACTORY]) {
  for (const f of await readdir(dir)) {
    index.set(`${dir}|${f.trim().toLowerCase()}`, join(dir, f));
  }
}
const resolve = (p) => {
  const dir = p.slice(0, p.lastIndexOf("/"));
  const file = p.slice(p.lastIndexOf("/") + 1);
  const hit = index.get(`${dir}|${file.trim().toLowerCase()}`);
  if (!hit) throw new Error(`source not found: ${file}`);
  return hit;
};

const report = [];
for (const [dest, srcRaw, ratio, displayW] of JOBS) {
  const src = resolve(srcRaw);
  const meta = await sharp(src).metadata();
  // Largest cover-crop of this ratio that fits inside the source. No upscaling.
  let w = meta.width;
  let h = Math.round(w / ratio);
  if (h > meta.height) {
    h = meta.height;
    w = Math.round(h * ratio);
  }

  let buf;
  let q = QUALITY;
  for (const attempt of [QUALITY, 70, 62, 55]) {
    q = attempt;
    buf = await sharp(src)
      .resize(w, h, { fit: "cover", position: "centre" })
      .webp({ quality: q })
      .toBuffer();
    if (buf.length <= MAX_BYTES) break;
  }
  await writeFile(join(OUT, dest), buf);

  report.push({
    dest,
    srcPx: `${meta.width}x${meta.height}`,
    outPx: `${w}x${h}`,
    scale: +(w / displayW).toFixed(2),
    kb: +(buf.length / 1024).toFixed(1),
    q,
  });
}

console.log("dest".padEnd(52), "source".padEnd(11), "output".padEnd(11), "scale", " q ", "size");
for (const r of report) {
  const flag = r.scale < 1.5 ? "  <-- under 1.5x, reshoot candidate" : "";
  console.log(
    r.dest.padEnd(52),
    r.srcPx.padEnd(11),
    r.outPx.padEnd(11),
    `${r.scale}x`.padEnd(6),
    String(r.q).padEnd(3),
    `${r.kb}KB`.padEnd(8) + flag,
  );
}
const over = report.filter((r) => r.kb > 300);
const total = report.reduce((n, r) => n + r.kb, 0);
console.log(`\n${report.length} files, ${total.toFixed(0)} KB total`);
console.log(over.length ? `OVER 300KB: ${over.map((r) => r.dest).join(", ")}` : "all within the 300 KB budget");
console.log(`under 1.5x: ${report.filter((r) => r.scale < 1.5).length}`);

// leftover sources not used, so nothing silently goes missing
const used = new Set(JOBS.map(([, s]) => s.split("/").pop().trim().toLowerCase()));
for (const dir of [P15, P4, P5, CO, P1, CERT, NEW_FACTORY]) {
  for (const f of await readdir(dir)) {
    if (/\.(jpg|jpeg|png)$/i.test(f) && !used.has(f.trim().toLowerCase())) console.log(`unused source: ${dir.split("/").pop()}/${f}`);
  }
}
