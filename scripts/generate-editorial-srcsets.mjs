import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const siteComponents = join(repositoryRoot, "src", "components", "site");
const publicRoot = join(repositoryRoot, "public");
const checkOnly = process.argv.includes("--check");

/*
  Two libraries, two config files, two output directories. The product library was added
  on 2026-09-11: the six homepage product thumbnails were serving a full 1000–1100px
  square into a box never wider than 420 CSS px, because candidates only ever existed for
  editorial images. Paths here are mirrored in src/components/site/editorial-images.ts —
  if one side moves, the srcSet points at a 404 and the browser silently falls back to
  the full-size source, which looks exactly like success.
*/
const editorialConfig = JSON.parse(
  readFileSync(join(siteComponents, "editorial-images.config.json"), "utf8"),
);

/*
  A third library, added 2026-09-14: the HYDE-marked copies of the editorial photographs
  that a tracked record proves came from a real photograph.

  It has to exist separately rather than replacing the first. A branded candidate must be
  resized FROM the branded source — resizing the unbranded one and calling it branded
  would serve an unmarked 480px image to every phone, which is most of the traffic, and
  the page would look correct while the mark was missing exactly where it was asked for.

  The entries are derived rather than listed: same widths as the unbranded entry, source
  path rewritten to the branded root. So a width added to editorial-images.config.json is
  automatically generated for both, and the two libraries cannot drift apart.

  Only the images in branded-editorial-list.json are here. See
  scripts/build-branded-editorial-list.mjs for why that list is short.
*/
const brandedEditorialFiles = JSON.parse(
  readFileSync(join(repositoryRoot, "docs", "design-references", "branded-editorial-list.json"), "utf8"),
);
const brandedEditorialConfig = Object.fromEntries(
  brandedEditorialFiles
    .map((file) => [`/images/editorial/${file}`, `/images/editorial-hyde/${file}`])
    .filter(([source]) => editorialConfig[source])
    .map(([source, branded]) => [branded, editorialConfig[source]]),
);

const libraries = [
  {
    label: "editorial",
    config: editorialConfig,
    outputDirectory: join(publicRoot, "images", "editorial", "responsive"),
  },
  {
    label: "branded editorial",
    config: brandedEditorialConfig,
    outputDirectory: join(publicRoot, "images", "editorial-hyde", "responsive"),
  },
  {
    label: "product",
    config: JSON.parse(
      readFileSync(join(siteComponents, "product-images.config.json"), "utf8"),
    ),
    outputDirectory: join(publicRoot, "images", "responsive", "products"),
  },
];

function outputPath(src, width, outputDirectory) {
  const filename = src.slice(src.lastIndexOf("/") + 1).replace(/\.webp$/i, "");
  return join(outputDirectory, `${filename}-${width}w.webp`);
}

/*
  Candidates are named by BASENAME, and the product library is the first one with
  subdirectories — /products-hyde/argentina-ar4/hyde-ar4-110.webp and a future
  /products-hyde/hyde-ar4-110.webp would write the same candidate file. The second one
  would win, and the first product would quietly serve the second product's photograph
  at every width below its source. On a hardware catalogue that is a wrong part in a
  buyer's basket, so it fails the build instead.
*/
function assertNoBasenameCollision(config, label) {
  const seen = new Map();
  for (const publicPath of Object.keys(config)) {
    const filename = publicPath.slice(publicPath.lastIndexOf("/") + 1);
    const previous = seen.get(filename);
    if (previous) {
      throw new Error(
        `Duplicate ${label} basename "${filename}": ${previous} and ${publicPath} would write the same candidate files.`,
      );
    }
    seen.set(filename, publicPath);
  }
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

let variantCount = 0;
for (const { label, config, outputDirectory } of libraries) {
  assertNoBasenameCollision(config, label);
  if (!checkOnly) mkdirSync(outputDirectory, { recursive: true });

  for (const [publicPath, image] of Object.entries(config)) {
    const sourcePath = join(publicRoot, ...publicPath.split("/").filter(Boolean));
    await verifyImage(sourcePath, image.sourceWidth, `${label} source`);

    for (const width of image.variants) {
      if (!Number.isInteger(width) || width <= 0 || width >= image.sourceWidth) {
        throw new Error(`Invalid ${width}px candidate for ${publicPath}`);
      }

      const destination = outputPath(publicPath, width, outputDirectory);
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
}

console.log(
  `${checkOnly ? "Verified" : "Generated"} ${variantCount} responsive WebPs across ${libraries.length} libraries.`,
);
