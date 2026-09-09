/** Inventory the interrupted task and build a source-photo comparison. No image pixels are edited. */
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'docs/design-references/2026-09-09-111-recovery');
const previous = resolve(root, 'docs/design-references/2026-09-07-home-stills');
const sha = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
const rel = (file) => relative(root, file).replaceAll('\\', '/');
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
mkdirSync(resolve(output, 'references'), { recursive: true });
const jobs = [
  { slug: 'lc04-85-60-lock-case', source: 'lc04-85-60-lock-case-5.webp', image: '01-stone-lc04-draft.png', title: 'LC04 · 石材桌面', qa: '四圆柱锁舌、上二下三固定孔、面板全长已目视对照。细小冲压轮廓与反光并非逐像素锁定，保留为候选。' },
  { slug: 'bl028-brass-and-steel-hinges', source: 'bl028-brass-and-steel-hinges.webp', image: '02-box-bl028-draft.png', title: 'BL028 · 浅色样品盒', qa: '八孔交错关系及轴节布局已目视对照。采用单款产品避免虚构混装套装。孔径与边缘倒角不能从生成图证明。' },
  { slug: '9004s-stainless-steel-handle', source: '9004s-stainless-steel-handle.webp', image: '03-wood-9004s-candidate.png', title: '9004S · 木纹样品板', qa: '保留原图直柄、内嵌方底座和上方紧定螺钉；已修正钥匙孔中的白底残留。样品陈列不证明门锁安装配套关系。' },
];
const catalogue = [];
for (const job of jobs) {
  const product = JSON.parse(readFileSync(resolve(root, `content/products/${job.slug}.json`), 'utf8'));
  job.url = `https://cantonlock.com/products/${product.categoryPath[0]}/${product.slug}/`;
  const images = [product.heroImage, ...product.gallery];
  const records = [];
  for (const entry of images) {
    const file = resolve(root, 'public' + entry.src);
    const name = entry.src.split('/').at(-1);
    const snapshot = resolve(output, 'references', name);
    if (!existsSync(snapshot)) copyFileSync(file, snapshot);
    if (sha(file) !== sha(snapshot)) throw Error(`Catalogue source drift: ${entry.src}; keep old snapshot and review explicitly.`);
    const metadata = await sharp(snapshot).metadata();
    records.push({ source: entry.src, snapshot: rel(snapshot), sha256: sha(snapshot), width: metadata.width, height: metadata.height });
  }
  const candidate = resolve(output, job.image);
  const metadata = await sharp(candidate).metadata();
  await sharp(candidate).stats(); // Decode complete delivered image, not just the header.
  catalogue.push({ model: product.model, url: job.url, specs: product.specs, images: records,
    candidate: { file: rel(candidate), sha256: sha(candidate), width: metadata.width, height: metadata.height, releaseStatus: 'private-review-candidate', qa: job.qa } });
}
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = resolve(directory, entry.name);
    return entry.isDirectory() ? files(file) : /\.blend1$/.test(file) ? [] : [file];
  });
}
const recovered = [];
for (const file of files(previous)) {
  if (/\.(png|webp)$/.test(file)) await sharp(file).stats();
  recovered.push({ file: rel(file), bytes: statSync(file).size, sha256: sha(file), releaseStatus: file.includes('models-9004s') ? 'incomplete-exterior-study' : 'historical-private-draft' });
}
const manifest = { task: '111', threadId: '01a075c9-7e36-7390-bfa9-e180a0af8a3d', sourceOfTruth: 'https://cantonlock.com/product-finder/',
  userDecision: '2026-09-09: no factory CAD held by client; use the Product Finder gallery as the authority for image content.',
  imageMethod: 'Built-in imagegen edits of the saved real product photographs. No claim of pixel-perfect preservation or manufacturing geometry.',
  recovered, catalogue };
writeFileSync(resolve(output, 'inventory.json'), JSON.stringify(manifest, null, 2) + '\n');
const rows = jobs.map((job) => `<section><h2>${escape(job.title)}</h2><p>${escape(job.qa)} <a href="${job.url}">官网全部角度与规格</a></p><div class="pair"><figure><img src="references/${job.source}" alt="官网原图"><figcaption>官网原图 · 未加工快照</figcaption></figure><figure><img src="${job.image}" alt="场景编辑候选"><figcaption>新场景候选 · 尚未替换官网</figcaption></figure></div></section>`).join('\n');
const gallery = catalogue.map((product) => `<details><summary>${escape(product.model)} · ${product.images.length} 张源图</summary><div class="gallery">${product.images.map((entry) => `<a href="${escape(relative(output, resolve(root, entry.snapshot)).replaceAll('\\', '/'))}"><img loading="lazy" src="${escape(relative(output, resolve(root, entry.snapshot)).replaceAll('\\', '/'))}" alt="${escape(product.model)} 图库"></a>`).join('')}</div></details>`).join('\n');
writeFileSync(resolve(output, 'review.html'), `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>111 接手成果 · 原图对照</title><style>body{margin:0;background:#f5f3ee;color:#222;font:16px/1.65 Arial,sans-serif}main{max-width:1400px;margin:auto;padding:32px 24px}h1{font-size:32px}h2{font-size:22px}section{border-top:1px solid #ccc;margin-top:36px;padding-top:16px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:20px}figure{margin:0}img{width:100%;display:block}figcaption{padding:8px 0;color:#555}a{color:inherit}p{max-width:1000px}summary{cursor:pointer;padding:16px 0}.gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}@media(max-width:700px){.pair{grid-template-columns:1fr}.gallery{grid-template-columns:repeat(2,1fr)}}</style><main><h1>111 接手成果：三种场景，逐张对照原图</h1><p>2026-09-09。产品图片以 <a href="https://cantonlock.com/product-finder/">Product Finder</a> 为准。以下是实物照片的场景编辑候选，未上官网；不是尺寸验证图、制造 CAD 或套装证明。</p><p>旧的多产品场景保留为不合格迭代记录。新图用单一型号简化陈列，仍须保留与原图的并排对照，不能标作未经编辑的实拍。</p>${rows}<h2>官网全角度快照</h2>${gallery}<h2>模型进度</h2><p>9004S 外壳已重新通过 Blender 尺寸及闭合网格校验。LC04 与 BL028 的完整精细模型仍未完成：照片明确外观，不提供全部孔中心、轴节和内部尺寸。客户已确认没有额外 CAD，不再把重复索要文件作为下一步。</p><p><a href="../2026-09-07-home-stills/models-9004s/9004s-orthographic.svg">9004S 正交尺寸图</a> · <a href="../2026-09-07-home-stills/models-9004s/9004s-published-shell.blend">Blender 外壳文件</a> · <a href="inventory.json">全部源图与遗留成果校验清单</a></p></main></html>\n`);
console.log(`Recovered ${recovered.length} artifacts; decoded 3 candidates and ${catalogue.reduce((n, p) => n + p.images.length, 0)} source images. Saved inventory.json and review.html.`);
