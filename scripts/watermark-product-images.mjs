import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import sharp from "sharp";

const PROJECT_ROOT = path.resolve(import.meta.dirname, "..");
const DEFAULT_INPUT_ROOT = path.join(PROJECT_ROOT, "public", "images", "products");
const DEFAULT_OUTPUT_ROOT = path.join(PROJECT_ROOT, "tmp", "codex-watermark-preview");
const DEFAULT_LOGO = path.join(
  PROJECT_ROOT,
  "public",
  "images",
  "brand",
  "hyde",
  "hyde-logo-horizontal-black.svg",
);
const DEFAULT_WHITE_LOGO = path.join(
  PROJECT_ROOT,
  "public",
  "images",
  "brand",
  "hyde",
  "hyde-logo-horizontal-white.svg",
);

const CORNERS = ["top-left", "top-right", "bottom-left", "bottom-right"];

const SAMPLE_RELATIVE_PATHS = [
  "015-panic-exit-device.webp",
  "9001-stainless-steel-handle-3.webp",
  "9001-stainless-steel-handle-5.webp",
  "564-mb-night-latch-and-rim-lock.webp",
  "314-alarm-panic-bar-exit-device-4.webp",
  "f101-glass-door-patch-fittings.webp",
  "argentina-ar4/hyde-ar4-110.webp",
  "argentina-ar4/hyde-ar4-1121.webp",
];

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function getWatermarkGeometry(imageWidth, imageHeight) {
  if (!Number.isFinite(imageWidth) || !Number.isFinite(imageHeight)) {
    throw new TypeError("Image dimensions must be finite numbers.");
  }
  if (imageWidth <= 0 || imageHeight <= 0) {
    throw new RangeError("Image dimensions must be positive.");
  }

  const margin = clamp(Math.round(Math.min(imageWidth, imageHeight) * 0.025), 10, 30);
  const horizontalPadding = clamp(Math.round(imageWidth * 0.025), 10, 24);
  const verticalPadding = clamp(Math.round(imageWidth * 0.03), 16, 24);
  const maximumLogoWidth = Math.max(24, imageWidth - margin * 2 - horizontalPadding * 2);
  const requestedLogoWidth = clamp(Math.round(imageWidth * 0.14), 72, 140);
  const logoWidth = Math.min(requestedLogoWidth, maximumLogoWidth);
  const logoHeight = Math.max(6, Math.round(logoWidth / 4));

  return {
    margin,
    logoWidth,
    logoHeight,
    plateWidth: logoWidth + horizontalPadding * 2,
    // Legacy Hyland badges often carry a small tagline below the oval mark.
    // The extra bottom band prevents that line or a mirrored badge edge from peeking out.
    plateHeight: logoHeight + verticalPadding * 3,
  };
}

export function getAdaptiveMarkGeometry(imageWidth, imageHeight) {
  if (!Number.isFinite(imageWidth) || !Number.isFinite(imageHeight)) {
    throw new TypeError("Image dimensions must be finite numbers.");
  }
  if (imageWidth <= 0 || imageHeight <= 0) {
    throw new RangeError("Image dimensions must be positive.");
  }

  const margin = clamp(Math.round(Math.min(imageWidth, imageHeight) * 0.025), 10, 30);
  const maximumLogoWidth = Math.max(24, imageWidth - margin * 2);
  const requestedLogoWidth = clamp(Math.round(imageWidth * 0.12), 64, 120);
  const logoWidth = Math.min(requestedLogoWidth, maximumLogoWidth);

  return {
    margin,
    logoWidth,
    logoHeight: Math.max(6, Math.round(logoWidth / 4)),
  };
}

function isLegacyRed(r, g, b) {
  return r > 105 && r - g > 28 && r - b > 18 && r > g * 1.2;
}

