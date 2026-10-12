import { ArrowLink } from "../ArrowLink";
import { MediaPlaceholder } from "../MediaPlaceholder";
import { StoryFilm } from "../StoryFilm";
import { COLOUR_HEX, FAMILIES, functionLine, itemName, items, t, type Lang } from "./brazil-data";

/*
  Proposal C — the story (after FSB's 1138 relaunch and Les Couleurs pages): one silent
  factory film across the page, a short text in FSB's label-and-column layout, three facts an
  importer can check, then the whole range as a hardware schedule — one row per model, grouped
  by door, the way a specifier writes it.
*/
const copy = {
  en: {
    lead: "Nine Brazilian brands sell panic bars made in our moulds. This page shows the range as we make it: by door, by locking, by colour, with what we publish about each.",
    filmLabel: "A single-door panic bar from the latch housing along the bar, then the housing and vertical rod of a double-door bar.",
    factsTitle: "What the mould owner can offer",
    facts: [
      ["Our moulds", "Every model on this page is cut and cast in tooling we own, so the part you reorder is the part you approved."],
      ["Your brand", "Customers' names go on the housing and the bar today. Yours can, on the same parts."],
      ["New tooling", "No model for your door yet? We cut new moulds to a customer's sample or drawing."],
    ],
    scheduleTitle: "The range",
    cols: { model: "Model", what: "Door and locking", outside: "Outside", colours: "Colours" },
    closing: "Send us the door, the quantity and the colour. We answer with the model and a quotation.",
  },
  pt: {
    lead: "Nove marcas brasileiras vendem barras antipânico feitas nos nossos moldes. Esta página mostra a linha como a fabricamos: por porta, por travamento, por cor, com o que publicamos de cada uma.",
    filmLabel: "Barra antipânico de uma folha, da caixa do trinco ao longo da barra; depois a caixa e a haste vertical de uma barra de duas folhas.",
    factsTitle: "O que o dono do molde oferece",
    facts: [
      ["Moldes próprios", "Cada modelo desta página é feito em ferramental nosso; a peça que você recompra é a peça que você aprovou."],
      ["A sua marca", "Hoje os nomes dos clientes vão na caixa e na barra. O seu pode ir nas mesmas peças."],
      ["Molde novo", "Ainda não há modelo para a sua porta? Fazemos molde novo a partir da amostra ou do desenho do cliente."],
    ],
    scheduleTitle: "A linha",
    cols: { model: "Modelo", what: "Porta e travamento", outside: "Lado de fora", colours: "Cores" },
    closing: "Envie a porta, a quantidade e a cor. Respondemos com o modelo e a cotação.",
  },
} as const;

export function BrazilCollectionC({ lang = "en" }: { lang?: Lang }) {
  const c = copy[lang];
  const base = t[lang];
  return (
    <article aria-label={base.title} data-content-module="brazil-collection-c">
      <div className="layout">
        <div className="col-popout">
          <StoryFilm src="/videos/stories/brazil-panic-bar.mp4" poster="/images/stories/brazil/film-poster.webp" width={1280} height={576} label={c.filmLabel} buttonLabels={lang === "pt" ? { play: "Reproduzir", pause: "Pausar" } : undefined} />
        </div>
      </div>

      <div className="layout mt-48 lg:mt-96">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <h1 className="col-span-full text-balance text-d1 font-semibold leading-none text-ink xl:col-span-11">{base.title}</h1>
          <p className="col-span-full text-c1 text-ink xl:col-span-11 xl:col-start-14 xl:mt-8">{c.lead}</p>
        </div>
      </div>

      <div className="layout mt-96 lg:mt-136">
        <div className="col-content grid w-full grid-cols gap-x gap-y-32 border-t border-ink pt-24">
          <h2 className="col-span-full text-h3 font-semibold text-ink xl:col-span-8">{c.factsTitle}</h2>
          <dl className="col-span-full grid gap-32 sm:grid-cols-3 xl:col-span-16 xl:col-start-9">
            {c.facts.map(([term, text]) => (
              <div key={term}>
                <dt className="text-c1 font-semibold text-ink">{term}</dt>
                <dd className="mt-8 text-c1 text-ink-secondary">{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="layout mt-96 lg:mt-136">
        <div className="col-content w-full">
          <div className="flex flex-wrap items-baseline justify-between gap-16 border-b border-ink pb-12">
            <h2 className="text-h2 font-semibold text-ink">{c.scheduleTitle} <span className="text-ink-secondary tabular-nums">{items.length}</span></h2>
            <ArrowLink href={base.contactHref}>{base.contact}</ArrowLink>
          </div>
          {FAMILIES.map((family) => {
            const rows = items.filter((i) => i.family === family);
            if (!rows.length) return null;
            return (
              <section key={family} aria-label={base.families[family]} className="mt-48">
                <h3 className="text-c2 uppercase tracking-[0.12em] text-ink-secondary">
                  {base.families[family]} <span className="tabular-nums">{rows.length}</span>
                </h3>
                <div className="mt-12 overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-left text-c2">
                    <thead className="sr-only">
                      <tr>
                        <th scope="col">{c.cols.model}</th>
                        <th scope="col">{c.cols.what}</th>
                        <th scope="col">{c.cols.outside}</th>
                        <th scope="col">{c.cols.colours}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((item) => (
                        <tr key={item.id} className="group border-t border-line align-middle">
                          <th scope="row" className="w-[42%] py-12 pr-24 font-normal">
                            <span className="flex items-center gap-16">
                              <MediaPlaceholder src={item.image} ratio="1 / 1" label={`HYDE ${item.model} ${itemName(item, lang)}`} sizes="72px" className="size-72 shrink-0 bg-surface object-contain mix-blend-multiply" />
                              <span>
                                <span className="block font-semibold text-ink">{item.model}</span>
                                <span className="block text-ink-secondary">{itemName(item, lang)}</span>
                              </span>
                            </span>
                          </th>
                          <td className="py-12 pr-24 text-ink">{item.family === "trim" ? base.familyOne.trim : functionLine(item, lang)}</td>
                          <td className="py-12 pr-24 text-ink">{base.outside[item.outside]}</td>
                          <td className="py-12">
                            <span className="flex items-center gap-4" aria-label={item.colours.map((col) => base.colours[col]).join(", ")}>
                              {item.colours.map((col) => (
                                <span key={col} title={base.colours[col]} className="size-12 border border-line" style={{ background: COLOUR_HEX[col] }} />
                              ))}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
          <p className="mt-96 max-w-[34ch] text-balance text-h2 font-semibold text-ink">{c.closing}</p>
          <ArrowLink href={base.contactHref} className="mt-24">{base.contact}</ArrowLink>
        </div>
      </div>
    </article>
  );
}
