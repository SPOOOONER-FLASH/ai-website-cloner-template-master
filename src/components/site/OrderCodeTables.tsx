import Link from "next/link";
import type { Locale } from "@/data/site";
import { doorUsage, finishUsage, functionUsage, type CodeUsage } from "@/lib/finish-usage";
import type { CodeEvidence } from "@/data/finish-codes";

/**
 * The order-code reference, rendered as three tables.
 *
 * ---------------------------------------------------------------------------
 * WHY A REAL <table> AND NOT THE SITE'S USUAL DEFINITION LISTS
 *
 * Everything else on this site that looks tabular is a `dl` in a grid, because the
 * content is a handful of labelled values per record and a grid reflows better on a
 * phone. This is different: it is a lookup, forty rows deep, that a reader scans down one
 * column. `th scope="col"` and `th scope="row"` are what let a screen reader announce
 * "SSBK — finish — Satin Stainless Steel" instead of reading three unrelated cells, and
 * they are also what an answer engine uses to extract the pairs. The page exists to be
 * quoted; the markup should make quoting it easy.
 *
 * The horizontal scroll container is not decoration either. A four-column table with a
 * note column cannot fit 360px, and the alternative — letting the page body scroll
 * sideways — breaks every other section on the page to fix one.
 */

const COPY = {
  en: {
    codeHead: "Code",
    meaningHead: "Meaning",
    modelsHead: "Models",
    exampleHead: "Example",
    unknown: "Not confirmed — ask",
    none: "—",
    models: (n: number) => (n === 1 ? "1 model" : `${n} models`),
    notPublished: "none published",
  },
  es: {
    codeHead: "Código",
    meaningHead: "Significado",
    modelsHead: "Modelos",
    exampleHead: "Ejemplo",
    unknown: "Sin confirmar — consúltenos",
    none: "—",
    models: (n: number) => (n === 1 ? "1 modelo" : `${n} modelos`),
    notPublished: "ninguno publicado",
  },
} as const;

interface Row {
  code: string;
  name: string | null;
  note?: string;
  evidence: CodeEvidence;
  models: number;
  example?: string;
}

function toRows(
  usage: CodeUsage<{
    code: string;
    name: string | null;
    nameEs: string | null;
    evidence: CodeEvidence;
    note?: string;
    noteEs?: string;
  }>[],
  locale: Locale,
): Row[] {
  return usage.map(({ entry, models, example }) => ({
    code: entry.code,
    name: locale === "es" ? entry.nameEs : entry.name,
    note: locale === "es" ? entry.noteEs : entry.note,
    evidence: entry.evidence,
    models,
    example,
  }));
}

