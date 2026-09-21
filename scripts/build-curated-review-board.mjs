import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const base='docs/design-references/2026-09-14-curated-hardware',legacy='docs/design-references/2026-09-09-professional-hardware-sets';
const jobs=JSON.parse(fs.readFileSync(legacy+'/manifest.json'));
const decisions=JSON.parse(fs.readFileSync(base+'/publication.json'));
const missing={
'04':'未有具体主匙实物配置的型号与钥匙层级证据；现有主匙填写表可使用，不能把普通锁芯照片冒充已配置主匙系统。',
'15':'已找到6068产品记录，面板330mm、SS304；仍无heroImage.src及图库。缺真实产品照片，不能替代为相似拉手。',
'16':'窄边铝合金锁体仍缺甲方指向的唯一型号。已有类目照片不能证明它就是询盘对应产品。',
'17':'90mm锁舌仍缺唯一型号。5831-90mm是锁具记录，不能据名字代替待确认的独立锁舌。'
};
const rows=jobs.items.map(item=>{
const chosen=decisions.filter(d=>d.itemId===item.id||(item.id==='11'&&d.itemId==='03'));
const source=item.id==='06'?['glass-door-patch-fitting-set']:item.id==='15'?['6068-mortise-lever-handle-lock']:item.slugs;
return {id:item.id,title:item.title,outcome:missing[item.id]?'需实物证据':chosen.length?'已有核验图像':'仅归档',scope:missing[item.id]||(['02','03','05','06'].includes(item.id)?'完成原厂照片或部件展示；不据此推定完整门配置、开孔尺寸或未知配套。':'真实照片及有来源的场景展示；不属于产品CAD。'),sources:source.map(slug=>{const p=JSON.parse(fs.readFileSync('content/products/'+slug+'.json'));return {slug,model:p.model,url:'https://cantonlock.com/products/'+p.categoryPath[0]+'/'+slug+'/',photo:p.heroImage?.src||null,specs:p.specs};}),assets:chosen};
});
fs.writeFileSync(base+'/twenty-item-review.json',JSON.stringify(rows,null,2)+'\n');
const esc=x=>String(x??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
const rel=file=>path.relative(path.resolve(base),path.resolve(file)).replaceAll('\\','/');
const cards=rows.map(r=>`<article><header><span>${r.id} / ${esc(r.outcome)}</span><h2>${esc(r.title)}</h2><p>${esc(r.scope)}</p></header>${r.assets.map(a=>{const original=jobs.items.flatMap(i=>i.assets).find(x=>path.parse(x.name).name===a.id);const file=a.file||legacy+'/'+original.file;const b=fs.readFileSync(file);if(a.sha256&&crypto.createHash('sha256').update(b).digest('hex')!==a.sha256)throw Error(a.id);return `<a href="${rel(file)}"><img src="${rel(file)}" loading="lazy" alt="${esc(a.id)}"></a><p>${esc(a.captionEn)}</p>`}).join('')}<details><summary>型号、原图与尺寸来源</summary>${r.sources.map(p=>`<p><a href="${p.url}">${esc(p.model)}</a></p>${p.photo?`<a href="${rel('public'+p.photo)}"><img class="source" src="${rel('public'+p.photo)}" loading="lazy" alt="${esc(p.model)} 原始照片"></a>`:'<p>未有产品照片</p>'}<pre>${esc(JSON.stringify(p.specs,null,2))}</pre>`).join('')}</details></article>`).join('');
const html=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HYDE 五金图片复核</title><style>body{margin:0;background:#f4f2ed;color:#242725;font:16px/1.65 system-ui,sans-serif}main{max-width:1400px;margin:auto;padding:40px 24px}h1{font-size:40px}article{margin:32px 0 64px;border-top:1px solid #aaa;padding-top:24px}article>img,article>a>img{display:block;width:100%;max-height:900px;object-fit:contain;background:#fff}.source{max-width:260px;max-height:260px;object-fit:contain}a{color:inherit}pre{white-space:pre-wrap;font-size:13px}header{max-width:900px}summary{cursor:pointer;padding:12px 0}span{font-size:13px;letter-spacing:1px}</style><main><header><span>HYDE / 2026-09-14</span><h1>真实产品，逐项核对。</h1><p>二十项清单与两张指定场景。图像只使用本厂实物照片；原图、型号及已发布规格可逐项展开。四项仍缺实物或唯一型号，未以相似产品填充。</p><p>这份文件用于设计复核。可编辑 Blender 文件与每张来源记录保存在同目录。场景不是可加工产品 CAD，单品展示不等于已确认套装。</p></header>${cards}</main></html>`;
fs.writeFileSync(base+'/review.html',html);
console.log(JSON.stringify({items:rows.length,imageItems:rows.filter(r=>r.assets.length).length,evidenceGaps:rows.filter(r=>r.outcome==='需实物证据').map(r=>r.id)}));
