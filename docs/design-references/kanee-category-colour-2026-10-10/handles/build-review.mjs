import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
import {cutOut} from '../../../../scripts/lib/product-cutout.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const recipe=JSON.parse(await fs.readFile(path.join(here,'recipe.json'),'utf8'));
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
const raw=buffer=>sharp(buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const wanted=process.argv.slice(2);

function matchOffset(full,cut) {
  const probes=[];
  for(let p=0;p<cut.info.width*cut.info.height;p++) if(cut.data[p*4+3]===255) probes.push(p);
  assert.ok(probes.length>1000,'Not enough photographic product pixels');
  const sample=[probes[0],probes[Math.floor(probes.length*.27)],probes[Math.floor(probes.length*.61)],probes.at(-1)];
  for(let y=0;y<=full.info.height-cut.info.height;y++) for(let x=0;x<=full.info.width-cut.info.width;x++) {
    if(!sample.every(p=>[0,1,2].every(c=>full.data[((y+Math.floor(p/cut.info.width))*full.info.width+x+p%cut.info.width)*4+c]===cut.data[p*4+c]))) continue;
    let equal=true;
    for(const p of probes) {
      const q=((y+Math.floor(p/cut.info.width))*full.info.width+x+p%cut.info.width)*4;
      if([0,1,2].some(c=>full.data[q+c]!==cut.data[p*4+c])) {equal=false;break;}
    }
    if(equal) return [x,y];
  }
  throw new Error('Source/cutout RGB coordinate match not found');
}

function clearReviewedPaper(cut,offset,seeds) {
  const areas=[];
  const width=cut.info.width,height=cut.info.height;
  for(const [sourceX,sourceY] of seeds) {
    const x=sourceX-offset[0],y=sourceY-offset[1];
    assert.ok(x>=0&&y>=0&&x<width&&y<height,'Reviewed paper seed outside cutout');
    const start=y*width+x, seen=new Uint8Array(width*height),stack=[start];
    let area=0;
    while(stack.length) {
      const p=stack.pop();
      if(seen[p]) continue;
      seen[p]=1;
      const rgb=[cut.data[p*4],cut.data[p*4+1],cut.data[p*4+2]];
      if(cut.data[p*4+3]===0||Math.min(...rgb)<245||Math.max(...rgb)-Math.min(...rgb)>12) continue;
      cut.data[p*4+3]=0; area++;
      const px=p%width,py=Math.floor(p/width);
      if(px>0)stack.push(p-1);if(px+1<width)stack.push(p+1);if(py>0)stack.push(p-width);if(py+1<height)stack.push(p+width);
    }
    assert.ok(area<width*height*.12,'Reviewed hole seed leaked into a large region');
    areas.push({source:[sourceX,sourceY],removedPaperPixels:area});
  }
  return areas;
}

for(const item of recipe.items) {
  if(wanted.length&&!wanted.includes(item.id))continue;
  const directory=path.join(here,item.id);
  await fs.mkdir(directory,{recursive:true});
  const input=await fs.readFile(path.join(directory,item.source));
  assert.equal(sha(input),item.sourceSha256,'Source hash mismatch');
  const original=await raw(input);
  assert.deepEqual([original.info.width,original.info.height],item.dimensions);
  let cutBuffer,offset;
  if(item.mask==='previous-reviewed-derived') {
    cutBuffer=await fs.readFile(path.join(directory,item.maskFile));
    assert.equal(sha(cutBuffer),item.maskSha256,'Retained mask hash mismatch');
    offset=item.sourceOffset;
  } else {
    const extracted=await cutOut(path.join(directory,item.source));
    cutBuffer=extracted.buffer;
    offset=matchOffset(original,await raw(cutBuffer));
  }
  const cut=await raw(cutBuffer);
  const paperCleanup=clearReviewedPaper(cut,offset,item.holeSeeds);
  let alphaEdgePixelsChanged=0;
  if(item.edgeAlphaCleanup) {
    const alpha=Uint8Array.from({length:cut.info.width*cut.info.height},(_,p)=>cut.data[p*4+3]);
    for(let p=0;p<alpha.length;p++) {
      if(!alpha[p])continue;
      const x=p%cut.info.width,y=Math.floor(p/cut.info.width);
      const neighbours=[x?p-1:-1,x+1<cut.info.width?p+1:-1,y?p-cut.info.width:-1,y+1<cut.info.height?p+cut.info.width:-1];
      if(neighbours.some(q=>q>=0&&!alpha[q])) {
        const pale=Math.min(cut.data[p*4],cut.data[p*4+1],cut.data[p*4+2]);
        if(pale>230) {cut.data[p*4+3]=75;alphaEdgePixelsChanged++;}
        else if(pale>200) {cut.data[p*4+3]=170;alphaEdgePixelsChanged++;}
      }
    }
  }
  let cutRgbCompared=0;
  for(let y=0;y<cut.info.height;y++)for(let x=0;x<cut.info.width;x++) {
    const p=(y*cut.info.width+x)*4;
    if(!cut.data[p+3])continue;
    const q=((y+offset[1])*original.info.width+x+offset[0])*4;
    for(let c=0;c<3;c++) assert.equal(cut.data[p+c],original.data[q+c],'Mask changed source product RGB');
    cutRgbCompared++;
  }
  let partialAlphaMatteCleanupPixels=0;
  // Optical white-matte cleanup only at already partial-alpha pixels. Opaque
  // metal, source arrangement and alpha are untouched by this operation.
  if(item.partialAlphaWhiteMatteCleanup) for(let p=0;p<cut.info.width*cut.info.height;p++) {
    const opacity=cut.data[p*4+3]/255;
    if(opacity===0||opacity===1)continue;
    const whiteContribution=255*(1-opacity);
    if(Math.min(cut.data[p*4],cut.data[p*4+1],cut.data[p*4+2])<whiteContribution)continue;
    for(let c=0;c<3;c++)cut.data[p*4+c]=Math.round((cut.data[p*4+c]-whiteContribution)/opacity);
    partialAlphaMatteCleanupPixels++;
  }
  cutBuffer=await sharp(cut.data,{raw:{width:cut.info.width,height:cut.info.height,channels:4}}).png().toBuffer();
  await fs.writeFile(path.join(directory,'source-product.png'),cutBuffer);
  const background=await fs.readFile(path.join(here,'..','empty-fields',`${item.field}.png`));
  assert.equal(sha(background),recipe.backgroundHashes[item.field],'Background hash mismatch');
  const field=await sharp(background).resize(...item.dimensions,{fit:'cover'}).blur(.9).linear(.95,0).png().toBuffer();
  const output=await sharp(field).composite([{input:cutBuffer,left:offset[0],top:offset[1]}]).png().toBuffer();
  const result=await raw(output);
  let opaque=0;
  for(let y=0;y<cut.info.height;y++)for(let x=0;x<cut.info.width;x++) {
    const p=(y*cut.info.width+x)*4;
    if(cut.data[p+3]!==255)continue;
    const q=((y+offset[1])*original.info.width+x+offset[0])*4;
    for(let c=0;c<3;c++)assert.equal(result.data[q+c],original.data[q+c],'Master opaque RGB changed');
    opaque++;
  }
  assert.deepEqual([result.info.width,result.info.height],item.dimensions);
  assert.equal(sha(await fs.readFile(path.join(directory,item.source))),item.sourceSha256,'Source changed during render');
  const name=`${item.id}.png`;
  await fs.writeFile(path.join(directory,name),output);
  await sharp(output).webp({quality:94}).toFile(path.join(directory,`${item.id}.webp`));
  for(const crop of item.contourCrops) {
    const {name:cropName,...rectangle}=crop;
    await sharp(output).extract(rectangle).resize(rectangle.width*3,rectangle.height*3,{kernel:'nearest'}).png().toFile(path.join(directory,`qa-${cropName}-3x.png`));
    await sharp(input).extract(rectangle).resize(rectangle.width*3,rectangle.height*3,{kernel:'nearest'}).png().toFile(path.join(directory,`qa-source-${cropName}-3x.png`));
  }
  const receipt={id:item.id,model:item.model,category:item.category,view:item.view,origin:item.origin,source:item.source,sourceSha256:sha(input),sourceDimensions:item.dimensions,mask:item.mask,sourceProduct:'source-product.png',sourceProductSha256:sha(cutBuffer),sourceProductDimensions:[cut.info.width,cut.info.height],sourceOffset:offset,preCleanupRetainedSourceRgbPixelsCompared:cutRgbCompared,preCleanupRetainedSourceRgbDifferences:0,opaqueRgbPixelsCompared:opaque,opaqueRgbDifferences:0,paperCleanup,alphaEdgePixelsChanged,partialAlphaMatteCleanupPixels,opticalCleanup:partialAlphaMatteCleanupPixels?'White contribution removed only from already partial-alpha edge pixels; opaque metal RGB and alpha unchanged':'None',background:`../empty-fields/${item.field}.png`,backgroundSha256:sha(background),backgroundOnlyAdjustment:{resize:item.dimensions,blur:.9,gain:.95},productResize:false,productRotation:false,productRepainted:false,productRegenerated:false,shadow:'No added shadow; colour catalogue portrait, not a grounded source-shadow still-life',arrangement:'All retained parts preserve their original source coordinates; no independent component resizing or rearrangement',facts:item.facts,uncertainty:item.uncertainty,contourStatus:'Pending individual enlarged visual QA; numeric interior equality is not acceptance',clientApproved:false,master:name,masterDimensions:item.dimensions,masterSha256:sha(output)};
  await fs.writeFile(path.join(directory,'provenance.json'),JSON.stringify(receipt,null,2)+'\n');
  console.log(`${item.id}: ${opaque} opaque pixels, RGB differences 0; mask ${cut.info.width}×${cut.info.height} @ ${offset.join(',')}`);
}
