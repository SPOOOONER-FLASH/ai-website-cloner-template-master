import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

/** Restore only a reviewer-identified enclosed alpha omission, from aligned real
 * source RGB. An exterior field or opaque product seed is never flood-filled. */
export async function restoreEnclosedSourceRegion(source, product, {x,y}) {
  const full = await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const fg = await sharp(product).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {width,height} = fg.info;
  if (width !== full.info.width || height !== full.info.height) throw new Error('Source restore dimensions must match');
  if (!Number.isInteger(x) || !Number.isInteger(y) || x<0 || y<0 || x>=width || y>=height ||
      fg.data[(y*width+x)*4+3] !== 0) throw new Error('Restoration seed must be a transparent source omission');
  const seen = new Uint8Array(width*height);
  const queue = [y*width+x];
  seen[queue[0]] = 1;
  for (let n=0;n<queue.length;n++) {
    const p=queue[n], px=p%width, py=Math.floor(p/width);
    if (px===0 || py===0 || px===width-1 || py===height-1) throw new Error('Refusing exterior background restoration');
    for (const q of [p-1,p+1,p-width,p+width]) {
      if (!seen[q] && fg.data[q*4+3]===0) { seen[q]=1;queue.push(q); }
    }
  }
  for (const p of queue) {
    full.data.copy(fg.data,p*4,p*4,p*4+3);
    fg.data[p*4+3] = 255;
  }
  return sharp(fg.data,{raw:{width,height,channels:4}}).png().toBuffer();
}

/** Recover the white-field photo's supplied ground shading, including RGB hidden
 * beneath zero alpha in a PSD extraction. No translated silhouette or new shadow. */
export async function recoverSourceShadow(source, product, {paperLevel = 255, strength = 1} = {}) {
  if (!Number.isFinite(paperLevel) || paperLevel < 220 || paperLevel > 255 ||
      !Number.isFinite(strength) || strength <= 0 || strength > 1) {
    throw new Error('Invalid source paper calibration');
  }
  const photo = await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const mask = await sharp(product).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  if (photo.info.width !== mask.info.width || photo.info.height !== mask.info.height) {
    throw new Error('Source and product mask dimensions must match');
  }
  const transmission = Buffer.alloc(photo.info.width * photo.info.height * 3, 255);
  for (let p = 0; p < photo.info.width * photo.info.height; p++) {
    const i = p * 4;
    // All photographed hardware pixels, including its antialias edge, are protected.
    if (mask.data[i + 3] > 0) continue;
    const luminance = .2126 * photo.data[i] + .7152 * photo.data[i+1] + .0722 * photo.data[i+2];
    const value = Math.round(255 * (1 - strength * (1 - Math.min(1, luminance / paperLevel))));
    transmission.fill(value, p*3, p*3+3);
  }
  return sharp(transmission, {raw:{width:photo.info.width,height:photo.info.height,channels:3}}).png().toBuffer();
}

/** Multiply only the photographic ground transmission; real photo RGB goes last.
 * Product and shadow stay in one source coordinate system, without independent resize. */
export async function composeSourceShadow(background, product, transmission, {left = 0, top = 0} = {}) {
  const bg = await sharp(background).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const fg = await sharp(product).metadata();
  const shadow = await sharp(transmission).removeAlpha().raw().toBuffer({resolveWithObject:true});
  if (fg.width !== shadow.info.width || fg.height !== shadow.info.height) {
    throw new Error('Product and shadow dimensions must match');
  }
  if (!Number.isInteger(left) || !Number.isInteger(top) || left < 0 || top < 0 ||
      left + fg.width > bg.info.width || top + fg.height > bg.info.height) {
    throw new Error('Refusing to crop genuine source photo');
  }
  for (let y = 0; y < fg.height; y++) for (let x = 0; x < fg.width; x++) {
    const p = ((top+y)*bg.info.width+left+x)*4;
    const s = (y*fg.width+x)*3;
    for (let c = 0; c < 3; c++) bg.data[p+c] = Math.round(bg.data[p+c] * shadow.data[s+c] / 255);
  }
  const shaded = await sharp(bg.data, {raw:{width:bg.info.width,height:bg.info.height,channels:4}}).png().toBuffer();
  return sharp(shaded).composite([{input:product,left,top}]).png().toBuffer();
}

