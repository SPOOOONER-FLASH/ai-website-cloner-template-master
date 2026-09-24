import fs from 'node:fs/promises';
import sharp from 'sharp';
import crypto from 'node:crypto';
const source='docs/design-references/2026-09-21-guides-visuals/reference-desk-source.png';
const input=await fs.readFile(source);
for(const width of [960,1600]) await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:84}).toFile(`public/images/editorial/guides-reference-desk-${width}.webp`);
await fs.writeFile('docs/design-references/2026-09-21-guides-visuals/provenance.json',JSON.stringify({source,sha256:crypto.createHash('sha256').update(input).digest('hex'),method:'Generated empty architectural reference desk; contains no hardware. Catalog product photographs are rendered separately, without geometric editing.',outputs:[960,1600].map(w=>`/images/editorial/guides-reference-desk-${w}.webp`)},null,2)+'\n');
