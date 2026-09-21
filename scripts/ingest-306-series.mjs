#!/usr/bin/env node
/**
 * 上架 306 系列：306-S / 306-D / 306 PS。
 *
 * 图包只有照片和视频，没有规格表。所以规格表里只有三条，全部来自甲方 2026-09-21
 * 转述工厂的原话，一个字没有推演：
 *
 *   老妈：「单开，双开」
 *   cantonlock：「区分,S代表单开门,D代表双开门,PS是通道,无锁舌,要搭配锁体」
 *
 * 背距、面板尺寸、推杆长度、锁芯孔、认证一律不写 —— 规格表里查不到的一栏是短横线，
 * 不是一个看起来合理的数字。这三条写进 specSources.client，注明出处与日期。
 *
 * 命名按目录既有约定：309-D 已经叫 "Double Door Panic Exit Device"，所以 306-D
 * 跟它一致。306 PS 不叫 panic exit device —— 工厂说它没有锁舌，而 panic exit device
 * 的定义就是按一下释放锁舌。叫它 "Passage Push Bar"，并在摘要里写明要配锁体。
 *
 * ⚠ 类目一律用 panic-exit-devices 根目录，不进 multi-point 或 special-applications。
 * 309-D 在 multi-point 是因为它是两点锁，而工厂没有说 306-D 是两点锁。不知道就不放。
 *
 * 用法: node scripts/ingest-306-series.mjs <解包后的 "Panic Exit Devices" 目录>
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import ffprobeStatic from "ffprobe-static";

const SRC_ROOT = process.argv[2];
if (!SRC_ROOT || !existsSync(SRC_ROOT)) {
  console.error("用法: node scripts/ingest-306-series.mjs <解包后的 Panic Exit Devices 目录>");
  process.exit(1);
}

const IMG_OUT = "public/images/products";
const VID_OUT = "public/videos/products";
const REC_OUT = "content/products";
const TODAY = new Date().toISOString().slice(0, 10);

const CLIENT_QUOTE =
  "区分,S代表单开门,D代表双开门,PS是通道,无锁舌,要搭配锁体（甲方转述工厂，2026-09-21）";

const MODELS = [
  {
    dir: "306-S",
    model: "306-S",
    slug: "306-s-panic-exit-device",
    name: "Single Door Panic Exit Device",
    nameZh: "单开门逃生推杠",
    summary:
      "A push bar for a single escape door. The factory distinguishes this from the 306-D by door leaf count; dimensions are not yet published.",
    specs: [{ label: "Door leaves", value: "Single door" }],
  },
  {
    dir: "306-D",
    model: "306-D",
    slug: "306-d-panic-exit-device",
    name: "Double Door Panic Exit Device",
    nameZh: "双开门逃生推杠",
    summary:
      "A push bar for a double escape door. The factory distinguishes this from the 306-S by door leaf count; dimensions are not yet published.",
    specs: [{ label: "Door leaves", value: "Double door" }],
  },
  {
    dir: "306 PS",
    model: "306 PS",
    slug: "306-ps-panic-exit-device",
    name: "Passage Push Bar",
    nameZh: "通道推杠",
    summary:
      "A passage push bar with no latch bolt of its own — it is fitted with a separate lock case, which carries the latching. Not a self-latching exit device.",
    specs: [
      { label: "Function", value: "Passage — no latch bolt" },
      { label: "Fitted with", value: "A separate lock case, supplied to suit" },
    ],
  },
];

/* Natural sort so 2, 4, 5, 8, 9, 10 does not come back as 10, 2, 4. The gallery order
   the factory shot in is the order a buyer should see. */
const natural = (a, b) =>
  String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });

const listImages = (dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !f.startsWith("._"))
        .sort(natural)
    : [];

function probeDuration(file) {
  try {
    const out = execFileSync(
      ffprobeStatic.path,
      ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", file],
      { encoding: "utf8" },
    );
    const n = Number(String(out).trim());
    return Number.isFinite(n) ? Math.round(n) : null;
  } catch {
    return null;
  }
}

mkdirSync(IMG_OUT, { recursive: true });
mkdirSync(VID_OUT, { recursive: true });

