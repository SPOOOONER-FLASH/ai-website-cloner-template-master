import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const [directory]=process.argv.slice(2);if(!directory)throw Error('Usage: node scripts/build-kanee-fidelity-preview.mjs pack-directory');
const root=path.resolve(directory),plates=JSON.parse(await fs.readFile(path.join(root,'masters-v2/provenance.json'),'utf8'));
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const layers=[];
for(let i=0;i<plates.length;i++){
  const left=(i%4)*400,top=Math.floor(i/4)*330;
  layers.push({input:await sharp(path.join(root,'masters-v2',plates[i].master)).resize(392,294,{fit:'contain',background:'#ddd9d2'}).jpeg().toBuffer(),left,top});
  layers.push({input:Buffer.from(`<svg width="392" height="30"><text x="4" y="22" font-family="Arial" font-size="14" fill="#222">${escape(plates[i].id)}</text></svg>`),left,top:top+294});
}
await sharp({create:{width:1600,height:1650,channels:3,background:'#ddd9d2'}}).composite(layers).jpeg({quality:90}).toFile(path.join(root,'overview.jpg'));
const cards=plates.map(p=>`<figure><a href="masters-v2/${escape(p.master)}"><img loading="lazy" src="masters-v2/${escape(p.web)}" alt="Real ${escape(p.model)} photographic study"></a><figcaption>${escape(p.id)} · ${escape(p.model)}</figcaption></figure>`).join('\n');
await fs.writeFile(path.join(root,'preview.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HYDE 真实产品摄影候选</title><style>body{margin:0;padding:32px;font:16px system-ui;background:#ece9e3;color:#222}h1{font-size:28px}p{max-width:75ch;line-height:1.6}video{width:100%;max-width:1000px;display:block;background:#333}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:24px;margin-top:36px}figure{margin:0}img{width:100%;height:320px;object-fit:contain}figcaption{padding-top:8px;font-size:13px}a{color:inherit}@media(max-width:450px){body{padding:16px}img{height:auto}}</style><h1>二十张候选图 · 八个真实型号</h1><p>原生 PSD 产品像素 + 独立摄影场。供审阅与 Claude 挑选，不代表已经上线或甲方批准。视频为 18 秒二维真实照片运镜，不是三维旋转。</p><video controls muted playsinline preload="metadata" poster="motion/stills/45-bnik-motion.webp" src="motion/hyde-real-product-motion-trial.mp4"></video><main>${cards}</main></html>`);
console.log('Twenty-image overview and local review gallery generated.');
