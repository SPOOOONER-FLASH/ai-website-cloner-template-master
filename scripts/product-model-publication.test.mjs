import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const root='public/downloads/models';
test('only the three reviewed partial models publish with scope and unchanged GLB geometry',()=>{
  const models=JSON.parse(fs.readFileSync(root+'/index.json'));
  assert.deepEqual(models.map(m=>m.slug).sort(),['9004s-stainless-steel-handle','lc04-85-60-lock-case','70sn-lock-cylinder'].sort());
  for(const m of models){
    const product=JSON.parse(fs.readFileSync('content/products/'+m.slug+'.json'));
    assert.equal(m.category,product.categoryPath[0]);
    assert.equal(m.partial,true);assert.equal(m.manufacturingReady,false);
    for(const locale of ['en','es']){assert.ok(m.scope[locale]);assert.ok(m.omissions[locale]);}
    const bytes=fs.readFileSync('public'+m.glb);
    const original=fs.readFileSync('docs/design-references/2026-09-14-dimension-models/'+m.id+'.glb');
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),crypto.createHash('sha256').update(original).digest('hex'));
    assert.equal(bytes.readUInt32LE(0),0x46546c67);assert.equal(bytes.readUInt32LE(8),bytes.length);
    for(const file of [m.blend,m.notes])assert.ok(fs.statSync('public'+file).size>0);
  }
  const lc04=models.find(m=>m.id==='lc04-case-envelope');
  assert.match(lc04.scope.en,/15 mm/);assert.match(lc04.scope.es,/15 mm/);
});
