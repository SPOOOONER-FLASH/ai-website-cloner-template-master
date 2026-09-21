import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import crypto from 'node:crypto';
import {cutOut} from './lib/product-cutout.mjs';
const base='docs/design-references/2026-09-14-curated-hardware';
const scenes=JSON.parse(fs.readFileSync(base+'/scenes.json'));
const output=[];
for(const item of scenes[0].photos){
  const [left,top,width,height]=item.crop;
  const source=await sharp(item.source).extract({left,top,width,height}).png().toBuffer();
  const pre=base+'/'+item.slug+'-crop.png';fs.writeFileSync(pre,source);
  const cut=await cutOut(pre);
  const original=await sharp(source).ensureAlpha().raw().toBuffer();
  const pixels=await sharp(cut.buffer).ensureAlpha().raw().toBuffer();
  const probes=[0,Math.floor(cut.width*.3),Math.floor(cut.width*cut.height*.4),cut.width*cut.height-1];
  let offset;
  search:for(let y=0;y<=height-cut.height;y++)for(let x=0;x<=width-cut.width;x++){
    if(!probes.every(p=>[0,1,2].every(c=>original[((y+Math.floor(p/cut.width))*width+x+p%cut.width)*4+c]===pixels[p*4+c])))continue;
    let same=true;for(let p=0;p<cut.width*cut.height&&same;p++)for(let c=0;c<3;c++)if(original[((y+Math.floor(p/cut.width))*width+x+p%cut.width)*4+c]!==pixels[p*4+c]){same=false;break;}
    if(same){offset=[x,y];break search;}
  }
  if(!offset)throw Error('Changed RGB '+item.slug);
  const seeds=item.slug==='9004s-stainless-steel-handle'?[[145,500]]:item.slug==='70sn-lock-cylinder'?[[709,229]]:[[384,31],[381,92],[98,746],[41,806],[214,637]];
  const holeAreas=[];
  for(const [sx,sy] of seeds){
    if(sx>=cut.width||sy>=cut.height)throw Error('Seed outside image');
    const todo=[sy*cut.width+sx],seen=new Set();
    while(todo.length){const q=todo.pop();if(seen.has(q)||pixels[q*4+3]===0||Math.min(...pixels.subarray(q*4,q*4+3))<247)continue;seen.add(q);const x=q%cut.width,y=Math.floor(q/cut.width);if(x)todo.push(q-1);if(x+1<cut.width)todo.push(q+1);if(y)todo.push(q-cut.width);if(y+1<cut.height)todo.push(q+cut.width);}
    if(seen.size>cut.width*cut.height*.08)throw Error('Hole seed leaked');for(const q of seen)pixels[q*4+3]=0;holeAreas.push(seen.size);
  }
  const opacity=Uint8Array.from({length:cut.width*cut.height},(_,p)=>pixels[p*4+3]);
  for(let q=0;q<opacity.length;q++){
    if(!opacity[q])continue;const x=q%cut.width,y=Math.floor(q/cut.width);
    const near=[x?q-1:-1,x+1<cut.width?q+1:-1,y?q-cut.width:-1,y+1<cut.height?q+cut.width:-1].filter(n=>n>=0);
    if(near.some(n=>!opacity[n])){const pale=Math.min(...pixels.subarray(q*4,q*4+3));if(pale>230)pixels[q*4+3]=75;else if(pale>200)pixels[q*4+3]=170;}
  }
  const final=await sharp(pixels,{raw:{width:cut.width,height:cut.height,channels:4}}).png().toBuffer();
  const file=base+'/'+item.slug+'-alpha.png';fs.writeFileSync(file,final);
  output.push({...item,texture:path.resolve(file),textureSha256:crypto.createHash('sha256').update(final).digest('hex'),reviewedHoleSeeds:seeds,holeAreas,textureWidth:cut.width,textureHeight:cut.height,cropOffset:offset,exactSourceRGB:true});
}
fs.writeFileSync(base+'/alpha-review.json',JSON.stringify(output,null,2));console.log('Three source RGB checks passed; masks require visual review');
