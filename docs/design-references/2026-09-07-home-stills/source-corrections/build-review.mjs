import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'../../../..');
const jobs=JSON.parse(await fs.readFile(path.join(dir,'manifest.json'),'utf8'));
for(const j of jobs){
  await fs.copyFile(path.join(root,j.source),path.join(dir,j.original));
  // Existing saved results keep the review reproducible on another checkout.
  try{await fs.access(path.join(dir,j.output));}catch{await fs.copyFile(j.generated,path.join(dir,j.output));}
}
const rows=jobs.map(j=>`<section><h2>${j.name}</h2><p><a href="${j.url}">官网型号</a> · 左：原始目录照片 · 右：背景编辑试稿</p><div class="pair"><img src="${j.original}" alt="${j.name} 原图"><img src="${j.output}" alt="${j.name} 编辑试稿"></div></section>`).join('');
await fs.writeFile(path.join(dir,'review.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>HYDE — 原图与编辑试稿校对</title><style>body{margin:0;background:#f2f1ee;color:#171717;font:16px/1.6 Arial,sans-serif}main{max-width:1500px;margin:auto;padding:48px 24px}h1{font-size:36px;letter-spacing:-1px}h2{margin-bottom:4px}p{max-width:850px;color:#555}section{border-top:1px solid #ccc;margin-top:48px;padding-top:20px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}.pair img{width:100%;display:block}a{color:inherit}@media(max-width:700px){.pair{grid-template-columns:1fr}main{padding:24px 16px}}</style><main><h1>真实产品，编辑式影调。</h1><p>这份对照保留了未经编辑的原始照片。试稿只用于核对背景与摄影处理；没有声明像素锁定、尺寸准确或安装兼容。没有替换官网图片。</p><p>检查重点：JU-051 连杆角度、阀孔和安装脚；LC04 四圆栓、扣板、冲压孔；BL028 八孔的交错排列、轴筒分节。缺乏资料的安装场景没有重画。</p>${rows}</main></html>`);
console.log('Saved three originals, three edits, and review.html');
