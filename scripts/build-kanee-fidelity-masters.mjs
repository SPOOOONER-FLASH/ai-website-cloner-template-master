import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { cutOut } from './lib/product-cutout.mjs';
import {selectNativeProductLayer} from './kanee-psd-layer.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sha = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

export async function cleanPhotographicMatte(photo, paperSeeds = [], {cleanBoundary = true} = {}) {
  const { data, info } = await sharp(photo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const width = info.width, height = info.height;
  const paper = (p) => data[p*4] >= 247 && data[p*4+1] >= 247 && data[p*4+2] >= 247;
  for (const [nx, ny] of paperSeeds) {
    const x = Math.floor(nx * width), y = Math.floor(ny * height);
    if (x < 0 || y < 0 || x >= width || y >= height || !paper(y*width+x)) {
      throw new Error('Verified aperture seed is not white paper; refusing to erase metal');
    }
    const stack = [y*width+x], visited = new Uint8Array(width*height);
    while (stack.length) {
      const p = stack.pop();
      if (visited[p]) continue;
      visited[p] = 1;
      if (!paper(p)) continue;
      data[p*4+3] = 0;
      const px = p%width, py = Math.floor(p/width);
      if (px>0) stack.push(p-1);
      if (px<width-1) stack.push(p+1);
      if (py>0) stack.push(p-width);
      if (py<height-1) stack.push(p+width);
    }
  }
  // Clean pure paper at the existing silhouette only. RGB values are never repainted.
  const alpha = Buffer.from(data);
  if (cleanBoundary) for (let y=1;y<height-1;y++) for (let x=1;x<width-1;x++) {
    const p=y*width+x;
    if (alpha[p*4+3] === 0 || !paper(p)) continue;
    if ([p-1,p+1,p-width,p+width].some(n => alpha[n*4+3] === 0)) data[p*4+3] = 0;
  }
  return sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

async function shadowLayer(photo, opacity, blur, pad) {
  const { data, info } = await sharp(photo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const shadow = Buffer.from(data);
  for (let offset = 0; offset < shadow.length; offset += 4) {
    shadow[offset] = 0;
    shadow[offset + 1] = 0;
    shadow[offset + 2] = 0;
    shadow[offset + 3] = Math.round(data[offset + 3] * opacity);
  }
  return sharp(shadow, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .blur(blur).png().toBuffer();
}

/** Photo is immutable RGBA. Only a separate shadow copy is modified. No image-model product pixels. */
export async function composeRealPhoto(background, photo, { left, top, shadow = true }) {
  const bg = await sharp(background).metadata();
  const fg = await sharp(photo).metadata();
  if (left < 0 || top < 0 || left + fg.width > bg.width || top + fg.height > bg.height) {
    throw new Error('Product outside photographic field; refusing to crop real hardware');
  }
  const layers = [];
  if (shadow) {
    const pad = 48;
    if (left < pad || top < pad || left + fg.width + pad + 16 > bg.width || top + fg.height + pad + 12 > bg.height) {
      throw new Error('Shadow outside photographic field; enlarge the clear margin');
    }
    layers.push({ input: await shadowLayer(photo, 0.18, 15, pad), left: left - pad + 16, top: top - pad + 12 });
    layers.push({ input: await shadowLayer(photo, 0.36, 3, pad), left: left - pad + 3, top: top - pad + 4 });
  }
  layers.push({ input: photo, left, top });
  return sharp(background).composite(layers).png().toBuffer();
}

export async function build(inputPath, outputPath) {
  const specification = JSON.parse(await fs.readFile(inputPath, 'utf8'));
  const output = path.resolve(outputPath);
  await fs.mkdir(output, { recursive: true });
  const receipts = [];
  for (const item of specification.plates) {
    const source = path.resolve(root, item.source);
    const backgroundPath = path.resolve(root, item.background);
    const sourceBuffer = await fs.readFile(source);
    const bgBuffer = await fs.readFile(backgroundPath);
    let cut;
    let native;
    if (Number.isInteger(item.nativeLayerIndex)) {
      native = selectNativeProductLayer(sourceBuffer, item.nativeLayerIndex);
      cut = { buffer: await sharp(native.rgba, {raw: {width:native.width,height:native.height,channels:4}}).png().toBuffer(), width:native.width, height:native.height };
    } else if(item.nativePng) {
      const m=await sharp(sourceBuffer).metadata();
      if(m.format!=='png'||!m.hasAlpha)throw Error('Native photo must be a lossless RGBA PNG');
      cut={buffer:sourceBuffer,width:m.width,height:m.height};native={index:item.sourceLayerIndex,name:item.sourceLayerName,width:m.width,height:m.height};
    } else cut = await cutOut(source);
    const width = item.width ?? specification.width ?? 1600;
    const height = item.height ?? specification.height ?? 1000;
    let bg = sharp(bgBuffer).resize(width, height, { fit: 'cover' });
    if (item.backgroundBlur) bg = bg.blur(item.backgroundBlur);
    const background = await bg.png().toBuffer();
    const matte = native && !item.paperSeeds?.length ? cut.buffer : await cleanPhotographicMatte(cut.buffer, item.paperSeeds ?? [], {cleanBoundary:!native});
    const photo = await sharp(matte).resize(item.maxWidth ?? 1080, item.maxHeight ?? 690, { fit: 'inside' }).png().toBuffer({ resolveWithObject: true });
    if (photo.info.width / cut.width > 1.5 || photo.info.height / cut.height > 1.5) throw new Error(`${item.id}: excessive source enlargement`);
    const left = item.left ?? Math.round((width - photo.info.width) / 2);
    const top = item.top ?? Math.round((height - photo.info.height) / 2);
    const composed = await composeRealPhoto(background, photo.data, { left, top, shadow: item.shadow !== false });
    const master = `${item.id}.png`;
    const web = `${item.id}.webp`;
    await fs.writeFile(path.join(output, master), composed);
    await sharp(composed).webp({ quality: 92 }).toFile(path.join(output, web));
    receipts.push({ id: item.id, model: item.model, source: item.source, sourceSha256: sha(sourceBuffer),
      background: item.background, backgroundSha256: sha(bgBuffer), master, masterSha256: sha(composed), web,
      method: native ? 'original PSD RGB/alpha layer; uniform resize; background-only field; separate shadow' : 'guarded source-pixel cutout; uniform resize; background-only field; separate shadow',
      nativeLayer: native ? {index:native.index,name:native.name,width:native.width,height:native.height} : undefined,
      role: item.role ?? 'full-product',
      sourceProductRegenerated: false, sourceProductRepainted: false,
      placement: { left, top, width: photo.info.width, height: photo.info.height },
      verifiedPaperSeeds: item.paperSeeds ?? [],
      qa: 'pending visual review; generator success does not imply acceptance' });
  }
  await fs.writeFile(path.join(output, 'provenance.json'), JSON.stringify(receipts, null, 2) + '\n');
  console.log(`${receipts.length} real-photo studies rendered to ${output}; visual acceptance is separate.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) throw new Error('Usage: node scripts/build-kanee-fidelity-masters.mjs input.json output-directory');
  await build(input, output);
}
