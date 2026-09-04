#!/usr/bin/env node
/**
 * Transcodes the client's product demonstration clips for the web and wires them into the
 * catalogue, from the same `<model>/视频/<file>.mp4` folders the photographs arrive in.
 *
 * WHY THE SOURCE FILES CANNOT GO UP AS THEY ARE. They are 1920×1080 at 50 fps and about
 * 10 Mbit/s — 1,577 MB across 45 clips, averaging 35 MB each, the largest 71.7 MB. That is
 * camera output, not web delivery. At 720p/30 the same clip is 3.0 MB, a 24× reduction,
 * and on a white studio background the difference is not visible: the background is flat,
 * so almost every bit the encoder saves comes from a region with nothing in it.
 *
 * WHY THIS DOES NOT SLOW THE SITE DOWN. `ProductVideo` renders self-hosted files with
 * `preload="none"` and a poster image, so a browser opening a product page downloads
 * ZERO bytes of video. It fetches the poster — one WebP, about 25 KB — and nothing else
 * until a visitor presses play. The clip is not in the critical path, is not in the
 * Largest Contentful Paint, and is not in the page weight for anyone who does not want it.
 * That is the whole reason `preload="none"` is not negotiable here: flip it to "metadata"
 * and every page with a video starts paying for it on load.
 *
 * 720p AND NOT 1080p. This is a 16:9 clip inside a product page column, roughly 640-800
 * CSS pixels wide on a desktop and full-width on a phone. 720p is already above what the
 * element displays on most screens; 1080p would triple the bytes to feed pixels the layout
 * throws away.
 *
 * 30 fps AND NOT 50. A hand pressing a push bar is not a sport. Halving the frame rate
 * halves the frames the encoder has to spend bits on and is invisible at this subject speed.
 *
 * `-movflags +faststart` moves the index to the front of the file so playback can begin
 * during the download instead of after it. Without it a 3 MB clip appears to hang.
 *
 * THE POSTER IS CHOSEN, NOT TAKEN AT A FIXED TIME. These clips are demonstrations: a hand
 * enters the frame and moves. A frame grabbed at a fixed offset lands on motion blur about
 * half the time, and a blurred poster is the first thing a buyer sees of the product. So
 * five candidates are sampled across the clip and the sharpest wins, measured as JPEG size
 * at a fixed quality — motion blur destroys high-frequency detail, which is exactly what a
 * JPEG spends its bytes on, so the largest encode is the least blurred frame. It is a
 * proxy, not a judgement, and any poster can be replaced by hand afterwards.
 *
 * MATCHING IS EXACT, NOT FUZZY — the same rule as import-client-product-photos.mjs, for
 * the same reason. A folder named `308` is not written to `308-D`.
 *
 * IDEMPOTENT. A clip already transcoded is skipped unless --force, so a re-run after new
 * folders arrive only does the new work.
 *
 * Usage:
 *   node scripts/import-client-product-videos.mjs --from "<folder>" [--from "<folder>"] --report
 *   node scripts/import-client-product-videos.mjs --from "<folder>" --write [--force]
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync } from "node:fs";
import { join, basename } from "node:path";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";

const PRODUCTS_DIR = "content/products";
const VIDEO_DIR = "public/videos/products";
const POSTER_DIR = "public/images/products";

/** Delivery profile. See the header for why each of these is the number it is. */
const HEIGHT = 720;
const FPS = 30;
const CRF = 28;
const AUDIO_KBPS = 96;
/** Poster candidates sampled across the clip, as a fraction of its duration. */
const POSTER_SAMPLES = [0.05, 0.2, 0.4, 0.6, 0.8];

const args = process.argv.slice(2);
const write = args.includes("--write");
const force = args.includes("--force");
const roots = args.flatMap((a, i) => (a === "--from" && args[i + 1] ? [args[i + 1]] : []));

if (!roots.length) {
  console.error('Give at least one folder: --from "<path to the model folders>"');
  process.exit(1);
}

