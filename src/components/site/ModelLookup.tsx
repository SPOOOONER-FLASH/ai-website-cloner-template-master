import Link from "next/link";
import type { Locale } from "@/data/site";
import { localised } from "@/lib/localised";
import {
  notShownByCategory,
  notShownModels,
  renamedRecords,
  retiredPaths,
  type MergeReason,
} from "@/lib/superseded-models";

/**
 * The three tables of /model-lookup. See src/lib/superseded-models.ts for why they are
 * three tables and not one — "renamed", "moved" and "not shown" are different facts, and
 * a buyer acts differently on each.
 *
 * Nothing in the "not shown" block is a link. That is asserted by
 * src/data/withheld-products.test.ts against the built HTML, so it cannot quietly become
 * a link later.
 */

/**
 * One heading per reason, not one sentence per row.
 *
 * The first draft printed the reason in a third column, and fourteen consecutive rows
 * carried the same forty-word sentence. That reads as padding, and padding on a
 * reference page is the specific thing that makes a reader stop trusting it. Grouping
 * says the same thing once and lets the rows be what they are: a list of numbers.
 */
const REASONS: Record<MergeReason, Partial<Record<Locale, [string, string]>> & { en: [string, string] }> = {
  "renamed-to-match-type": {
    en: [
      "Renamed to match the specification",
      "These are outside trim handles for panic exit devices, not the devices themselves — each record's own Type row said so while its name did not. Nothing about the part changed.",
    ],
    es: [
      "Renombrados para coincidir con la ficha",
      "Son manillones exteriores para barras antipánico, no las barras: la fila «Type» de cada ficha ya lo decía y el nombre no. La pieza no cambió en nada.",
    ],
    pt: [
      "Renomeados para corresponder à ficha",
      "São guarnições externas de barra antipânico, e não as barras: a linha «Type» de cada ficha já dizia isso e o nome não. Nada na peça mudou.",
    ],
  },
  "duplicate-merged": {
    en: [
      "Duplicate records merged",
      "Two records described one product. The one carrying the complete specification and the photographs survived; the other now redirects to it.",
    ],
    es: [
      "Fichas duplicadas fusionadas",
      "Dos fichas describían un mismo producto. Se conservó la que tiene la especificación completa y las fotografías; la otra redirige a ella.",
    ],
    pt: [
      "Fichas duplicadas unificadas",
      "Duas fichas descreviam um mesmo produto. Ficou a que tem a especificação completa e as fotografias; a outra passou a redirecionar para ela.",
    ],
  },
  "type-corrected": {
    en: [
      "Product type corrected by the factory",
      "The record described the wrong kind of part. DS011 is a door stopper rather than a flush bolt, and 072 is the profile lock case that 307's specification names.",
    ],
    es: [
      "Tipo de producto corregido por la fábrica",
      "La ficha describía otro tipo de pieza. DS011 es un tope de puerta y no un pasador, y 072 es la caja de cerradura de perfil que nombra la ficha del 307.",
    ],
    pt: [
      "Tipo de produto corrigido pela fábrica",
      "A ficha descrevia outro tipo de peça. DS011 é um batente de porta e não um ferrolho, e 072 é a caixa de fechadura de perfil que a ficha do 307 nomeia.",
    ],
  },
};

/** Reason order on the page: the largest group first, so the common case is the first answer. */
const REASON_ORDER: MergeReason[] = [
  "renamed-to-match-type",
  "duplicate-merged",
  "type-corrected",
];

const COPY = {
  en: {
    renamedTitle: "Renamed records",
    renamedIntro:
      "The part did not change. Its name did, so that the name and the specification agree. Every old address below still resolves — it returns a permanent redirect to the page named beside it, so a link in an old email keeps working.",
    oldAddress: "Old address",
    nowCalled: "Now",
    retiredTitle: "Retired catalog paths",
    retiredIntro: "A whole category was withdrawn and everything under it moved.",
    movedProducts: (n: number) => (n === 1 ? "1 product moved" : `${n} products moved`),
    notShownTitle: "In the catalog, not on the site",
    notShownIntro: (n: number) =>
      `${n} models are in the catalog and have no published photograph, so the site does not list them. They are not discontinued — we will not use that word about a product we are still making. Send the model number and we will send the photograph and the specification.`,
    notShownNote:
      "These are printed as text rather than links on purpose: the page behind each one has no photograph on it yet, and sending you to a blank page is not an answer.",
    ask: "Ask about a model number",
  },
  es: {
    renamedTitle: "Fichas renombradas",
    renamedIntro:
      "La pieza no cambió; cambió su nombre, para que el nombre y la ficha técnica coincidan. Todas las direcciones antiguas siguen funcionando: devuelven una redirección permanente a la página indicada al lado, así que un enlace de un correo antiguo sigue sirviendo.",
    oldAddress: "Dirección antigua",
    nowCalled: "Ahora",
    retiredTitle: "Rutas de catálogo retiradas",
    retiredIntro: "Se retiró una categoría entera y todo lo que contenía se trasladó.",
    movedProducts: (n: number) => (n === 1 ? "1 producto trasladado" : `${n} productos trasladados`),
    notShownTitle: "En el catálogo, no en la web",
    notShownIntro: (n: number) =>
      `${n} modelos están en el catálogo y no tienen fotografía publicada, así que la web no los lista. No están descatalogados — no usamos esa palabra para un producto que seguimos fabricando. Envíenos el número de modelo y le mandamos la fotografía y la ficha técnica.`,
    notShownNote:
      "Van escritos como texto y no como enlaces a propósito: la página de cada uno todavía no tiene fotografía, y mandarle a una página en blanco no es una respuesta.",
    ask: "Consultar un número de modelo",
  },
  pt: {
    renamedTitle: "Fichas renomeadas",
    renamedIntro:
      "A peça não mudou; mudou o seu nome, para que o nome e a ficha técnica coincidam. Todos os endereços antigos continuam a funcionar: devolvem um redirecionamento permanente para a página indicada ao lado, por isso um link de um e-mail antigo continua a servir.",
    oldAddress: "Endereço antigo",
    nowCalled: "Agora",
    retiredTitle: "Rotas de catálogo retiradas",
    retiredIntro: "Retirou-se uma categoria inteira e tudo o que continha foi transferido.",
    movedProducts: (n: number) => (n === 1 ? "1 produto transferido" : `${n} produtos transferidos`),
    notShownTitle: "No catálogo, não no site",
    notShownIntro: (n: number) =>
      `${n} modelos estão no catálogo e não têm fotografia publicada, por isso o site não os lista. Não estão descontinuados — não usamos essa palavra para um produto que continuamos a fabricar. Envie-nos o número de modelo e mandamos a fotografia e a ficha técnica.`,
    notShownNote:
      "Estão escritos como texto e não como links de propósito: a página de cada um ainda não tem fotografia, e mandá-lo para uma página em branco não é uma resposta.",
    ask: "Consultar um número de modelo",
  },
} as const;

