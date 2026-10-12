import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
import {buildShadowPilot} from '../../../../scripts/build-kanee-source-shadow.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ready = path.join(here,'70-abkt-cp-petrol-blue');
const receipt = await buildShadowPilot(path.join(ready,'spec.json'),ready);
assert.equal(receipt.productRgbReference,'full-photo');
assert.equal(receipt.opaqueRgbDifferences,0);
assert.equal(receipt.productResize,false);
assert.equal(receipt.productRotation,false);
const portrait = path.join(here,'60-cpdk-terracotta');
const spec = JSON.parse(await fs.readFile(path.join(portrait,'spec.json'),'utf8'));
const source = await fs.readFile(path.join(portrait,spec.sourceProduct));
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
assert.equal(hash(source),spec.sourceProductSha256);
assert.equal(spec.sourceFullPhoto,null);
assert.equal(spec.productRgbSource,'native-cutout');
const native = await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
assert.equal(native.info.width,648);
assert.equal(native.info.height,591);
assert.equal(spec.sourceOffset.left,89);
assert.equal(spec.sourceOffset.top,153);
assert.ok(spec.sourceOffset.left+native.info.width<=spec.width && spec.sourceOffset.top+native.info.height<=spec.height);
const background = await fs.readFile(path.join(portrait,spec.background));
const field = await sharp(background).resize(spec.width,spec.height,{fit:'cover'}).blur(spec.backgroundBlur).linear(spec.backgroundGain,0).png().toBuffer();
const output = await sharp(field).composite([{input:source,left:spec.sourceOffset.left,top:spec.sourceOffset.top}]).png().toBuffer();
const result = await sharp(output).ensureAlpha().raw().toBuffer({resolveWithObject:true});
assert.equal(result.info.width,spec.width);
assert.equal(result.info.height,spec.height);
let compared = 0;
for (let y=0;y<native.info.height;y++) for (let x=0;x<native.info.width;x++) {
  const p=(y*native.info.width+x)*4;
  if (native.data[p+3]!==255) continue;
  const q=((y+spec.sourceOffset.top)*spec.width+x+spec.sourceOffset.left)*4;
  assert.deepEqual([...result.data.subarray(q,q+3)],[...native.data.subarray(p,p+3)]);
  compared++;
}
await fs.writeFile(path.join(portrait,`${spec.id}-native-portrait.png`),output);
await sharp(output).webp({quality:94}).toFile(path.join(portrait,`${spec.id}-native-portrait.webp`));
await fs.writeFile(path.join(portrait,'provenance.json'),JSON.stringify({
  id:spec.id,model:spec.model,view:spec.view,status:'Review only; enlarged contour review recorded separately',
  sourceProduct:spec.sourceProduct,sourceProductSha256:hash(source),sourceDimensions:[648,591],
  originalLibrary:spec.originalLibrary,originalPsdSha256:spec.originalPsdSha256,originalHashStatus:spec.originalHashStatus,
  sourceOffset:spec.sourceOffset,width:spec.width,height:spec.height,
  background:spec.background,backgroundSha256:hash(background),backgroundOnlyAdjustment:{blur:spec.backgroundBlur,gain:spec.backgroundGain},
  productRgbReference:'Unchanged native photographic cutout RGB',productMaskExtraction:'Supplied native alpha unchanged',
  productResize:false,productRotation:false,productRegenerated:false,productRepainted:false,
  shadow:'None added; photographic contact ground unavailable',hiddenZeroAlphaRgbUsedAsGround:false,
  separateScrewLayerAdded:false,opaqueRgbPixelsCompared:compared,opaqueRgbDifferences:0,
  masterSha256:hash(output),limitation:spec.limitation
},null,2)+'\n');
console.log(`${spec.id}: native portrait generated; ${compared} opaque RGB pixels unchanged`);
for (const [dir,file,name,rect] of [
  [ready,'70-abkt-cp-petrol-blue-source-shadow.png','contour-3x.png',{left:116,top:346,width:230,height:260}],
  [ready,'70-abkt-cp-petrol-blue-source-shadow.png','thumbturn-contour-3x.png',{left:473,top:137,width:218,height:175}],
  [portrait,'60-cpdk-terracotta-native-portrait.png','contour-3x.png',{left:79,top:249,width:210,height:280}],
  [portrait,'60-cpdk-terracotta-native-portrait.png','keys-contour-3x.png',{left:325,top:307,width:421,height:447}]
]) {
  await sharp(path.join(dir,file)).extract(rect).resize(rect.width*3,rect.height*3,{kernel:'nearest'}).png().toFile(path.join(dir,name));
}
