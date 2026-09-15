import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const source='docs/design-references/2026-09-14-dimension-models';
const root='public/downloads/models';fs.mkdirSync(root,{recursive:true});
const entries=[
 {id:'9004s-exterior',slug:'9004s-stainless-steel-handle',model:'9004S',category:'stainless-steel-handles',orbit:'35deg 65deg auto',
  scope:{en:'Exterior lever and rose: 135 mm lever length and 53 × 53 × 8 mm rose, based on the published drawing.',es:'Exterior de la manija y roseta: manija de 135 mm y roseta de 53 × 53 × 8 mm, según el plano publicado.'},
  omissions:{en:'Fixing holes, edge radii, spindle length, internal parts and escutcheon are not modeled.',es:'No se incluyen orificios de fijación, radios de borde, longitud del cuadradillo, piezas internas ni bocallave.'}},
 {id:'lc04-case-envelope',slug:'lc04-85-60-lock-case',model:'LC04 85/60',category:'lock-cases',orbit:'0deg 90deg auto',
  scope:{en:'Case envelope: 93 mm depth and 173 mm height. The 15 mm thickness is an assumed closure value, not a published product dimension.',es:'Volumen exterior de la caja: 93 mm de profundidad y 173 mm de altura. El espesor de 15 mm es un valor supuesto para cerrar el volumen, no una cota publicada del producto.'},
  omissions:{en:'Faceplate, latch, bolts, fixing holes and internal mechanism are not modeled. This does not establish door preparation or installation clearances.',es:'No se incluyen frente, picaporte, cerrojos, orificios de fijación ni mecanismo interno. No define mecanizados de puerta ni holguras de instalación.'}},
 {id:'70sn-upper-housing-envelopes',slug:'70sn-lock-cylinder',model:'70SN',category:'lock-cylinders',orbit:'35deg 65deg auto',
  scope:{en:'Upper cylindrical housing envelopes only: Ø17 mm, two 30 mm segments with a 10 mm central gap.',es:'Solo los volúmenes cilíndricos superiores: Ø17 mm, dos tramos de 30 mm con un espacio central de 10 mm.'},
  omissions:{en:'Lower euro profile, cam, thumbturn, fixing thread, keyway and keys are not modeled.',es:'No se incluyen perfil europeo inferior, leva, pomo, rosca de fijación, bocallave ni llaves.'}},
];
const log=execFileSync('C:/Program Files/Blender Foundation/Blender 5.2/blender.exe',['--background','--threads','2','--python-exit-code','1','--python',path.resolve('scripts/blender/publish-dimension-models.py')],{encoding:'utf8',maxBuffer:4*1024*1024});
if(!log.includes('PUBLIC_MODELS_VERIFIED 3'))throw Error(log);
for(const e of entries){
  fs.copyFileSync(`${source}/${e.id}.glb`,`${root}/${e.id}.glb`);
  Object.assign(e,{partial:true,manufacturingReady:false,glb:`/downloads/models/${e.id}.glb`,blend:`/downloads/models/${e.id}.blend`,notes:`/downloads/models/${e.id}-scope.txt`});
  const note=`${e.model} — PARTIAL 3D REFERENCE MODEL\n\n${e.scope.en}\n${e.omissions.en}\nNot a complete product model. Do not use for machining, door preparation or installation.\n\nMODELO 3D PARCIAL DE REFERENCIA\n\n${e.scope.es}\n${e.omissions.es}\nNo es un modelo completo del producto. No utilizar para fabricación, mecanizados de puerta ni instalación.\n\nBlender reference images are packed in the file. Source dimensions and omitted features are recorded in its text data.\n`;
  fs.writeFileSync('public'+e.notes,note);
  Object.assign(e,{glbBytes:fs.statSync('public'+e.glb).size,blendBytes:fs.statSync('public'+e.blend).size});
}
fs.writeFileSync(root+'/index.json',JSON.stringify(entries,null,2)+'\n');
console.log('Published 3 reviewed partial models, with packed Blender references and bilingual scope notes.');
