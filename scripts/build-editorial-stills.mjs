/** Native Blender still-life scenes with original product photographs as alpha plates.
 * Product pixels are never generated. Stage geometry is scenery, not product CAD.
 * Run: node scripts/build-editorial-stills.mjs [--prepare-only]
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { cutOut } from './lib/product-cutout.mjs';

const out = resolve('docs/design-references/2026-09-07-home-stills');
const scratch = resolve('tmp/codex-editorial-still-inputs');
mkdirSync(out, { recursive: true });
mkdirSync(scratch, { recursive: true });
const specs = [
  { id: '01-selection', slug: '9004s-stainless-steel-handle', mood: 'limestone', cropTop: 0,
    backgroundSeeds: [[220,510]],
    purpose: 'Distributor selection', label: '9004S / Stainless steel', width: 1.14, x: 0.62, y: 0.02 },
  { id: '02-specification', slug: '70sn-lock-cylinder', mood: 'paper', cropTop: 120,
    purpose: 'Specification support', label: '70SN / 70 mm', width: 1.10, x: 0.59, y: 0.02 },
  { id: '03-material', slug: 'ssh017-brass-and-steel-hinges', mood: 'stone', cropTop: 0,
    backgroundSeeds: [[511,195],[576,204],[541,273],[506,343],[568,357],[211,447],[272,457],[234,522],[201,599],[267,607]],
    purpose: 'Material and construction detail', label: 'SSH017 / Stainless steel', width: 0.61, x: 0.62, y: 0.02 },
];
for (const spec of specs) {
  const sourceRecord = `content/products/${spec.slug}.json`;
  const product = JSON.parse(readFileSync(sourceRecord, 'utf8'));
  const source = resolve('public' + product.heroImage.src);
  let input = source;
  if (spec.backgroundSeeds) {
    // Reviewed white background visible THROUGH real openings. Flood-fill only the
    // connected white region at each seed; no new opening or contour is drawn.
    const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    for (const [x,y] of spec.backgroundSeeds) {
      const start=y*info.width+x;
      const white=p=>Math.min(data[p*4],data[p*4+1],data[p*4+2])>=247;
      if(!white(start)) throw Error(`Background seed is not white: ${spec.id} ${x},${y}`);
      const todo=[start];const seen=new Set();
      while(todo.length) {
        const p=todo.pop();if(seen.has(p)||p<0||p>=info.width*info.height||!white(p))continue;
        seen.add(p);data[p*4+3]=0;
        for(const d of [-1,1,-info.width,info.width])todo.push(p+d);
      }
    }
    input=resolve(scratch,spec.id+'-source.png');
    await sharp(data,{raw:info}).png().toFile(input);
  }
  if (spec.cropTop) {
    const meta = await sharp(source).metadata();
    input = resolve(scratch, spec.id + '-source.png');
    // Crop only the separate logo above the actual cylinder; all supplied parts survive.
    await sharp(source).extract({left: 0, top: spec.cropTop, width: meta.width, height: meta.height-spec.cropTop}).png().toFile(input);
  }
  const cut = await cutOut(input);
  // Only the alpha boundary is antialiased; retained product RGB is untouched.
  // The source JPEG matte has bright fringes that otherwise look serrated on grey.
  const matte = await sharp(cut.buffer).ensureAlpha().raw().toBuffer();
  const alpha = new Uint8Array(cut.width * cut.height);
  for (let i=0;i<alpha.length;i++) alpha[i]=matte[i*4+3];
  for (let y=1;y<cut.height-1;y++) for (let x=1;x<cut.width-1;x++) {
    const p=y*cut.width+x;
    if (alpha[p] && [-1,1,-cut.width,cut.width].some(d=>alpha[p+d]===0)) {
      const pale=Math.min(matte[p*4],matte[p*4+1],matte[p*4+2])>225;
      matte[p*4+3]=pale?35:155;
    }
  }
  const texture = resolve(scratch, spec.id + '.png');
  await sharp(matte,{raw:{width:cut.width,height:cut.height,channels:4}}).png().toFile(texture);
  const originalRgb=await sharp(cut.buffer).ensureAlpha().raw().toBuffer();
  for(let p=0;p<matte.length;p+=4)for(let c=0;c<3;c++)if(matte[p+c]!==originalRgb[p+c])throw Error('Product RGB changed');
  const config = { ...spec, texture, textureWidth: cut.width, textureHeight: cut.height,
    sourceRecord, sourceImage: product.heroImage.src,
    sourceSha256: createHash('sha256').update(readFileSync(source)).digest('hex'),
    technique: 'Original photograph on an alpha plate inside a Blender still-life set. No reconstructed product geometry or simulated installation.',
    scope: 'Design preview, not a dimensional model or a completed project photograph.',
    alphaQa: 'Product RGB unchanged; outer alpha edge antialiased; only reviewed existing white openings keyed.',
    productDimensions: product.specs.filter(s => /mm|inch|"/i.test(s.value)),
    outputDirectory: out };
  const configFile = resolve(out, spec.id + '.json');
  writeFileSync(configFile, JSON.stringify(config,null,2)+'\n');
  if (!process.argv.includes('--prepare-only')) {
    const blender = process.env.BLENDER_PATH || 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe';
    const log = execFileSync(blender,['--background','--python-exit-code','1','--python',resolve('scripts/blender/editorial-stills.py'),'--',configFile],{encoding:'utf8',maxBuffer:16*1024*1024});
    writeFileSync(resolve(scratch,spec.id+'.log'),log);
    for (const ext of ['png','blend']) {
      const file=resolve(out,spec.id+'.'+ext);
      if (!existsSync(file)||!statSync(file).size) throw Error('Missing '+file);
    }
    if (!log.includes('EDITORIAL_STILL_OK')) throw Error('Blender did not complete '+spec.id);
    console.log('Completed '+spec.id);
  }
}
