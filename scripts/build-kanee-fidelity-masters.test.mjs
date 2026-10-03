import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { composeRealPhoto, cleanPhotographicMatte } from './build-kanee-fidelity-masters.mjs';

// Repainting the foreground or adding a side card must fail this boundary test.
test('preserves opaque source pixels and retains the continuous background', async () => {
  const background = await sharp({ create: { width: 40, height: 30, channels: 3, background: '#34404a' } }).png().toBuffer();
  const photo = await sharp({ create: { width: 10, height: 10, channels: 4, background: { r: 163, g: 121, b: 67, alpha: 1 } } }).png().toBuffer();
  const result = await composeRealPhoto(background, photo, { left: 15, top: 10, shadow: false });
  const raw = await sharp(result).removeAlpha().raw().toBuffer();
  const pixel = (x, y) => [...raw.subarray((y * 40 + x) * 3, (y * 40 + x) * 3 + 3)];
  assert.deepEqual(pixel(19, 14), [163, 121, 67]);
  assert.deepEqual(pixel(35, 14), [52, 64, 74]);
  assert.deepEqual(pixel(1, 1), [52, 64, 74]);
});

test('does not allow a composition to crop away a product edge', async () => {
  const bg = await sharp({ create: { width: 20, height: 20, channels: 3, background: '#ddd' } }).png().toBuffer();
  const photo = await sharp({ create: { width: 10, height: 10, channels: 4, background: '#777' } }).png().toBuffer();
  await assert.rejects(composeRealPhoto(bg, photo, { left: 15, top: 15 }), /outside/);
});

// A trapped white-paper aperture must not survive on a dark field; nearby metal must.
test('removes only connected paper from a manually verified aperture seed', async () => {
  const data = Buffer.alloc(7 * 7 * 4);
  for (let p = 0; p < 49; p++) { data[p*4] = 70; data[p*4+1] = 80; data[p*4+2] = 90; data[p*4+3] = 255; }
  data.set([255, 255, 255, 255], (3*7+3)*4);
  const photo = await sharp(data, { raw: { width: 7, height: 7, channels: 4 } }).png().toBuffer();
  const result = await cleanPhotographicMatte(photo, [[3/7,3/7]]);
  const raw = await sharp(result).ensureAlpha().raw().toBuffer();
  assert.equal(raw[(3*7+3)*4+3], 0);
  assert.deepEqual([...raw.subarray((3*7+2)*4, (3*7+2)*4+4)], [70,80,90,255]);
});

test('refuses an aperture seed that points into metal rather than paper', async () => {
  const photo = await sharp({ create: { width: 8, height: 8, channels: 4, background: '#777' } }).png().toBuffer();
  await assert.rejects(cleanPhotographicMatte(photo, [[0.5,0.5]]), /not white paper/);
});

test('native-layer aperture cleanup preserves white metal highlights at the silhouette', async () => {
  const data = Buffer.alloc(7 * 7 * 4);
  data.set([255,255,255,255],(3*7+3)*4);
  data.set([255,255,255,255],(1*7+1)*4);
  const photo=await sharp(data,{raw:{width:7,height:7,channels:4}}).png().toBuffer();
  const result=await cleanPhotographicMatte(photo,[[3/7,3/7]],{cleanBoundary:false});
  const raw=await sharp(result).ensureAlpha().raw().toBuffer();
  assert.equal(raw[(3*7+3)*4+3],0);
  assert.equal(raw[(1*7+1)*4+3],255);
});
