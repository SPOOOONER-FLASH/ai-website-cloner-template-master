#!/usr/bin/env node
/**
 * Puts client-supplied photographs onto a catalogue record that has none.
 *
 *   node scripts/import-product-photos.mjs <slug> <source-directory>
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS RATHER THAN "JUST COPY THE FILE IN"
 *
 * A record with no `heroImage.src` is withheld from the site — no page, noindex, absent
 * from the finder and from A–Z. That is deliberate and `withheld-products.test.ts` says
 * so in one line: visibility is derived from heroImage.src alone. The consequence is that
 * adding a photograph is a publishing action, and there are four things to get right at
 * once or the model goes live wrong:
 *
 *   1. The plate has to be square. Every catalogue plate is 1000×1000; the cards, the
 *      gallery and the responsive candidates all assume it. A portrait phone photograph
 *      dropped in unchanged is cropped through the product by the card.
 *   2. Padding, never cropping. A lock case is wider than it is tall — cropping it to
 *      square removes the bolts, which are the reason somebody is looking.
 *   3. The file goes in public/images/products/, the UNBRANDED root. The HYDE mark is
 *      applied by scripts/watermark-product-images.mjs into products-hyde/, and the
 *      record points at the unbranded path — brandProductImageRef rewrites it at read
 *      time. Writing a pre-marked file here would get it marked twice.
 *   4. The watermark pass also REMOVES the old red Hyland oval where it finds one. Client
 *      photographs routinely still carry it; that is what findLegacyBrandRegion is for.
 *      So the order is: import, then watermark, and never the reverse.
 *
 * This script does 1–3 and then tells you to run 4. It does not touch specs: a dimension
 * read off a photograph is a guess, and this catalogue prints a dash instead of a guess.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const PLATE = 1000;
const PRODUCTS = "content/products";

const [slug, directory] = process.argv.slice(2).filter((argument) => !argument.startsWith("--"));
/*
  `--append` adds views to a record that already has a photograph, instead of replacing it.

  The default replaces, because the first use was a withheld model with no hero at all.
  308 is the other case and it is the commoner one: the record already carries a good
  branded plate and the client has sent more views of the same part. Overwriting the hero
  there would demote a photograph somebody already approved.
*/
const append = process.argv.includes("--append");

if (!slug || !directory) {
  console.error("Usage: node scripts/import-product-photos.mjs <slug> <source-directory>");
  console.error("Sources are taken in filename order; the first becomes the hero.");
  process.exit(1);
}

const recordPath = join(PRODUCTS, `${slug}.json`);
if (!existsSync(recordPath)) {
  console.error(`No such record: ${recordPath}`);
  process.exit(1);
}

const record = JSON.parse(readFileSync(recordPath, "utf8"));
const sources = readdirSync(directory)
  .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
  .sort();

if (!sources.length) {
  console.error(`No images in ${directory}`);
  process.exit(1);
}

/** The plate's own field colour, so the pad matches instead of announcing itself. */
async function fieldColour(input) {
  const { data } = await sharp(input)
    .extract({ left: 0, top: 0, width: 24, height: 24 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < data.length; i += 3) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  const pixels = data.length / 3;
  return { r: Math.round(r / pixels), g: Math.round(g / pixels), b: Math.round(b / pixels) };
}

const written = [];

/* Continue the numbering where the record stops, so nothing already published is replaced. */
/*
  ⚠ THE FIELD IS `gallery`, NOT `images`.

  The first version of this script wrote `record.images`. Nothing errored, no test failed,
  and the record looked right in the JSON — but src/data/products.ts reads
  `product.gallery`, so the extra photographs simply never reached a page. 6068 shipped
  that way on 2026-09-15 with its second photograph invisible, and it was only caught by
  grepping the built HTML for the filename rather than trusting the record.

  Worth remembering as a shape: a wrong field name in content is silent at every layer —
  the writer succeeds, the type is optional, the renderer reads undefined and draws
  nothing. Check the built output, not the input.
*/
const startAt = append ? (record.gallery?.length ?? 0) + (record.heroImage?.src ? 1 : 0) : 0;

for (const [index, file] of sources.entries()) {
  const input = join(directory, file);
  const position = startAt + index;
  const suffix = position === 0 ? "" : `-${position + 1}`;
  const publicPath = `/images/products/${slug}${suffix}.webp`;
  const target = `public${publicPath}`;

  const meta = await sharp(input).metadata();
  const background = await fieldColour(input);

  /* `contain` pads to the square; nothing leaves the frame. */
  await sharp(input)
    .resize({ width: PLATE, height: PLATE, fit: "contain", background })
    .webp({ quality: 86, effort: 6 })
    .toFile(target);

  written.push(publicPath);
  console.log(
    `  ${file} → ${slug}${suffix}.webp  ${meta.width}×${meta.height} → ${PLATE}×${PLATE}` +
      `  field rgb(${background.r},${background.g},${background.b})`,
  );
}

if (append) {
  record.gallery = [
    ...(record.gallery ?? []),
    ...written.map((src, index) => ({
      src,
      ratio: "1 / 1",
      label: `${record.heroImage?.label ?? record.name}, view ${startAt + index + 1}`,
    })),
  ];
} else {
  const [hero, ...rest] = written;
  record.heroImage = { ...record.heroImage, src: hero };
  if (rest.length) {
    record.gallery = rest.map((src, index) => ({
      src,
      ratio: "1 / 1",
      label: `${record.heroImage.label ?? record.name}, view ${index + 2}`,
    }));
  }
}
writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`);

console.log(`\n${slug}: ${written.length} photographs, record now has heroImage.src — it will publish.`);
console.log("Next, and required before committing:");
console.log("  npm run assets:watermark      # adds the HYDE mark, removes the old Hyland oval");
console.log("  npm run assets:productconfig  # if this model needs responsive candidates");
