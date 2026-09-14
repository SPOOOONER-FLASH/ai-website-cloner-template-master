import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base=path.resolve('docs/design-references/2026-09-14-curated-hardware');
const output=path.resolve(process.argv[2]||'tmp/codex-curated/delivery');
fs.mkdirSync(output+'/assets',{recursive:true});fs.mkdirSync(output+'/blender',{recursive:true});
let html=fs.readFileSync(base+'/review.html','utf8');
html=html.replace(/(src|href)="([^"]+)"/g,(whole,attr,target)=>{
  if(/^https?:/.test(target))return whole;
  const source=path.resolve(base,target);if(!fs.existsSync(source))throw Error(source);
  const b=fs.readFileSync(source),name=crypto.createHash('sha256').update(b).digest('hex').slice(0,12)+'-'+path.basename(source);
  fs.writeFileSync(output+'/assets/'+name,b);return `${attr}="assets/${name}"`;
});
const ids=fs.readdirSync(base).filter(f=>f.endsWith('.blend')&&!['curated-selection-stone.blend','curated-selection-box.blend'].includes(f)).map(f=>f.slice(0,-6));
const files=[];
for(const id of ids){
  for(const ext of ['.blend','.json','-qa.json'])fs.copyFileSync(base+'/'+id+ext,output+'/blender/'+id+ext);
  fs.copyFileSync(base+'/'+id+'.png',output+'/assets/'+id+'.png');
  files.push({id,image:'assets/'+id+'.png',blender:'blender/'+id+'.blend'});
}
html=html.replace('</main>',`<article><h2>本轮完整成图与 Blender</h2><p>直接打开 .blend 文件即可编辑背景、灯光、照片位置。产品是打包照片，不是可加工的三维五金模型。</p>${files.map(f=>`<p><a href="${f.image}">${f.id} PNG</a> · <a href="${f.blender}">Blender</a></p>`).join('')}</article></main>`);
fs.writeFileSync(output+'/index.html',html);
for(const name of ['publication.json','twenty-item-review.json','blender-reopen-review.json','alpha-review.json'])fs.copyFileSync(base+'/'+name,output+'/'+name);
fs.writeFileSync(output+'/README.txt','打开 index.html 浏览逐项结果与来源。\nblender 目录有17份最终场景，纹理均已打包；直接用 Blender 打开。\n两张指定替代图名称含 selection-stone-final / selection-box-final。\n二十项中16项有来源图像；04、15、16、17仍需实物或唯一型号。\n场景不是加工CAD，也不证明未确认配套。\n原始处理路径记录于JSON，换电脑后仍可直接打开打包的blend。重新生成请在原仓库运行 scripts/ 中对应生成器。\n');
console.log(JSON.stringify({output,finalScenes:files.length}));
