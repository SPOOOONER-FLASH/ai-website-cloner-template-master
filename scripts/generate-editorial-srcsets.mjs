import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(
  repositoryRoot,
  "src",
  "components",
  "site",
  "editorial-images.config.json",
);
const publicRoot = join(repositoryRoot, "public");
const outputDirectory = join(publicRoot, "images", "editorial", "responsive");
const checkOnly = process.argv.includes("--check");
const config = JSON.parse(readFileSync(configPath, "utf8"));

function outputPath(src, width) {
  const filename = src.slice(src.lastIndexOf("/") + 1).replace(/\.webp$/i, "");
  return join(outputDirectory, `${filename}-${width}w.webp`);
}

async function verifyImage(path, expectedWidth, label) {
  if (!existsSync(path)) {
    throw new Error(`Missing ${label}: ${path}`);
  }

  const metadata = await sharp(path).metadata();
  if (metadata.format !== "webp" || metadata.width !== expectedWidth) {
    throw new Error(
      `${label} must be WebP ${expectedWidth}px wide; got ${metadata.format} ${metadata.width}px at ${path}`,
    );
  }
}

if (!checkOnly) mkdirSync(outputDirectory, { recursive: true });

let variantCount = 0;
for (const [publicPath, image] of Object.entries(config)) {
  const sourcePath = join(publicRoot, ...publicPath.split("/").filter(Boolean));
  await verifyImage(sourcePath, image.sourceWidth, "editorial source");

  for (const width of image.variants) {
    if (!Number.isInteger(width) || width <= 0 || width >= image.sourceWidth) {
      throw new Error(`Invalid ${width}px candidate for ${publicPath}`);
    }

    const destination = outputPath(publicPath, width);
    if (checkOnly) {
      await verifyImage(destination, width, "responsive candidate");
    } else {
      await sharp(sourcePath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6, smartSubsample: true })
        .toFile(destination);
    }
    variantCount += 1;
  }
}

console.log(
  `${checkOnly ? "Verified" : "Generated"} ${variantCount} responsive editorial WebPs.`,
);
