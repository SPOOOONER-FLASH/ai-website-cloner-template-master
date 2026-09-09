/** Archive source photographs and generated drafts without changing any image pixels. */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, relative } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dest = resolve(root, 'docs/design-references/2026-09-07-home-stills/scene-product-replacements');
const refs = resolve(dest, 'references');
mkdirSync(refs, { recursive: true });
const originals = 'C:/Users/johns/.codex/generated_images/01a0570e-5f9e-7ea1-9127-cf4f6d0adb76/New folder (2)';
const sources = [
  ['stone-original.png', `${originals}/exec-4eea0ca8-d56f-4ebb-a675-7facf87d6347.png`],
  ['box-original.png', `${originals}/exec-4e313ee4-6d40-4122-ba32-894ed2861d44.png`],
  ['wood-original.png', `${originals}/exec-4e0ec391-de79-46e0-ad61-c6494b8dab75.png`],
  ['lc04-reference.webp', resolve(root, 'public/images/products/lc04-85-60-lock-case.webp')],
  ['9004s-reference.webp', resolve(root, 'public/images/products/9004s-stainless-steel-handle.webp')],
  ['client-hinge-reference.png', resolve(root, 'docs/design-references/client-home-20260908/black-hinge-original.png')],
];
const sha = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const records = sources.map(([name, source]) => {
  const target = resolve(refs, name);
  // A source snapshot must not drift when the catalogue later changes.
  if (!existsSync(target)) copyFileSync(source, target);
  return { originalSource: source, snapshot: relative(root, target).replaceAll('\\', '/'), sha256: sha(target) };
});
const drafts = ['01-stone-selection-scene.png', '02-sample-box.png', '03-wood-display.png']
  .filter(name => existsSync(resolve(dest, name)))
  .map(name => ({ file: name, sha256: sha(resolve(dest, name)), releaseStatus: 'draft-only' }));
writeFileSync(resolve(dest, 'archive.json'), `${JSON.stringify({
  method: 'Built-in imagegen photographic edits; archived without pixel processing',
  generatedImagesAreNotCAD: true,
  sources: records, drafts,
  note: 'Catalogue snapshots captured 2026-09-08 for the box and wood retries. Earlier stone generation used mutable catalogue paths; its exact prior source bytes are not asserted.',
}, null, 2)}\n`);
console.log(`Archived ${records.length} source snapshots and ${drafts.length} scene drafts.`);
