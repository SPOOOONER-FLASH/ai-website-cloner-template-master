import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {recoverSourceShadow,composeSourceShadow} from '../../../../scripts/build-kanee-source-shadow.mjs';

const base=path.dirname(fileURLToPath(import.meta.url));
const dir=path.join(base,'single-oval-cylinder-burgundy');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const source=await fs.readFile(path.join(dir,'source.webp'));
assert.equal(sha(source),'655190310c8171397ced07c43fe278adb9a6fc83e1b5f52eeec0af5661fab2ba');
const original=await sharp(source).ensureAlpha().raw().toBuffer();
// This path traces the visible photographic silhouette in source coordinates.
// It masks paper, never draws or replaces hardware. A changed source requires a new trace.
const contour='M356 330 L637 331 C659 331 674 341 690 365 C714 370 724 391 726 422 L734 423 L735 440 L728 442 C728 468 718 488 708 498 L706 590 C706 629 689 670 659 686 C648 690 640 691 630 692 L444 705 L428 707 L361 713 C327 714 307 691 297 655 C288 620 289 590 289 555 L286 440 C284 390 308 332 356 330 Z';
const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000"><path d="${contour}" fill="white"/></svg>`);
const mask=await sharp(svg).ensureAlpha().raw().toBuffer();
const product=Buffer.from(original);
for(let p=0;p<1000000;p++) product[p*4+3]=mask[p*4+3];
const productPng=await sharp(product,{raw:{width:1000,height:1000,channels:4}}).png().toBuffer();
let ground=await recoverSourceShadow(source,productPng,{paperLevel:255,strength:1});
const transmission=await sharp(ground).removeAlpha().raw().toBuffer();
for(let y=0;y<1000;y++)for(let x=0;x<1000;x++)if(x<210||x>790||y<315||y>850)transmission.fill(255,(y*1000+x)*3,(y*1000+x)*3+3);
ground=await sharp(transmission,{raw:{width:1000,height:1000,channels:3}}).png().toBuffer();
const fieldBytes=await fs.readFile(path.join(base,'../empty-fields/burgundy.png'));
const field=await sharp(fieldBytes).resize(1000,1000).blur(.9).linear(.95,0).png().toBuffer();
const output=await composeSourceShadow(field,productPng,ground);
const result=await sharp(output).ensureAlpha().raw().toBuffer();
let compared=0;
for(let p=0;p<1000000;p++)if(product[p*4+3]===255){
  assert.deepEqual(result.subarray(p*4,p*4+3),original.subarray(p*4,p*4+3));compared++;
}
assert.ok(compared>120000,'The complete photographed body must remain');
await fs.writeFile(path.join(dir,'reviewed-silhouette.svg'),svg);
await fs.writeFile(path.join(dir,'source-product-ground-repair.png'),productPng);
await fs.writeFile(path.join(dir,'shadow-transmission-ground-repair.png'),ground);
await fs.writeFile(path.join(dir,'single-oval-cylinder-burgundy-ground-repair.png'),output);
await sharp(output).webp({quality:94}).toFile(path.join(dir,'single-oval-cylinder-burgundy-ground-repair.webp'));
await sharp(output).extract({left:240,top:625,width:510,height:185}).resize(1530,555,{kernel:'nearest'}).toFile(path.join(dir,'qa-ground-repair-3x.png'));
const receipt={model:'Single oval cylinder',source:'source.webp',sourceSha256:sha(source),fieldSha256:sha(fieldBytes),master:'single-oval-cylinder-burgundy-ground-repair.png',masterSha256:sha(output),method:'Source-coordinate manually traced photographic matte and original photo ground luminance; no generated product, ground blur or translated shadow',opaqueRgbPixelsCompared:compared,opaqueRgbDifferences:0,productResize:false,productRotation:false,productRegenerated:false,status:'TECHNICAL_RECEIPT; current visual disposition is ../../review.json; original white-island draft remains HELD',clientApproved:false,contour};
await fs.writeFile(path.join(dir,'ground-repair.provenance.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt));
