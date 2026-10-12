import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { recoverSourceShadow, composeSourceShadow } from '../../../../scripts/build-kanee-source-shadow.mjs';

const base = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(base, '../../../../');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const entries = [
  { id:'881ss-burgundy', model:'881 SS', category:'sliding-hook-locks', source:'881-ss-sliding-hook-lock-2.webp', field:'burgundy', threshold:250,
    exclusions:[[0,0,192,132]], holes:[[673,202],[676,810]], mode:'catalogue-portrait', crops:[[260,140,190,190],[625,158,113,114]],
    caveat:'Original mechanical back view of the two plates. This is a detail view, not the full supplied kit. No parts added or removed.' },
  { id:'s03-sage', model:'S03', category:'sliding-hook-locks', source:'s03-sliding-hook-lock.webp', field:'sage', threshold:250,
    exclusions:[[0,0,192,132]], holes:[[325,151],[325,854],[495,337],[495,450],[496,581]], mode:'catalogue-portrait', crops:[[296,112,80,99],[602,481,302,216],[643,713,133,142]],
    caveat:'Full original photographed arrangement including screws. Source ground around the round pulls needs individual separation; hold if retained paper is visible.' },
  { id:'panic300-petrol-blue', model:'300', category:'panic-exit-devices', source:'300-panic-exit-device.webp', field:'petrol-blue', threshold:250,
    exclusions:[[0,0,192,132]], mode:'catalogue-portrait', crops:[[94,377,149,278],[766,373,146,276]],
    caveat:'Complete frontal real red crossbar and black mechanism housings; original colour retained. Image makes no certification or fire-door compliance claim.' },
  { id:'glass112-burgundy', model:'112', category:'glass-door-accessories', source:'112-glass-door-handle.webp', field:'burgundy', threshold:250,
    holes:[[505,501]], mode:'catalogue-portrait', crops:[[410,62,226,158],[390,777,237,168]],
    caveat:'Complete original polished pull pair with original couplings. Broad chrome reflections are metal, not removable paper.' },
  { id:'bh56-terracotta', model:'BH56', category:'care-grab-bars', source:'bh56-bathroom-accessories-2.webp', field:'terracotta', threshold:250,
    exclusions:[[0,0,214,151]], holes:[[512,516]], mode:'catalogue-portrait', crops:[[27,335,239,142],[778,408,194,220],[778,756,157,128]],
    caveat:'Original black and white folding bar assembly. White coating must remain; current catalogue groups it under bathroom accessories. No load or installation claim inferred.' },
  { id:'bh57-sage', model:'BH57', category:'care-grab-bars', source:'bh57-bathroom-accessories.webp', field:'sage', threshold:250,
    exclusions:[[0,0,214,151]], holes:[[569,523],[852,487]], mode:'catalogue-portrait', crops:[[23,470,188,205],[883,345,95,292],[315,482,115,137]],
    caveat:'Original two rails, two struts and hinged wall plate; source view and proportion preserved. Existing neutral record used, no site or taxonomy changes.' },
  { id:'f100-sage', model:'F100 SS', category:'floor-springs-and-pivots', source:'f100-ss-door-hinge-4.webp', field:'sage', threshold:250,
    exclusions:[[0,0,192,132]], holes:[[269,637],[197,628],[476,574],[747,575]], mode:'catalogue-portrait', crops:[[119,220,101,326],[204,571,249,125],[478,575,325,131],[119,757,357,83]],
    caveat:'Real wooden-door floor hinge, spring and plates in original assembly. Existing record filed under hinges; current independent HYDE second floor/pivot model remains unconfirmed. Source ground requires separate QA.' },
  { id:'ssh016-petrol-blue', model:'SSH016', category:'brass-steel-hinges', source:'ssh016-brass-and-steel-hinges.webp', field:'petrol-blue', threshold:250,
    holes:[[277,237],[201,436],[275,629],[201,810],[837,237],[760,437],[836,629],[760,811]],
    exclusions:[[0,0,192,132]], retainUnion:[[124,140,793,777],[467,113,100,820]],
    holeEllipses:[[277,237,24,24],[201,436,25,25],[275,629,25,25],[201,810,25,25],[837,237,24,24],[760,437,24,24],[836,629,24,24],[760,811,25,25]],
    ground:[85,904,884,76], mode:'source-shadow', crops:[[115,128,140,120],[450,102,140,150],[180,182,180,140],[440,850,150,130]],
    caveat:'Neutral source record is HYDE-eligible. Brushed silver appearance is preserved; no new finish claim.' },
  { id:'b024-sage', model:'B024', category:'brass-steel-hinges', source:'b024-brass-and-steel-hinges.webp', field:'sage', threshold:250,
    holes:[[538,345],[365,256],[315,426],[365,598],[315,770],[691,250],[640,423],[691,596],[640,769]], holeEllipses:[[365,256,28,28],[315,426,28,28],[365,598,28,28],[315,770,28,28],[691,250,28,28],[640,423,28,28],[691,596,28,28],[640,769,28,28]],
    paperRegions:[[535,282,8,174]],
    retainUnion:[[238,158,528,701],[458,121,83,760],[535,271,21,184]],
    mode:'catalogue-portrait', crops:[[225,145,180,130],[440,110,140,200],[310,210,120,110],[490,255,100,205]],
    caveat:'Gold-coloured original, not re-coloured. No source ground shadow claimed or added.' },
  { id:'bh08-terracotta', model:'BH08', category:'bathroom-accessories', source:'bh08-bathroom-accessories.webp', field:'terracotta', threshold:250,
    exclusions:[[176,473,17,11]], edgeBand:8,
    holes:[[279,432],[664,545]], mode:'catalogue-portrait', crops:[[65,395,180,145],[104,302,170,135],[634,512,170,150],[839,515,110,195]],
    caveat:'Original four straight pegs retained. No source ground shadow claimed or added.' },
  { id:'bh05-petrol-blue', model:'BH05', category:'bathroom-accessories', source:'bh05-bathroom-accessories.webp', field:'petrol-blue', threshold:250,
    exclusions:[[387,503,4,4]], edgeBand:8,
    holes:[[319,408],[630,471]], mode:'catalogue-portrait', crops:[[83,332,155,215],[315,381,165,250],[646,445,170,270],[787,425,125,160]],
    caveat:'Original three curved hooks retained. No source ground shadow claimed or added.' },
  { id:'ju061-burgundy', model:'JU-061', category:'door-closers', source:'ju-061-door-closer.webp', field:'burgundy', threshold:250,
    mode:'catalogue-portrait', crops:[[407,96,106,140],[303,472,95,160],[146,749,175,150],[379,770,170,145]],
    caveat:'Original aluminum closer with complete triangular arm, threaded adjuster and mounting foot. Finish unspecified in product record; photographed gray preserved. No added ground.' },
  { id:'ju093-sage', model:'JU-093', category:'door-closers', source:'ju-093-door-closer.webp', field:'sage', threshold:250,
    paperRegions:[[326,772,9,9]],
    holes:[[399,286],[639,252],[879,216],[331,736],[331,776],[778,648]], mode:'catalogue-portrait', crops:[[70,272,130,110],[371,224,110,100],[816,177,125,140],[304,710,158,115]],
    caveat:'Original rail, arm, full closer body and fixing brackets retained. Finish unspecified in product record; photographed silver preserved. No added ground.' },
  { id:'glass100-terracotta', model:'100', category:'glass-door-accessories', source:'100-glass-door-handle.webp', field:'terracotta', threshold:250,
    holes:[[499,496]], mode:'catalogue-portrait', crops:[[402,58,72,135],[531,42,75,115],[416,247,146,70],[404,853,202,115]],
    caveat:'Original complete pull-handle pair and both photographed connector collars retained; no altered tube length, no added ground.' },
  { id:'panic301-burgundy', model:'301', category:'panic-exit-devices', source:'301-panic-exit-device.webp', field:'burgundy', threshold:250,
    exclusions:[[0,0,192,132]], mode:'catalogue-portrait', crops:[[12,541,234,218],[891,207,95,94],[124,515,167,108],[394,330,225,160]],
    caveat:'Complete original long exit device with latch head and opposite end cap. Photographed silver is preserved; current record color/finish fields conflict. No certification, compliance or finish code inferred.' },
  { id:'fb001-sage', model:'FB001', category:'hardware-accessories', source:'fb001-door-flush-bolt.webp', field:'sage', threshold:250,
    holes:[[767,100],[828,354]], mode:'catalogue-portrait', crops:[[114,537,168,170],[147,755,179,180],[568,139,176,149],[716,319,161,166]],
    caveat:'Original front/back views of one flush bolt model. Two photographed views are not two models; both stems, flanges and mounting apertures retained. Specifications absent.' },
  { id:'ds01-petrol-blue', model:'DS01', category:'hardware-accessories', source:'ds01-door-stopper.webp', field:'petrol-blue', threshold:250,
    holes:[[391,769],[600,748],[517,857]], mode:'catalogue-portrait', crops:[[396,102,209,203],[336,715,95,98],[559,704,89,104],[452,807,125,93]],
    caveat:'Original photographed gold-coloured stopper with pale buffer retained, not re-coloured. Record material is stainless steel; gold appearance is not evidence of brass. No ground added.' },
];

