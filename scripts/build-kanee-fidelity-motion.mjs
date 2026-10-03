import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
import {build} from './build-kanee-fidelity-masters.mjs';
const require=createRequire(import.meta.url);
const ffmpeg=require('ffmpeg-static');
const [specPath,outputPath]=process.argv.slice(2);
if(!specPath||!outputPath)throw Error('Usage: node scripts/build-kanee-fidelity-motion.mjs motion-spec.json output-directory');
const out=path.resolve(outputPath);await fs.mkdir(out,{recursive:true});
const frames=path.join(out,'stills');await build(specPath,frames);
const {plates}=JSON.parse(await fs.readFile(specPath,'utf8'));
async function run(args){
  await new Promise((resolve,reject)=>{
    const child=spawn(ffmpeg,args,{stdio:'inherit',windowsHide:true});
    child.once('error',reject);child.once('exit',code=>code===0?resolve():reject(Error(`ffmpeg exited ${code}`)));
  });
}
const clips=[];
for(let i=0;i<plates.length;i++){
  const clip=path.join(out,`shot-${i+1}.mp4`);clips.push(clip);
  await run(['-y','-hide_banner','-loglevel','error','-i',path.join(frames,`${plates[i].id}.png`),
    '-vf',"scale=2560:1440,zoompan=z='1+0.035*sin(PI*on/179)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=180:s=1280x720:fps=30,fade=t=in:st=0:d=0.35,fade=t=out:st=5.65:d=0.35,format=yuv420p",
    '-frames:v','180','-an','-c:v','libx264','-preset','medium','-crf','19','-movflags','+faststart',clip]);
}
const list=path.join(out,'concat.txt');
await fs.writeFile(list,clips.map(p=>`file '${p.replaceAll('\\','/').replaceAll("'","'\\''")}'`).join('\n')+'\n');
await run(['-y','-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',list,'-c','copy','-movflags','+faststart',path.join(out,'hyde-real-product-motion-trial.mp4')]);
await fs.writeFile(path.join(out,'motion-receipt.json'),JSON.stringify({method:'2D movement of real-photo compositions, not 3D rotation or moving light',durationSeconds:plates.length*6,fps:30,width:1280,height:720,audio:false,products:plates.map(p=>p.model),maximumZoom:1.035,brandedReferenceFramesUsed:false,productRegenerated:false,qa:'Pending full decode and visual keyframe review'},null,2)+'\n');
console.log('Original HYDE photo-motion trial rendered. Not equivalent to continuous 3D FSB rotation.');
