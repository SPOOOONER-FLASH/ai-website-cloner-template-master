#!/usr/bin/env node
/**
 * Adds the Spanish FAQ to content/faq.json.
 *
 * WHY THIS PAGE FIRST. Of everything still English-only, the FAQ is the one a buyer needs
 * before they can do business at all: minimum order, lead time, samples, payment terms,
 * OEM. A Spanish-speaking importer asking "¿cuál es el pedido mínimo?" currently gets
 * nothing, and those five answers took a fortnight to get out of the client — leaving
 * them in one language wastes that.
 *
 * TRADE SPANISH, NOT TRANSLATED ENGLISH. These are commercial terms with settled forms in
 * the trade, and a literal rendering reads as machine output to the person who has to act
 * on it:
 *
 *   pedido mínimo · plazo de producción · muestras · transferencia bancaria (T/T) ·
 *   carta de crédito irrevocable a la vista · factura proforma · flete ·
 *   derechos pagados (DDP) · despacho de aduana · utillaje y molde ·
 *   planilla de herrajes · sistema de llave maestra · llave de obra · planos acotados ·
 *   informe de ensayo · licitación
 *
 * The incoterms stay in their international form — EXW, FOB, DDP, DAP, T/T, L/C — because
 * that is what appears on the proforma and what the buyer will quote back at us.
 *
 * NUMBERS ARE NOT TRANSLATED, THEY ARE CARRIED. 300–5,000 pieces, 30 days, ISO 9001 since
 * 2002, 435 models, 15 families, thirty markets. Every one of these took a decision from
 * the client; a translation that rounds or drops one is a different commitment.
 *
 * Idempotent. Run it twice and nothing changes.
 *
 * Usage: node scripts/add-faq-es.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";

const FILE = "content/faq.json";

/** Group titles, keyed by their English form. */
const GROUPS = {
  "Ordering and samples": "Pedidos y muestras",
  "Products and specification": "Producto y especificación",
  "Standards and certification": "Normas y certificación",
  "The company": "La empresa",
};

