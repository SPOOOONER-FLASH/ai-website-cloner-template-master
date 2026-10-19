import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductCard } from "@/components/site/ProductCard";
import { FinishCodeConverter } from "@/components/site/tools/FinishCodeConverter";
import { HandingFinder } from "@/components/site/tools/HandingFinder";
import { HsCodeFinder } from "@/components/site/tools/HsCodeFinder";
import { MasterKeyPlanner } from "@/components/site/tools/MasterKeyPlanner";
import type { Locale } from "@/data/locales";
import { publishedProducts } from "@/data/products";
import type { Product } from "@/data/types";
import { bhmaFinishesFor, bhmaRows, UNMAPPED_FINISHES } from "@/lib/bhma-finish";
import { tx } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { localisedHref } from "@/lib/spanish-mirror";
import { HS_ITEMS, inCategories } from "@/lib/tools/hs-codes";

/**
 * The four tool pages of 2026-10-19 and their index, for all ten locales.
 *
 * Client 2026-10-19: 「工具页去做，然后一定要结合我们的产品推荐」— HS code finder, finish code
 * converter, master key plan generator, door handing finder. Each answers one search the site
 * already receives (see docs/collaboration/2026-10-19-数据结论-SEO复盘四步与外链工具页.md) and
 * then shows the products the answer applies to, picked from what each record states:
 * category for an HS code, finish + material for a BHMA number, "master keyed" for a key
 * plan, a reversible handing row for a door hand. Nothing is recommended on a guess.
 *
 * Unlike the older tool, the English, Spanish and Portuguese routes render these same
 * components: one copy per sentence, `tx` with the es/pt text inline, the seven overlays from
 * content/i18n/<code>/ui.json. The client components receive every word already translated.
 */

const L = (locale: Locale, en: string, es: string, pt: string) => tx(locale, en, { es, pt });
type Tri = { en: string; es: string; pt: string };
const T = (locale: Locale, o: Tri) => tx(locale, o.en, o);
const to = (path: string, locale: Locale) => localisedHref(path, locale);
const MAX_CARDS = 6;

function meta(locale: Locale, enPath: string, title: Tri, description: Tri): Metadata {
  return pageMetadata({ enPath, locale, title: T(locale, title), description: T(locale, description) });
}

/** Spread a list across its categories so six cards are not six finishes of one model. */
function varied(products: Product[], n = MAX_CARDS): Product[] {
  const byGroup = new Map<string, Product[]>();
  for (const p of products) {
    const key = `${p.categoryPath.join("/")}|${p.series || p.model.split(/\s/)[0]}`;
    byGroup.set(key, [...(byGroup.get(key) ?? []), p]);
  }
  const queues = [...byGroup.values()];
  const out: Product[] = [];
  for (let i = 0; out.length < n && queues.some((q) => q.length > i); i++) {
    for (const q of queues) if (q[i] && out.length < n) out.push(q[i]);
  }
  return out;
}

function ProductGroup({
  locale,
  title,
  products,
  total,
  more,
}: {
  locale: Locale;
  title: string;
  products: Product[];
  total: number;
  more?: { href: string; label: string };
}) {
  if (!products.length) return null;
  return (
    <section className="col-content border-t border-line pt-32" data-link-list="tool-products">
      <h2 className="text-h3 text-ink">{title}</h2>
      <p className="mt-8 text-c2 text-ink-secondary">
        {L(locale, "{n} in our catalog", "{n} en nuestro catálogo", "{n} no nosso catálogo").replace("{n}", String(total))}
      </p>
      <div className="mt-24 grid grid-cols-1 gap-24 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} locale={locale} />
        ))}
      </div>
      {more ? (
        <Link href={more.href} className="mt-24 inline-block text-c1 text-brand hover:text-brand-hover">
          {more.label} →
        </Link>
      ) : null}
    </section>
  );
}

