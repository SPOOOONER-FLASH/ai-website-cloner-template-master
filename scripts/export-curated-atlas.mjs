import fs from 'node:fs';
import sharp from 'sharp';
const base='docs/design-references/2026-09-14-curated-hardware';
const id='curated-home-catalogue';
for(const width of [480,960,1440,1800]){
  const file=width===1800?`public/images/editorial/${id}.webp`:`public/images/editorial/responsive/${id}-${width}w.webp`;
  await sharp(`${base}/${id}.png`).resize(width).webp({quality:88}).toFile(file);
}
const cfg=JSON.parse(fs.readFileSync(`${base}/${id}.json`));
fs.writeFileSync(`public/images/editorial/${id}.webp.json`,JSON.stringify({kind:'real-photograph-composition',sources:cfg.photos,scope:'Nine separate catalog photographs; no installation scale or kit compatibility claim. Native Blender backdrop and mounts only.',scene:`${base}/${id}.blend`},null,2)+'\n');
