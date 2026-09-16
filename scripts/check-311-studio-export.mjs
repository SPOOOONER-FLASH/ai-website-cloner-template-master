import fs from 'node:fs';
import assert from 'node:assert/strict';
const studies=JSON.parse(fs.readFileSync('src/data/studio-studies.json'));
for(const prefix of ['out','out/es']){
  for(const route of ['index.html','products/index.html']){
    const html=fs.readFileSync(`${prefix}/${route}`,'utf8');
    assert.match(html, /title="311"/);
    assert.match(html, /href="(?:\/es)?\/products\/panic-exit-devices\/311-panic-exit-device\/"/);
    assert.match(html, /<img[^>]+products-hyde\/311-panic-exit-device\.webp/);
    assert.doesNotMatch(html, /<img[^>]+(?:hyde-real-product-atlas|hyde-real-panic-plate|305-fire-door-panic-exit-device)/);
  }
  const gallery=fs.readFileSync(`${prefix}/product-studies/index.html`,'utf8');
  for(const study of studies){
    assert.ok(gallery.includes(study.src));
    assert.ok(gallery.includes(study.small));
    for(const file of [study.src,study.small])assert.deepEqual(fs.readFileSync('out'+file),fs.readFileSync('public'+file));
  }
}
console.log('EN/ES home and Products use original 311; two studio edits and responsive downloads verified.');
