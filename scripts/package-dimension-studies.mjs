import fs from 'node:fs';
import path from 'node:path';
const source=path.resolve('docs/design-references/2026-09-14-dimension-models');
const output=path.resolve(process.argv[2]||'tmp/codex-dimension-delivery');
fs.mkdirSync(output,{recursive:true});
for(const file of fs.readdirSync(source))if(/\.(blend|glb|json|svg|txt|md)$/.test(file))fs.copyFileSync(path.join(source,file),path.join(output,file));
console.log(output);
