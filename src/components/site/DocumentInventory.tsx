import Link from "next/link";
import type { Locale } from "@/data/site";
import { DocumentPreview } from "./DocumentPreview";
import { DataTable } from "./DataTable";
import reading from "./ArticleReading.module.css";
import { formatDownloadSize } from "@/data/downloads";
import {
  DOCUMENT_ROWS,
  catalogue,
  drawingCount,
  specifiedProductCount,
  type Availability,
} from "@/lib/document-inventory";

/**
 * 「我们能给你什么文件」的站点区块。见 src/lib/document-inventory.ts 的长注释：
 * 内容全部来自 /news/what-documents-you-can-actually-get/，变的只是位置和形状。
 *
 * 三栏的分法是那篇文章自己写的三种用途，不是抄来的买家角色。
 */

const prefix = (locale: Locale) => (locale === "en" ? "" : `/${locale}`);

const STATE: Record<Availability, Record<Locale, string>> = {
  published: { en: "Published now", es: "Publicado ahora", pt: "Publicado agora" },
  "on-request": { en: "Sent on request", es: "Se envía a petición", pt: "Enviado mediante pedido" },
  absent: { en: "We do not have this", es: "Esto no lo tenemos", pt: "Isto não temos" },
};

const PURPOSE: Record<string, Record<Locale, string>> = {
  approval: { en: "Client approval", es: "Aprobación del cliente", pt: "Aprovação do cliente" },
  machining: { en: "Door machining", es: "Mecanizado de la puerta", pt: "Usinagem da porta" },
  tender: { en: "Tender / submittal", es: "Licitación / dossier", pt: "Licitação / dossiê" },
};

