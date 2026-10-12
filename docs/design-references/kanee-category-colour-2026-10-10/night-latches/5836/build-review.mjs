import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {cutOut} from '../../../../../scripts/lib/product-cutout.mjs';
import {cleanPhotographicMatte} from '../../../../../scripts/build-kanee-fidelity-masters.mjs';

const base = path.dirname(fileURLToPath(import.meta.url));
const spec = JSON.parse(await fs.readFile(path.join(base,'recipe.json'),'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const source = await fs.readFile(path.resolve(base,spec.source));
assert.equal(sha(source),spec.sourceSha256,'Original photograph changed; re-review required');
const full = await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
assert.equal(full.info.width,spec.originalDimensions.width);
assert.equal(full.info.height,spec.originalDimensions.height);
const cut = await cutOut(source);
assert.equal(cut.width,spec.crop.width);
assert.equal(cut.height,spec.crop.height);
const unclean = await sharp(cut.buffer).ensureAlpha().raw().toBuffer();
const seeds = spec.backgroundApertureSeedsPixels.map(([x,y]) => [x/cut.width,y/cut.height]);
const matte = await cleanPhotographicMatte(cut.buffer,seeds,{cleanBoundary:true});
const pixels = await sharp(matte).ensureAlpha().raw().toBuffer();
let retained = 0, clearedPaper = 0;
for (let y=0;y<cut.height;y++) for (let x=0;x<cut.width;x++) {
  const p = (y*cut.width+x)*4;
  const q = ((y+spec.crop.top)*full.info.width+x+spec.crop.left)*4;
  assert.deepEqual(pixels.subarray(p,p+3),full.data.subarray(q,q+3),'Original photographic RGB must not change');
  if (pixels[p+3]===255) retained++;
  if (unclean[p+3]!==0 && pixels[p+3]===0) {
    assert.ok(Math.min(...pixels.subarray(p,p+3))>=247,'Only confirmed white paper alpha may be cleared');
    clearedPaper++;
  }
}
for (const [x,y] of spec.retainedPartAnchors) assert.equal(pixels[(y*cut.width+x)*4+3],255,'A reviewed actual part disappeared');
const {width,height} = spec.canvas;
const left = Math.floor((width-cut.width)/2), top = Math.floor((height-cut.height)/2);
assert.ok(left>=0 && top>=0,'Complete product must fit at native size');
const bg = await fs.readFile(path.resolve(base,spec.background));
const field = await sharp(bg).resize(width,height,{fit:'cover'}).png().toBuffer();
const fieldPixels = await sharp(field).ensureAlpha().raw().toBuffer();
const master = await sharp(field).composite([{input:matte,left,top}]).png().toBuffer();
const composed = await sharp(master).ensureAlpha().raw().toBuffer();
for (let y=0;y<cut.height;y++) for (let x=0;x<cut.width;x++) {
  const p = (y*cut.width+x)*4, q = ((y+top)*width+x+left)*4;
  assert.deepEqual(composed.subarray(q,q+3),pixels[p+3]===255 ? pixels.subarray(p,p+3) : fieldPixels.subarray(q,q+3),'Native product or clear field changed');
}
const out = path.join(base,'preview');
await fs.mkdir(out,{recursive:true});
await fs.writeFile(path.join(base,'sources/reviewed-cutout.png'),cut.buffer);
await fs.writeFile(path.join(base,'sources/paper-cleaned-cutout.png'),matte);
await sharp(field).composite([{input:cut.buffer,left,top}]).png().toFile(path.join(base,`${spec.id}-candidate.png`));
await fs.writeFile(path.join(out,`${spec.id}.png`),master);
await sharp(master).webp({quality:94}).toFile(path.join(out,`${spec.id}.webp`));
for (const region of spec.reviewRegions) {
  const {id,...extract} = region;
  await sharp(master).extract(extract).resize(extract.width*3,extract.height*3,{kernel:'nearest'}).png().toFile(path.join(out,`qa-${id}-3x.png`));
  const sourceExtract = {...extract,left:extract.left-left+spec.crop.left,top:extract.top-top+spec.crop.top};
  await sharp(source).extract(sourceExtract).resize(extract.width*3,extract.height*3,{kernel:'nearest'}).png().toFile(path.join(out,`qa-source-${id}-3x.png`));
}
assert.equal(sha(await fs.readFile(path.resolve(base,spec.source))),spec.sourceSha256);
const receipt = {...spec,placement:{left,top,width:cut.width,height:cut.height},
  backgroundSha256:sha(bg),masterSha256:sha(master),maskSha256:sha(matte),
  helpers:'Existing cutOut and cleanPhotographicMatte unchanged; individually reviewed white-aperture seeds, not a batch mask',
  photographicRgbPixelsCompared:cut.width*cut.height,photographicRgbDifferences:0,
  opaqueProductPixelsCompared:retained,opaqueProductRgbDifferences:0,clearedVerifiedPaperAlphaPixels:clearedPaper,
  transparentFieldRgbDifferences:0,sourceFileUnchanged:true,productResize:false,productRotation:false,
  productRepainted:false,productRegenerated:false,shadowAdded:false,nativeAlphaAvailable:false,
  sourceGroundClaim:false,commercialApproval:false,clientApproval:'pending'};
await fs.writeFile(path.join(out,'provenance.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({id:spec.id,status:spec.status,retainedProductPixels:retained,clearedPaperAlphaPixels:clearedPaper,rgbDifferences:0,output:out},null,2));