export function findLegacyBrandCorner({ data, width, height, channels }) {
  if (!data || !width || !height || channels < 3) return undefined;

  const heightLimit = Math.max(1, Math.floor(height * 0.32));
  const mask = new Uint8Array(width * heightLimit);
  for (let y = 0; y < heightLimit; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixelOffset = (y * width + x) * channels;
      if (isLegacyRed(data[pixelOffset], data[pixelOffset + 1], data[pixelOffset + 2])) {
        mask[y * width + x] = 1;
      }
    }
  }

  const seen = new Uint8Array(mask.length);
  const candidates = [];
  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start] || seen[start]) continue;
    const stack = [start];
    seen[start] = 1;
    let count = 0;
    let minX = width;
    let minY = heightLimit;
    let maxX = 0;
    let maxY = 0;

    while (stack.length) {
      const point = stack.pop();
      const x = point % width;
      const y = Math.floor(point / width);
      count += 1;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      for (let deltaY = -1; deltaY <= 1; deltaY += 1) {
        for (let deltaX = -1; deltaX <= 1; deltaX += 1) {
          const nextX = x + deltaX;
          const nextY = y + deltaY;
          if (
            nextX < 0 ||
            nextY < 0 ||
            nextX >= width ||
            nextY >= heightLimit
          ) {
            continue;
          }
          const next = nextY * width + nextX;
          if (mask[next] && !seen[next]) {
            seen[next] = 1;
            stack.push(next);
          }
        }
      }
    }

    const componentWidth = maxX - minX + 1;
    const componentHeight = maxY - minY + 1;
    const widthRatio = componentWidth / width;
    const heightRatio = componentHeight / height;
    const aspectRatio = componentWidth / componentHeight;
    const centreX = (minX + maxX) / 2;
    const isInLeftCorner = centreX <= width * 0.27;
    const isInRightCorner = centreX >= width * 0.73;

    if (
      count >= 12 &&
      widthRatio >= 0.055 &&
      widthRatio <= 0.2 &&
      heightRatio >= 0.018 &&
      heightRatio <= 0.1 &&
      aspectRatio >= 1.8 &&
      aspectRatio <= 6 &&
      (isInLeftCorner || isInRightCorner)
    ) {
      candidates.push({
        corner: isInLeftCorner ? "top-left" : "top-right",
        score: count * aspectRatio,
      });
    }
  }

  candidates.sort((left, right) => right.score - left.score);
  return candidates[0]?.corner;
}

export function chooseWatermarkCorner(metrics, legacyCorner) {
  if (legacyCorner) return legacyCorner;
  return CORNERS.reduce((best, corner) =>
    (metrics[corner].score ?? metrics[corner].entropy) <
    (metrics[best].score ?? metrics[best].entropy)
      ? corner
      : best,
  );
}

function getCornerPosition(corner, imageWidth, imageHeight, markWidth, markHeight, margin) {
  return {
    left: corner.endsWith("right") ? imageWidth - margin - markWidth : margin,
    top: corner.startsWith("bottom") ? imageHeight - margin - markHeight : margin,
  };
}

