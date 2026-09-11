import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const base='docs/design-references/2026-09-09-professional-hardware-sets';
const manifest=JSON.parse(await fs.readFile(path.join(base,'manifest.json'),'utf8'));
const output='public/images/product-studies';
await fs.mkdir(output,{recursive:true});
const entries=[];
for(const item of manifest.items)for(const asset of item.assets.filter(a=>!a.archiveOnly)) {
  const id=path.parse(asset.name).name;
  const input=await fs.readFile(path.join(base,asset.file));
  if(crypto.createHash('sha256').update(input).digest('hex')!==asset.sha256)throw Error('Image changed: '+id);
  for(const width of [720,1440])await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:88}).withXmp(`<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/" dc:source="Canton Hyland Product Finder; source-photo Blender composition ${id}; SHA256 ${asset.sha256}"/></rdf:RDF></x:xmpmeta>`).toFile(path.join(output,`${id}-${width}.webp`));
  entries.push({id,itemId:item.id,slugs:item.slugs,src:`/images/product-studies/${id}-1440.webp`,small:`/images/product-studies/${id}-720.webp`,width:asset.width,height:asset.height,kind:id.includes('stone')?'space':'selection'});
}
const leading=['564-warm-stone','310-cool-stone','01-source-307-components','00-real-source-selection'];
entries.sort((a,b)=>(leading.includes(a.id)?leading.indexOf(a.id):100)-(leading.includes(b.id)?leading.indexOf(b.id):100));
if(entries.length!==15)throw Error('Expected 15 reviewed images');
await fs.writeFile('src/data/generated/product-studies.json',JSON.stringify(entries,null,2)+'\n');
console.log(`Published ${entries.length} studies / ${entries.length*2} WebP assets`);
