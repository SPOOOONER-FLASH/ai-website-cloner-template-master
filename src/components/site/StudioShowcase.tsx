import Link from "next/link";
import type { Locale } from "@/data/site";
import { publishedProducts } from "@/data/products";
import { tx } from "@/lib/i18n";
import { finishCode } from "@/lib/order-code";
import { studioShowcase } from "@/lib/studio-showcase";
import { ArrowLink } from "./ArrowLink";
import { MediaPlaceholder } from "./MediaPlaceholder";

/**
 * The home page's introduction to the configurator studio.
 *
 * One model in every finish the factory lists for it, photographed, in a row — and the
 * order code under each. That row IS the studio's argument: the reader sees that a finish
 * is a real part with a real code before they click, which is what FSB's configurator
 * promises and what a rendered preview could not honestly deliver here (see
 * ConfiguratorStudioPage). The family is chosen from the data in src/lib/studio-showcase.ts.
 *
 * Client, 2026-09-29: 「现在这个太优异了需要着重列出和展示，导航栏侧边栏，首页都可以放」.
 */
export function StudioShowcase({ locale = "en" }: { locale?: Locale }) {
  const pick = studioShowcase(publishedProducts);
  if (!pick) return null;
  const base = locale === "en" ? "" : `/${locale}`;
  const studioHref = `${base}/configurator/studio/`;
  const finishName = (code: string) =>
    code
      .split("+")
      .map((c) => {
        const entry = finishCode(c);
        return entry?.name ? tx(locale, entry.name, { es: entry.nameEs ?? undefined, pt: entry.namePt ?? undefined }) : c;
      })
      .join(" / ");

  return (
    <section className="layout mt-96 lg:mt-136" aria-labelledby="studio-showcase-heading">
      <div className="col-content grid w-full grid-cols gap-x">
        <div className="col-span-full lg:col-span-4 xl:col-span-7">
          <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
            {tx(locale, "Configurator Studio", { es: "Estudio de configuración", pt: "Estúdio de configuração" })}
          </p>
          <h2 id="studio-showcase-heading" className="mt-8 text-h2 text-ink">
            {tx(locale, "One model, every finish the factory makes.", {
              es: "Un modelo, todos los acabados que fabrica la fábrica.",
              pt: "Um modelo, todos os acabamentos que a fábrica produz.",
            })}
          </h2>
        </div>
        <div className="col-span-full mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0 xl:col-span-14 xl:col-start-10">
          <p className="text-c1 text-ink-secondary">
            {tx(
              locale,
              "Pick a range, switch finish and function, and the photograph on the stage changes to the exact part with its order code. Nothing is rendered: every image is the real model.",
              {
                es: "Elija una gama, cambie el acabado y la función, y la fotografía del escenario pasa a la pieza exacta con su código de pedido. Nada es un render: cada imagen es el modelo real.",
                pt: "Escolha uma linha, troque acabamento e função, e a fotografia no palco passa para a peça exata com o seu código de pedido. Nada é renderizado: cada imagem é o modelo real.",
              },
            )}
          </p>
        </div>

        <ul
          className="horizontal-snap col-span-full mt-32 flex snap-x snap-mandatory gap-16 overflow-x-auto overscroll-x-contain sm:grid sm:grid-cols-3 sm:gap-24 sm:overflow-visible lg:grid-cols-5"
        >
          {pick.members.slice(0, 5).map((member) => (
            <li key={member.slug} className="w-[62%] min-w-[62%] flex-none snap-start sm:w-auto sm:min-w-0">
              <Link href={`${studioHref}?model=${member.slug}`} className="group block bg-surface no-underline">
                <MediaPlaceholder {...member.heroImage} ratio="1 / 1" sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 62vw" />
                <p className="mt-12 text-c2 tabular-nums text-ink">{member.model}</p>
                <p className="text-c2 text-ink-secondary">{finishName(member.finish)}</p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="col-span-full mt-8 flex justify-end">
          <ArrowLink href={studioHref}>
            {tx(locale, "Open the studio", { es: "Abrir el estudio", pt: "Abrir o estúdio" })}
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
