import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const base='docs/design-references/2026-09-09-professional-hardware-sets';
const review='docs/design-references/2026-09-14-curated-hardware';
const manifest=JSON.parse(await fs.readFile(path.join(base,'manifest.json'),'utf8'));
const selection=JSON.parse(await fs.readFile(path.join(review,'publication.json'),'utf8'));
const output='public/images/product-studies';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
await fs.mkdir(output,{recursive:true});
const entries=[];
for(const selected of selection){
  if(selected.publish===false)continue;
  if(selected.reviewed!==true)throw Error('Unreviewed publication: '+selected.id);
  const legacy=manifest.items.flatMap(item=>item.assets.map(asset=>({item,asset}))).find(x=>path.parse(x.asset.name).name===selected.id);
  if(legacy?.asset.archiveOnly)throw Error('Rejected legacy asset: '+selected.id);
  const file=selected.file||path.join(base,legacy.asset.file);
  const expected=selected.sha256||legacy.asset.sha256;
  const input=await fs.readFile(file);if(hash(input)!==expected)throw Error('Image changed: '+selected.id);
  const slugs=selected.slugs||legacy.item.slugs;
  for(const slug of slugs){const p=JSON.parse(await fs.readFile('content/products/'+slug+'.json','utf8'));if(!p.heroImage?.src||(p.sites&&!p.sites.includes('hyde')))throw Error('Unpublished catalogue model: '+slug);}
  const meta=await sharp(input).metadata();await sharp(input).raw().toBuffer();
  for(const width of [720,1440])await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:88}).toFile(path.join(output,`${selected.id}-${width}.webp`));
  entries.push({id:selected.id,itemId:selected.itemId||legacy.item.id,slugs,src:`/images/product-studies/${selected.id}-1440.webp`,small:`/images/product-studies/${selected.id}-720.webp`,width:meta.width,height:meta.height,kind:selected.kind||(selected.id.includes('stone')?'space':'selection'),captionEn:selected.captionEn||'',captionEs:selected.captionEs||''});
}
if(new Set(entries.map(x=>x.id)).size!==entries.length)throw Error('Duplicate gallery entry');
await fs.writeFile('src/data/generated/product-studies.json',JSON.stringify(entries,null,2)+'\n');
console.log(`Published ${entries.length} reviewed studies / ${entries.length*2} WebP assets`);
