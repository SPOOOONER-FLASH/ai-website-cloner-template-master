import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

// Read-only acceptance for the retained source-photo studies and withheld drawings.
// node scripts/audit-hyde-product-public.mjs --out tmp/codex-product-public
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error(`Missing ${name} value`);
  return args[index + 1];
};
const sourceRoot = process.cwd();
const out = path.resolve(option('--out', 'tmp/codex-product-public'));
const base = new URL(option('--base', 'https://cantonlock.com')).origin;
const studies = JSON.parse(await readFile(path.join(sourceRoot, 'src/data/generated/product-studies.json'), 'utf8'));
const selections = studies.filter(s => s.kind === 'selection');
if (selections.length !== 13) throw new Error(`Expected 13 source-photo compositions; got ${selections.length}`);
await mkdir(out, { recursive: true });
const htmlDir = path.join(out, 'html');
await mkdir(htmlDir, { recursive: true });
const slugs = ['100', '102', '104', '106', '107'].map(model => `${model}-glass-door-handle`);
const jobs = ['', '/es', '/pt'].flatMap(prefix => [
  { type: 'studies', prefix, pathname: `${prefix}/product-studies/` },
  ...slugs.map(slug => ({ type: 'suppressed', prefix, slug, pathname: `${prefix}/products/glass-door-accessories/${slug}/` })),
  { type: 'control', prefix, slug: '001-panic-exit-device-trim', pathname: `${prefix}/products/panic-exit-devices/001-panic-exit-device-trim/` },
]);
const results = [];
const startedAt = new Date().toISOString();
async function page(job) {
  const url = `${base}${job.pathname}`;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000), redirect: 'follow' });
    const html = await response.text();
    const main = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || '';
    const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '';
    const imgTags = [...main.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
    const sources = imgTags.map(tag => tag.match(/\bsrc="([^"]+)"/)?.[1]).filter(Boolean);
    const result = {
      ...job, url, finalUrl: response.url, checkedAt: new Date().toISOString(),
      status: response.status, contentType: response.headers.get('content-type'), title,
      mainPresent: Boolean(main), drawingHeadingPresent: main.includes('id="product-drawing-heading"'),
      drawingImagePresent: sources.includes(`/images/drawings/${job.slug}.svg`),
    };
    if (job.type === 'studies') {
      result.sourceStudyRefs = selections.map(s => ({ id: s.id, src: s.src, present: sources.includes(s.src) }));
      result.sourceStudyCount = result.sourceStudyRefs.filter(s => s.present).length;
      result.totalStudyImages = sources.filter(s => s.startsWith('/images/product-studies/')).length;
      result.pass = response.ok && Boolean(main) && result.sourceStudyCount === 13;
    } else {
      result.pass = response.ok && Boolean(main) && (job.type === 'control'
        ? result.drawingHeadingPresent && result.drawingImagePresent
        : !result.drawingHeadingPresent && !result.drawingImagePresent);
    }
    const filename = job.pathname.replace(/^\//, '').replaceAll('/', '__') + '.html';
    await writeFile(path.join(htmlDir, filename), html, 'utf8');
    result.evidenceHtml = path.join(htmlDir, filename);
    results.push(result);
  } catch (error) {
    results.push({ ...job, url, checkedAt: new Date().toISOString(), pass: false, error: String(error) });
  }
}
let next = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (next < jobs.length) await page(jobs[next++]);
}));
results.sort((a, b) => a.pathname.localeCompare(b.pathname));
const assets = [];
for (const asset of [...new Set(selections.flatMap(s => [s.src, s.small]))]) {
  try {
    const response = await fetch(`${base}${asset}`, { method: 'HEAD', signal: AbortSignal.timeout(30000), redirect: 'follow' });
    const contentType = response.headers.get('content-type');
    const length = Number(response.headers.get('content-length'));
    assets.push({ url: `${base}${asset}`, status: response.status, contentType, length,
      pass: response.ok && contentType?.includes('image/webp') && length > 0 });
  } catch (error) {
    assets.push({ url: `${base}${asset}`, pass: false, error: String(error) });
  }
}
const report = { startedAt, finishedAt: new Date().toISOString(), sourceRoot,
  requests: 'Normal public URLs only. No form posts, cache busters or Cloudflare operations. Image resources checked by HEAD without downloading media.',
  sourceSelectionCount: selections.length, pagesPassed: results.filter(r => r.pass).length,
  pagesTotal: results.length, assetsPassed: assets.filter(r => r.pass).length,
  assetsTotal: assets.length, results, assets };
await writeFile(path.join(out, 'audit.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ pagesPassed: report.pagesPassed, pagesTotal: report.pagesTotal,
  assetsPassed: report.assetsPassed, assetsTotal: report.assetsTotal, evidence: path.join(out, 'audit.json') }));
if (report.pagesPassed !== report.pagesTotal || report.assetsPassed !== report.assetsTotal) process.exitCode = 1;
