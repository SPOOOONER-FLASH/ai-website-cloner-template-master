import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
// Client direction 2026-09-14: withdraw the new batch and restore original images.
test('rejected curated compositions stay out of published news, home and studies',()=>{
  const paths=['src/data/home.ts','src/data/home-es.ts','src/data/feature-columns.ts','src/data/generated/product-studies.json',...fs.readdirSync('content/news').filter(x=>x.endsWith('.json')).map(x=>'content/news/'+x)];
  for(const file of paths)assert.doesNotMatch(fs.readFileSync(file,'utf8'),/\/images\/(?:editorial|product-studies)\/curated-/,file);
});
