import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
const base='docs/design-references/2026-09-15-studio';
const selections=[
  {id:'311-warm-grey',slug:'311-panic-exit-device',en:'311 in a warm grey studio setting. Product photograph with an edited background.',es:'311 sobre un fondo de estudio gris cálido. Fotografía del producto con fondo editado.'},
  {id:'9001-warm-stone',slug:'9001-stainless-steel-handle',en:'9001 lever and escutcheon on a pale stone backdrop. Product photograph with an edited background.',es:'Manija y bocallave 9001 sobre un fondo de piedra clara. Fotografía del producto con fondo editado.'},
];
const entries=[];
for(const item of selections){
  const input=fs.readFileSync(`${base}/${item.id}.png`);
  const metadata=await sharp(input).metadata();
  for(const width of [720,1440])await sharp(input).resize({width}).webp({quality:88}).toFile(`public/images/product-studies/studio-${item.id}-${width}.webp`);
  entries.push({id:`studio-${item.id}`,itemId:`studio-${item.id}`,slugs:[item.slug],src:`/images/product-studies/studio-${item.id}-1440.webp`,small:`/images/product-studies/studio-${item.id}-720.webp`,width:metadata.width,height:metadata.height,kind:'source-photo-background-edit',captionEn:item.en,captionEs:item.es});
}
fs.writeFileSync('src/data/studio-studies.json',JSON.stringify(entries,null,2)+'\n');
fs.writeFileSync(`${base}/manifest.json`,JSON.stringify({method:'Built-in image_gen background editing; visually compared against catalogue originals. Not byte-identical foregrounds.',selected:selections.map(x=>({...x,source:`public/images/products/${x.slug}.webp`,editedSha256:crypto.createHash('sha256').update(fs.readFileSync(`${base}/${x.id}.png`)).digest('hex')})),rejected:['307 dark versions: invented or uncertain housing details','70SN slate: changed key detail','Full atlas edit: other foreground products were regenerated'],overview:'Native EditorialAtlas uses the unchanged branded 311 catalogue photograph; all other original atlas subjects retained.'},null,2)+'\n');
console.log('Published two reviewed background edits and their bilingual gallery entries.');