const ffmpeg = ffmpegPath;
const ffprobe = ffprobeStatic.path;

const normalise = (s) => String(s ?? "").toUpperCase().replace(/[\s_-]/g, "");
const mb = (bytes) => bytes / 1024 / 1024;

/* --------------------------------------------------------------- catalogue */

const products = readdirSync(PRODUCTS_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((file) => ({ file, ...JSON.parse(readFileSync(join(PRODUCTS_DIR, file), "utf8")) }));

const byModel = new Map();
for (const p of products) if (p.model) byModel.set(normalise(p.model), p);

/* ------------------------------------------------------------------ source */

/** Every `<root>/<model>/视频/*.mp4`, paired with the product carrying that model. */
function collect() {
  const found = [];
  for (const root of roots) {
    if (!existsSync(root)) {
      console.error(`skipping missing folder: ${root}`);
      continue;
    }
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const videoDir = join(root, entry.name, "视频");
      if (!existsSync(videoDir)) continue;
      const clips = readdirSync(videoDir).filter((f) => /\.(mp4|mov|m4v)$/i.test(f));
      if (!clips.length) continue;
      found.push({
        model: entry.name,
        product: byModel.get(normalise(entry.name)) ?? null,
        /*
          One clip per product. Every folder the client has sent holds exactly one, and a
          product page showing two near-identical demonstrations of the same lock is worse
          than showing one. Extras are reported rather than dropped silently.
        */
        source: join(videoDir, clips[0]),
        extras: clips.slice(1),
      });
    }
  }
  return found.sort((a, b) => a.model.localeCompare(b.model, "en"));
}

/* --------------------------------------------------------------- transcode */

function probeDuration(file) {
  const out = execFileSync(
    ffprobe,
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
    { encoding: "utf8" },
  );
  return Number.parseFloat(out.trim()) || 0;
}

