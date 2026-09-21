import fs from 'node:fs';
import crypto from 'node:crypto';
const base='docs/design-references/2026-09-14-curated-hardware';
const entries=['564-warm-stone','310-cool-stone'].map(id=>({id,reviewed:true}));
function add(id,itemId,captionEn='',captionEs='',publish=true){
  const scene=JSON.parse(fs.readFileSync(`${base}/${id}.json`));
  const file=`${base}/${id}.png`;
  entries.push({id,itemId,file,sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),slugs:[...new Set(scene.photos.map(p=>p.slug))],reviewed:true,publish,captionEn,captionEs,kind:id.includes('stone')?'space':'selection'});
}
add('curated-selection-stone-final','00','Individual models for selection. Confirm compatibility and the complete configuration before ordering; this composition is not installation scale.','Modelos individuales para selección. Confirme la compatibilidad y la configuración completa antes del pedido; esta composición no representa una escala de instalación.');
entries.push({id:'01-source-307-components',reviewed:true});
add('curated-311-construction','02','Original views of the 311 mechanism. Door preparation and outside trim are confirmed for the project.','Vistas originales del mecanismo 311. La preparación de la puerta y la manija exterior se confirman para cada proyecto.');
add('curated-lc14-details','03','LC14 lock case details from the original photographs. Handle and cylinder configuration are selected separately.','Detalles de la caja LC14 en fotografías originales. La configuración de manija y cilindro se selecciona por separado.');
add('curated-305-components','05','305 device and components shown in its catalogue photography. Confirm the complete door configuration before ordering.','Dispositivo 305 y componentes de su fotografía de catálogo. Confirme la configuración completa de la puerta antes del pedido.');
add('curated-glass-patch-components','06','Components from the original glass door hardware catalogue photograph. Glass preparation and compatibility are confirmed per project.','Componentes de la fotografía original del catálogo de herrajes para puertas de vidrio. Los mecanizados y la compatibilidad se confirman para cada proyecto.');
for(const id of ['08-source-607-sset-tubular-lock','09-source-587-sset-light-duty-cylindrical-lock','10-source-70bk-lock-cylinder','12-source-316-s-panic-exit-device','13-source-dc02-door-coordinator','14-source-hyde-ar4-110-mortise-lock','18-source-308-panic-exit-device','20-source-035-panic-exit-device-trim'])entries.push({id,reviewed:true});
add('curated-selection-box-final','00','Alternative sample-board scene retained for review; the stone composition is selected for the gallery.','Escena alternativa de muestrario para revisión; se seleccionó la composición sobre piedra para la galería.',false);
// Resolve legacy item numbers once for both the review board and the publisher.
const legacy=JSON.parse(fs.readFileSync('docs/design-references/2026-09-09-professional-hardware-sets/manifest.json'));
for(const e of entries)if(!e.itemId)e.itemId=legacy.items.find(i=>i.assets.some(a=>a.name===e.id+'.png')).id;
fs.writeFileSync(base+'/publication.json',JSON.stringify(entries,null,2)+'\n');
