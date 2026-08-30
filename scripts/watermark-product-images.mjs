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

const SAMPLE_RELATIVE_PATHS = [
  "015-panic-exit-device.webp",
  "9001-stainless-steel-handle-3.webp",
  "564-mb-night-latch-and-rim-lock.webp",
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
  const horizontalPadding = clamp(Math.round(imageWidth * 0.019), 8, 18);
  const verticalPadding = clamp(Math.round(imageWidth * 0.03), 16, 24);
  const maximumLogoWidth = Math.max(24, imageWidth - margin * 2 - horizontalPadding * 2);
  const requestedLogoWidth = clamp(Math.round(imageWidth * 0.18), 72, 176);
  const logoWidth = Math.min(requestedLogoWidth, maximumLogoWidth);
  const logoHeight = Math.max(6, Math.round(logoWidth / 4));

  return {
    margin,
    logoWidth,
    logoHeight,
    plateWidth: logoWidth + horizontalPadding * 2,
    plateHeight: logoHeight + verticalPadding * 2,
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
      background: { r: 255, g: 255, b: 255, alpha: 0.96 },
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

async function watermarkImage({ inputPath, inputRoot, logoPath, outputRoot }) {
  const image = sharp(inputPath).rotate();
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Unable to read image dimensions: ${inputPath}`);
  }

  const geometry = getWatermarkGeometry(metadata.width, metadata.height);
  const { logo, plate } = await createWatermarkBuffers(geometry, logoPath);
  const outputPath = resolveSafeOutputPath(inputPath, inputRoot, outputRoot);
  const logoLeft = geometry.margin + Math.round((geometry.plateWidth - geometry.logoWidth) / 2);
  const logoTop = geometry.margin + Math.round((geometry.plateHeight - geometry.logoHeight) / 2);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await image
    .composite([
      { input: plate, left: geometry.margin, top: geometry.margin },
      { input: logo, left: logoLeft, top: logoTop },
    ])
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
      }),
    );
  }

  const manifestPath = options.manifestPath;
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(
    manifestPath,
    `${JSON.stringify(
      {
        schemaVersion: 1,
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
