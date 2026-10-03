import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import sharp from 'sharp';
const require=createRequire(import.meta.url),ffmpeg=require('ffmpeg-static'),ffprobe=require('ffprobe-static').path;
const [packPath]=process.argv.slice(2);
if(!packPath)throw Error('Usage: node scripts/verify-kanee-fidelity.mjs asset-pack-directory');
const pack=path.resolve(packPath),qa=path.join(pack,'qa');await fs.mkdir(qa,{recursive:true});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const sources=JSON.parse(await fs.readFile(path.join(pack,'sources/provenance.json'),'utf8'));
const plates=JSON.parse(await fs.readFile(path.join(pack,'masters-v2/provenance.json'),'utf8'));
if(plates.length!==20||new Set(plates.map(p=>p.id)).size!==20)throw Error('Expected twenty unique image ids, not twenty unique models');
for(const s of sources){
  if(sha(await fs.readFile(path.join(pack,s.nativePng)))!==s.nativePngSha256)throw Error(`Native source changed: ${s.id}`);
}
for(const p of plates){
  const buf=await fs.readFile(path.join(pack,'masters-v2',p.master));
  if(sha(buf)!==p.masterSha256)throw Error(`Master changed: ${p.id}`);
  if(sha(await fs.readFile(p.source))!==p.sourceSha256)throw Error(`Photo changed: ${p.id}`);
  const m=await sharp(buf).metadata(),web=await sharp(path.join(pack,'masters-v2',p.web)).metadata();
  if(web.width!==m.width||web.height!==m.height)throw Error(`Web size differs: ${p.id}`);
}
function run(binary,args){const r=spawnSync(binary,args,{encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});if(r.status!==0)throw Error(r.error?.message||r.stderr||`${binary} failed`);return r.stdout;}
const video=path.join(pack,'motion/hyde-real-product-motion-trial.mp4');
const meta=JSON.parse(run(ffprobe,['-v','error','-show_streams','-show_format','-of','json',video]));
const v=meta.streams.find(s=>s.codec_type==='video');
if(v.width!==1280||v.height!==720||v.nb_frames!=='540'||meta.streams.some(s=>s.codec_type==='audio')||Math.abs(Number(meta.format.duration)-18)>0.05)throw Error('Motion properties failed');
run(ffmpeg,['-hide_banner','-v','error','-xerror','-i',video,'-an','-f','null','NUL']);
for(const time of [0.4,3,5.4,6.4,9,11.4,12.4,15,17.4]){
  run(ffmpeg,['-y','-v','error','-ss',String(time),'-i',video,'-frames:v','1',path.join(qa,`motion-${time}.png`)]);
}
await fs.writeFile(path.join(qa,'technical-verification.json'),JSON.stringify({imageFiles:plates.length,uniqueModels:new Set(plates.map(p=>p.model)).size,sourceHashesVerified:true,masterHashesVerified:true,webDimensionsVerified:true,video:{width:v.width,height:v.height,fps:v.avg_frame_rate,frames:v.nb_frames,duration:meta.format.duration,bytes:meta.format.size,fullDecodePassed:true,audio:false},visualAcceptance:'Separate visual-qa.json; this check cannot judge photographic realism.'},null,2)+'\n');
console.log('20 image hashes/sizes verified; 540 video frames fully decoded; nine keyframes extracted. Visual QA remains independent.');