function rowCopy(locale: Locale, drawings: number, specified: number, cat: ReturnType<typeof catalogue>) {
  const size = cat ? formatDownloadSize(cat.sizeBytes) : "";
  return {
    drawings: {
      en: [
        `Dimensioned line drawings — ${drawings} of them`,
        "Drawn 1:1 from the dimensions the catalogue publishes for that model: backset, centre distance, faceplate, case size, fixing centres. Orthographic, so nothing is foreshortened and a measurement taken off one is a real measurement. They exist for these models and not the whole catalogue for one reason — those are the models where the factory has given us enough published dimensions to draw without inventing anything. A drawing with a guessed hole position is worse than no drawing, because it will be believed.",
      ],
      es: [
        `Planos acotados — ${drawings}`,
        "Dibujados 1:1 a partir de las cotas que el catálogo publica para ese modelo: distancia al eje, entrada, frente, caja, entrejes de fijación. Son ortográficos, así que nada está escorzado y una medida tomada de uno es una medida real. Existen para estos modelos y no para todo el catálogo por una razón: son los modelos en los que la fábrica nos ha dado cotas suficientes para dibujar sin inventar nada. Un plano con una posición de taladro supuesta es peor que ningún plano, porque será creído.",
      ],
      pt: [
        `Desenhos cotados — ${drawings}`,
        "Desenhados 1:1 a partir das cotas que o catálogo publica para aquele modelo: distância ao eixo, entrada, testa, caixa, entre-eixos de fixação. São ortográficos, portanto nada fica escorçado e uma medida tirada de um deles é uma medida real. Existem para estes modelos e não para o catálogo inteiro por um motivo: são os modelos em que a fábrica nos deu cotas suficientes para desenhar sem inventar nada. Um desenho com uma posição de furo supostamente correta é pior do que nenhum desenho, porque será acreditado.",
      ],
    },
    specifications: {
      en: [
        `Specification tables — on ${specified} product pages`,
        "A table, not prose. Backset, centre distance, material, finish codes, cycle life where it has been tested, door thickness range, handing. Where a value is missing it is missing, not estimated.",
      ],
      es: [
        `Tablas de especificación — en ${specified} fichas de producto`,
        "Una tabla, no un párrafo. Distancia al eje, entrada, material, códigos de acabado, ciclos de vida donde se ha ensayado, espesor de puerta admisible, mano. Donde falta un valor, falta: no se estima.",
      ],
      pt: [
        `Tabelas de especificação — em ${specified} páginas de produto`,
        "Uma tabela, não um parágrafo. Distância ao eixo, entrada, material, códigos de acabamento, ciclos de vida onde foi ensaiado, espessura de porta admissível, mão. Onde falta um valor, falta: não é estimado.",
      ],
    },
    catalogue: {
      en: [
        `Product catalogue — one PDF, ${size}`,
        "A text PDF, not a scan: the words in it are selectable and searchable, which means a search engine and an AI assistant can read it. It carries every published model with its spec table, bookmarks by family, and an index at the back.",
      ],
      es: [
        `Catálogo de producto — un PDF, ${size}`,
        "Un PDF de texto, no un escaneo: sus palabras se pueden seleccionar y buscar, lo que significa que un buscador y un asistente de IA pueden leerlo. Lleva cada modelo publicado con su tabla de especificación, marcadores por familia y un índice al final.",
      ],
      pt: [
        `Catálogo de produto — um PDF, ${size}`,
        "Um PDF de texto, não uma digitalização: as palavras podem ser selecionadas e pesquisadas, o que significa que um buscador e um assistente de IA conseguem lê-lo. Traz cada modelo publicado com a sua tabela de especificação, marcadores por família e um índice no fim.",
      ],
    },
    "spec-export": {
      en: [
        "Specifications as a spreadsheet",
        "If you need the spec tables in a sheet rather than on a page — for a schedule, a comparison or a tender annex — ask and we will send them.",
      ],
      es: [
        "Especificaciones en hoja de cálculo",
        "Si necesita las tablas en una hoja y no en una página —para un cuadro de carpintería, una comparación o un anexo de licitación— pídalas y se las enviamos.",
      ],
      pt: [
        "Especificações em planilha",
        "Se precisar das tabelas em uma planilha e não numa página — para um mapa de esquadrias, uma comparação ou um anexo de licitação — peça e enviamos.",
      ],
    },
    "test-documents": {
      en: [
        "Test documents, with their exact scope",
        "We publish the facts of each one — laboratory, reference number, issue date and the specific model covered — and send the document itself through the proper route when a specification needs it. The scope line matters more than the headline, and we would rather you read it before you rely on it.",
      ],
      es: [
        "Informes de ensayo, con su alcance exacto",
        "Publicamos los datos de cada uno —laboratorio, número de referencia, fecha de emisión y el modelo concreto que cubre— y enviamos el documento por la vía adecuada cuando una especificación lo exige. La línea del alcance importa más que el titular, y preferimos que la lea antes de apoyarse en ella.",
      ],
      pt: [
        "Relatórios de ensaio, com o escopo exato",
        "Publicamos os dados de cada um — laboratório, número de referência, data de emissão e o modelo específico coberto — e enviamos o documento pela via adequada quando uma especificação exige. A linha do escopo importa mais do que o título, e preferimos que você a leia antes de se apoiar nela.",
      ],
    },
    bim: {
      en: [
        "A BIM library",
        "There are no Revit families and no IFC objects. If you need a hardware item inside a BIM model today, we can give you the dimensioned drawing and the specification and your modeller can build the object from them. That is the truthful answer rather than a promise with a date attached.",
      ],
      es: [
        "Una biblioteca BIM",
        "No hay familias de Revit ni objetos IFC. Si hoy necesita un herraje dentro de un modelo BIM, podemos darle el plano acotado y la especificación, y su modelador puede construir el objeto a partir de ellos. Esa es la respuesta veraz, en lugar de una promesa con fecha.",
      ],
      pt: [
        "Uma biblioteca BIM",
        "Não há famílias Revit nem objetos IFC. Se hoje você precisa de uma ferragem dentro de um modelo BIM, podemos dar o desenho cotado e a especificação, e o seu modelador constrói o objeto a partir deles. Essa é a resposta verdadeira, em vez de uma promessa com data.",
      ],
    },
    "native-cad": {
      en: [
        "A DWG library per model",
        "We publish drawings as SVG, which any CAD package will import and which is dimensionally exact. We do not maintain native DWG files model by model.",
      ],
      es: [
        "Una biblioteca DWG por modelo",
        "Publicamos los planos en SVG, que cualquier programa de CAD importa y que es exacto dimensionalmente. No mantenemos archivos DWG nativos modelo por modelo.",
      ],
      pt: [
        "Uma biblioteca DWG por modelo",
        "Publicamos os desenhos em SVG, que qualquer programa de CAD importa e que é dimensionalmente exato. Não mantemos arquivos DWG nativos modelo a modelo.",
      ],
    },
  } as Record<string, Record<Locale, [string, string]>>;
}