for (const m of MODELS) {
  const base = join(SRC_ROOT, m.dir);
  if (!existsSync(base)) {
    console.error(`x ${m.model}: 源目录不存在 ${base}`);
    process.exitCode = 1;
    continue;
  }

  const heroFiles = listImages(join(base, "主图"));
  const galleryFiles = listImages(join(base, "图库"));
  if (!heroFiles.length) {
    console.error(`x ${m.model}: 主图目录里没有图`);
    process.exitCode = 1;
    continue;
  }

  // Hero
  const heroOut = `${IMG_OUT}/${m.slug}.webp`;
  await sharp(join(base, "主图", heroFiles[0])).webp({ quality: 88 }).toFile(heroOut);

  // Gallery, numbered from 2 like the rest of the catalogue
  const gallery = [];
  for (let i = 0; i < galleryFiles.length; i++) {
    const n = i + 2;
    const out = `${IMG_OUT}/${m.slug}-${n}.webp`;
    await sharp(join(base, "图库", galleryFiles[i])).webp({ quality: 88 }).toFile(out);
    gallery.push({
      src: `/images/products/${m.slug}-${n}.webp`,
      ratio: "1 / 1",
      label: `Hyland ${m.model} ${m.name}, view ${n}`,
    });
  }

  // Video + its poster. The poster is the hero cropped to 16/9 rather than a frame grab:
  // a frame from a demonstration video is motion-blurred, and the product plate is what
  // tells the reader what they are about to watch.
  const videoDir = join(base, "视频");
  const videoFile = existsSync(videoDir)
    ? readdirSync(videoDir).find((f) => /\.mp4$/i.test(f) && !f.startsWith("._"))
    : null;

  let videos;
  if (videoFile) {
    const dest = `${VID_OUT}/${m.slug}.mp4`;
    copyFileSync(join(videoDir, videoFile), dest);
    const posterOut = `${IMG_OUT}/${m.slug}-video.webp`;
    await sharp(join(base, "主图", heroFiles[0]))
      .resize({ width: 1280, height: 720, fit: "contain", background: "#ffffff" })
      .webp({ quality: 88 })
      .toFile(posterOut);

    const seconds = probeDuration(dest);
    videos = [
      {
        src: `/videos/products/${m.slug}.mp4`,
        poster: {
          src: `/images/products/${m.slug}-video.webp`,
          ratio: "16 / 9",
          label: `${m.model} ${m.name}, demonstration still`,
        },
        label: `${m.model} ${m.name} — product demonstration`,
        ...(seconds ? { durationSeconds: seconds } : {}),
        uploadDate: TODAY,
      },
    ];
  }

  const record = {
    model: m.model,
    slug: m.slug,
    name: m.name,
    nameZh: m.nameZh,
    series: "Hyland 300",
    categoryPath: ["panic-exit-devices"],
    sites: ["hyde"],
    summary: m.summary,
    specs: m.specs,
    specSources: {
      client: {
        basis: "client-relayed-from-factory",
        quote: CLIENT_QUOTE,
        fields: m.specs.map((s) => s.label),
        receivedAt: TODAY,
      },
    },
    material: null,
    finishes: [],
    doorTypes: [],
    certifications: [],
    heroImage: {
      src: `/images/products/${m.slug}.webp`,
      ratio: "1 / 1",
      label: `Hyland ${m.model} ${m.name}`,
    },
    gallery,
    ...(videos ? { videos } : {}),
    attachmentIds: [],
    relatedModels: MODELS.filter((x) => x.model !== m.model).map((x) => x.model),
    seoTitle: `${m.model} ${m.name} | Canton Hyland`,
    seoDescription: `Canton Hyland ${m.model} ${m.name.toLowerCase()}. ${m.summary}`,
  };

  writeFileSync(`${REC_OUT}/${m.slug}.json`, `${JSON.stringify(record, null, 2)}\n`);
  console.log(
    `ok ${m.model.padEnd(7)} 主图 1 · 图库 ${gallery.length} · 视频 ${videoFile ? "1" : "0"} → ${m.slug}`,
  );
}

console.log("\n⚠ 规格表只有工厂说过的那几条。背距、面板尺寸、推杆长度、锁芯孔一律留空。");