export function ModelLookup({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const prefix = locale === "en" ? "" : `/${locale}`;
  /* English, never the other translation — see the note in src/lib/localised.ts. */
  const pick = (en: string, es?: string, pt?: string) =>
    (locale === "es" ? es : locale === "pt" ? pt : undefined) ?? en;

  return (
    <>
      <section className="col-content" aria-labelledby="renamed">
        <h2 id="renamed" className="text-h2 text-ink">
          {copy.renamedTitle}
        </h2>
        <p className="mt-16 max-w-[68ch] text-c1 text-ink-secondary">{copy.renamedIntro}</p>

        {REASON_ORDER.map((reason) => {
          const group = renamedRecords.filter((record) => record.reason === reason);
          if (!group.length) return null;
          const [heading, explanation] = localised(REASONS[reason], locale);

          return (
            <div key={reason} className="mt-48 first:mt-32">
              <h3 className="text-h3 text-ink">
                {heading}{" "}
                <span className="text-ink-secondary">({group.length})</span>
              </h3>
              <p className="mt-12 max-w-[68ch] text-c2 text-ink-secondary">{explanation}</p>
              <div className="mt-16 overflow-x-auto">
                <table className="w-full min-w-[42rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line">
                      <th
                        scope="col"
                        className="py-12 pr-16 text-c2 font-semibold text-ink-secondary"
                      >
                        {copy.oldAddress}
                      </th>
                      <th scope="col" className="py-12 text-c2 font-semibold text-ink-secondary">
                        {copy.nowCalled}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.map((record) => (
                      <tr key={record.fromPath} className="border-b border-line align-top">
                        <th
                          scope="row"
                          className="py-12 pr-16 font-mono text-c2 font-normal break-all text-ink-secondary"
                        >
                          {record.fromPath}
                        </th>
                        <td className="py-12 text-c1 text-ink">
                          <Link
                            href={`${prefix}${record.toPath}`}
                            className="short-marker short-marker-compact text-brand hover:text-brand-hover"
                          >
                            <span className="font-mono font-semibold">{record.model}</span>{" "}
                            {pick(record.name, record.nameEs, record.namePt)}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </section>

      {retiredPaths.length ? (
        <section className="col-content" aria-labelledby="retired">
          <h2 id="retired" className="text-h2 text-ink">
            {copy.retiredTitle}
          </h2>
          <p className="mt-16 max-w-[68ch] text-c1 text-ink-secondary">{copy.retiredIntro}</p>
          <dl className="mt-24 grid grid-cols-1 gap-24 sm:grid-cols-2">
            {retiredPaths.map((path) => (
              <div key={path.fromPath} className="border-t border-line pt-12">
                <dt className="font-mono text-c2 break-all text-ink-secondary">{path.fromPath}</dt>
                <dd className="mt-8 text-c1 text-ink">
                  <Link
                    href={`${prefix}${path.toPath}`}
                    className="short-marker short-marker-compact text-brand hover:text-brand-hover"
                  >
                    {pick(path.categoryName, path.categoryNameEs, path.categoryNamePt)}
                  </Link>
                  <span className="mt-4 block text-c2 text-ink-secondary">
                    {copy.movedProducts(path.moved)}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="col-content" aria-labelledby="not-shown">
        <h2 id="not-shown" className="text-h2 text-ink">
          {copy.notShownTitle}
        </h2>
        <p className="mt-16 max-w-[68ch] text-c1 text-ink-secondary">
          {copy.notShownIntro(notShownModels.length)}
        </p>
        <p className="mt-16 max-w-[68ch] text-c2 text-ink-secondary">{copy.notShownNote}</p>

        <div className="mt-32 grid grid-cols-1 gap-32 sm:grid-cols-2 xl:grid-cols-3">
          {notShownByCategory.map((group) => (
            <div key={group.category} className="border-t border-line pt-12">
              <h3 className="text-c1 font-semibold text-ink">
                {pick(group.category, group.categoryEs, group.categoryPt)}
              </h3>
              <ul className="mt-12 space-y-8">
                {group.models.map((model) => (
                  <li key={`${model.categorySlug}-${model.model}`} className="text-c2">
                    <span className="font-mono text-ink">{model.model}</span>{" "}
                    <span className="text-ink-secondary">
                      {pick(model.name, model.nameEs, model.namePt)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
