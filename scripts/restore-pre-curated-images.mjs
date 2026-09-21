import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const baseline='3be713b968^';
const old=file=>execFileSync('git',['-c','safe.directory='+process.cwd().replaceAll('\\','/'),'show',baseline+':'+file],{encoding:'utf8'});
const news=JSON.parse(fs.readFileSync('docs/design-references/2026-09-14-curated-hardware/news-selection.json'));
for(const slug of Object.keys(news)){
  const file='content/news/'+slug+'.json';const current=JSON.parse(fs.readFileSync(file));
  current.heroImage=JSON.parse(old(file)).heroImage;
  fs.writeFileSync(file,JSON.stringify(current,null,2)+'\n');
}
for(const file of ['src/data/home.ts','src/data/home-es.ts','src/data/home-editorial-assets.test.ts'])fs.writeFileSync(file,fs.readFileSync(file,'utf8').replaceAll('curated-home-catalogue.webp','hyde-real-product-atlas.webp'));
const columns='src/data/feature-columns.ts';
fs.writeFileSync(columns,fs.readFileSync(columns,'utf8').replace('curated-lc04-dimensions.webp','news-mortise-lock-inspection.webp').replace('LC04 85/60 original product photograph and factory dimension drawing','A Canton Hyland mortise lock case being measured').replace('Fotografía original y plano de cotas de fábrica del LC04 85/60','Medición de una cerradura de embutir de Canton Hyland'));
// These two files only acquired the rejected gallery selection in this image task.
for(const file of ['src/data/generated/product-studies.json','scripts/publish-hardware-studies.mjs'])fs.writeFileSync(file,old(file));
const test='src/lib/editorial-image-uniqueness.test.ts';let t=fs.readFileSync(test,'utf8');
t=t.replace('curated-lc04-dimensions.webp','news-mortise-lock-inspection.webp').replace('curated-finish-models.webp','news-finish-function-library.webp');
t=t.replace(/  \/\*\s+UPDATED 2026-09-14[\s\S]*?\*\//,'  // 2026-09-14: client rejected the new compositions and requested the original images.');
fs.writeFileSync(test,t);
console.log('Restored original 10 news covers, homepage images and 15-study gallery; other content preserved.');
