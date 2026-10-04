import { readFile, writeFile, mkdir, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argumentsList = process.argv.slice(2);
function option(name, fallback) {
  const index = argumentsList.indexOf(name);
  if (index < 0) return fallback;
  const value = argumentsList[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${name}`);
  return path.resolve(value);
}
const assetRoot = option('--asset-root', path.join(repositoryRoot, 'public'));
const outputPath = option('--output', path.join(repositoryRoot, 'docs/design-references/2026-10-04-homepage-motion-options.html'));
const inlinePath = option('--inline-output', null);
const templatePath = path.join(repositoryRoot, 'docs/design-references/2026-10-04-homepage-motion-options.template.html');
const assets = {
  LEVER: 'images/editorial/hyde-real-lever-plate.webp',
  DARK_SET: 'images/editorial/hyde-real-lever-set-dark.webp',
  BLACK_SET: 'images/products/black-tubular-lever-lock-set.webp',
  FACTORY: 'images/company/factory-cnc-machining.webp',
};
let fragment = await readFile(templatePath, 'utf8');
for (const [key, relativePath] of Object.entries(assets)) {
  const bytes = await readFile(path.join(assetRoot, relativePath));
  const token = `__ASSET_${key}__`;
  if (!fragment.includes(token)) throw new Error(`Missing template token ${token}`);
  fragment = fragment.replaceAll(token, `data:image/webp;base64,${bytes.toString('base64')}`);
}
if (/__ASSET_[A-Z_]+__/.test(fragment)) throw new Error('Unresolved image token');
if (/<!doctype\s|<\s*(?:html|head|body)(?:\s|>)/i.test(fragment)) throw new Error('Expected an inline fragment');
const bytes = Buffer.byteLength(fragment);
if (bytes >= 1_000_000) throw new Error(`Fragment too large: ${bytes} bytes`);
if ((fragment.match(/<section data-variant=/g) ?? []).length !== 3) throw new Error('Expected three homepage alternatives');
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, fragment, 'utf8');
if (inlinePath) {
  await mkdir(path.dirname(inlinePath), { recursive: true });
  let directory = path.dirname(inlinePath);
  while (true) {
    const stat = await lstat(directory);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`Inline directory contains a link: ${directory}`);
    const parent = path.dirname(directory);
    if (parent === directory) break;
    directory = parent;
  }
  await writeFile(inlinePath, fragment, 'utf8');
}
console.log(JSON.stringify({ outputPath, inlinePath, bytes, assets: Object.values(assets) }, null, 2));