function CodeTable({
  id,
  title,
  rows,
  locale,
}: {
  id: string;
  title: string;
  rows: Row[];
  locale: Locale;
}) {
  const copy = COPY[locale];

  return (
    <section className="col-content" aria-labelledby={id}>
      <h2 id={id} className="text-h2 text-ink">
        {title}
      </h2>
      <div className="mt-24 overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="py-12 pr-16 text-c2 font-semibold text-ink-secondary">
                {copy.codeHead}
              </th>
              <th scope="col" className="py-12 pr-16 text-c2 font-semibold text-ink-secondary">
                {copy.meaningHead}
              </th>
              <th scope="col" className="py-12 pr-16 text-c2 font-semibold text-ink-secondary">
                {copy.modelsHead}
              </th>
              <th scope="col" className="py-12 text-c2 font-semibold text-ink-secondary">
                {copy.exampleHead}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.code} className="border-b border-line align-top">
                <th
                  scope="row"
                  className="py-16 pr-16 font-mono text-c1 font-semibold whitespace-nowrap text-ink"
                >
                  {row.code}
                </th>
                <td className="py-16 pr-16 text-c1 text-ink">
                  {/*
                    An unconfirmed code prints the invitation to ask, never a guess. The
                    note below it says what the candidate readings are and why none of
                    them is printed as the answer — which is more use to a buyer holding a
                    quotation than a confident wrong expansion.
                  */}
                  {row.name ?? <span className="text-ink-secondary">{copy.unknown}</span>}
                  {row.note ? (
                    <span className="mt-8 block max-w-[52ch] text-c2 text-ink-secondary">
                      {row.note}
                    </span>
                  ) : null}
                </td>
                <td className="py-16 pr-16 text-c2 whitespace-nowrap text-ink-secondary">
                  {row.models > 0 ? copy.models(row.models) : copy.notPublished}
                </td>
                <td className="py-16 font-mono text-c2 whitespace-nowrap text-ink-secondary">
                  {row.example ?? copy.none}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const TITLES = {
  en: {
    finish: "Finish codes",
    fn: "Function codes",
    door: "Door configuration",
  },
  es: {
    finish: "Códigos de acabado",
    fn: "Códigos de función",
    door: "Configuración de puerta",
  },
} as const;

/** A worked decomposition. The single most useful object on the page. */
export function WorkedOrderCode({ locale }: { locale: Locale }) {
  const parts =
    locale === "es"
      ? [
          ["587", "Modelo base — cerradura cilíndrica de servicio ligero"],
          ["SS", "Acabado — acero inoxidable"],
          ["BK", "Función — privacidad, botón interior"],
        ]
      : [
          ["587", "Base model — light-duty cylindrical lock"],
          ["SS", "Finish — stainless steel"],
          ["BK", "Function — privacy, turn button inside"],
        ];

  return (
    <div className="border border-line p-24 lg:p-32">
      {/*
        Each segment is underlined separately rather than coloured. Colour would need a
        key to explain what each colour meant; an underline that lines up with the three
        definitions below needs nothing — the reader's eye does the mapping.
      */}
      <p className="font-mono text-h3 tracking-[0.08em] text-ink" aria-hidden="true">
        <span className="border-b-2 border-frame pb-4">587</span>{" "}
        <span className="border-b-2 border-frame pb-4">SS</span>
        <span className="border-b-2 border-line pb-4">BK</span>
      </p>
      <p className="sr-only">587 SSBK</p>
      <dl className="mt-24 grid grid-cols-1 gap-16 sm:grid-cols-3">
        {parts.map(([code, meaning]) => (
          <div key={code} className="border-t border-line pt-12">
            <dt className="font-mono text-c1 font-semibold text-ink">{code}</dt>
            <dd className="mt-4 text-c2 text-ink-secondary">{meaning}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function OrderCodeTables({ locale }: { locale: Locale }) {
  const titles = TITLES[locale];
  return (
    <>
      <CodeTable
        id="finish-codes"
        title={titles.finish}
        rows={toRows(finishUsage, locale)}
        locale={locale}
      />
      <CodeTable
        id="function-codes"
        title={titles.fn}
        rows={toRows(functionUsage, locale)}
        locale={locale}
      />
      <CodeTable
        id="door-codes"
        title={titles.door}
        rows={toRows(doorUsage, locale)}
        locale={locale}
      />
    </>
  );
}

/** The link out. Separate so the pages can place it themselves. */
export function OrderCodeFooter({ locale }: { locale: Locale }) {
  const es = locale === "es";
  return (
    <p className="text-c1 text-ink-secondary">
      {es ? (
        <>
          Los códigos sin confirmar de estas tablas están en nuestra lista de preguntas a
          fábrica. Si tiene un presupuesto con uno de ellos,{" "}
          <Link href="/es/contact/" className="underline underline-offset-4">
            envíenos el número de modelo completo
          </Link>{" "}
          y le confirmaremos el acabado antes de que pida una muestra.
        </>
      ) : (
        <>
          The unconfirmed codes in these tables are on our own question list to the factory.
          If you are holding a quotation that carries one,{" "}
          <Link href="/contact/" className="underline underline-offset-4">
            send us the full model number
          </Link>{" "}
          and we will confirm the finish before you order a sample.
        </>
      )}
    </p>
  );
}
