import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
const root=process.cwd(),base='docs/design-references/2026-09-14-curated-hardware';
fs.mkdirSync(base+'/sources',{recursive:true});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const p=(slug,view=0,crop)=>{const r=JSON.parse(fs.readFileSync('content/products/'+slug+'.json'));const src=view?r.gallery[view-1].src:r.heroImage.src;if(!src)throw Error('No real image: '+slug);const b=fs.readFileSync('public'+src);const source=base+'/sources/'+path.basename(src);fs.writeFileSync(source,b);return {model:r.model,slug,source:path.resolve(source),original:src,sha256:sha(b),...(crop?{crop}:{})};};
const LC='lc04-85-60-lock-case',SN='70sn-lock-cylinder',LE='9004s-stainless-steel-handle',KN='607-sset-tubular-lock';
const scene=(id,style,photos,heading,note,itemId)=>({id,style,photos,heading,note,itemId,outputDirectory:path.resolve(base),resolution:1800});
const one=(photo)=>[{...photo,position:[0,0],width:1.92}];
const two=(a,b)=>[{...a,position:[-.85,0],width:1.40},{...b,position:[.85,0],width:1.40}];
const three=(a,b,c)=>[{...a,position:[-1.12,0],width:.90},{...b,position:[0,0],width:.90},{...c,position:[1.12,0],width:.90}];
const selection=()=>[{...p(LE,0,[100,190,890,720]),position:[-.98,.08],width:1.08},{...p(LC,4,[220,40,480,900]),position:[.04,0],width:.78},{...p(SN,0,[0,120,800,650]),position:[1.08,.02],width:1.0}];
const scenes=[
scene('curated-selection-stone','stone',selection(),'HYDE / MATERIAL SELECTION','LC04 / 70SN / 9004S - individual selections, compatibility to confirm','00'),
scene('curated-selection-box','box',selection(),'HYDE / SAMPLE STUDY','Photographic sample layout - not an installation or supplied kit','00'),
scene('curated-311-construction','technical',two(p('311-panic-exit-device',2),p('311-panic-exit-device',3)),'311 / CONSTRUCTION','Original catalog views - outside trim selected separately','02'),
scene('curated-305-components','oak',two(p('305-fire-door-panic-exit-device',2),p('305-fire-door-panic-exit-device',3)),'305 / COMPONENTS','The parts and views shown in the original 305 catalog','05'),
scene('curated-lc14-details','white',two(p('lc14-85-50mm-lock-case',2),p('lc14-85-50mm-lock-case',3)),'LC14 / DETAIL STUDY','Original catalog views - no unverified cylinder or lever added','03'),
scene('curated-607-test-model','stone',one(p(KN,0)),'607 SS ET / MODEL REFERENCE','Exact model identification comes before report scope'),
scene('curated-9004-mechanism','box',two(p(LE,2),p(LE,3)),'9004S / COMPONENT DETAIL','Original reverse view and supplied component photograph'),
scene('curated-lc04-dimensions','technical',two(p(LC,0),p(LC,2)),'LC04 85 / 60 / PUBLISHED GEOMETRY','Factory source photograph and drawing - consult the model specification'),
scene('curated-lc04-reverse','stone',one(p(LC,3)),'LC04 / REVERSE VIEW','Original catalog view - confirm handing for the order'),
scene('curated-sn-dimensions','technical',one(p(SN,1)),'70SN / DIMENSION REFERENCE','Original annotated catalog photograph'),
scene('curated-finish-models','white',one(p('587-sset-light-duty-cylindrical-lock',1)),'587 SSET / MODEL & FINISH','One catalog model, one finish / Read the full reference'),
scene('curated-lock-comparison','white',two(p(LC,4),p('lc04-85-70-lock-case')),'LC04 / MODEL IDENTIFICATION','Separate catalog references - compare the published backset'),
scene('curated-catalogue-range','oak',three(p('311-panic-exit-device'),p(KN),p(LE)),'HYDE / FROM THE CATALOG','Original products - different families, individual selections'),
scene('curated-order-dimensions','technical',two(p(LE,0),p(SN,1)),'PRODUCT / FINISH / DIMENSIONS','Identify each part before confirming a door configuration'),
scene('curated-document-reference','white',two(p(KN,2),p(LC,2)),'FACTORY DRAWING REFERENCES','Original catalog drawings - open each product for its dimensions')
];
const news={
'why-the-catalogue-is-this-wide':['curated-catalogue-range','Original catalog photographs of 311, 607 SSET and 9004S, presented as individual models.','Fotografías originales de los modelos 311, 607 SSET y 9004S, presentados por separado.'],
'what-a-test-report-actually-covers':['curated-607-test-model','Original photograph of model 607 SSET, the model discussed in the durability report.','Fotografía original del modelo 607 SSET tratado en el informe de durabilidad.'],
'what-oem-actually-changes':['curated-9004-mechanism','Original 9004S photographs showing the reverse mechanism and components.','Fotografías originales del mecanismo posterior y los componentes del 9004S.'],
'mortise-lock-backset-and-centre-distance-guide':['curated-lc04-dimensions','LC04 85/60 catalog photograph and its original dimension drawing.','Fotografía del LC04 85/60 y su plano de cotas original.'],
'handing-left-right-and-universal':['curated-lc04-reverse','Original reverse view of the LC04 lock case; handing must be confirmed for the order.','Vista posterior original de la cerradura LC04; la mano debe confirmarse para el pedido.'],
'euro-cylinder-length-and-split':['curated-sn-dimensions','70SN original annotated catalog photograph.','Fotografía original acotada del cilindro 70SN.'],
'reading-door-hardware-model-numbers':['curated-finish-models','Original photograph of model 587 SSET in its stainless steel finish.','Fotografía original del modelo 587 SSET con acabado de acero inoxidable.'],
'cross-referencing-a-lock-you-already-buy':['curated-lock-comparison','LC04 85/60 and LC04 85/70 shown as separate model references.','LC04 85/60 y LC04 85/70 como referencias de modelo separadas.'],
'six-values-an-order-needs':['curated-order-dimensions','9004S product photograph with an original 70SN dimension reference, shown as individual selections.','Fotografía del 9004S y referencia de cotas original del 70SN, como selecciones individuales.'],
'what-documents-you-can-actually-get':['curated-document-reference','Original 607 SSET and LC04 catalog dimension drawings.','Planos de cotas originales del catálogo de 607 SSET y LC04.']
};
fs.writeFileSync(base+'/scenes.json',JSON.stringify(scenes,null,2)+'\n');
fs.writeFileSync(base+'/news-selection.json',JSON.stringify(news,null,2)+'\n');
if(process.argv.includes('--prepare-only')){console.log('Prepared '+scenes.length+' scenes');process.exit(0);}
for(const s of scenes){const config=base+'/'+s.id+'.json';fs.writeFileSync(config,JSON.stringify(s,null,2));if(!process.argv.includes('--export-only')){const log=execFileSync(process.env.BLENDER_PATH||'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe',['--background','--threads','6','--python-exit-code','1','--python',path.resolve('scripts/blender/curated-hardware-scenes.py'),'--',path.resolve(config)],{encoding:'utf8',maxBuffer:8*1024*1024});fs.writeFileSync(base+'/'+s.id+'.log',log);if(!log.includes('CURATED_SCENE_OK'))throw Error(s.id);}
const input=fs.readFileSync(base+'/'+s.id+'.png');await sharp(input).raw().toBuffer();for(const width of [480,960,1440,1800]){const dest=width===1800?'public/images/editorial/'+s.id+'.webp':'public/images/editorial/responsive/'+s.id+'-'+width+'w.webp';await sharp(input).resize(width).webp({quality:88}).toFile(dest);}console.log('Rendered / exported '+s.id);}
const editorial=JSON.parse(fs.readFileSync('src/components/site/editorial-images.config.json'));for(const s of scenes)editorial['/images/editorial/'+s.id+'.webp']={sourceWidth:1800,variants:[480,960,1440]};fs.writeFileSync('src/components/site/editorial-images.config.json',JSON.stringify(editorial,null,2)+'\n');
for(const [slug,[id,label,labelEs]] of Object.entries(news)){const file='content/news/'+slug+'.json';const record=JSON.parse(fs.readFileSync(file));record.heroImage={src:'/images/editorial/'+id+'.webp',ratio:'3 / 2',label,labelEs};fs.writeFileSync(file,JSON.stringify(record,null,2)+'\n');}
console.log('Updated '+Object.keys(news).length+' article images');
