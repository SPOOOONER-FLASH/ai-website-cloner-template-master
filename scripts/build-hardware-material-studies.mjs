import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { cutOut } from './lib/product-cutout.mjs';

const base = path.resolve('docs/design-references/2026-09-09-professional-hardware-sets');
const dest = path.join(base, 'material-studies');
fs.mkdirSync(dest, { recursive: true });
const studies = [
  {id:'564-warm-stone',slug:'564-night-latch-and-rim-lock',model:'564',components:2,seeds:[[95,480],[503,350],[905,500],[500,645]],color:[.57,.54,.48],width:1.72},
  {id:'310-cool-stone',slug:'310-panic-exit-device',model:'310',components:1,seeds:[],color:[.52,.55,.56],width:1.75},
];
for (const study of studies) {
  const source = path.join(base,'references',study.slug+'.webp');
  const {data,info} = await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const original = Buffer.from(data);
  for (const [x,y] of study.seeds) {
    const seen = new Set();
    const stack = [y*info.width+x];
    while(stack.length) {
      const p=stack.pop();
      if(seen.has(p)||Math.min(...data.subarray(p*4,p*4+3))<247) continue;
      seen.add(p);data[p*4+3]=0;
      const px=p%info.width,py=Math.floor(p/info.width);
      if(px)stack.push(p-1);if(px+1<info.width)stack.push(p+1);
      if(py)stack.push(p-info.width);if(py+1<info.height)stack.push(p+info.width);
    }
  }
  const seedFile=path.join(dest,study.id+'-seeded.png');
  await sharp(data,{raw:info}).png().toFile(seedFile);
  const cut=await cutOut(seedFile);
  const pixels=await sharp(cut.buffer).ensureAlpha().raw().toBuffer();
  // Recover the crop offset from retained RGB, then check EVERY output RGB pixel.
  const probes=[0,Math.floor(cut.width*.3),Math.floor(cut.width*cut.height*.4),cut.width*cut.height-1];
  let offset;
  search: for(let y=0;y<=info.height-cut.height;y++)for(let x=0;x<=info.width-cut.width;x++) {
    if(probes.every(p=>[0,1,2].every(c=>original[((y+Math.floor(p/cut.width))*info.width+x+p%cut.width)*4+c]===pixels[p*4+c]))) {
      let same=true;
      for(let p=0;p<cut.width*cut.height&&same;p++)for(let c=0;c<3;c++)if(original[((y+Math.floor(p/cut.width))*info.width+x+p%cut.width)*4+c]!==pixels[p*4+c]){same=false;break;}
      if(same){offset=[x,y];break search;}
    }
  }
  if(!offset)throw Error('Retained source RGB mismatch: '+study.id);
  // The two reviewed products have no detached tiny accessories. Remove isolated
  // backdrop specks, then attenuate only pale matte on the existing alpha boundary.
  const alpha=Uint8Array.from({length:cut.width*cut.height},(_,p)=>pixels[p*4+3]);
  const visited=new Set(), components=[];
  const neighbors=p=>{const x=p%cut.width,y=Math.floor(p/cut.width);return [x?p-1:-1,x+1<cut.width?p+1:-1,y?p-cut.width:-1,y+1<cut.height?p+cut.width:-1].filter(q=>q>=0);};
  for(let p=0;p<alpha.length;p++) {
    if(!alpha[p]||visited.has(p))continue;
    const todo=[p],component=[];visited.add(p);
    while(todo.length){const q=todo.pop();component.push(q);for(const n of neighbors(q))if(alpha[n]&&!visited.has(n)){visited.add(n);todo.push(n);}}
    components.push(component);
  }
  components.sort((a,b)=>b.length-a.length);
  for(const component of components.slice(study.components))for(const q of component)alpha[q]=0;
  for(let p=0;p<alpha.length;p++) {
    let opacity=alpha[p];
    const edge=neighbors(p).some(q=>!alpha[q]||neighbors(q).some(r=>!alpha[r]));
    if(opacity&&edge){const pale=Math.min(...pixels.subarray(p*4,p*4+3));if(pale>220)opacity=25;else if(pale>190)opacity=110;}
    pixels[p*4+3]=opacity;
  }
  const texture=path.join(dest,study.id+'-texture.png');
  await sharp(pixels,{raw:{width:cut.width,height:cut.height,channels:4}}).png().toFile(texture);
  const config={...study,source,sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),texture,textureWidth:cut.width,textureHeight:cut.height,cropOffset:offset,exactSourceRGB:true,alphaTreatment:'Reviewed four holes for 564; retain the two real connected parts for 564, one complete connected device for 310; remove detached background artefacts. Pale matte attenuated within two pixels of existing edges. RGB unchanged.',outputDirectory:dest};
  const configFile=path.join(dest,study.id+'.json');
  fs.writeFileSync(configFile,JSON.stringify(config,null,2)+'\n');
  const log=execFileSync('C:/Program Files/Blender Foundation/Blender 5.2/blender.exe',['--background','--python-exit-code','1','--python',path.resolve('scripts/blender/hardware-material-study.py'),'--',configFile],{encoding:'utf8',maxBuffer:4*1024*1024});
  fs.writeFileSync(path.join(dest,study.id+'.log'),log);
  if(!log.includes('MATERIAL_STUDY_OK'))throw Error(study.id);
  console.log('Completed '+study.id);
}