const NOTES = {
  en: {
    heading: "Two things to put in the email",
    items: [
      "Ask by model number in the configuration you are buying, finish and function suffix included. A drawing of the 60mm (2-3/8\") backset version is not a drawing of the 45mm (1-3/4\") one.",
      "Tell us what the document is for. A cutsheet for a client approval, a drawing for a door manufacturer's machining setup and a specification for a tender each need a different thing emphasised, and we would rather send the right one than the largest one.",
    ],
    ask: "Ask for a document",
    article: "The longer version, with the reasoning",
  },
  es: {
    heading: "Dos cosas que conviene poner en el correo",
    items: [
      "Pida por número de modelo en la configuración que va a comprar, con el sufijo de acabado y de función incluidos. Un plano de la versión de 60 mm de entrada no es el plano de la de 45 mm.",
      "Díganos para qué es el documento. Una ficha para la aprobación del cliente, un plano para el mecanizado del fabricante de puertas y una especificación para una licitación necesitan destacar cosas distintas, y preferimos enviar el correcto antes que el más grande.",
    ],
    ask: "Pedir un documento",
    article: "La versión larga, con el razonamiento",
  },
  pt: {
    heading: "Duas coisas para colocar no e-mail",
    items: [
      "Peça pelo número de modelo na configuração que vai comprar, com o sufixo de acabamento e de função incluídos. Um desenho da versão de 60 mm de entrada não é o desenho da de 45 mm.",
      "Diga para que serve o documento. Uma ficha para aprovação do cliente, um desenho para a usinagem do fabricante de portas e uma especificação para uma licitação precisam destacar coisas diferentes, e preferimos enviar o certo a enviar o maior.",
    ],
    ask: "Pedir um documento",
    article: "A versão longa, com o raciocínio",
  },
} as const;

export function DocumentInventory({ locale }: { locale: Locale }) {
  const drawings = drawingCount();
  const specified = specifiedProductCount();
  const cat = catalogue();
  const copy = rowCopy(locale, drawings, specified, cat);
  const notes = NOTES[locale] ?? NOTES.en;

  const groups: Availability[] = ["published", "on-request", "absent"];

  return (
    <>
      <div className="col-content min-w-0">
        <nav className={reading.documentNav} aria-label={{ en: "Document availability", es: "Disponibilidad de documentos", pt: "Disponibilidade de documentos" }[locale]}>{groups.map(state => <a key={state} href={`#documents-${state}`}>{STATE[state][locale]}</a>)}</nav>
        <DataTable locale={locale} caption={{ en: "Find the right document", es: "Encuentre el documento adecuado", pt: "Encontre o documento certo" }[locale]} columns={[{ label: { en: "Document", es: "Documento", pt: "Documento" }[locale], sort: "text" }, { label: { en: "Availability", es: "Disponibilidad", pt: "Disponibilidade" }[locale], sort: "text" }, { label: { en: "Purpose", es: "Uso", pt: "Uso" }[locale], sort: "text" }]} rows={DOCUMENT_ROWS.map(row => [{ text: copy[row.id][locale][0] }, { text: STATE[row.availability][locale] }, { text: row.purposes.map(p => PURPOSE[p][locale]).join(" · ") }])} />
        {cat && <DocumentPreview url={cat.url} title={cat.title} locale={locale} />}
      </div>
      {groups.map((state) => {
        const rows = DOCUMENT_ROWS.filter((r) => r.availability === state);
        if (!rows.length) return null;
        return (
          <section
            key={state}
            id={`documents-${state}`}
            className="col-content grid scroll-mt-128 grid-cols gap-x gap-y-32 border-t border-line pt-32"
          >
            <h2 className="col-span-full text-h2 text-ink lg:col-span-4 xl:col-span-7">
              {STATE[state][locale] ?? STATE[state].en}
            </h2>
            <div className="col-span-full lg:col-span-7 lg:col-start-6 xl:col-span-15 xl:col-start-10">
              <dl>
                {rows.map((row) => {
                  const [title, body] = copy[row.id][locale] ?? copy[row.id].en;
                  return (
                    <div key={row.id} className="border-b border-line py-24 first:pt-0">
                      <dt className="text-h3 text-ink">{title}</dt>
                      <dd className="mt-12 max-w-[68ch] text-c1 text-ink-secondary">{body}</dd>
                      <dd className="mt-12 flex flex-wrap gap-x-16 gap-y-4">
                        {row.purposes.map((p) => (
                          <span
                            key={p}
                            className="text-kicker uppercase tracking-[0.14em] text-ink-tertiary"
                          >
                            {PURPOSE[p][locale] ?? PURPOSE[p].en}
                          </span>
                        ))}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </section>
        );
      })}

      <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
        <h2 className="col-span-full text-h2 text-ink lg:col-span-4 xl:col-span-7">
          {notes.heading}
        </h2>
        <div className="col-span-full lg:col-span-7 lg:col-start-6 xl:col-span-15 xl:col-start-10">
          <ol className="space-y-24">
            {notes.items.map((item) => (
              <li key={item} className="max-w-[68ch] text-c1 text-ink">
                {item}
              </li>
            ))}
          </ol>
          <div className="mt-32 flex flex-wrap gap-x-32 gap-y-12">
            <Link
              href={`${prefix(locale)}/contact/`}
              className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
            >
              {notes.ask}
            </Link>
            <Link
              href={`${prefix(locale)}/news/what-documents-you-can-actually-get/`}
              className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
            >
              {notes.article}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
