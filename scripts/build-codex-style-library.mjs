/** Rebuilds the September two-style library from preserved generated stages and real photos. */
import { readdirSync, mkdirSync, existsSync, copyFileSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';

const root = 'docs/design-references/2026-09-09-style-batches';
const generated = 'C:/Users/johns/.codex/generated_images/01a0570e-5f9e-7ea1-9127-cf4f6d0adb76';
const recovered = [
  'f8ef3fcd-4af4-418d-8bc3-dedfb4ef5da9', '7ba9ebdf-5566-4013-ad5c-988d6c99dddb',
  'cffbf496-e013-44f2-9bff-4a4ca9f55cc1', 'b307e5dc-af7f-4e0a-8345-0d4356323ef0',
  'c4a5b9f5-f966-4c9d-a391-12bd164758f5', 'cd2d937f-f92c-45cc-a133-8f2bd727ff3c',
  'd89f09c9-599c-4c30-82dc-24ed8f7759f1', 'dcee9a99-c6d2-4e34-aed6-001c44640832',
  '0eb0f2fc-5f66-4e4f-84f2-4e135972bb97', 'f8a8e5c4-9196-44a9-b531-456a67156854',
];
const products = [
  '812-sset-lever-handle', '3431-sset-lever-handle', 'b024-brass-and-steel-hinges',
  'ju-051-door-closer', '70610-ab-grip-handle-set', '45-bnik-lock-cylinder',
  'fb001-ss-door-flush-bolt', 'f110-glass-door-patch-fittings', '5807-sscr-commercial-lock',
  'd101-ab-deadbolts', '1073d-mb-night-latch-and-rim-lock', '575-sset-tubular-lock',
  'ds01-door-stopper', '600-concealed-sliding-door-handle', 'f001-security-door-guard',
  'dv05-door-viewer', 'aah024-brass-and-steel-hinges', 'ju-061-door-closer',
  '54-dk-lock-cylinder', 'dv08-sn-door-viewer',
];
const pad = (n) => String(n).padStart(2, '0');
const hash = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');

async function sheet(files, out) {
  const width = 400, height = 260, cols = 4;
  const tiles = await Promise.all(files.map(async (p, i) => {
    const label = Buffer.from(`<svg width="400" height="28"><rect width="400" height="28" fill="white"/><text x="12" y="20" font-family="Arial" font-size="15">${pad(i + 1)} · ${p.split(/[\\/]/).pop().slice(0, 43)}</text></svg>`);
    const tile = await sharp({ create: { width, height, channels: 3, background: 'white' } }).composite([
      { input: await sharp(p).resize(width, height - 28, { fit: 'contain', background: '#eeeeee' }).png().toBuffer(), top: 0, left: 0 },
      { input: label, top: height - 28, left: 0 },
    ]).png().toBuffer();
    return { input: tile, left: i % cols * width, top: Math.floor(i / cols) * height };
  }));
  await sharp({ create: { width: cols * width, height: Math.ceil(files.length / cols) * height, channels: 3, background: 'white' } }).composite(tiles).webp({ quality: 90 }).toFile(out);
  console.log(out);
}

if (process.argv.includes('--prepare')) {
  recovered.forEach((id, i) => {
    const dest = join(root, 'architecture-originals', `${pad(i + 11)}-architecture.png`);
    if (!existsSync(dest)) copyFileSync(join(generated, `exec-${id}.png`), dest);
  });
  for (const dir of ['architecture-originals', 'product-stage-backgrounds']) {
    await sheet(readdirSync(join(root, dir)).filter((f) => f.endsWith('.png')).sort().map((f) => join(root, dir, f)), join(root, `${dir}-contact.webp`));
  }
  const valid = products.map((slug) => join('public/images/products', `${slug}.webp`)).filter(existsSync);
  await sheet(valid, join(root, 'product-sources-contact.webp'));
  console.log('Missing sources:', products.filter((slug) => !existsSync(join('public/images/products', `${slug}.webp`))));
}

if (process.argv.includes('--compose')) {
  const dir = join(root, 'product-final-composites');
  mkdirSync(dir, { recursive: true });
  const manifest = [];
  for (const [i, slug] of products.entries()) {
    const scene = join(root, 'product-stage-backgrounds', `${pad(i + 1)}-product-stage.png`);
    const source = join('public/images/products', `${slug}.webp`);
    const run = spawnSync(process.execPath, ['scripts/compose-scene-plate.mjs', '--scene', scene, '--slug', slug, '--x', '0.50', '--y', '0.62', '--span', '0.38', '--out', dir], { encoding: 'utf8' });
    if (run.status !== 0) throw new Error(run.stderr || run.stdout);
    const native = join(dir, `${slug}-on-${pad(i + 1)}-product-stage.png.webp`);
    const out = join(dir, `${pad(i + 1)}-${slug}.webp`);
    renameSync(native, out);
    manifest.push({ index: i + 1, slug, source, sourceSha256: hash(source), scene, sceneSha256: hash(scene), out, method: 'Real photograph cutout; uniform resize, limited exposure and white balance, silhouette shadows. Generated stage contains no product.' });
  }
  writeFileSync(join(root, 'product-provenance.json'), JSON.stringify(manifest, null, 2) + '\n');
  await sheet(manifest.map((m) => m.out), join(root, 'products-contact.webp'));
}