/** Question -> { q, a } in Spanish, keyed by the English question. */
const ITEMS = {
  "What is your minimum order quantity?": {
    q: "¿Cuál es el pedido mínimo?",
    a: "Depende del modelo, del acabado y de si el pedido sale de stock o se fabrica según su especificación. La mayoría de los modelos se sitúa entre 300 y 5.000 piezas. Algunos artículos ya publicados en nuestra tienda de Alibaba tienen un mínimo publicado más bajo. Envíenos los modelos que necesita y las cantidades que maneja, y el equipo de exportación le confirmará el mínimo de esa línea concreta antes de que usted se comprometa a nada.",
  },
  "What are your lead times?": {
    q: "¿Cuáles son los plazos de entrega?",
    a: "El plazo de producción parte de 30 días desde la confirmación del pedido. La fecha exacta depende de los modelos, la cantidad y los acabados que lleve el pedido — díganos qué necesita y el equipo de exportación le confirmará una fecha antes de que pague ninguna señal.",
  },
  "Can I order samples before placing a production order?": {
    q: "¿Puedo pedir muestras antes de hacer un pedido de producción?",
    a: "Sí, y las muestras normalmente se cobran. Cotizamos el precio de la muestra junto con el flete a su dirección, y ese importe se descuenta de su primer pedido de producción — de modo que, si la muestra acaba en negocio, no le cuesta nada. Indique al equipo de exportación los modelos y acabados que quiere ver y le confirmarán precio y fecha de expedición. Un modelo que tenemos en stock suele salir en pocos días; una muestra en un acabado que no mantenemos tarda lo mismo que una serie corta de producción.",
  },
  "What payment terms do you accept?": {
    q: "¿Qué condiciones de pago aceptan?",
    a: "Trabajamos con los instrumentos habituales del comercio exterior: transferencia bancaria (T/T) con señal y el saldo contra documentos de embarque o antes de la expedición, y carta de crédito irrevocable a la vista para pedidos mayores. El reparto no es una regla fija: se mueve con el importe del pedido, el tiempo de producción que exijan los modelos, los materiales y acabados implicados, y cómo despache y embarque la mercancía hacia su país. También cotizamos en el incoterm que usted prefiera — EXW en fábrica, FOB en puerto o DDP entregado — y el término que elija cambia tanto el precio como el punto donde empieza su responsabilidad. Envíe modelos, cantidades y destino, y el equipo de exportación dejará las condiciones por escrito en la factura proforma antes de que usted se comprometa a nada.",
  },
  "Can I order through Alibaba instead of by email?": {
    q: "¿Puedo comprar por Alibaba en lugar de por correo?",
    a: "Sí. Nuestra tienda verificada tiene el mismo catálogo y suele ser la vía más rápida si usted ya compra por Alibaba — la garantía comercial, la mensajería y el pago se gestionan allí. Para planillas de proyecto, acabados a medida o sistemas de llave maestra, el correo suele funcionar mejor, porque esos casos requieren antes una conversación técnica.",
  },
  "How is shipping quoted, and can you ship duty paid?": {
    q: "¿Cómo se cotiza el transporte? ¿Pueden enviar con derechos pagados?",
    a: "El flete se cotiza por envío, porque depende del destino, del peso y volumen del pedido y de si va por aire o por mar. Ambas vías están disponibles: aéreo para muestras y reposiciones urgentes, marítimo para pedidos de producción completos. En nuestra tienda de Alibaba el flete se calcula automáticamente en el momento de la compra para los principales países de destino, que es la forma más rápida de ver una cifra puesta en destino. El envío con derechos pagados (DDP) está disponible en muchas rutas, incluidos Estados Unidos y buena parte de Europa; en el resto el criterio por defecto es DAP, con los derechos y el despacho de aduana a su nombre. Indique al equipo de exportación la ciudad de destino y la cantidad y le cotizarán las modalidades en paralelo.",
  },
  "Do you provide dimensional drawings?": {
    q: "¿Facilitan planos acotados?",
    a: "Hay planos acotados disponibles para la mayoría de los productos, bajo petición. Envíe el número de modelo y le responderemos con lo que tengamos de él. Si un plano todavía no está publicado en este sitio es porque no lo hemos verificado contra el utillaje de producción actual, no porque no exista.",
  },
  "Can you supply master key and construction key systems?": {
    q: "¿Suministran sistemas de llave maestra y llave de obra?",
    a: "Sí. Los sistemas de llave maestra y de llave de obra son una especialidad de largo recorrido. Se planifican por proyecto en lugar de pedirse de catálogo, así que empiece por la planilla de herrajes y trabajamos hacia atrás desde ahí.",
  },
  "Which finishes are available?": {
    q: "¿Qué acabados hay disponibles?",
    a: "Los acabados disponibles figuran en cada ficha de producto, en el apartado de configuración. Cuando una ficha no muestra acabados es porque ese dato aún no se ha verificado para ese modelo, y preferimos dejarlo en blanco antes que suponerlo.",
  },
  "Can you produce to our own design or branding (OEM / ODM)?": {
    q: "¿Pueden fabricar con nuestro diseño o nuestra marca (OEM / ODM)?",
    a: "Sí — es una parte importante de lo que hace la fábrica. Fabricamos bajo la marca de nuestros clientes y según sus planos: su logotipo en el producto y en el embalaje, su acabado, su empaque y su marcaje de cajas. Si existe un molde para la forma que usted quiere, podemos producirla; si no existe, lo fabricamos. Publicamos 435 modelos en 15 familias de producto y el utillaje que hay detrás es propio, que es la razón por la que cambiar el perfil de una manilla, una roseta, una placa o un acabado aquí es una petición normal y no un proyecto especial. Envíe una muestra, un plano o incluso una fotografía de lo que necesita y nuestro equipo de ingeniería le dirá qué hace falta para fabricarlo. El coste del molde, el plazo de muestreo y el mínimo que hace rentable una serie a medida dependen enteramente de la pieza, así que se cotizan por proyecto — pregunte y obtendrá cifras reales, no un rango.",
  },
  "Is Canton Hyland ISO 9001 certified?": {
    q: "¿Canton Hyland tiene la certificación ISO 9001?",
    a: "Sí. La empresa mantiene la certificación ISO 9001 desde 2002.",
  },
  "Are your panic exit devices EN 1125 certified?": {
    q: "¿Sus barras antipánico están certificadas según EN 1125?",
    a: "Los informes de ensayo existen para modelos concretos, no para la gama en conjunto, y no extendemos el informe de un modelo a un producto hermano. Los informes se emiten para uso exclusivo de quien los encargó y solo pueden cederse íntegros, por lo que los enviamos bajo petición contra un modelo nombrado en lugar de publicar extractos. Díganos el modelo que piensa especificar y le enviaremos el informe que lo cubre, o le diremos claramente que no lo hay.",
  },
  "Can you supply test reports and certificates for a tender?": {
    q: "¿Pueden facilitar informes de ensayo y certificados para una licitación?",
    a: "Sí. Díganos los modelos que figuran en la planilla y le enviaremos los informes que los nombran, con sus fechas de emisión y su alcance.",
  },
  "Where are your products manufactured?": {
    q: "¿Dónde se fabrican sus productos?",
    a: "En Guangdong, China. Canton Hyland Hardware (Group) Co., Ltd. fabrica herrajes de puerta comerciales y residenciales desde 1998.",
  },
  "Do you export worldwide?": {
    q: "¿Exportan a todo el mundo?",
    a: "Sí. Nuestras barras antipánico, cerraduras de embutir, juegos de manilla y cierrapuertas de suelo están especificados en edificios comerciales, institucionales y residenciales en más de treinta mercados de exportación. Díganos el país de destino y el equipo de exportación le confirmará la documentación y el transporte para ese mercado.",
  },
};

const data = JSON.parse(readFileSync(FILE, "utf8"));
const groups = data.groups ?? data;

let written = 0;
let already = 0;
const missing = [];

for (const group of groups) {
  const titleEs = GROUPS[group.title];
  if (!titleEs) missing.push(`GROUP: ${group.title}`);
  else if (group.titleEs === titleEs) already += 1;
  else {
    group.titleEs = titleEs;
    written += 1;
  }

  for (const item of group.items ?? []) {
    const es = ITEMS[item.question];
    if (!es) {
      missing.push(item.question);
      continue;
    }
    if (item.questionEs === es.q && item.answerEs === es.a) {
      already += 1;
      continue;
    }
    item.questionEs = es.q;
    item.answerEs = es.a;
    written += 1;
  }
}

if (missing.length) {
  console.error("No Spanish for:");
  for (const m of missing) console.error(`  ${m}`);
  console.error("\nAdd it above rather than shipping a half-translated page.");
  process.exit(1);
}

if (written) writeFileSync(FILE, `${JSON.stringify(data, null, 2)}\n`);
console.log(`${FILE}: ${written} written, ${already} already correct.`);