export async function buildShadowPilot(specPath, outputDirectory) {
  const spec = JSON.parse(await fs.readFile(specPath,'utf8'));
  const base = path.dirname(path.resolve(specPath));
  const source = await fs.readFile(path.resolve(base,spec.sourceProduct));
  const shadowPhoto = await fs.readFile(path.resolve(base,spec.sourceFullPhoto));
  const background = await fs.readFile(path.resolve(base,spec.background));
  const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  if (spec.sourceProductSha256 !== hash(source) || spec.sourceFullPhotoSha256 !== hash(shadowPhoto)) {
    throw new Error('Cached genuine source hash changed');
  }
  const full = await sharp(shadowPhoto).metadata();
  let product = await sharp({create:{width:full.width,height:full.height,channels:4,background:'#00000000'}})
    .composite([{input:source,left:spec.sourceOffset.left,top:spec.sourceOffset.top}]).png().toBuffer();
  const recoveredRegions = [];
  const restoredIndices = [];
  for (const region of spec.restoreSourceRegions ?? []) {
    const before = await sharp(product).ensureAlpha().raw().toBuffer();
    product = await restoreEnclosedSourceRegion(shadowPhoto,product,region.seed);
    const after = await sharp(product).ensureAlpha().raw().toBuffer();
    let count = 0;
    for (let p=0;p<full.width*full.height;p++) if (before[p*4+3]===0 && after[p*4+3]===255) {
      count++;restoredIndices.push(p);
    }
    recoveredRegions.push({...region,restoredPixels:count});
  }
  const transmission = await recoverSourceShadow(shadowPhoto, product, spec.calibration);
  const fieldPipe = sharp(background).resize(full.width,full.height,{fit:'cover'});
  if (spec.backgroundBlur !== undefined) {
    if (!Number.isFinite(spec.backgroundBlur) || spec.backgroundBlur<.3 || spec.backgroundBlur>10) throw new Error('Invalid background blur');
    fieldPipe.blur(spec.backgroundBlur);
  }
  if (spec.backgroundGain !== undefined) {
    if (!Number.isFinite(spec.backgroundGain) || spec.backgroundGain<.5 || spec.backgroundGain>1) throw new Error('Invalid background gain');
    fieldPipe.linear(spec.backgroundGain,0);
  }
  const field = await fieldPipe.png().toBuffer();
  const output = await composeSourceShadow(field,product,transmission);
  const sourceRaw = await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const outRaw = await sharp(output).ensureAlpha().raw().toBuffer();
  let compared = 0, differences = 0;
  for (let y = 0; y < sourceRaw.info.height; y++) for (let x = 0; x < sourceRaw.info.width; x++) {
    const p = (y*sourceRaw.info.width+x)*4;
    const q = ((y+spec.sourceOffset.top)*full.width+x+spec.sourceOffset.left)*4;
    if (sourceRaw.data[p+3] !== 255) continue;
    compared++;
    if ([0,1,2].some(c => sourceRaw.data[p+c] !== outRaw[q+c])) differences++;
  }
  if (differences) throw new Error('Opaque real product RGB changed');
  const fullRaw = await sharp(shadowPhoto).ensureAlpha().raw().toBuffer();
  let restoredDifferences = 0;
  for (const p of restoredIndices) if ([0,1,2].some(c => outRaw[p*4+c] !== fullRaw[p*4+c])) restoredDifferences++;
  if (restoredDifferences) throw new Error('Restored original photo RGB changed');
  await fs.mkdir(outputDirectory,{recursive:true});
  await fs.writeFile(path.join(outputDirectory,'564-mb-source-shadow.png'),output);
  await sharp(output).webp({quality:94}).toFile(path.join(outputDirectory,'564-mb-source-shadow.webp'));
  await fs.writeFile(path.join(outputDirectory,'shadow-transmission.png'),transmission);
  const receipt = {
    model:'564 MB',status:'Review sample only; not client-approved or deployed',
    originalLibrary:spec.originalLibrary,originalPsdSha256:spec.originalPsdSha256,
    cacheStatus:'G drive absent this session; using previously extracted and hash-checked G-source layers',
    sourceProduct:spec.sourceProduct,sourceProductSha256:hash(source),
    sourceFullPhoto:spec.sourceFullPhoto,sourceFullPhotoSha256:hash(shadowPhoto),
    sourceOffset:spec.sourceOffset,background:spec.background,backgroundSha256:hash(background),
    width:full.width,height:full.height,productResize:false,productRotation:false,
    productRegenerated:false,productRepainted:false,opaqueRgbPixelsCompared:compared,opaqueRgbDifferences:differences,
    recoveredRegions,restoredSourcePixelsCompared:restoredIndices.length,restoredSourceRgbDifferences:restoredDifferences,
    backgroundOnlyAdjustment:{blur:spec.backgroundBlur ?? 0,gain:spec.backgroundGain ?? 1},
    shadow:'Original full photographic layer luminance outside native product alpha, neutral multiply transmission; no offset silhouette, ellipse, added blur or extrapolation',
    calibration:spec.calibration,masterSha256:hash(output),
    limitation:'Preserves supplied photographic lighting and view. No claim that PSD shadows are untouched camera capture. Pixel fidelity is not aesthetic acceptance.',
  };
  await fs.writeFile(path.join(outputDirectory,'provenance.json'),JSON.stringify(receipt,null,2)+'\n');
  console.log(JSON.stringify(receipt,null,2));
  return receipt;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [spec,out] = process.argv.slice(2);
  if (!spec || !out) throw new Error('Usage: node scripts/build-kanee-source-shadow.mjs spec.json output-directory');
  await buildShadowPilot(spec,out);
}
