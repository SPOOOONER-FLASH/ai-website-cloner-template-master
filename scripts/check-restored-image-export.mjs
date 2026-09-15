import fs from 'node:fs';
import assert from 'node:assert/strict';
const slugs=Object.keys(JSON.parse(fs.readFileSync('docs/design-references/2026-09-14-curated-hardware/news-selection.json')));
for(const prefix of ['out','out/es']){
  for(const slug of slugs){
    const expected=JSON.parse(fs.readFileSync('content/news/'+slug+'.json')).heroImage.src;
    const file=prefix+'/news/'+slug+'/index.html';
    const html=fs.readFileSync(file,'utf8');
    assert.ok(html.includes(expected),file+' lacks restored cover');
    assert.doesNotMatch(html,/<img[^>]+curated-[^>]*>/,file+' still shows rejected cover');
    assert.ok(fs.existsSync('out'+expected),expected+' missing from export');
  }
  for(const rel of ['index.html','product-studies/index.html']){
    const html=fs.readFileSync(prefix+'/'+rel,'utf8');
    assert.doesNotMatch(html,/<img[^>]+curated-[^>]*>/,prefix+'/'+rel);
  }
}
// Check mirror references using the full root-relative path, not just a basename.
let pages=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=dir+'/'+e.name;if(e.isDirectory())walk(file);else if(e.name.endsWith('.html')){pages++;const html=fs.readFileSync(file,'utf8');for(const m of html.matchAll(/(?:src|href)="(\/(?:images|_next)\/[^"?#]+)(?:[?#][^"]*)?"/g))assert.ok(fs.existsSync('out-rayen'+m[1]),file+' missing '+m[1]);}}}
walk('out-rayen');console.log('Restored EN/ES home, gallery and 20 article pages verified; mirror assets checked on '+pages+' pages.');
