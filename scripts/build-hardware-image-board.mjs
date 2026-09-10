import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

// Archive without editing image pixels. Re-running refuses changed source snapshots.
const root = process.cwd();
const base = path.join(root, 'docs/design-references/2026-09-09-professional-hardware-sets');
const config = JSON.parse(await fs.readFile(path.join(base, 'jobs.json'), 'utf8'));
if (process.argv.includes('--render-sources')) {
  for (const input of ['source-layout-input.json', ...[1,7,8,9,10,11,12,13,14,18,19,20].map(i => `source-input-${i}.json`)]) {
    const result = execFileSync(process.env.BLENDER_PATH || 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe', ['--background', '--python-exit-code', '1', '--python', path.join(root, 'scripts/blender/hardware-source-layout.py'), '--', path.join(base, input)], {encoding: 'utf8', maxBuffer: 8*1024*1024});
    if (!result.includes('SOURCE_LAYOUT_OK')) throw new Error(`Blender did not finish ${input}`);
    await fs.writeFile(path.join(base, input.replace('.json', '.log')), result);
  }
}
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
await fs.mkdir(path.join(base, 'references'), { recursive: true });
await fs.mkdir(path.join(base, 'images'), { recursive: true });
async function archive(source, relative) {
  const data = await fs.readFile(source);
  const target = path.join(base, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  try {
    const prior = await fs.readFile(target);
    if (hash(prior) !== hash(data)) throw new Error(`Source drift: ${relative}; use a new version`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await fs.writeFile(target, data);
  }
  const meta = await sharp(data).metadata();
  await sharp(data).raw().toBuffer();
  return { file: relative.replaceAll('\\', '/'), sha256: hash(data), width: meta.width, height: meta.height };
}
const products = {};
for (const slug of [...new Set(config.items.flatMap(item => item.slugs))]) {
  let data;
  try { data = await fs.readFile(path.join(root, 'content/products', slug + '.json')); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    products[slug] = { model: slug, url: 'https://cantonlock.com/product-finder/', specs: [], images: [], unavailable: true };
    continue;
  }
  const p = JSON.parse(data);
  const snapshot = path.join(base, 'references', slug + '.json');
  try {
    if (hash(await fs.readFile(snapshot)) !== hash(data)) throw new Error(`Product source drift: ${slug}`);
  } catch (error) { if (error.code !== 'ENOENT') throw error; await fs.writeFile(snapshot, data); }
  const images = [];
  for (const src of [...new Set([p.heroImage?.src, ...(p.gallery ?? []).map(g => g.src)].filter(Boolean))]) {
    images.push(await archive(path.join(root, 'public', src), 'references/' + path.basename(src)));
  }
  products[slug] = { model: p.model, url: `https://cantonlock.com/products/${p.categoryPath[0]}/${slug}/`, specs: p.specs, images };
}
const items = [];
for (const item of config.items) {
  const assets = [];
  for (const a of item.assets ?? []) assets.push({ ...a, ...await archive(a.source, 'images/' + a.name) });
  items.push({ ...item, assets });
}
const manifest = { version: 2, date: config.date, scope: 'Source-photo Blender layouts; all generative product drafts retired. Photo layouts are not product CAD or validated kits.', products, items };
await fs.writeFile(path.join(base, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const img = (asset, alt) => `<a href="${escape(asset.file)}" target="_blank"><img loading="lazy" src="${escape(asset.file)}" alt="${escape(alt)}" width="${asset.width}" height="${asset.height}"></a>`;
const figure = (a, title) => `<figure>${img(a,title)}<figcaption>${escape(a.qa)}${a.blend ? ' · <a href="'+escape(a.blend)+'">下载 Blender 文件</a>' : ''}</figcaption></figure>`;
const cards = items.map(item => {
  const current = item.assets.filter(a => !a.archiveOnly);
  const retired = item.assets.filter(a => a.archiveOnly);
  const sources = item.slugs.map(slug => {
    const p = products[slug];
    return `<section><h3><a href="${escape(p.url)}" target="_blank" rel="noreferrer">${escape(p.model)} · 产品页</a></h3><p>${escape(p.specs.map(s => s.label+': '+s.value+(s.unit?' '+s.unit:'')).join(' · ') || '未发布规格')}</p><div class="sources">${p.images.map(a => img(a,p.model+' 原图')).join('')}</div></section>`;
  }).join('');
  return `<article data-has-image="${current.length > 0}" id="item-${escape(item.id)}"><div class="caption"><span>${escape(item.id)}</span><h2>${escape(item.title)}</h2><b>${escape(item.state)}</b></div>${current.length ? '<div class="scenes">'+current.map(a=>figure(a,item.title)).join('')+'</div>' : '<p class="pending">本项尚无通过原图保真检查的版面。</p>'}<p>${escape(item.reason)}</p><details><summary>型号、规格与全部实物角度</summary>${sources}</details>${retired.length ? '<details><summary>已退回的旧稿 · 不用于产品展示</summary><p>以下留存仅用于追溯问题，原有候选评价不代表验收通过。现已全部退回。</p><div class="scenes">'+retired.map(a=>figure(a,item.title)).join('')+'</div></details>' : ''}</article>`;
}).join('');
const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HYDE · 真实五金场景审阅</title><style>*{box-sizing:border-box}body{margin:0;background:#eeeae3;color:#272724;font:16px/1.65 system-ui,sans-serif}header,main{max-width:1480px;margin:auto;padding:32px}header{padding-top:65px}h1{font-size:clamp(28px,4vw,54px);line-height:1.2;letter-spacing:-.03em;margin:14px 0}header p{max-width:850px}nav{display:flex;gap:12px;flex-wrap:wrap}button{background:transparent;border:1px solid #999184;border-radius:2px;padding:10px 18px;font:inherit;cursor:pointer}button[aria-pressed=true]{background:#282a26;color:white}.gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:32px}article{min-width:0;border-top:1px solid #aaa398;padding-top:16px}article:first-child{grid-column:1/-1}.caption{display:flex;align-items:baseline;gap:12px}.caption h2{font-size:22px;flex:1;margin:5px 0 16px}.caption b{font-size:12px;font-weight:500}.scenes{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}figure{margin:0}img{display:block;width:100%;height:auto}figcaption{font-size:13px;padding-top:8px;color:#5c584f}summary{cursor:pointer;padding:10px 0;border-top:1px solid #cac3b9}a{color:inherit}.sources{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.sources img{aspect-ratio:1;object-fit:contain;background:white}.pending{min-height:110px;background:#e3dfd6;padding:24px}p{font-size:14px}section{padding:10px 0}article[hidden]{display:none}footer{padding:32px;text-align:center;color:#686257}@media(max-width:720px){header,main{padding:20px}.gallery{grid-template-columns:1fr;gap:28px}.caption{flex-wrap:wrap}.sources{grid-template-columns:repeat(2,minmax(0,1fr))}}@media print{details{display:block}nav{display:none}}</style><header><small>HYDE / PRODUCT & MATERIAL STUDIES / ${escape(config.date)}</small><h1>真实五金，克制呈现。</h1><p>二十项作图清单与客户组合图的实物替代版面。主展示使用原厂照片，在 Blender 中制作纸板、石材和光照；产品不重画。组合是选型照片排版，不表示已确认套装或真实相对尺寸。旧生成稿均已退回并折叠存档。</p><nav><button data-filter="all" aria-pressed="true">全部</button><button data-filter="images" aria-pressed="false">已有原图版面</button><button data-filter="pending" aria-pressed="false">资料待补</button></nav></header><main class="gallery">${cards}</main><footer>原图仅复制归档，SHA-256 见 manifest.json。研究与设计规则见项目目标文件。未接入生产网站。</footer><script>document.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelectorAll('article').forEach(a=>{a.hidden=b.dataset.filter==='images'?a.dataset.hasImage!=='true':b.dataset.filter==='pending'?a.dataset.hasImage==='true':false})}));</script></html>`;
await fs.writeFile(path.join(base, 'review.html'), html);
console.log(JSON.stringify({ items: items.length, products: Object.keys(products).length, scenes: items.reduce((n,x)=>n+x.assets.length,0), sourceImages: Object.values(products).reduce((n,p)=>n+p.images.length,0), fullyDecoded: true }));