// Source-specific seeds identify paper only. This is a draft photographic matte,
// never an automatic approval; each entry requires separate visual QA.
function matte(raw, width, height, entry) {
  const alpha = Buffer.alloc(width*height,255);
  const seen = new Uint8Array(width*height);
  const queue = new Int32Array(width*height);
  let start=0,end=0;
  const enqueue = p => {
    if(seen[p]) return;
    seen[p]=1;
    const i=p*4;
    const lo=Math.min(raw[i],raw[i+1],raw[i+2]), hi=Math.max(raw[i],raw[i+1],raw[i+2]);
    if(lo<entry.threshold || hi-lo>10) return;
    queue[end++]=p;
  };
  for(let x=0;x<width;x++){enqueue(x);enqueue((height-1)*width+x);}
  for(let y=0;y<height;y++){enqueue(y*width);enqueue(y*width+width-1);}
  while(start<end){
    const p=queue[start++],x=p%width,y=Math.floor(p/width);
    alpha[p]=0;
    if(x)enqueue(p-1); if(x<width-1)enqueue(p+1);
    if(y)enqueue(p-width); if(y<height-1)enqueue(p+width);
  }
  // Apertures follow connected photographic paper from the seeds above.
  // Ellipses below only protect countersinks from edge cleanup; never cut metal.
  for(const [cx,cy] of entry.holes??[]) {
    const bounds=(entry.holeEllipses??[]).find(([x,y])=>Math.hypot(x-cx,y-cy)<3);
    const visited=new Set(), pending=[cy*width+cx];
    while(pending.length) {
      const p=pending.pop();if(visited.has(p))continue;visited.add(p);
      const x=p%width,y=Math.floor(p/width),i=p*4;
      if(x<0||x>=width||y<0||y>=height)continue;
      if(bounds && ((x-bounds[0])/bounds[2])**2+((y-bounds[1])/bounds[3])**2>1)continue;
      const rgb=[raw[i],raw[i+1],raw[i+2]];
      const minimum=entry.id==='b024-sage'?225:entry.threshold;
      if(Math.min(...rgb)<minimum||Math.max(...rgb)-Math.min(...rgb)>15)continue;
      alpha[p]=0;
      if(x)pending.push(p-1);if(x+1<width)pending.push(p+1);
      if(y)pending.push(p-width);if(y+1<height)pending.push(p+width);
    }
  }
  for(const [left,top,w,h] of entry.paperRegions??[])for(let y=top;y<top+h;y++)for(let x=left;x<left+w;x++){
    const p=y*width+x,i=p*4;if(Math.min(raw[i],raw[i+1],raw[i+2])>=220)alpha[p]=0;
  }
  for(const [left,top,w,h] of entry.exclusions??[]) for(let y=top;y<top+h;y++) for(let x=left;x<left+w;x++) alpha[y*width+x]=0;
  if(entry.retainUnion)for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(!entry.retainUnion.some(([left,top,w,h])=>x>=left&&x<left+w&&y>=top&&y<top+h))alpha[y*width+x]=0;
  const product=Buffer.from(raw);
  for(let p=0;p<width*height;p++)product[p*4+3]=alpha[p];
  // Recover only white-paper mixture at the existing photographic contour.
  // A nearby protected interior colour estimates coverage; no new surface is drawn.
  // Review panels expose every affected boundary. Opaque interior RGB is untouched.
  const distance=new Uint16Array(width*height);distance.fill(65535);
  for(let p=0;p<width*height;p++)if(alpha[p]===0)distance[p]=0;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const p=y*width+x;
    if(x)distance[p]=Math.min(distance[p],distance[p-1]+1);
    if(y)distance[p]=Math.min(distance[p],distance[p-width]+1);
  }
  for(let y=height-1;y>=0;y--)for(let x=width-1;x>=0;x--){
    const p=y*width+x;
    if(x<width-1)distance[p]=Math.min(distance[p],distance[p+1]+1);
    if(y<height-1)distance[p]=Math.min(distance[p],distance[p+width]+1);
  }
  let edgeCorrections=0;
  const band=entry.edgeBand??4, search=band+4;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const p=y*width+x,i=p*4;
    if(!alpha[p]||distance[p]>band)continue;
    if((entry.holeEllipses??[]).some(([cx,cy,rx,ry])=>((x-cx)/(rx+13))**2+((y-cy)/(ry+13))**2<=1))continue;
    let best=-1,bestDistance=1e9;
    for(let dy=-search;dy<=search;dy++)for(let dx=-search;dx<=search;dx++){
      const xx=x+dx,yy=y+dy;if(xx<0||xx>=width||yy<0||yy>=height)continue;
      const q=yy*width+xx,d=dx*dx+dy*dy;
      if(distance[q]<band+1||d>=bestDistance)continue;
      best=q;bestDistance=d;
    }
    if(best<0)continue;
    const contrast=[0,1,2].map(c=>255-raw[best*4+c]);
    const c=contrast.indexOf(Math.max(...contrast));
    if(contrast[c]<20)continue;
    const coverage=Math.min(1,Math.max(0,(255-raw[i+c])/contrast[c]));
    if(coverage>=.97)continue;
    product[i+3]=Math.round(coverage*255);alpha[p]=product[i+3];
    if(coverage>0)for(let channel=0;channel<3;channel++)product[i+channel]=Math.min(255,Math.max(0,Math.round((raw[i+channel]-255*(1-coverage))/coverage)));
    edgeCorrections++;
  }
  return {product,alpha,edgeCorrections};
}

