import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import * as renderer from './build-kanee-source-shadow.mjs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

const png = (pixels, width, height) => sharp(Buffer.from(pixels), {
  raw: { width, height, channels: 4 },
}).png().toBuffer();

// Catches losing RGB shadows merely because a PSD extraction has zero alpha.
test('recovers supplied shadow transmission, not alpha silhouettes or white paper', async () => {
  const source = await png([
    255,255,255,0, 128,128,128,0, 12,12,12,255, 240,240,240,0,
  ], 4, 1);
  const product = await png([
    0,0,0,0, 0,0,0,0, 12,12,12,255, 0,0,0,0,
  ], 4, 1);
  const transmission = await renderer.recoverSourceShadow(source, product, {
    paperLevel: 255, strength: 1,
  });
  const raw = await sharp(transmission).raw().toBuffer();
  assert.deepEqual([...raw], [255,255,255, 128,128,128, 255,255,255, 240,240,240]);
});

// Catches shading real opaque metal, moving a shadow, or painting outside its source frame.
test('multiplication follows original source coordinates and product RGB wins unchanged', async () => {
  const bg = await sharp({create:{width:6,height:2,channels:3,background:'#c8b496'}}).png().toBuffer();
  const product = await png([0,0,0,0, 20,30,40,255], 2, 1);
  const shadow = await sharp(Buffer.from([128,128,128,255,255,255]), {
    raw:{width:2,height:1,channels:3},
  }).png().toBuffer();
  const out = await renderer.composeSourceShadow(bg, product, shadow, {left:2,top:1});
  const raw = await sharp(out).ensureAlpha().raw().toBuffer();
  const pixel = (x,y) => [...raw.subarray((y*6+x)*4, (y*6+x)*4+4)];
  assert.deepEqual(pixel(2,1), [100,90,75,255]);
  assert.deepEqual(pixel(3,1), [20,30,40,255]);
  assert.deepEqual(pixel(1,1), [200,180,150,255]);
  assert.deepEqual(pixel(2,0), [200,180,150,255]);
});

test('rejects mismatched photo and product mask instead of guessing alignment', async () => {
  const a = await png([255,255,255,0],1,1);
  const b = await png([0,0,0,0, 0,0,0,0],2,1);
  await assert.rejects(renderer.recoverSourceShadow(a,b,{paperLevel:255,strength:1}), /dimensions/);
});

test('rejects cropping a genuine photo or rescaling a shadow independently', async () => {
  const bg = await sharp({create:{width:2,height:2,channels:3,background:'#aaa'}}).png().toBuffer();
  const product = await png([20,30,40,255, 20,30,40,255],2,1);
  const shadow = await sharp({create:{width:2,height:1,channels:3,background:'#888'}}).png().toBuffer();
  await assert.rejects(renderer.composeSourceShadow(bg,product,shadow,{left:1,top:0}), /crop/);
  const wrong = await sharp(shadow).resize(1,1).png().toBuffer();
  await assert.rejects(renderer.composeSourceShadow(bg,product,wrong,{left:0,top:0}), /dimensions/);
});

test('restores an explicitly identified enclosed mask omission from original RGB only', async () => {
  const productPixels = [];
  const sourcePixels = [];
  for (let p=0;p<9;p++) {
    productPixels.push(20,30,40,p===4?0:255);
    sourcePixels.push(p===4?180:22,p===4?185:32,p===4?190:42,255);
  }
  const product = await png(productPixels,3,3);
  const source = await png(sourcePixels,3,3);
  const restored = await renderer.restoreEnclosedSourceRegion(source,product,{x:1,y:1});
  const raw = await sharp(restored).ensureAlpha().raw().toBuffer();
  assert.deepEqual([...raw.subarray(16,20)],[180,185,190,255]);
  assert.deepEqual([...raw.subarray(0,4)],[20,30,40,255]);
  await assert.rejects(renderer.restoreEnclosedSourceRegion(source,product,{x:0,y:0}), /transparent/);
  const exposed = await png([20,30,40,0],1,1);
  await assert.rejects(renderer.restoreEnclosedSourceRegion(exposed,exposed,{x:0,y:0}), /exterior/);
});

test('pilot adjusts only empty field and pins both genuine source hashes', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(),'codex-shadow-test-'));
  try {
    const product = await png([20,30,40,255],1,1);
    const full = await png([20,30,40,255,128,128,128,0],2,1);
    const field = await png([100,100,100,255,100,100,100,255],2,1);
    const hash = b => crypto.createHash('sha256').update(b).digest('hex');
    await fs.writeFile(path.join(dir,'product.png'),product);
    await fs.writeFile(path.join(dir,'full.png'),full);
    await fs.writeFile(path.join(dir,'field.png'),field);
    const spec = {sourceProduct:'product.png',sourceFullPhoto:'full.png',background:'field.png',
      sourceProductSha256:hash(product),sourceFullPhotoSha256:hash(full),sourceOffset:{left:0,top:0},
      calibration:{paperLevel:255,strength:1},backgroundGain:.8};
    await fs.writeFile(path.join(dir,'spec.json'),JSON.stringify(spec));
    const receipt = await renderer.buildShadowPilot(path.join(dir,'spec.json'),path.join(dir,'out'));
    const raw = await sharp(path.join(dir,'out/564-mb-source-shadow.png')).ensureAlpha().raw().toBuffer();
    assert.deepEqual([...raw],[20,30,40,255,40,40,40,255]);
    assert.equal(receipt.opaqueRgbDifferences,0);
    assert.deepEqual(await fs.readFile(path.join(dir,'product.png')),product);
    spec.sourceProductSha256 = 'wrong';
    await fs.writeFile(path.join(dir,'spec.json'),JSON.stringify(spec));
    await assert.rejects(renderer.buildShadowPilot(path.join(dir,'spec.json'),path.join(dir,'refuse')),/hash changed/);
  } finally {
    await fs.rm(dir,{recursive:true,force:true});
  }
});
