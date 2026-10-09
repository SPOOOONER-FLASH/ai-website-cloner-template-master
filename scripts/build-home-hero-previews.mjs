import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const base = path.resolve('docs/design-references/home-hero-five-2026-10-09');
const spec = JSON.parse(await fs.readFile(path.join(base, 'spec.json'), 'utf8'));
const source = await fs.readFile(path.join(base, spec.source));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(sha(source), spec.sourceSha256, 'Customer source changed');
const photo = await sharp(source).extract(spec.crop).png().toBuffer();
const original = await sharp(photo).removeAlpha().raw().toBuffer();
await fs.mkdir(path.join(base, 'previews'), {recursive: true});
await fs.mkdir(path.join(base, 'backgrounds'), {recursive: true});
await fs.mkdir(path.join(base, 'references'), {recursive: true});
const mode = process.argv[2];
assert.ok(['prepare', 'compose'].includes(mode), 'Use prepare or compose');
const qa = [];
for (const view of spec.views) {
  const {left, top} = view;
  assert.ok(left >= 0 && top >= 0 && left + spec.crop.width <= spec.width && top + spec.crop.height <= spec.height);
  if (mode === 'prepare') {
    // Only an empty architectural opening reaches ImageGen; no hardware input.
    const aperture = await sharp({create:{width:spec.crop.width, height:spec.crop.height, channels:3, background:'#e1dfda'}}).png().toBuffer();
    await sharp({create:{width:spec.width, height:spec.height, channels:3, background:'#ebe8e2'}})
      .composite([{input:aperture, left, top}]).png().toFile(path.join(base, 'references', `${view.id}.png`));
    continue;
  }
  // Rectify only the generated aperture; the customer doors never stretch.
  const reframe = view.backgroundReframe;
  const background = await sharp(path.join(base, 'backgrounds', `${view.id}.png`))
    .resize(reframe.width, reframe.height, {fit:'fill'})
    .extract({left:reframe.left, top:reframe.top, width:spec.width, height:spec.height})
    .png().toBuffer();
  const final = await sharp(background).composite([{input:photo, left, top}]).png().toBuffer();
  const retained = await sharp(final).extract({left, top, width:spec.crop.width, height:spec.crop.height}).removeAlpha().raw().toBuffer();
  assert.deepEqual(retained, original, `${view.id}: customer photograph pixels changed`);
  const output = `previews/${view.id}.png`;
  await fs.writeFile(path.join(base, output), final);
  qa.push({id:view.id, output, outputSha256:sha(final), backgroundSha256:sha(background), backgroundReframe:reframe, preservedPixels:spec.crop.width*spec.crop.height, changedSourcePixels:0});
}
if (mode === 'compose') {
  await fs.writeFile(path.join(base, 'pixel-qa.json'), JSON.stringify({sourceSha256:spec.sourceSha256, sourceCrop:spec.crop, resizedSource:false, results:qa}, null, 2)+'\n');
}
console.log(`${mode}: ${spec.views.length} review-only images; no website assets edited`);
