import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {selectNativeProductLayer} from './kanee-psd-layer.mjs';

// Extract only expressly reviewed photographic layers. No full-PSD flattening or AI metal.
const [manifestPath, sourceRoot, outputPath] = process.argv.slice(2);
if(!manifestPath || !sourceRoot || !outputPath) throw Error('Usage: node scripts/build-kanee-fidelity-sources.mjs manifest.json original-source-root output-directory');
const entries=JSON.parse(await fs.readFile(manifestPath,'utf8'));
const root=path.resolve(sourceRoot),out=path.resolve(outputPath);
await fs.mkdir(out,{recursive:true});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const receipts=[];
for(const item of entries){
  const source=path.resolve(root,item.relativeSource);
  if(!source.startsWith(root+path.sep))throw Error('Source outside approved source root');
  if(!/^[a-z0-9-]+$/.test(item.id))throw Error('Invalid output id');
  const buffer=await fs.readFile(source),l=selectNativeProductLayer(buffer,item.layerIndex);
  const image=await sharp(l.rgba,{raw:{width:l.width,height:l.height,channels:4}}).png().toBuffer();
  await fs.writeFile(path.join(out,`${item.id}.png`),image);
  receipts.push({id:item.id,model:item.model,source,sourceSha256:sha(buffer),layerIndex:l.index,
    layerName:l.name,originalLayerWidth:l.width,originalLayerHeight:l.height,pixelSha256:sha(l.rgba),
    nativePng:`sources/${item.id}.png`,nativePngSha256:sha(image),
    scope:'Real photographic portrait, not a claim of a supplied kit. Original manufacturing colours retained. No invented finish, quantity, compatibility, dimensions or certification.'});
}
await fs.writeFile(path.join(out,'provenance.json'),JSON.stringify(receipts,null,2)+'\n');
console.log(`${receipts.length} native photographic layers extracted; visual acceptance remains separate.`);
