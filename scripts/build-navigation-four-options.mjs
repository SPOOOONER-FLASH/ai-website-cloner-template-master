import { readFile, writeFile, mkdir, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
function option(key, fallback) {
  const index = args.indexOf(key);
  if (index < 0) return fallback;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${key}`);
  return path.resolve(value);
}
const assetRoot = option('--asset-root', path.join(root, 'public'));
const output = option('--output', path.join(root, 'docs/design-references/2026-10-04-navigation-four-options.html'));
const inline = option('--inline-output', null);
const assets = [
  ['__LOGO_LIGHT__', 'images/brand/hyde/hyde-logo-horizontal-black.svg', 'image/svg+xml'],
  ['__LOGO_DARK__', 'images/brand/hyde/hyde-logo-horizontal-white.svg', 'image/svg+xml'],
  ['__LEVER_PHOTO__', 'images/editorial/hyde-real-lever-plate.webp', 'image/webp'],
];
let html = await readFile(path.join(root, 'docs/design-references/2026-10-04-navigation-four-options.template.html'), 'utf8');
for (const [token, asset, mime] of assets) {
  if (!html.includes(token)) throw new Error(`Missing ${token}`);
  const bytes = await readFile(path.join(assetRoot, asset));
  html = html.replaceAll(token, `data:${mime};base64,${bytes.toString('base64')}`);
}
if (/<(?:html|head|body)(?:\s|>)|<!doctype/i.test(html)) throw new Error('Expected an inline fragment');
if ((html.match(/<section data-variant=/g) ?? []).length !== 4) throw new Error('Expected four concepts');
if (Buffer.byteLength(html) >= 1_000_000) throw new Error('Fragment exceeds 1 MB');
for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, html, 'utf8');
if (inline) {
  await mkdir(path.dirname(inline), { recursive: true });
  let directory = path.dirname(inline);
  while (true) {
    const stat = await lstat(directory);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`Linked inline parent: ${directory}`);
    const parent = path.dirname(directory);
    if (parent === directory) break;
    directory = parent;
  }
  await writeFile(inline, html, 'utf8');
}
console.log(JSON.stringify({ output, inline, bytes: Buffer.byteLength(html), variants: 4 }, null, 2));
