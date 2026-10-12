import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const base = path.dirname(fileURLToPath(import.meta.url));
const spec = JSON.parse(await fs.readFile(path.join(base,'recipe.json'),'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const receipts = [];
for (const item of spec.samples) {
  const source = await fs.readFile(path.resolve(base,item.source));
  const background = await fs.readFile(path.resolve(base,item.background));
  assert.equal(sha(source),item.sourceSha256,'Native source changed: re-review before composition');
  const original = await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.equal(original.info.width,item.nativeLayer.width);
  assert.equal(original.info.height,item.nativeLayer.height);
  const left = Math.floor((spec.canvas.width-original.info.width)/2);
  const top = Math.floor((spec.canvas.height-original.info.height)/2);
  assert.ok(left >= 0 && top >= 0,'Complete native product must fit without cropping or resizing');
  const field = await sharp(background).resize(spec.canvas.width,spec.canvas.height,{fit:'cover'}).png().toBuffer();
  const fieldPixels = await sharp(field).ensureAlpha().raw().toBuffer();
  const png = await sharp(field).composite([{input:source,left,top}]).png().toBuffer();
  const output = await sharp(png).ensureAlpha().raw().toBuffer();
  let opaque = 0, partial = 0, transparent = 0;
  for (let y=0;y<original.info.height;y++) for (let x=0;x<original.info.width;x++) {
    const p = (y*original.info.width+x)*4;
    const a = original.data[p+3];
    if (a===0) {
      transparent++;
      const q = ((y+top)*spec.canvas.width+x+left)*4;
      assert.deepEqual(output.subarray(q,q+3),fieldPixels.subarray(q,q+3),'Hidden zero-alpha RGB leaked into field');
    }
    else if (a<255) partial++;
    else {
      opaque++;
      const q = ((y+top)*spec.canvas.width+x+left)*4;
      assert.deepEqual(output.subarray(q,q+3),original.data.subarray(p,p+3),'Opaque product RGB changed');
    }
  }
  assert.equal(sha(await fs.readFile(path.resolve(base,item.source))),item.sourceSha256,'Source RGB/alpha was modified');
  const out = path.resolve(base,path.dirname(item.source),'preview');
  await fs.mkdir(out,{recursive:true});
  await fs.writeFile(path.join(out,`${item.id}.png`),png);
  await sharp(png).webp({quality:94}).toFile(path.join(out,`${item.id}.webp`));
  for (const {id,left:rx,top:ry,width,height} of item.reviewRegions) {
    await sharp(png).extract({left:rx,top:ry,width,height}).resize(width*3,height*3,{kernel:'nearest'}).png()
      .toFile(path.join(out,`qa-${id}-3x.png`));
  }
  if (item.referencePhoto) {
    const reference = await fs.readFile(path.resolve(base,item.referencePhoto));
    assert.equal(sha(reference),item.referencePhotoSha256,'Genuine comparison photograph changed');
    const region = item.referenceReviewRegion;
    await sharp(reference).extract(region).resize(region.width*4,region.height*4,{kernel:'nearest'}).png()
      .toFile(path.join(out,'qa-repository-ring-4x.png'));
  }
  const receipt = {...item,canvas:spec.canvas,placement:{left,top,width:original.info.width,height:original.info.height},
    backgroundSha256:sha(background),masterSha256:sha(png),opaquePixelsCompared:opaque,opaqueRgbDifferences:0,
    alphaPixelCounts:{opaque,partial,transparent},nativeRgbAlphaSourceUnchanged:true,transparentRgbDifferences:0,
    productResize:false,productRotation:false,productRepainted:false,productRegenerated:false,
    shadowAdded:false,hiddenZeroAlphaRgbUsed:false,
    status:item.reviewStatus,
    sourceVerification:'Cached native PNG hash verified; original PSD hash previously recorded, no fresh external-disk read',
    limitations:['No complete native ground photograph is available, so no photographic ground shadow is asserted or added',
      'Original partial-alpha optical matte is inherited and requires visual contour review',
      'Photographed parts do not establish current finish, compatibility or a sold kit']};
  await fs.writeFile(path.join(out,'provenance.json'),JSON.stringify(receipt,null,2)+'\n');
  receipts.push({id:item.id,opaquePixelsCompared:opaque,opaqueRgbDifferences:0,output:out});
}
console.log(JSON.stringify(receipts,null,2));
