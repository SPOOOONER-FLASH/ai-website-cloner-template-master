import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const rejected=['news-mortise-lock-inspection.webp','news-finish-function-library.webp','hyde-materials-engineering-2026.webp','hyde-editorial-exhibition-wall-01.webp','hyde-editorial-product-range-07.webp'];
test('published news covers exclude rejected hardware and exact duplicate images',()=>{
  const seen=new Map();
  for(const file of fs.readdirSync('content/news').filter(x=>x.endsWith('.json'))){
    const r=JSON.parse(fs.readFileSync('content/news/'+file));
    const src=r.heroImage?.src;
    assert.ok(src, file+' needs a cover');
    assert.ok(!rejected.some(x=>src.endsWith(x)),file+' uses a rejected image');
    const hash=crypto.createHash('sha256').update(fs.readFileSync('public'+src)).digest('hex');
    assert.ok(!seen.has(hash),file+' duplicates '+seen.get(hash));seen.set(hash,file);
  }
});
