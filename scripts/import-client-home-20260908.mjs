/** Re-encode the two client-selected images without changing composition or geometry. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const choices = [
  ['lc04-selection', 'Materials + Engineering', 'lc04-85-60-lock-case'],
  ['black-hinge', 'Specify with confidence', 'bl028-brass-and-steel-hinges'],
];
const configPath = 'src/components/site/editorial-images.config.json';
const config = JSON.parse(readFileSync(configPath, 'utf8'));
mkdirSync('public/images/editorial/responsive', { recursive: true });
for (const [name, placement, slug] of choices) {
  const source = `docs/design-references/client-home-20260908/${name}-original.png`;
  const bytes = readFileSync(source);
  const metadata = await sharp(bytes).metadata();
  const src = `/images/editorial/hyde-client-${name}.webp`;
  await sharp(bytes).webp({ quality: 92, effort: 6 }).toFile(`public${src}`);
  for (const width of [480, 960]) {
    await sharp(bytes).resize({ width, withoutEnlargement: true })
      .webp({ quality: 84, effort: 6 })
      .toFile(`public/images/editorial/responsive/hyde-client-${name}-${width}w.webp`);
  }
  config[src] = { sourceWidth: metadata.width, variants: [480, 960] };
  writeFileSync(`public${src}.json`, JSON.stringify({
    kind: 'client-selected-source-photo-edit',
    approvedUse: `Client asked to select from supplied images for ${placement}, 2026-09-08`,
    sources: [{ path: source, sha256: createHash('sha256').update(bytes).digest('hex'), catalogueSlug: slug }],
    processing: 'WebP encoding and responsive resizing only; no crop or generated edits during import.',
    limitation: 'Client-supplied edited image. Not an untouched photograph, CAD model, dimension drawing or proof of installation compatibility.',
  }, null, 2) + '\n');
  console.log(`${placement}: ${src}, ${metadata.width} x ${metadata.height}`);
}
writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