function transcode(source, target) {
  execFileSync(
    ffmpeg,
    [
      "-y", "-i", source,
      "-vf", `scale=-2:${HEIGHT},fps=${FPS}`,
      "-c:v", "libx264", "-crf", String(CRF), "-preset", "veryfast",
      /* main/yuv420p is the combination every browser and iOS version decodes. */
      "-profile:v", "main", "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-c:a", "aac", "-b:a", `${AUDIO_KBPS}k`, "-ac", "1",
      target,
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
}

/**
 * Writes the sharpest of several sampled frames as a WebP poster.
 *
 * Returns the chosen offset in seconds, so the report can say which frame was taken and a
 * person can grab a different one if they disagree.
 */
async function writePoster(source, duration, target) {
  const scratch = join(tmpdir(), `poster-${process.pid}-${Date.now()}`);
  mkdirSync(scratch, { recursive: true });
  let best = null;

  try {
    for (const fraction of POSTER_SAMPLES) {
      const at = Math.max(0.1, duration * fraction);
      const candidate = join(scratch, `${fraction}.jpg`);
      try {
        execFileSync(
          ffmpeg,
          ["-y", "-ss", at.toFixed(2), "-i", source, "-frames:v", "1",
           "-vf", `scale=-2:${HEIGHT}`, "-q:v", "3", candidate],
          { stdio: ["ignore", "ignore", "pipe"] },
        );
      } catch {
        continue; /* A seek past the end of a short clip; try the next sample. */
      }
      if (!existsSync(candidate)) continue;
      const size = statSync(candidate).size;
      if (!best || size > best.size) best = { size, at, file: candidate };
    }

    if (!best) return null;
    await sharp(best.file).webp({ quality: 82 }).toFile(target);
    return best.at;
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

/* -------------------------------------------------------------------- run */

const items = collect();
const matched = items.filter((i) => i.product);
const unmatched = items.filter((i) => !i.product);

console.log(
  `${items.length} folders carry a clip · ${matched.length} matched to a product · ${unmatched.length} unmatched`,
);

const sourceBytes = items.reduce((n, i) => n + statSync(i.source).size, 0);
console.log(`source: ${mb(sourceBytes).toFixed(0)} MB`);

if (!write) {
  if (unmatched.length) {
    console.log("\nno product carries these model numbers — nothing is imported for them:");
    for (const i of unmatched) console.log(`  ${i.model.padEnd(20)} ${basename(i.source)}`);
  }
  console.log(`\n--write not given; nothing transcoded.`);
  process.exit(0);
}

mkdirSync(VIDEO_DIR, { recursive: true });
mkdirSync(POSTER_DIR, { recursive: true });

let written = 0;
let skipped = 0;
let outBytes = 0;
const report = [];

for (const [index, item] of matched.entries()) {
  const { product, source } = item;
  const target = join(VIDEO_DIR, `${product.slug}.mp4`);
  const poster = join(POSTER_DIR, `${product.slug}-video.webp`);

  const fresh =
    !force && existsSync(target) && existsSync(poster) &&
    statSync(target).mtimeMs >= statSync(source).mtimeMs;

  if (fresh) {
    skipped += 1;
    outBytes += statSync(target).size;
  } else {
    transcode(source, target);
    const duration = probeDuration(source);
    const at = await writePoster(source, duration, poster);
    outBytes += statSync(target).size;
    written += 1;
    report.push({
      model: product.model,
      slug: product.slug,
      from: mb(statSync(source).size),
      to: mb(statSync(target).size),
      posterAt: at,
    });
  }

  /*
    The label is what a screen reader announces and what the player is titled. It says what
    the clip shows, not "video" — "305 Fire Door Panic Exit Device" alone would be the
    product's name repeated, and a person hearing it would not know a demonstration is on
    offer.
  */
  const label = `${product.model} ${product.name} — product demonstration`;
  const record = JSON.parse(readFileSync(join(PRODUCTS_DIR, product.file), "utf8"));
  record.videos = [
    {
      src: `/videos/products/${product.slug}.mp4`,
      poster: {
        src: `/images/products/${product.slug}-video.webp`,
        ratio: "16 / 9",
        label: `${product.model} ${product.name}, demonstration still`,
      },
      label,
      /*
        Both fields are here because Google's video structured data requires them and
        will not show a video result without them. Duration is measured off the file we
        actually serve, not the camera original, so it cannot drift from what a visitor
        watches. `uploadDate` is the date this site published the clip — that is what the
        property means, and it is a date we can stand behind, unlike a filming date
        nobody recorded.
      */
      durationSeconds: Math.round(probeDuration(target)),
      uploadDate: record.videos?.[0]?.uploadDate ?? new Date().toISOString().slice(0, 10),
    },
  ];
  writeFileSync(join(PRODUCTS_DIR, product.file), `${JSON.stringify(record, null, 2)}\n`);

  if ((index + 1) % 10 === 0 || index === matched.length - 1) {
    console.log(`  ${index + 1}/${matched.length} — ${written} transcoded, ${skipped} already current`);
  }
}

console.log(
  `\n${written} transcoded, ${skipped} unchanged · ${mb(sourceBytes).toFixed(0)} MB in, ${mb(outBytes).toFixed(0)} MB out ` +
    `(${(sourceBytes / Math.max(outBytes, 1)).toFixed(0)}× smaller)`,
);

if (report.length) {
  console.log("\nwhat was written:");
  for (const r of report.slice(0, 12)) {
    console.log(
      `  ${r.model.padEnd(16)} ${r.from.toFixed(1).padStart(5)} MB -> ${r.to.toFixed(1).padStart(4)} MB` +
        `  poster @ ${r.posterAt === null ? "—" : `${r.posterAt.toFixed(1)}s`}`,
    );
  }
  if (report.length > 12) console.log(`  … and ${report.length - 12} more`);
}

const withExtras = items.filter((i) => i.extras.length);
if (withExtras.length) {
  console.log(`\n${withExtras.length} folder(s) held more than one clip; only the first was used:`);
  for (const i of withExtras) console.log(`  ${i.model}: ignored ${i.extras.join(", ")}`);
}
