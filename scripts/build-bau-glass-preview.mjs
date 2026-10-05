import { readFile, writeFile, mkdir, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import postcss from 'postcss';
import { transform } from 'lightningcss';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
function option(key, fallback) {
  const index = args.indexOf(key);
  if (index < 0) return fallback;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${key}`);
  return path.resolve(value);
}
const output = option('--output', path.join(root, 'docs/design-references/2026-10-04-bau-glass.html'));
const inline = option('--inline-output', null);
const filename = path.join(root, 'src/components/site/BauEntry.module.css');
const source = (await readFile(filename, 'utf8')).replace(/\r\n/g, '\n');
const compiled = transform({ filename, code: Buffer.from(source), cssModules: true });
for (const name of ['band', 'bandInner', 'bandFacts', 'primaryLink', 'secondaryLink']) {
  if (!compiled.exports?.[name]) throw new Error(`Missing CSS module class: ${name}`);
}
const stylesheet = postcss.parse(source, { from: filename });
// Reference calculation for this band's documented light-theme tokens over black.
// Read the fallback colors and blend weights from the CSS being previewed.
const tokenRgb = (name) => {
  const match = source.match(new RegExp(`${name}, (#[a-fA-F0-9]{3,6})`));
  if (!match) throw new Error(`Missing fallback color for ${name}`);
  let hex = match[1].slice(1);
  if (hex.length === 3) hex = [...hex].map((digit) => digit + digit).join('');
  return [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
};
const mix = (a, b, weight) => a.map((channel, index) => channel * weight + b[index] * (1 - weight));
const luminance = (rgb) => rgb.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
  .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
const mixWeight = Number(source.match(/--color-ink-secondary, #[a-fA-F0-9]+\) (\d+)%/)?.[1]) / 100;
const opacity = Number(source.match(/--color-surface-alt, #[a-fA-F0-9]+\) (\d+)%/)?.[1]) / 100;
if (!Number.isFinite(mixWeight) || !Number.isFinite(opacity)) throw new Error('Missing glass blend weights');
const secondary = mix(tokenRgb('--color-ink-secondary'), tokenRgb('--color-ink'), mixWeight);
const background = mix(tokenRgb('--color-surface-alt'), [0, 0, 0], opacity);
const referenceContrast = (luminance(background) + 0.05) / (luminance(secondary) + 0.05);
if (referenceContrast < 4.5) throw new Error(`Light glass text contrast below 4.5:1: ${referenceContrast}`);
stylesheet.walkRules((rule) => {
  rule.selectors = rule.selectors.map((selector) => `#hyde-bau-glass ${selector}`);
});
let html = (await readFile(path.join(root, 'docs/design-references/2026-10-04-bau-glass.template.html'), 'utf8')).replace(/\r\n/g, '\n');
if (!html.includes('__BAND_CSS__')) throw new Error('Missing source CSS token');
html = html.replace('__BAND_CSS__', stylesheet.toString());
if (/<(?:html|head|body)(?:\s|>)|<!doctype/i.test(html)) throw new Error('Expected an inline fragment');
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
console.log(JSON.stringify({ output, inline, bytes: Buffer.byteLength(html), cssModulesCompiled: true, referenceLightContrastOverBlack: Number(referenceContrast.toFixed(2)) }, null, 2));
