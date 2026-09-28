import { PRIVACY_UPDATED, privacyCopy, type PrivacyBlock, type PrivacyLocale } from "@/data/privacy-policy";

const DATE_TAG: Record<PrivacyLocale, string> = { en: "en-GB", de: "de-DE" };

function Block({ block }: { block: PrivacyBlock }) {
  if (typeof block === "string") return <p className="text-c1 text-ink">{block}</p>;
  if ("list" in block) {
    return (
      <ul className="list-disc space-y-8 pl-24 text-c1 text-ink">
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[56rem] border-collapse text-left text-c2">
        <thead>
          <tr>
            {block.table.head.map((cell) => (
              <th key={cell} scope="col" className="border-b border-line py-12 pr-24 font-semibold text-ink">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={cell} scope="row" className="border-b border-line py-12 pr-24 align-top font-semibold text-ink">
                    {cell}
                  </th>
                ) : (
                  <td key={cell} className="border-b border-line py-12 pr-24 align-top text-ink-secondary">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * /privacy/ and /de/privacy/. Plain prose on one column: a buyer reads a privacy notice to
 * check it, so nothing here competes with the text. Copy lives in src/data/privacy-policy.ts.
 */
export function PrivacyPolicy({ locale }: { locale: PrivacyLocale }) {
  const copy = privacyCopy(locale);
  const updated = new Date(`${PRIVACY_UPDATED}T00:00:00Z`).toLocaleDateString(DATE_TAG[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-96">
      <div className="layout">
        <article className="col-content max-w-[72rem] space-y-64">
          <header>
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">{copy.kicker}</p>
            <h1 className="mt-16 text-h1 text-ink">{copy.title}</h1>
            <p className="mt-16 text-c2 text-ink-secondary">
              {copy.updatedLabel}: <time dateTime={PRIVACY_UPDATED}>{updated}</time>
            </p>
            <p className="mt-24 text-c1 text-ink">{copy.intro}</p>
          </header>
          {copy.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="space-y-16">
              <h2 id={`${section.id}-heading`} className="text-h3 text-ink">
                {section.heading}
              </h2>
              {section.body.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
