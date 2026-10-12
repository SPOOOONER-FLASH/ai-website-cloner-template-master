import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const base=path.dirname(fileURLToPath(import.meta.url));
const selection=JSON.parse(await fs.readFile(path.join(base,'selection.json'),'utf8'));
const review=JSON.parse(await fs.readFile(path.join(base,'review.json'),'utf8').catch(e=>{if(e.code==='ENOENT')return '{}';throw e;}));
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const entries=[];
assert.equal(selection.categories.length,17);
for(const category of selection.categories){
  assert.equal(category.items.length,2);
  for(const [model,file] of category.items){
    if(!file){entries.push({model,category:category.name,status:'SOURCE_PENDING',reason:category.gap});continue;}
    const resolved=path.resolve(base,file);
    assert.ok(resolved.startsWith(base+path.sep),'Asset must remain within this pack');
    const bytes=await fs.readFile(resolved), metadata=await sharp(bytes).metadata();
    const hash=crypto.createHash('sha256').update(bytes).digest('hex');
    const qa=review[model];
    if(qa?.sha256)assert.equal(hash,qa.sha256,`${model} changed after visual review`);
    entries.push({model,category:category.name,file,width:metadata.width,height:metadata.height,sha256:hash,status:qa?.status??'DRAFT',reason:qa?.reason??'Visual review pending'});
  }
}
assert.equal(new Set(entries.map(e=>e.model)).size,34,'Count models, not colour/view variants');
await fs.mkdir(path.join(base,'overview'),{recursive:true});
const actual=entries.filter(e=>e.file);
const featured=['564 MB','140','B024','JU-061','D101 SS','Single oval cylinder'];
const featuredLayers=[];
for(const [n,model] of featured.entries()){
  const item=entries.find(e=>e.model===model);
  assert.equal(item.status,'PREVIEW');
  const x=(n%3)*512,y=Math.floor(n/3)*550;
  featuredLayers.push({input:await sharp(path.join(base,item.file)).resize(500,500,{fit:'contain'}).png().toBuffer(),left:x,top:y});
  featuredLayers.push({input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="500" height="42"><text x="10" y="29" font-size="20" font-family="sans-serif">${escape(model)} · PREVIEW</text></svg>`),left:x,top:y+500});
}
await sharp({create:{width:1536,height:1100,channels:3,background:'#f2f0ec'}}).composite(featuredLayers).jpeg({quality:95}).toFile(path.join(base,'overview/selected-six.jpg'));
const sheets=[];
for(let i=0;i<actual.length;i+=9){
  const batch=actual.slice(i,i+9),layers=[];
  for(let n=0;n<batch.length;n++){
    const item=batch[n],x=(n%3)*344,y=Math.floor(n/3)*390;
    const thumb=await sharp(path.join(base,item.file)).resize(336,336,{fit:'contain'}).png().toBuffer();
    layers.push({input:thumb,left:x,top:y});
    const label=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="336" height="46"><text x="4" y="18" font-size="16" font-family="sans-serif">${escape(item.model)}</text><text x="4" y="37" font-size="12" font-family="sans-serif" fill="#666">${escape(item.status)}</text></svg>`);
    layers.push({input:label,left:x,top:y+336});
  }
  const name=`overview/contact-${Math.floor(i/9)+1}.jpg`;
  await sharp({create:{width:1032,height:Math.ceil(batch.length/3)*390,channels:3,background:'#f2f0ec'}}).composite(layers).jpeg({quality:94}).toFile(path.join(base,name));
  sheets.push(name);
}
const counts=Object.fromEntries([...new Set(entries.map(e=>e.status))].map(s=>[s,entries.filter(e=>e.status===s).length]));
await fs.writeFile(path.join(base,'inventory.json'),JSON.stringify({target:34,produced:actual.length,counts,sheets,entries},null,2)+'\n');
const card=e=>`<article><h2>${escape(e.category)} · ${escape(e.model)}</h2><p class="status">${escape(e.status)}</p>${e.file?`<a href="${escape(e.file)}"><img loading="lazy" src="${escape(e.file)}" alt="${escape(e.model)} colour photographic study"></a>`:''}<p>${escape(e.reason)}</p></article>`;
const cards=entries.filter(e=>e.status==='PREVIEW').map(card).join('\n');
const held=entries.filter(e=>e.status!=='PREVIEW').map(card).join('\n');
await fs.writeFile(path.join(base,'index.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HYDE 彩色产品摄影样片</title><style>body{margin:32px auto;max-width:1400px;padding:0 24px;background:#f2f0ec;color:#222;font:16px/1.6 system-ui}h1{font-size:32px}main,.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:40px 24px}h2{font-size:18px;margin-bottom:0}img{display:block;width:100%;height:auto}.status{font-size:13px;color:#735523}article p{max-width:65ch}@media(max-width:650px){main,.grid{grid-template-columns:1fr}}</style><h1>HYDE 彩色产品摄影样片</h1><p>17 类 / 34 个位置，已制作 ${actual.length} 款。真实产品照片；仅摄影背景由 AI 生成。PREVIEW 表示可以评颜色与构图，HELD 表示已发现问题、不能发布。全部尚未替换线上图片。</p><main>${cards}</main><details><summary>待修和缺素材（不能发布）</summary><div class="grid">${held}</div></details></html>`);
console.log(JSON.stringify({produced:actual.length,counts,sheets}));
