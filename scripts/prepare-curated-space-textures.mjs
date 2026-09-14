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
  const file=base+'/'+item.slug+'-alpha.png';fs.writeFileSync(file,cut.buffer);
  output.push({...item,texture:path.resolve(file),textureSha256:crypto.createHash('sha256').update(cut.buffer).digest('hex'),textureWidth:cut.width,textureHeight:cut.height,cropOffset:offset,exactSourceRGB:true});
}
fs.writeFileSync(base+'/alpha-review.json',JSON.stringify(output,null,2));console.log('Three source RGB checks passed; masks require visual review');
