#!/usr/bin/env node
/**
 * Replace rejected staged guide composites with their exact catalogue source bytes.
 * The original photographs are truthful stopgaps, not the final dark-studio reshoot.
 * Dry-run by default. This script never edits guide content or the RAYEN lane.
 */
import { copyFileSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const imageDir = join(root, 'public/images/editorial/guides');
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const write = process.argv.includes('--write');
const entries = [];

for (const filename of readdirSync(imageDir).filter((name) => name.endsWith('.webp.json'))) {
  const sidecarPath = join(imageDir, filename);
  const sidecar = JSON.parse(readFileSync(sidecarPath, 'utf8'));
  const rejected = sidecar.kind === 'real-photograph-composition' && Boolean(sidecar.stage);
  const restored = sidecar.kind === 'catalogue-photograph-as-supplied' && Boolean(sidecar.correction);
  if (!rejected && !restored) continue;
  if (sidecar.sources?.length !== 1 || !sidecar.sources[0].original || !sidecar.sources[0].sha256) {
    throw new Error(`Expected one documented source for ${filename}`);
  }

  const outputPath = join(imageDir, filename.slice(0, -'.json'.length));
  const guideSlug = /^\/guides\/([^/]+)\/ hero$/.exec(sidecar.usedFor ?? '')?.[1];
  if (!guideSlug) throw new Error(`Missing guide reference: ${filename}`);
  const guide = JSON.parse(readFileSync(join(root, 'content/guides', `${guideSlug}.json`), 'utf8'));
  const publicPath = `/images/editorial/guides/${filename.slice(0, -'.json'.length)}`;
  if (guide.heroImage?.src !== publicPath) throw new Error(`Guide cover drift: ${guideSlug}`);
  const sourceRelative = sidecar.sources[0].original.replaceAll('\\', '/');
  const sourcePath = resolve(root, sourceRelative);
  if (!sourcePath.startsWith(`${root}\\`) && !sourcePath.startsWith(`${root}/`)) {
    throw new Error(`Source outside repository: ${sourcePath}`);
  }
  const source = readFileSync(sourcePath);
  const sourceHash = sha256(source);
  if (sourceHash !== sidecar.sources[0].sha256) {
    throw new Error(`Source SHA-256 drift: ${sourceRelative}`);
  }
  if (restored && sha256(readFileSync(outputPath)) !== sourceHash) {
    throw new Error(`Restored guide image drift: ${filename}`);
  }
  entries.push({ filename, sidecarPath, outputPath, sourcePath, sourceRelative, sourceHash, sidecar, rejected });
}

if (entries.length !== 20) throw new Error(`Expected 20 rejected guide composites, found ${entries.length}`);
for (const entry of entries) {
  console.log(`${entry.filename.slice(0, -'.webp.json'.length)} <= ${entry.sourceRelative}`);
}

if (write) {
  for (const entry of entries) {
    if (!entry.rejected) continue;
    const rejectedHash = sha256(readFileSync(entry.outputPath));
    copyFileSync(entry.sourcePath, entry.outputPath);
    const corrected = {
      kind: 'catalogue-photograph-as-supplied',
      status: 'Truthful temporary guide image; premium dark-ground reshoot still required.',
      sources: entry.sidecar.sources,
      method: 'Copied byte-for-byte from the photographed catalogue source; no cutout, generated stage, added shadow, relighting, or product geometry edit.',
      scope: 'One photographed catalogue product. This image is not proof of a certification, dimension, installation, or separately orderable set.',
      usedFor: entry.sidecar.usedFor,
      sourceSha256: entry.sourceHash,
      rejectedCompositeSha256: rejectedHash,
      correction: '2026-09-24 client rejected the mismatched generated-stage composites.',
    };
    writeFileSync(entry.sidecarPath, `${JSON.stringify(corrected, null, 2)}\n`);
  }
  console.log(`RESTORED_REAL_SOURCE_PHOTOS ${entries.filter((entry) => entry.rejected).length}; VERIFIED ${entries.length}`);
} else {
  console.log(`DRY_RUN_REAL_SOURCE_PHOTOS ${entries.length}`);
}