export function resolveSafeOutputPath(inputPath, inputRoot, outputRoot) {
  const absoluteInput = path.resolve(inputPath);
  const absoluteInputRoot = path.resolve(inputRoot);
  const relativePath = path.relative(absoluteInputRoot, absoluteInput);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Input is outside the product image root: ${inputPath}`);
  }

  const absoluteOutputRoot = path.resolve(outputRoot);
  const outputPath = path.resolve(absoluteOutputRoot, relativePath);
  const relativeOutput = path.relative(absoluteOutputRoot, outputPath);
  if (relativeOutput.startsWith("..") || path.isAbsolute(relativeOutput)) {
    throw new Error(`Output would escape the target root: ${outputPath}`);
  }

  return outputPath;
}

async function listWebpFiles(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listWebpFiles(entryPath)));
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".webp") {
      files.push(entryPath);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

async function sha256(filePath) {
  const buffer = await fs.readFile(filePath);
  return createHash("sha256").update(buffer).digest("hex");
}

async function createWatermarkBuffers(geometry, logoPath) {
  const plate = await sharp({
    create: {
      width: geometry.plateWidth,
      height: geometry.plateHeight,
      channels: 4,
      // Legacy marks include a red script badge plus a faint grey tagline. A fully
      // opaque cover is required; anything translucent leaves the old identity visible.
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  const logo = await sharp(logoPath)
    .resize(geometry.logoWidth, geometry.logoHeight, {
      fit: "contain",
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();

  return { logo, plate };
}

async function createAdaptiveLogoBuffer(geometry, logoPath) {
  const svg = await fs.readFile(logoPath, "utf8");
  const translucentSvg = svg.replace("<svg ", '<svg opacity="0.82" ');
  return sharp(Buffer.from(translucentSvg))
    .resize(geometry.logoWidth, geometry.logoHeight, {
      fit: "contain",
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();
}

async function analyzeWatermarkPlacement({ inputPath, imageWidth, imageHeight }) {
  const { data, info } = await sharp(inputPath)
    .rotate()
    .resize({ width: 256, fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const legacyCorner = findLegacyBrandCorner({
    channels: info.channels,
    data,
    height: info.height,
    width: info.width,
  });

  if (legacyCorner) {
    return {
      corner: legacyCorner,
      strategy: "legacy-cover",
      variant: "black",
    };
  }

  const adaptiveGeometry = getAdaptiveMarkGeometry(imageWidth, imageHeight);
  const sampleWidth = Math.min(
    imageWidth,
    Math.max(adaptiveGeometry.logoWidth, Math.round(imageWidth * 0.2)),
  );
  const sampleHeight = Math.min(
    imageHeight,
    Math.max(adaptiveGeometry.logoHeight, Math.round(imageHeight * 0.14)),
  );
  const metrics = {};

  for (const corner of CORNERS) {
    const position = getCornerPosition(
      corner,
      imageWidth,
      imageHeight,
      sampleWidth,
      sampleHeight,
      adaptiveGeometry.margin,
    );
    const sample = await sharp(inputPath)
      .rotate()
      .extract({
        left: clamp(position.left, 0, imageWidth - sampleWidth),
        top: clamp(position.top, 0, imageHeight - sampleHeight),
        width: sampleWidth,
        height: sampleHeight,
      })
      .png()
      .toBuffer();
    const stats = await sharp(sample).stats();
    const edgeBuffer = await sharp(sample)
      .greyscale()
      .convolve({
        height: 3,
        kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
        width: 3,
      })
      .png()
      .toBuffer();
    const edgeStats = await sharp(edgeBuffer).stats();
    const mean =
      stats.channels.slice(0, 3).reduce((sum, channel) => sum + channel.mean, 0) / 3;
    const edgeMean = edgeStats.channels[0].mean;
    metrics[corner] = {
      edgeMean,
      entropy: stats.entropy,
      mean,
      score: stats.entropy + edgeMean / 10,
    };
  }

  const corner = chooseWatermarkCorner(metrics);
  return {
    corner,
    metrics,
    strategy: "adaptive-mark",
    variant: metrics[corner].mean >= 150 ? "black" : "white",
  };
}

async function watermarkImage({
  inputPath,
  inputRoot,
  logoPath,
  outputRoot,
  whiteLogoPath,
}) {
  const image = sharp(inputPath).rotate();
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Unable to read image dimensions: ${inputPath}`);
  }

  const placement = await analyzeWatermarkPlacement({
    inputPath,
    imageHeight: metadata.height,
    imageWidth: metadata.width,
  });
  const geometry =
    placement.strategy === "legacy-cover"
      ? getWatermarkGeometry(metadata.width, metadata.height)
      : getAdaptiveMarkGeometry(metadata.width, metadata.height);
  const outputPath = resolveSafeOutputPath(inputPath, inputRoot, outputRoot);
  const composites = [];

  if (placement.strategy === "legacy-cover") {
    const { logo, plate } = await createWatermarkBuffers(geometry, logoPath);
    const platePosition = getCornerPosition(
      placement.corner,
      metadata.width,
      metadata.height,
      geometry.plateWidth,
      geometry.plateHeight,
      geometry.margin,
    );
    composites.push(
      { input: plate, ...platePosition },
      {
        input: logo,
        left:
          platePosition.left + Math.round((geometry.plateWidth - geometry.logoWidth) / 2),
        top:
          platePosition.top + Math.round((geometry.plateHeight - geometry.logoHeight) / 2),
      },
    );
  } else {
    const selectedLogoPath = placement.variant === "white" ? whiteLogoPath : logoPath;
    const logo = await createAdaptiveLogoBuffer(geometry, selectedLogoPath);
    composites.push({
      input: logo,
      ...getCornerPosition(
        placement.corner,
        metadata.width,
        metadata.height,
        geometry.logoWidth,
        geometry.logoHeight,
        geometry.margin,
      ),
    });
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await image
    .composite(composites)
    .webp({ quality: 88, effort: 5, smartSubsample: true })
    .toFile(outputPath);

  const outputMetadata = await sharp(outputPath).metadata();
  if (outputMetadata.width !== metadata.width || outputMetadata.height !== metadata.height) {
    throw new Error(`Output dimensions changed unexpectedly: ${outputPath}`);
  }

  return {
    source: path.relative(PROJECT_ROOT, inputPath).replaceAll("\\", "/"),
    output: path.relative(PROJECT_ROOT, outputPath).replaceAll("\\", "/"),
    width: metadata.width,
    height: metadata.height,
    geometry,
    placement: {
      corner: placement.corner,
      strategy: placement.strategy,
      variant: placement.variant,
    },
    sourceSha256: await sha256(inputPath),
    outputSha256: await sha256(outputPath),
  };
}