function ToolFrame({
  locale,
  crumb,
  h1,
  lead,
  aside,
  children,
  reading,
}: {
  locale: Locale;
  crumb: string;
  h1: string;
  lead: string;
  aside: string;
  children: ReactNode;
  reading: { heading: string; body: string; links: { href: string; label: string }[] };
}) {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs
              items={[
                { label: L(locale, "Home", "Inicio", "Início"), href: to("/", locale) },
                { label: L(locale, "Tools", "Herramientas", "Ferramentas"), href: to("/tools/", locale) },
                { label: crumb },
              ]}
            />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">{L(locale, "Tool", "Herramienta", "Ferramenta")}</p>
            <h1 className="mt-16 text-h1 text-ink">{h1}</h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">{lead}</p>
            <p className="mt-24 text-c2 text-ink-secondary">{aside}</p>
          </div>
        </section>
        {children}
        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">{reading.heading}</h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">{reading.body}</p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              {reading.links.map((link) => (
                <ArrowLink key={link.href} href={link.href}>
                  {link.label}
                </ArrowLink>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const quoteCta = (locale: Locale) => L(locale, "Ask for a quote", "Pedir cotización", "Pedir cotação");
const contactLink = (locale: Locale) => ({
  href: to("/contact/", locale),
  label: L(locale, "Send us the door schedule", "Envíenos el cuadro de puertas", "Envie-nos o quadro de portas"),
});

/* ------------------------------------------------------------------ HS code finder */

const HS_PATH = "/door-hardware-hs-code-finder";

export const hsCodeFinderMetadata = (locale: Locale) =>
  meta(
    locale,
    HS_PATH,
    { en: "Door Hardware HS Code Finder: Locks 8301, Fittings 8302", es: "Buscador de código HS para herrajes de puerta: 8301 y 8302", pt: "Localizador de código HS para ferragens de porta: 8301 e 8302" },
    { en: "Pick the item to get its six-digit HS code, the Indian eight-digit tariff item, the classification trap to check, and our products that ship under it.", es: "Elija el artículo y obtenga su código HS de seis dígitos, la partida india de ocho dígitos, el punto de clasificación a revisar y nuestros productos que se envían con él.", pt: "Escolha o item e veja o código HS de seis dígitos, o item tarifário indiano de oito dígitos, o ponto de classificação a conferir e nossos produtos que seguem com ele." },
  );

export function HsCodeFinderPage({ locale }: { locale: Locale }) {
  const labels: Record<string, Tri> = {
    "lock-case": { en: "Mortise lock case (lock body)", es: "Caja de cerradura de embutir (cuerpo)", pt: "Caixa de fechadura de embutir (corpo)" },
    cylinder: { en: "Lock cylinder", es: "Cilindro de cerradura", pt: "Cilindro de fechadura" },
    lockset: { en: "Cylindrical or tubular lockset (knob or lever that locks)", es: "Cerradura cilíndrica o tubular (pomo o manilla con llave)", pt: "Fechadura cilíndrica ou tubular (maçaneta ou alavanca com chave)" },
    deadbolt: { en: "Deadbolt", es: "Cerrojo", pt: "Trinco de segurança (deadbolt)" },
    "rim-lock": { en: "Rim lock or night latch", es: "Cerradura de sobreponer o picaporte nocturno", pt: "Fechadura de sobrepor ou trinco noturno" },
    padlock: { en: "Padlock", es: "Candado", pt: "Cadeado" },
    keys: { en: "Keys or key blanks shipped without their locks", es: "Llaves o llaves en bruto enviadas sin su cerradura", pt: "Chaves ou chaves virgens enviadas sem a fechadura" },
    hinge: { en: "Door hinge", es: "Bisagra de puerta", pt: "Dobradiça de porta" },
    handle: { en: "Lever or pull handle sold without a lock", es: "Manilla o tirador vendido sin cerradura", pt: "Alavanca ou puxador vendido sem fechadura" },
    "flush-bolt": { en: "Flush bolt", es: "Pasador de embutir", pt: "Fecho de embutir" },
    "door-stop": { en: "Door stop", es: "Tope de puerta", pt: "Batente de porta" },
    "exit-trim": { en: "Exit device trim", es: "Tirador exterior para barra antipánico", pt: "Puxador externo para barra antipânico" },
    closer: { en: "Door closer", es: "Cierrapuertas", pt: "Mola aérea (fecha-porta)" },
  };
  const notes: Record<string, Tri> = {
    "lock-case": { en: "Ask your broker whether a case shipped without its cylinder is declared as a lock or as a part (8301.60).", es: "Pregunte a su agente de aduanas si una caja enviada sin su cilindro se declara como cerradura o como parte (8301.60).", pt: "Pergunte ao seu despachante se uma caixa enviada sem o cilindro é declarada como fechadura ou como parte (8301.60)." },
    cylinder: { en: "Practice varies on whether a cylinder shipped on its own is a lock or a part of one. Ask before the first shipment.", es: "La práctica varía sobre si un cilindro enviado solo es una cerradura o una parte de ella. Pregunte antes del primer envío.", pt: "A prática varia sobre se um cilindro enviado sozinho é uma fechadura ou parte de uma. Pergunte antes do primeiro embarque." },
    keys: { en: "Keys supplied with the lock they operate travel under the lock's own code.", es: "Las llaves que se suministran con su cerradura viajan con el código de la cerradura.", pt: "Chaves fornecidas com a fechadura que acionam seguem com o código da própria fechadura." },
    hinge: { en: "The material on the invoice must match the eight-digit item.", es: "El material en la factura debe coincidir con la partida de ocho dígitos.", pt: "O material na fatura deve corresponder ao item de oito dígitos." },
    handle: { en: "A handle that locks is a lock (8301.40). A handle for furniture is 8302.42.", es: "Una manilla que cierra con llave es una cerradura (8301.40). Un tirador para muebles es 8302.42.", pt: "Uma alavanca que tranca é uma fechadura (8301.40). Um puxador para móveis é 8302.42." },
    "flush-bolt": { en: "In India a flush bolt is not a tower bolt (8302 41 20).", es: "En la India un pasador de embutir no es un pasador de torre (8302 41 20).", pt: "Na Índia, um fecho de embutir não é um ferrolho de torre (8302 41 20)." },
    closer: { en: "A closer has its own subheading: it is neither a lock (8301) nor a building fitting (8302.41). The arm and brackets in the same box go with the closer.", es: "El cierrapuertas tiene su propia subpartida: no es cerradura (8301) ni herraje de edificio (8302.41). El brazo y las escuadras en la misma caja van con el cierrapuertas.", pt: "A mola aérea tem subposição própria: não é fechadura (8301) nem ferragem de edificação (8302.41). O braço e os suportes na mesma caixa seguem com a mola." },
  };
  const items = HS_ITEMS.map((item) => ({
    id: item.id,
    label: T(locale, labels[item.id]),
    hs: item.hs,
    india: item.india,
    note: notes[item.id] ? T(locale, notes[item.id]) : undefined,
  }));
  const products = Object.fromEntries(
    HS_ITEMS.filter((item) => item.categories.length).map((item) => {
      const all = publishedProducts.filter((p) => inCategories(p.categoryPath, item.categories));
      const label = items.find((i) => i.id === item.id)!.label;
      return [
        item.id,
        <ProductGroup
          key={item.id}
          locale={locale}
          title={L(locale, "From our catalog: {item} · HS {hs}", "De nuestro catálogo: {item} · HS {hs}", "Do nosso catálogo: {item} · HS {hs}")
            .replace("{item}", label)
            .replace("{hs}", item.hs)}
          products={varied(all)}
          total={all.length}
          more={{
            href: to(`/products/${item.categories[0]}/`, locale),
            label: L(locale, "See all", "Ver todos", "Ver todos"),
          }}
        />,
      ];
    }),
  );

  return (
    <ToolFrame
      locale={locale}
      crumb={L(locale, "HS code finder", "Buscador de código HS", "Localizador de código HS")}
      h1={L(
        locale,
        "Door hardware HS code finder. Six digits we can stand behind, and where yours begin.",
        "Buscador de código HS para herrajes de puerta. Seis dígitos que podemos respaldar, y dónde empiezan los suyos.",
        "Localizador de código HS para ferragens de porta. Seis dígitos que podemos garantir, e onde começam os seus.",
      )}
      lead={L(
        locale,
        "Door hardware sits in two headings. 8301 is anything that locks: locks, cylinders, padlocks, keys and their parts. 8302 is anything that mounts, hangs, closes or holds without locking: hinges, handles, flush bolts, door stops and, under its own subheading, door closers.",
        "Los herrajes de puerta caben en dos partidas. La 8301 es todo lo que cierra con llave: cerraduras, cilindros, candados, llaves y sus partes. La 8302 es todo lo que se monta, cuelga, cierra o sujeta sin cerrar con llave: bisagras, manillas, pasadores, topes y, en su propia subpartida, los cierrapuertas.",
        "As ferragens de porta ficam em duas posições. A 8301 é tudo o que tranca: fechaduras, cilindros, cadeados, chaves e suas partes. A 8302 é tudo o que monta, sustenta, fecha ou segura sem trancar: dobradiças, puxadores, fechos, batentes e, em subposição própria, as molas aéreas.",
      )}
      aside={L(
        locale,
        "The first six digits are international. The European Union adds two, the United States four, India two; those national digits carry the duty rate and are the importer's to confirm, ideally with an advance ruling.",
        "Los seis primeros dígitos son internacionales. La Unión Europea añade dos, Estados Unidos cuatro y la India dos; esos dígitos nacionales llevan el arancel y le corresponde al importador confirmarlos, mejor con una resolución anticipada.",
        "Os seis primeiros dígitos são internacionais. A União Europeia acrescenta dois, os Estados Unidos quatro e a Índia dois; esses dígitos nacionais definem a alíquota e cabe ao importador confirmá-los, de preferência com uma consulta prévia.",
      )}
      reading={{
        heading: L(locale, "What goes on our documents", "Lo que ponemos en nuestros documentos", "O que colocamos nos nossos documentos"),
        body: L(
          locale,
          "We print the six-digit HS code on commercial invoices and packing lists. Your national tariff code goes on them only when you send it: a supplier abroad cannot administer your tariff.",
          "Imprimimos el código HS de seis dígitos en facturas comerciales y listas de empaque. Su código arancelario nacional solo aparece si usted nos lo envía: un proveedor extranjero no administra su arancel.",
          "Imprimimos o código HS de seis dígitos nas faturas comerciais e listas de embalagem. O seu código tarifário nacional só entra se você o enviar: um fornecedor no exterior não administra a sua tarifa.",
        ),
        links: [
          { href: to("/guides/door-hardware-hs-codes-2026/", locale), label: L(locale, "HS codes for door hardware, explained", "Códigos HS de herrajes, explicados", "Códigos HS de ferragens, explicados") },
          { href: to("/guides/india-hsn-codes-door-hardware-2026/", locale), label: L(locale, "India HSN codes, item by item", "Códigos HSN de la India, uno por uno", "Códigos HSN da Índia, item por item") },
          contactLink(locale),
        ],
      }}
    >
      <HsCodeFinder
        locale={locale}
        items={items}
        products={products}
        copy={{
          choose: L(locale, "What are you shipping?", "¿Qué va a enviar?", "O que você vai enviar?"),
          hs6: L(locale, "HS code, six digits", "Código HS, seis dígitos", "Código HS, seis dígitos"),
          heading8301: L(locale, "Heading 8301: locks, padlocks, keys and their parts", "Partida 8301: cerraduras, candados, llaves y sus partes", "Posição 8301: fechaduras, cadeados, chaves e suas partes"),
          heading8302: L(locale, "Heading 8302: base metal mountings and fittings", "Partida 8302: guarniciones y herrajes de metal común", "Posição 8302: guarnições e ferragens de metal comum"),
          india: L(locale, "India, eight-digit tariff item", "India, partida de ocho dígitos", "Índia, item tarifário de oito dígitos"),
          indiaNone: L(
            locale,
            "Our India guide does not place this item. Ask your broker before the first shipment.",
            "Nuestra guía de la India no clasifica este artículo. Consulte a su agente de aduanas antes del primer envío.",
            "Nosso guia da Índia não classifica este item. Consulte seu despachante antes do primeiro embarque.",
          ),
          sixDigitRule: L(
            locale,
            "Six digits are the same in every country that uses the Harmonized System. Confirm any longer code with your customs broker.",
            "Los seis dígitos son iguales en todos los países que usan el Sistema Armonizado. Confirme cualquier código más largo con su agente de aduanas.",
            "Os seis dígitos são iguais em todos os países que usam o Sistema Harmonizado. Confirme qualquer código mais longo com seu despachante.",
          ),
          quoteCta: quoteCta(locale),
        }}
      />
    </ToolFrame>
  );
}

/* ------------------------------------------------------------- finish code converter */

const FINISH_PATH = "/finish-code-converter";

export const finishConverterMetadata = (locale: Locale) =>
  meta(
    locale,
    FINISH_PATH,
    { en: "Finish Code Converter: US26D, 626, 652, 630 and More", es: "Conversor de códigos de acabado: US26D, 626, 652, 630", pt: "Conversor de códigos de acabamento: US26D, 626, 652, 630" },
    { en: "Type a BHMA number, a US code or a house code to get every exact equivalent, the base metal it implies, and our products in that finish.", es: "Escriba un número BHMA, un código US o un código de fábrica y obtenga cada equivalencia exacta, el metal base que implica y nuestros productos en ese acabado.", pt: "Digite um número BHMA, um código US ou um código de fábrica e veja cada equivalência exata, o metal base que ele implica e nossos produtos nesse acabamento." },
  );

export function FinishConverterPage({ locale }: { locale: Locale }) {
  const rows = bhmaRows();
  const nameOf: Record<string, Tri> = {
    "Bright Brass, clear coated": { en: "Bright Brass, clear coated", es: "Latón brillante, con barniz", pt: "Latão polido, com verniz" },
    "Satin Brass, clear coated": { en: "Satin Brass, clear coated", es: "Latón satinado, con barniz", pt: "Latão acetinado, com verniz" },
    "Satin Nickel plated, clear coated": { en: "Satin Nickel plated, clear coated", es: "Niquelado satinado, con barniz", pt: "Niquelado acetinado, com verniz" },
    "Satin Chromium plated": { en: "Satin Chromium plated", es: "Cromado satinado", pt: "Cromado acetinado" },
    "Bright Chromium plated": { en: "Bright Chromium plated", es: "Cromado brillante", pt: "Cromado polido" },
    "Flat Black Coated": { en: "Flat Black Coated", es: "Recubrimiento negro mate", pt: "Revestimento preto fosco" },
    "Stainless Steel Metal, Satin": { en: "Stainless Steel Metal, Satin", es: "Acero inoxidable macizo, satinado", pt: "Aço inoxidável maciço, acetinado" },
    "Stainless Steel Metal, Bright": { en: "Stainless Steel Metal, Bright", es: "Acero inoxidable macizo, brillante", pt: "Aço inoxidável maciço, polido" },
    "Dark Oxidized Satin Bronze, oil rubbed": { en: "Dark Oxidized Satin Bronze, oil rubbed", es: "Bronce satinado oxidado oscuro, frotado con aceite", pt: "Bronze acetinado oxidado escuro, esfregado a óleo" },
  };
  const names = Object.fromEntries(rows.map((r) => [r.bhma, nameOf[r.name] ? T(locale, nameOf[r.name]) : r.name]));
  const reasonOf: Record<string, Tri> = {
    AB: { en: "Antique Brass is a family of relieved finishes, not one A156.18 number", es: "Antique Brass es una familia de acabados envejecidos, no un único número A156.18", pt: "Antique Brass é uma família de acabamentos envelhecidos, não um único número A156.18" },
    AC: { en: "Antique Copper has no A156.18 equivalent and copper is not a base group", es: "Antique Copper no tiene equivalente A156.18 y el cobre no es un grupo de metal base", pt: "Antique Copper não tem equivalente A156.18 e o cobre não é um grupo de metal base" },
    BN: { en: "Black Nickel has no A156.18 equivalent", es: "Black Nickel no tiene equivalente A156.18", pt: "Black Nickel não tem equivalente A156.18" },
    SP: { en: "Bright Polished names a process, not a color or a base metal", es: "Bright Polished nombra un proceso, no un color ni un metal base", pt: "Bright Polished nomeia um processo, não uma cor nem um metal base" },
    SS: { en: "Stainless Steel does not state satin or polished — 630 and 629 both fit", es: "Stainless Steel no dice si es satinado o pulido: encajan tanto 630 como 629", pt: "Stainless Steel não diz se é acetinado ou polido: tanto 630 quanto 629 servem" },
    NP: { en: "Nickel Plated does not state bright or satin — 618 and 619 both fit", es: "Nickel Plated no dice si es brillante o satinado: encajan tanto 618 como 619", pt: "Nickel Plated não diz se é polido ou acetinado: tanto 618 quanto 619 servem" },
  };
  const reasons = Object.fromEntries(
    Object.entries(UNMAPPED_FINISHES)
      .filter(([code]) => reasonOf[code])
      .map(([code]) => [code, T(locale, reasonOf[code])]),
  );
  const products = Object.fromEntries(
    [...new Set(rows.map((r) => r.bhma))].map((bhma) => {
      const row = rows.find((r) => r.bhma === bhma)!;
      const all = publishedProducts.filter((p) => bhmaFinishesFor(p).some((f) => f.bhma === bhma));
      return [
        bhma,
        <ProductGroup
          key={bhma}
          locale={locale}
          title={L(locale, "Ours in {bhma} ({us})", "Nuestros productos en {bhma} ({us})", "Nossos produtos em {bhma} ({us})")
            .replace("{bhma}", bhma)
            .replace("{us}", row.us)}
          products={varied(all)}
          total={all.length}
        />,
      ];
    }),
  );

  return (
    <ToolFrame
      locale={locale}
      crumb={L(locale, "Finish code converter", "Conversor de códigos de acabado", "Conversor de códigos de acabamento")}
      h1={L(
        locale,
        "Finish code converter. A BHMA number names the metal underneath as well as the color.",
        "Conversor de códigos de acabado. Un número BHMA nombra el metal de debajo además del color.",
        "Conversor de códigos de acabamento. Um número BHMA nomeia o metal por baixo, além da cor.",
      )}
      lead={L(
        locale,
        "US26D is satin chrome, and it is two BHMA numbers: 626 on a brass or bronze base, 652 on steel. 630 is not plated at all; it is solid satin stainless. Charts that print two columns lose that, and a submittal that asked for 626 and received 652 is a substitution.",
        "US26D es cromo satinado, y son dos números BHMA: 626 sobre base de latón o bronce, 652 sobre acero. 630 no lleva baño: es inoxidable macizo satinado. Las tablas de dos columnas pierden eso, y una especificación que pidió 626 y recibió 652 es una sustitución.",
        "US26D é cromo acetinado, e são dois números BHMA: 626 sobre base de latão ou bronze, 652 sobre aço. 630 não tem banho: é inox maciço acetinado. Tabelas de duas colunas perdem isso, e uma especificação que pediu 626 e recebeu 652 é uma substituição.",
      )}
      aside={L(
        locale,
        "The converter only answers where the equivalence is exact. A house code that does not say satin or polished, or a finish with no A156.18 number, comes back with the reason rather than the nearest guess.",
        "El conversor solo responde cuando la equivalencia es exacta. Un código que no dice satinado o pulido, o un acabado sin número A156.18, vuelve con el motivo y no con la suposición más cercana.",
        "O conversor só responde quando a equivalência é exata. Um código que não diz acetinado ou polido, ou um acabamento sem número A156.18, volta com o motivo e não com o palpite mais próximo.",
      )}
      reading={{
        heading: L(locale, "Read more on finishes", "Más sobre acabados", "Mais sobre acabamentos"),
        body: L(
          locale,
          "Our order codes put the finish after the model number, so 587 SSBK is model 587 in SS with function BK. The order-code page lists every finish code we use, including the ones whose expansion we still confirm per order.",
          "Nuestros códigos de pedido ponen el acabado después del número de modelo: 587 SSBK es el modelo 587 en SS con función BK. La página de códigos de pedido recoge todos los códigos de acabado que usamos, incluidos los que confirmamos en cada pedido.",
          "Nossos códigos de pedido colocam o acabamento depois do número do modelo: 587 SSBK é o modelo 587 em SS com função BK. A página de códigos de pedido lista todos os códigos de acabamento que usamos, inclusive os que confirmamos a cada pedido.",
        ),
        links: [
          { href: to("/news/finish-codes-us26d-626-630/", locale), label: L(locale, "US26D vs 626 vs 630", "US26D, 626 y 630", "US26D, 626 e 630") },
          { href: to("/news/satin-chrome-vs-satin-nickel-us26d-us15/", locale), label: L(locale, "Satin chrome or satin nickel", "Cromo satinado o níquel satinado", "Cromo acetinado ou níquel acetinado") },
          { href: to("/finishes/", locale), label: L(locale, "Our order codes", "Nuestros códigos de pedido", "Nossos códigos de pedido") },
        ],
      }}
    >
      <FinishCodeConverter
        locale={locale}
        names={names}
        reasons={reasons}
        products={products}
        copy={{
          input: L(locale, "Finish code: BHMA, US or ours", "Código de acabado: BHMA, US o nuestro", "Código de acabamento: BHMA, US ou nosso"),
          examples: L(locale, "Try one", "Pruebe uno", "Experimente um"),
          colHouse: L(locale, "Our code", "Nuestro código", "Nosso código"),
          colBase: L(locale, "Base metal", "Metal base", "Metal base"),
          colBhma: "BHMA",
          colUs: "US",
          colName: L(locale, "Finish", "Acabado", "Acabamento"),
          base: {
            steel: L(locale, "Steel", "Acero", "Aço"),
            brass: L(locale, "Brass or bronze", "Latón o bronce", "Latão ou bronze"),
            stainless: L(locale, "Stainless steel", "Acero inoxidable", "Aço inoxidável"),
          },
          twoRows: L(
            locale,
            "Two rows: the same appearance on two base metals. Say which base on the order.",
            "Dos filas: el mismo aspecto sobre dos metales base. Indique la base en el pedido.",
            "Duas linhas: a mesma aparência sobre dois metais base. Informe a base no pedido.",
          ),
          unknown: L(
            locale,
            "No exact equivalent in our table. Send the code with your inquiry and we will answer it.",
            "No hay equivalencia exacta en nuestra tabla. Envíenos el código con su consulta y le responderemos.",
            "Não há equivalência exata na nossa tabela. Envie o código com sua consulta e responderemos.",
          ),
          unmapped: L(locale, "{code}: {reason}.", "{code}: {reason}.", "{code}: {reason}."),
          zincNote: L(
            locale,
            "Zinc alloy and aluminum have no base designation in A156.18, so a zinc-alloy part has no BHMA number however close its color comes.",
            "La aleación de zinc y el aluminio no tienen designación de base en A156.18, así que una pieza de zamak no tiene número BHMA por mucho que se parezca el color.",
            "A liga de zinco e o alumínio não têm designação de base na A156.18, então uma peça de zamak não tem número BHMA por mais que a cor se pareça.",
          ),
          quoteCta: quoteCta(locale),
          product: L(locale, "Finish inquiry", "Consulta de acabado", "Consulta de acabamento"),
        }}
      />
    </ToolFrame>
  );
}

/* --------------------------------------------------------- master key plan generator */

const MASTER_PATH = "/master-key-plan-generator";
const MASTER_KEYED = /master[ -]?keyed/i;

export const masterKeyPlanMetadata = (locale: Locale) =>
  meta(
    locale,
    MASTER_PATH,
    { en: "Master Key Plan Generator: Key Symbols and a Schedule CSV", es: "Generador de plan de amaestramiento: símbolos y CSV", pt: "Gerador de plano de chave mestra: símbolos e CSV" },
    { en: "Choose three, four or five levels and how many keys sit at each. Get every key symbol in the standard GM, A, AA1 convention and a keying schedule to download.", es: "Elija tres, cuatro o cinco niveles y cuántas llaves hay en cada uno. Obtenga cada símbolo de llave en la convención estándar GM, A, AA1 y un cuadro de amaestramiento para descargar.", pt: "Escolha três, quatro ou cinco níveis e quantas chaves há em cada um. Receba cada símbolo de chave na convenção padrão GM, A, AA1 e um quadro de chaves para baixar." },
  );

export function MasterKeyPlanPage({ locale }: { locale: Locale }) {
  const keyed = publishedProducts.filter((p) =>
    MASTER_KEYED.test([p.summary, p.description ?? "", ...(p.features ?? []), ...p.specs.map((x) => x.value)].join(" ")),
  );
  const gm = L(locale, "Grand master keys under the GGM", "Llaves gran maestras bajo la GGM", "Chaves grão-mestras sob a GGM");
  const masters = (parent: string) =>
    L(locale, "Master keys under each {parent}", "Llaves maestras bajo cada {parent}", "Chaves mestras sob cada {parent}").replace("{parent}", parent);
  const subs = L(locale, "Sub-master keys under each master", "Llaves submaestras bajo cada maestra", "Chaves submestras sob cada mestra");

  return (
    <ToolFrame
      locale={locale}
      crumb={L(locale, "Master key plan generator", "Generador de plan de amaestramiento", "Gerador de plano de chave mestra")}
      h1={L(
        locale,
        "Master key plan generator. Every symbol says where its key sits.",
        "Generador de plan de amaestramiento. Cada símbolo dice dónde está su llave.",
        "Gerador de plano de chave mestra. Cada símbolo diz onde fica a sua chave.",
      )}
      lead={L(
        locale,
        "The symbols follow the keying nomenclature of the North American door-hardware trade, reflected in BHMA A156.28. In a four-level system the top key is GGM, grand masters are A and B, masters AA and AB, and change keys AA1, AA2. Read AB2 from the left and it says change key 2, under master AB, under grand master A.",
        "Los símbolos siguen la nomenclatura de amaestramiento del sector norteamericano, recogida en BHMA A156.28. En un sistema de cuatro niveles la llave superior es GGM, las gran maestras son A y B, las maestras AA y AB, y las llaves de paso AA1, AA2. AB2 leído de izquierda a derecha dice: llave de paso 2, bajo la maestra AB, bajo la gran maestra A.",
        "Os símbolos seguem a nomenclatura de chaves do setor norte-americano, refletida na BHMA A156.28. Num sistema de quatro níveis a chave do topo é GGM, as grão-mestras são A e B, as mestras AA e AB, e as chaves individuais AA1, AA2. AB2 lido da esquerda diz: chave individual 2, sob a mestra AB, sob a grão-mestra A.",
      )}
      aside={L(
        locale,
        "Most buildings need three levels at most. Add levels only where the organization actually delegates authority: every level costs capacity on the keyway.",
        "La mayoría de los edificios necesitan tres niveles como mucho. Añada niveles solo donde la organización realmente delega autoridad: cada nivel consume capacidad del perfil.",
        "A maioria dos edifícios precisa de três níveis no máximo. Acrescente níveis só onde a organização realmente delega autoridade: cada nível consome capacidade do perfil.",
      )}
      reading={{
        heading: L(locale, "Before a cylinder is cut", "Antes de cortar un cilindro", "Antes de cortar um cilindro"),
        body: L(
          locale,
          "Send the plan with the door schedule: door numbers, profile, length and split per cylinder, function, and how many copies of each master key. Whether a platform can carry the plan depends on its own mastering rules, so the hierarchy is confirmed by whoever designs the system.",
          "Envíe el plan con el cuadro de puertas: número de puerta, perfil, longitud y división de cada cilindro, función y cuántas copias de cada llave maestra. Que una plataforma pueda soportar el plan depende de sus propias reglas de amaestramiento, así que la jerarquía la confirma quien diseña el sistema.",
          "Envie o plano com o quadro de portas: número da porta, perfil, comprimento e divisão de cada cilindro, função e quantas cópias de cada chave mestra. Se uma plataforma comporta o plano depende das próprias regras de mestragem, então a hierarquia é confirmada por quem projeta o sistema.",
        ),
        links: [
          { href: to("/guides/master-key-hierarchy-planning-2026/", locale), label: L(locale, "Planning the hierarchy", "Planificar la jerarquía", "Planejar a hierarquia") },
          { href: to("/news/how-to-write-a-keying-schedule-with-template/", locale), label: L(locale, "Writing the keying schedule", "Redactar el cuadro de amaestramiento", "Escrever o quadro de chaves") },
          { href: to("/news/why-key-bitting-must-be-unique-master-key-security/", locale), label: L(locale, "Why every bitting must be unique", "Por qué cada combinación debe ser única", "Por que cada segredo deve ser único") },
          contactLink(locale),
        ],
      }}
    >
      <MasterKeyPlanner
        locale={locale}
        products={
          <ProductGroup
            locale={locale}
            title={L(
              locale,
              "Ours published as able to be master keyed",
              "Nuestros productos publicados como amaestrables",
              "Nossos produtos publicados como compatíveis com chave mestra",
            )}
            products={varied(keyed)}
            total={keyed.length}
          />
        }
        copy={{
          levels: L(locale, "Levels in the system", "Niveles del sistema", "Níveis do sistema"),
          levelOption: L(locale, "{n} levels", "{n} niveles", "{n} níveis"),
          branch: {
            "3": [L(locale, "Master keys under the GM", "Llaves maestras bajo la GM", "Chaves mestras sob a GM")],
            "4": [gm, masters(L(locale, "grand master", "gran maestra", "grão-mestra"))],
            "5": [gm, masters(L(locale, "grand master", "gran maestra", "grão-mestra")), subs],
          },
          changeKeys: L(locale, "Change keys under each lowest master", "Llaves de paso bajo cada maestra inferior", "Chaves individuais sob cada mestra inferior"),
          roles: {
            GGM: L(locale, "Great grand master", "Gran maestra general", "Grão-mestra geral"),
            GM: L(locale, "Grand master", "Gran maestra", "Grão-mestra"),
            M: L(locale, "Master", "Maestra", "Mestra"),
            SM: L(locale, "Sub-master", "Submaestra", "Submestra"),
            CK: L(locale, "Change key", "Llave de paso", "Chave individual"),
          },
          colSymbol: L(locale, "Symbol", "Símbolo", "Símbolo"),
          colRole: L(locale, "Key", "Llave", "Chave"),
          colAbove: L(locale, "Also opened by", "También la abre", "Também abre com"),
          totalKeys: L(locale, "{n} key symbols", "{n} símbolos de llave", "{n} símbolos de chave"),
          totalChange: L(locale, "{n} change keys", "{n} llaves de paso", "{n} chaves individuais"),
          truncated: L(
            locale,
            "Showing {shown} of {total}. The download has every change key.",
            "Se muestran {shown} de {total}. La descarga incluye todas las llaves de paso.",
            "Mostrando {shown} de {total}. O download traz todas as chaves individuais.",
          ),
          download: L(locale, "Download keying schedule (CSV)", "Descargar cuadro de amaestramiento (CSV)", "Baixar quadro de chaves (CSV)"),
          invalid: L(
            locale,
            "Enter whole numbers: 1 to 26 keys at each master level, 1 to 99 change keys.",
            "Introduzca números enteros: de 1 a 26 llaves en cada nivel maestro, de 1 a 99 llaves de paso.",
            "Informe números inteiros: de 1 a 26 chaves em cada nível mestre, de 1 a 99 chaves individuais.",
          ),
          capacity: L(
            locale,
            "Symbols only. Each master level and each cross-keyed door removes bittings from the pool, so confirm the plan against the platform before cutting.",
            "Solo símbolos. Cada nivel maestro y cada puerta con llave cruzada quita combinaciones del total, así que confirme el plan con la plataforma antes de cortar.",
            "Apenas símbolos. Cada nível mestre e cada porta com chave cruzada tira segredos do total, então confirme o plano com a plataforma antes de cortar.",
          ),
          quoteCta: quoteCta(locale),
          product: L(locale, "Master key system", "Sistema amaestrado", "Sistema de chave mestra"),
          csv: [
            L(locale, "Door no.", "N.º de puerta", "N.º da porta"),
            L(locale, "Location", "Ubicación", "Local"),
            L(locale, "Key symbol", "Símbolo de llave", "Símbolo da chave"),
            L(locale, "Also opened by", "También la abre", "Também abre com"),
            L(locale, "Keys", "Llaves", "Chaves"),
            L(locale, "Notes", "Notas", "Observações"),
          ],
        }}
      />
    </ToolFrame>
  );
}

/* ---------------------------------------------------------------- door handing finder */

const HANDING_PATH = "/door-handing-finder";
const REVERSIBLE = /reversible|non-handed/i;
const IN_SWING = ["knob-locks", "lever-handles", "deadbolts", "night-latches-rim-locks", "lock-cases", "grip-handle-sets"];
const OUT_SWING = ["panic-exit-devices"];

export const handingFinderMetadata = (locale: Locale) =>
  meta(
    locale,
    HANDING_PATH,
    { en: "Door Handing Finder: LH, RH, LHR, RHR and DIN Left or Right", es: "Cómo saber la mano de una puerta: LH, RH, LHR, RHR y DIN", pt: "Como saber a mão da porta: LH, RH, LHR, RHR e DIN" },
    { en: "Answer two questions from outside the door to get its ANSI hand, the DIN equivalent, a description that survives translation, and our reversible hardware for it.", es: "Responda dos preguntas desde el exterior de la puerta y obtenga su mano ANSI, el equivalente DIN, una descripción que no se pierde al traducir y nuestros herrajes reversibles para ella.", pt: "Responda duas perguntas do lado de fora da porta e veja a mão ANSI, o equivalente DIN, uma descrição que não se perde na tradução e nossas ferragens reversíveis para ela." },
  );

export function HandingFinderPage({ locale }: { locale: Locale }) {
  const reversible = publishedProducts.filter((p) =>
    p.specs.some((s) => /^hand(?:ing|ling)$/i.test(s.label) && REVERSIBLE.test(s.value)),
  );
  const inSwing = reversible.filter((p) => inCategories(p.categoryPath, IN_SWING));
  const outSwing = reversible.filter((p) => inCategories(p.categoryPath, OUT_SWING));

  return (
    <ToolFrame
      locale={locale}
      crumb={L(locale, "Door handing finder", "Mano de la puerta", "Mão da porta")}
      h1={L(
        locale,
        "Door handing finder. Stand outside, look at the hinges, watch which way it swings.",
        "Cómo saber la mano de una puerta. Desde fuera, mire las bisagras y hacia dónde abre.",
        "Como saber a mão da porta. Do lado de fora, olhe as dobradiças e para onde ela abre.",
      )}
      lead={L(
        locale,
        "ANSI/BHMA stands you outside, on the side you would use a key from, names the hinge side and adds reverse when the leaf swings toward you. DIN stands you on the side the door opens toward and names the hinge side. The same door can be right hand in one and DIN left in the other, and nobody has made a mistake.",
        "ANSI/BHMA le sitúa fuera, en el lado desde el que usaría la llave, nombra el lado de las bisagras y añade reverse si la hoja abre hacia usted. DIN le sitúa en el lado hacia el que abre la puerta y nombra el lado de las bisagras. La misma puerta puede ser mano derecha en uno y DIN izquierda en el otro, sin que nadie se haya equivocado.",
        "A ANSI/BHMA coloca você do lado de fora, onde usaria a chave, nomeia o lado das dobradiças e acrescenta reverse quando a folha abre na sua direção. A DIN coloca você do lado para onde a porta abre e nomeia o lado das dobradiças. A mesma porta pode ser mão direita numa e DIN esquerda na outra, sem que ninguém tenha errado.",
      )}
      aside={L(
        locale,
        "So the safest field on an order is the description underneath the letters. It reads the same in every language and every convention.",
        "Por eso el dato más seguro en un pedido es la descripción que va debajo de las letras. Se lee igual en cualquier idioma y convención.",
        "Por isso o dado mais seguro num pedido é a descrição embaixo das letras. Ela se lê igual em qualquer idioma e convenção.",
      )}
      reading={{
        heading: L(locale, "Where the hand still matters", "Dónde sigue importando la mano", "Onde a mão ainda importa"),
        body: L(
          locale,
          "Almost everything we sell is reversible or non-handed, so the lock rarely changes with the hand. The opening still decides which side the strike is cut, where the closer arm goes, and which leaf of a pair is active. Record the hand, name the convention beside it.",
          "Casi todo lo que vendemos es reversible o sin mano, así que la cerradura rara vez cambia con la mano. La abertura sigue decidiendo en qué lado se corta el cerradero, dónde va el brazo del cierrapuertas y qué hoja de una doble es la activa. Anote la mano y, al lado, la convención.",
          "Quase tudo o que vendemos é reversível ou sem mão, então a fechadura raramente muda com a mão. A abertura continua decidindo de que lado se corta a contratesta, onde vai o braço da mola e qual folha de uma porta dupla é a ativa. Anote a mão e, ao lado, a convenção.",
        ),
        links: [
          { href: to("/news/handing-left-right-and-universal/", locale), label: L(locale, "Handing: left, right and universal", "La mano: izquierda, derecha y universal", "A mão: esquerda, direita e universal") },
          { href: to("/products/door-closers/", locale), label: L(locale, "Door closers", "Cierrapuertas", "Molas aéreas") },
          contactLink(locale),
        ],
      }}
    >
      <HandingFinder
        locale={locale}
        products={{
          in: (
            <ProductGroup
              locale={locale}
              title={L(
                locale,
                "Ours for this door: reversible locks and levers",
                "Nuestros productos para esta puerta: cerraduras y manillas reversibles",
                "Nossos produtos para esta porta: fechaduras e alavancas reversíveis",
              )}
              products={varied(inSwing)}
              total={inSwing.length}
            />
          ),
          out: (
            <ProductGroup
              locale={locale}
              title={L(
                locale,
                "Ours for doors that swing toward you: reversible exit devices",
                "Nuestros productos para puertas que abren hacia usted: barras antipánico reversibles",
                "Nossos produtos para portas que abrem na sua direção: barras antipânico reversíveis",
              )}
              products={varied(outSwing)}
              total={outSwing.length}
              more={{ href: to("/products/panic-exit-devices/", locale), label: L(locale, "All exit devices", "Todas las barras antipánico", "Todas as barras antipânico") }}
            />
          ),
        }}
        copy={{
          hingesQ: L(locale, "Standing outside, the hinges are on the", "Desde fuera, las bisagras están a la", "Do lado de fora, as dobradiças estão à"),
          left: L(locale, "Left", "Izquierda", "Esquerda"),
          right: L(locale, "Right", "Derecha", "Direita"),
          swingQ: L(locale, "The door swings", "La puerta abre", "A porta abre"),
          away: L(locale, "Away from me", "Alejándose de mí", "Para longe de mim"),
          toward: L(locale, "Toward me", "Hacia mí", "Na minha direção"),
          result: L(locale, "ANSI/BHMA hand", "Mano ANSI/BHMA", "Mão ANSI/BHMA"),
          ansiLine: L(locale, "ANSI/BHMA A156.115: {hand}", "ANSI/BHMA A156.115: {hand}", "ANSI/BHMA A156.115: {hand}"),
          dinLine: L(locale, "DIN: {din}", "DIN: {din}", "DIN: {din}"),
          dinLeft: L(locale, "DIN left", "DIN izquierda", "DIN esquerda"),
          dinRight: L(locale, "DIN right", "DIN derecha", "DIN direita"),
          describe: L(
            locale,
            "Hinges on the {hinges} as seen from outside; the door opens {swing}.",
            "Bisagras a la {hinges} vistas desde fuera; la puerta abre {swing}.",
            "Dobradiças à {hinges} vistas de fora; a porta abre {swing}.",
          ),
          describeHint: L(locale, "Write it on the order like this", "Escríbalo así en el pedido", "Escreva assim no pedido"),
          hingesLeftWords: L(locale, "left side", "izquierda", "esquerda"),
          hingesRightWords: L(locale, "right side", "derecha", "direita"),
          awayWords: L(locale, "away from the outside", "hacia dentro, alejándose del exterior", "para dentro, afastando-se do lado de fora"),
          towardWords: L(locale, "toward the outside", "hacia fuera, hacia el exterior", "para fora, em direção ao lado de fora"),
          reverseNote: L(
            locale,
            "Reverse only means the leaf swings toward the person outside. It is normal on outward-opening exit doors, the doors that carry panic hardware.",
            "Reverse solo significa que la hoja abre hacia quien está fuera. Es lo normal en puertas de evacuación que abren hacia fuera, las que llevan barra antipánico.",
            "Reverse só significa que a folha abre na direção de quem está fora. É o normal em portas de saída que abrem para fora, as que levam barra antipânico.",
          ),
          quoteCta: quoteCta(locale),
          product: L(locale, "Door hardware for a handed opening", "Herrajes para una puerta con mano definida", "Ferragens para uma porta com mão definida"),
        }}
      />
    </ToolFrame>
  );
}

/* ------------------------------------------------------------------------ the index */

export const toolsIndexMetadata = (locale: Locale) =>
  meta(
    locale,
    "/tools",
    { en: "Door Hardware Tools: HS Codes, Finishes, Keying, Handing", es: "Herramientas de herrajes: HS, acabados, llaves, mano", pt: "Ferramentas de ferragens: HS, acabamentos, chaves, mão" },
    { en: "Five working tools for ordering door hardware: HS codes, finish code equivalents, master key symbols, door handing and euro cylinder length. Each ends at the products it applies to.", es: "Cinco herramientas para pedir herrajes de puerta: códigos HS, equivalencias de acabados, símbolos de amaestramiento, mano de la puerta y longitud de cilindro europeo. Cada una termina en los productos a los que se aplica.", pt: "Cinco ferramentas para pedir ferragens de porta: códigos HS, equivalências de acabamentos, símbolos de chave mestra, mão da porta e comprimento de cilindro europeu. Cada uma termina nos produtos a que se aplica." },
  );

export function ToolsIndexPage({ locale }: { locale: Locale }) {
  const tools: { href: string; name: string; does: string }[] = [
    {
      href: `${HS_PATH}/`,
      name: L(locale, "HS code finder", "Buscador de código HS", "Localizador de código HS"),
      does: L(locale, "Six-digit HS code and India tariff item for each kind of door hardware.", "Código HS de seis dígitos y partida india para cada tipo de herraje.", "Código HS de seis dígitos e item tarifário indiano para cada tipo de ferragem."),
    },
    {
      href: `${FINISH_PATH}/`,
      name: L(locale, "Finish code converter", "Conversor de códigos de acabado", "Conversor de códigos de acabamento"),
      does: L(locale, "BHMA, US and our codes, with the base metal each one implies.", "Códigos BHMA, US y nuestros, con el metal base que implica cada uno.", "Códigos BHMA, US e nossos, com o metal base que cada um implica."),
    },
    {
      href: `${MASTER_PATH}/`,
      name: L(locale, "Master key plan generator", "Generador de plan de amaestramiento", "Gerador de plano de chave mestra"),
      does: L(locale, "Key symbols for three to five levels, and a keying schedule to download.", "Símbolos de llave de tres a cinco niveles y un cuadro para descargar.", "Símbolos de chave de três a cinco níveis e um quadro para baixar."),
    },
    {
      href: `${HANDING_PATH}/`,
      name: L(locale, "Door handing finder", "Mano de la puerta", "Mão da porta"),
      does: L(locale, "LH, RH, LHR or RHR, the DIN equivalent, and words that cannot be misread.", "LH, RH, LHR o RHR, el equivalente DIN y una descripción que no se malinterpreta.", "LH, RH, LHR ou RHR, o equivalente DIN e uma descrição que não se interpreta errado."),
    },
    {
      href: "/euro-cylinder-calculator/",
      name: L(locale, "Euro cylinder calculator", "Calculadora de cilindro europeo", "Calculadora de cilindro europeu"),
      does: L(locale, "Door thickness and trim in, the two half-lengths and the cylinder to order out.", "Espesor de puerta y escudos dentro; las dos semilongitudes y el cilindro a pedir fuera.", "Espessura da porta e espelhos dentro; os dois meios-comprimentos e o cilindro a pedir fora."),
    },
  ];
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: L(locale, "Home", "Inicio", "Início"), href: to("/", locale) }, { label: L(locale, "Tools", "Herramientas", "Ferramentas") }]} />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <h1 className="text-h1 text-ink">{L(locale, "Tools for ordering door hardware", "Herramientas para pedir herrajes de puerta", "Ferramentas para pedir ferragens de porta")}</h1>
          </div>
          <p className="col-span-full text-c1 text-ink lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            {L(
              locale,
              "Each one answers a question an order cannot go out without, using the same figures our guides publish, and ends at the products in our catalog it applies to.",
              "Cada una responde a una pregunta sin la que un pedido no puede salir, con las mismas cifras que publican nuestras guías, y termina en los productos de nuestro catálogo a los que se aplica.",
              "Cada uma responde a uma pergunta sem a qual um pedido não sai, com os mesmos números que nossos guias publicam, e termina nos produtos do nosso catálogo a que se aplica.",
            )}
          </p>
        </section>
        <ul className="col-content divide-y divide-line border-y border-line" data-link-list="tools-index">
          {tools.map((tool) => (
            <li key={tool.href}>
              <Link href={to(tool.href, locale)} className="grid gap-8 py-24 hover:text-brand-hover lg:grid-cols-2 lg:gap-x">
                <span className="text-h3 text-ink">{tool.name}</span>
                <span className="text-c1 text-ink-secondary">{tool.does}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