const requested=new Set(process.argv.slice(2));
for(const entry of entries){
  if(requested.size && !requested.has(entry.id))continue;
  const sourcePath=path.join(repo,'public/images/products',entry.source);
  const bytes=await fs.readFile(sourcePath);
  const source=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {width,height}=source.info;
  assert.equal(width,1000);assert.equal(height,1000);
  const {product,alpha,edgeCorrections}=matte(source.data,width,height,entry);
  if(entry.id==='b024-sage') {
    assert.equal(alpha[423*width+640],0,'Second right aperture must reveal paper');
    assert.equal(alpha[423*width+612],255,'Actual countersink must survive the old offset-circle regression');
  }
  const productPng=await sharp(product,{raw:{width,height,channels:4}}).png().toBuffer();
  const fieldPath=path.join(base,'../empty-fields',entry.field+'.png');
  const fieldBytes=await fs.readFile(fieldPath);
  const field=await sharp(fieldBytes).resize(width,height,{fit:'cover'}).png().toBuffer();
  let transmission=await sharp({create:{width,height,channels:3,background:'#ffffff'}}).png().toBuffer();
  if(entry.ground){
    const recovered=await recoverSourceShadow(bytes,productPng,{paperLevel:255,strength:1});
    const raw=await sharp(recovered).removeAlpha().raw().toBuffer();
    const [left,top,w,h]=entry.ground;
    for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(x<left||x>=left+w||y<top||y>=top+h)raw.fill(255,(y*width+x)*3,(y*width+x)*3+3);
    transmission=await sharp(raw,{raw:{width,height,channels:3}}).png().toBuffer();
  }
  const composite=await composeSourceShadow(field,productPng,transmission);
  const compositeRaw=await sharp(composite).ensureAlpha().raw().toBuffer();
  let compared=0,differences=0;
  for(let p=0;p<width*height;p++)if(alpha[p]===255){compared++;for(let c=0;c<3;c++)if(source.data[p*4+c]!==compositeRaw[p*4+c])differences++;}
  assert.equal(differences,0,'Opaque photographic RGB must remain unchanged');
  const master=composite;
  const output=path.join(base,entry.id);await fs.mkdir(output,{recursive:true});
  await fs.writeFile(path.join(output,'source.webp'),bytes);
  await fs.writeFile(path.join(output,'photographic-matte.png'),productPng);
  await fs.writeFile(path.join(output,'alpha-mask.png'),await sharp(alpha,{raw:{width,height,channels:1}}).png().toBuffer());
  await fs.writeFile(path.join(output,'shadow-transmission.png'),transmission);
  await fs.writeFile(path.join(output,'composition.png'),master);
  await sharp(master).webp({quality:96}).toFile(path.join(output,'composition.webp'));
  const panels=[];
  for(let n=0;n<entry.crops.length;n++){
    const [left,top,w,h]=entry.crops[n];
    const before=await sharp(bytes).extract({left,top,width:w,height:h}).resize(w*3,h*3,{kernel:'nearest'}).png().toBuffer();
    const after=await sharp(composite).extract({left,top,width:w,height:h}).resize(w*3,h*3,{kernel:'nearest'}).png().toBuffer();
    const panel=await sharp({create:{width:w*6+12,height:h*3,channels:3,background:'#d7d7d7'}}).composite([{input:before,left:0,top:0},{input:after,left:w*3+12,top:0}]).png().toBuffer();
    await fs.writeFile(path.join(output,`source-vs-output-${n+1}-3x.png`),panel);
    panels.push(`source-vs-output-${n+1}-3x.png`);
  }
  const receipt={id:entry.id,model:entry.model,category:entry.category,sourcePath,sourceSha256:sha(bytes),sourceDimensions:{width,height},backgroundPath:fieldPath,backgroundSha256:sha(fieldBytes),outputSha256:sha(master),recipe:entry,productRegenerated:false,productRepainted:false,productResized:false,productRotated:false,opaqueRgbPixelsCompared:compared,opaqueRgbChannelDifferences:differences,edgeWhiteMattePixelsAdjusted:edgeCorrections,matte:'Source-specific paper flood seeds plus explicit reviewed exclusions. Only partial-alpha edge RGB is white-paper unpremultiplied using local native photographic colour; protected opaque RGB unchanged. No AI product or new shadow.',sourceShadow:entry.ground??null,mode:entry.mode,caveat:entry.caveat,status:'DRAFT — requires individual visual QA, not client approval',comparisonPanels:panels};
  await fs.writeFile(path.join(output,'provenance.json'),JSON.stringify(receipt,null,2)+'\n');
  console.log(JSON.stringify({id:entry.id,output:path.join(output,'composition.png'),compared,differences}));
}