function parseArguments(argumentsList) {
  const flags = new Set(argumentsList);
  const valueFor = (prefix, fallback) => {
    const argument = argumentsList.find((value) => value.startsWith(`${prefix}=`));
    return argument ? path.resolve(argument.slice(prefix.length + 1)) : fallback;
  };

  return {
    all: flags.has("--all"),
    check: flags.has("--check"),
    inputRoot: valueFor("--input-root", DEFAULT_INPUT_ROOT),
    logoPath: valueFor("--logo", DEFAULT_LOGO),
    whiteLogoPath: valueFor("--white-logo", DEFAULT_WHITE_LOGO),
    outputRoot: valueFor("--output-root", DEFAULT_OUTPUT_ROOT),
    manifestPath: valueFor(
      "--manifest",
      path.join(valueFor("--output-root", DEFAULT_OUTPUT_ROOT), "watermark-manifest.json"),
    ),
  };
}

async function checkWatermarkManifest({ inputRoot, manifestPath }) {
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const inputs = await listWebpFiles(inputRoot);
  const records = new Map(manifest.files.map((record) => [record.source, record]));

  if (manifest.count !== inputs.length || records.size !== inputs.length) {
    throw new Error(
      `Watermark manifest count mismatch: ${inputs.length} sources, ${manifest.count} declared, ${records.size} unique records.`,
    );
  }

  for (const inputPath of inputs) {
    const source = path.relative(PROJECT_ROOT, inputPath).replaceAll("\\", "/");
    const record = records.get(source);
    if (!record) throw new Error(`Missing HYDE watermark record: ${source}`);

    const outputPath = path.resolve(PROJECT_ROOT, record.output);
    const [sourceHash, outputHash] = await Promise.all([
      sha256(inputPath),
      sha256(outputPath).catch(() => undefined),
    ]);
    if (sourceHash !== record.sourceSha256) {
      throw new Error(`Stale HYDE watermark derivative; source changed: ${source}`);
    }
    if (!outputHash || outputHash !== record.outputSha256) {
      throw new Error(`Missing or changed HYDE watermark derivative: ${record.output}`);
    }
  }

  console.log(`Verified ${inputs.length} HYDE-branded product image derivatives.`);
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.check) {
    await checkWatermarkManifest(options);
    return;
  }
  const inputs = options.all
    ? await listWebpFiles(options.inputRoot)
    : SAMPLE_RELATIVE_PATHS.map((relativePath) => path.join(options.inputRoot, relativePath));

  const inputRoot = path.resolve(options.inputRoot);
  const outputRoot = path.resolve(options.outputRoot);
  if (inputRoot === outputRoot) {
    throw new Error("Refusing to overwrite the source product image directory.");
  }

  const records = [];
  for (const inputPath of inputs) {
    records.push(
      await watermarkImage({
        inputPath,
        inputRoot,
        logoPath: options.logoPath,
        outputRoot,
        whiteLogoPath: options.whiteLogoPath,
      }),
    );
  }

  const manifestPath = options.manifestPath;
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(
    manifestPath,
    `${JSON.stringify(
      {
        schemaVersion: 2,
        sourceRoot: path.relative(PROJECT_ROOT, inputRoot).replaceAll("\\", "/"),
        logo: path.relative(PROJECT_ROOT, options.logoPath).replaceAll("\\", "/"),
        count: records.length,
        files: records,
      },
      null,
      2,
    )}\n`,
  );

  console.log(`Generated ${records.length} HYDE-branded product image derivatives.`);
  console.log(`Output: ${path.relative(PROJECT_ROOT, outputRoot)}`);
  console.log(`Manifest: ${path.relative(PROJECT_ROOT, manifestPath)}`);
}

const isDirectExecution =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isDirectExecution) {
  await main();
}
