"use client";
import type { Locale } from "@/data/site";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowLink } from "./ArrowLink";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { ChevronDownIcon, HydeLockup } from "./icons";
import { dict } from "@/lib/i18n-client";

const introCopy = {
  en: {
    // The H1 renders `welcome` then `title` as its two lines. "Welcome" held the first and
    // most heavily weighted line of the only H1 on the site's highest-authority page while
    // carrying no search value; the category and the role sit there now instead.
    welcome: "Panic Exit Devices, Locks and Door Hardware",
    title: "Made in Xiaolan. Since 1998.",
    body: "Nobody praises door hardware on a good day, and that is the job. A lever should feel the same on its last turn as on its first. A lock case should hold its line for years. And on the one day a corridor fills with smoke, a push bar should open the door at the first touch, for whoever reaches it first. We have made that door hardware, architectural ironmongery as the UK trade calls it, since 1998 in Xiaolan, the Zhongshan town that ships close to a third of China's lock exports, ISO 9001 certified since 2002. It is on doors across Europe, Russia, North and South America, Turkey and Southeast Asia. For years we met our buyers at the Cologne hardware fair; our Spanish-speaking team has exhibited in Lima and Buenos Aires; today we have our own office in Germany. Much of what we make leaves under our customers' brands, and that is the work we are best at. Bring us a drawing or a sample and we will tool it. If a design runs into someone else's patent, our engineers rework the parts or the look until it doesn't. When your name goes on it, we want you to sleep well.",
    more: "More links",
    company: "Canton Hyland Hardware\n(Group) Co., Ltd",
    tagline: "Hardware you can stand behind.",
    links: [
      { label: "Project Planner", href: "/products" },
      { label: "The product overview", href: "/products" },
      { label: "About the company", href: "/company" },
    ],
  },
  es: {
    welcome: "Barras antipánico, cerraduras y herrajes para puertas",
    title: "Hecho en Xiaolan. Desde 1998.",
    body: "Nadie elogia un herraje en un día normal, y justamente ese es su trabajo. Una manija tiene que sentirse igual en su último giro que en el primero. Una cerradura tiene que aguantar años sin ceder. Y el día que un pasillo se llena de humo, una barra antipánico tiene que abrir la puerta al primer toque, para quien llegue primero. Fabricamos esos herrajes desde 1998 en Xiaolan, la localidad de Zhongshan de donde sale casi un tercio de las cerraduras que exporta China, con certificación ISO 9001 desde 2002. Están en puertas de Europa, Rusia, Norteamérica y Sudamérica, Turquía y el Sudeste Asiático. Durante años recibimos a nuestros compradores en la feria de ferretería de Colonia; nuestro equipo, que habla español, ha expuesto en Lima y en Buenos Aires; hoy tenemos oficina propia en Alemania. Buena parte de lo que fabricamos sale con la marca de nuestros clientes, y es el trabajo que mejor hacemos. Tráiganos un plano o una muestra y hacemos el molde. Si un diseño choca con la patente de otro fabricante, nuestros ingenieros modifican las piezas o el aspecto hasta que deja de chocar. Cuando su nombre va en ellos, queremos que duerma tranquilo.",
    more: "Más enlaces",
    company: "Canton Hyland Hardware\n(Group) Co., Ltd",
    tagline: "Herrajes que dan la cara.",
    links: [
      { label: "Planificador de proyectos", href: "/es/products" },
      { label: "Catálogo de productos", href: "/es/products" },
      { label: "Conozca la empresa", href: "/es/company" },
    ],
  },
  pt: {
    welcome: "Barras antipânico, fechaduras e ferragens para portas",
    title: "Feito em Xiaolan. Desde 1998.",
    body: "Ninguém elogia uma ferragem num dia comum, e esse é justamente o trabalho dela. Uma maçaneta precisa ter no último giro a mesma sensação do primeiro. Uma fechadura precisa aguentar anos sem ceder. E no dia em que um corredor se enche de fumaça, uma barra antipânico precisa abrir a porta no primeiro toque, para quem chegar primeiro. Fabricamos essas ferragens desde 1998 em Xiaolan, a cidade de Zhongshan de onde sai quase um terço das fechaduras que a China exporta, com certificação ISO 9001 desde 2002. Elas estão em portas da Europa, da Rússia, das Américas do Norte e do Sul, da Turquia e do Sudeste Asiático. Durante anos recebemos nossos compradores na feira de ferragens de Colônia; nossa equipe, que fala espanhol, já expôs em Lima e em Buenos Aires; hoje temos escritório próprio na Alemanha. Boa parte do que fabricamos sai com a marca dos nossos clientes, e é o trabalho que fazemos melhor. Traga um desenho ou uma amostra e nós fazemos o molde. Se um projeto esbarrar na patente de outro fabricante, nossos engenheiros alteram as peças ou a aparência até que deixe de esbarrar. Quando o seu nome vai nelas, queremos que você durma tranquilo.",
    more: "Mais links",
    company: "Canton Hyland Hardware\n(Group) Co., Ltd",
    tagline: "Ferragem que você assina embaixo.",
    links: [
      { label: "Planejamento de obra", href: "/pt/products" },
      { label: "Catálogo de produtos", href: "/pt/products" },
      { label: "Conheça a empresa", href: "/pt/company" },
    ],
  },
} as const;

/**
 * Page intro block — `main`'s second child, between the two `.modules` containers.
 * Not a `data-content-module`.
 *
 * The "More links" accordion is mobile-only: the toggle is `sm:hidden` and the panel is
 * forced open by `sm:!block` at >=744px, so the desktop reference state has no
 * interactive affordance here at all.
 *
 * COLOUR: h1, copy and the accordion heading are --color-ink (rule 2). The chevron is a
 * decorative icon, so --color-ink-tertiary. The three ArrowLinks in the panel
 * carry the only interactive accent here, now rendered in monochrome ink.
 */
export function WelcomeIntro({
  locale = "en",
  homeAccent = false,
}: {
  locale?: Locale;
  homeAccent?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const text = dict(introCopy, locale);

  return (
    <div className="layout">
      <div
        className={cn(
          "col-content grid w-full grid-cols gap-x gap-y-24 xl:gap-y-48",
          homeAccent && "home-accent-surface home-accent-module",
        )}
      >
        {/* slot-1 — headline */}
        <div className="col-span-full row-start-1 grid grid-cols-subgrid sm:col-span-4 md:col-span-6 xl:col-span-12 xl:col-start-1">
          <div className="col-span-6 row-start-1 xl:col-span-10">
            <h1 className={cn("text-h1 text-ink", homeAccent && "home-accent-marker")}>
              {text.welcome}
              <br />
              <span className="text-h1-light">
                {text.title}
              </span>
            </h1>
          </div>
        </div>

        {/*
          slot-2 — copy. Under the headline on the same left edge (2026-09-24). It used to
          sit in its own 5-of-24 column beside the headline: fine for three sentences, but the
          copy grew to a full paragraph and became a 271px-wide, 750px-tall ribbon with an
          empty column under the headline. Eleven columns is about 65 characters a line.
        */}
        <div className="col-span-full grid grid-cols-subgrid gap sm:col-span-4 md:col-span-6 xl:col-span-12 xl:col-start-1 xl:row-start-2">
          <section className="copy col-span-full text-ink xl:col-span-11">
            <div>{text.body}</div>
          </section>
        </div>

        {/* slot-4 — "More links" accordion */}
        <div className="col-span-full grid grid-cols-subgrid gap [grid-column-end:-1] sm:col-span-4 md:col-span-6 xl:col-span-6 xl:col-start-19 xl:row-span-2 xl:row-start-1">
          <section className="col-span-full">
            <div className="w-full">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mb-24 flex w-full justify-between gap-x-24 text-start sm:hidden sm:cursor-default"
              >
                <h2 className="text-h3 text-ink">{text.more}</h2>
                <span
                  className={cn(
                    "flex h-[var(--leading-h3)] place-items-center transition-transform duration-[var(--motion-medium)]",
                    expanded && "rotate-180",
                  )}
                >
                  <ChevronDownIcon className="h-auto w-16 text-ink-tertiary" />
                </span>
              </button>

              <div className={cn(expanded ? "block" : "hidden", "sm:!block")}>
                <ul className="flex flex-col gap-36 pointer-fine:gap-16">
                  {text.links.map((link) => (
                    <li key={link.label}>
                      <ArrowLink
                        href={link.href}
                        className={cn(homeAccent && "home-accent-action")}
                      >
                        {link.label}
                      </ArrowLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* slot-5 — signature row */}
      <div className="col-content mt-48">
        <div className="mt-48 grid gap-x gap-y-48 sm:grid-cols-2">
          <div className="grid grid-cols-12 gap-x sm:[grid-column-end:-1]">
            <div className="col-span-6">
              {/*
                Brand block. Was a hinge close-up, which read as an unrelated product shot
                in the signature row. The mark belongs here — this is the company signature,
                not a catalogue slot. Flat, no shadow, inherits nothing decorative.
              */}
              <div className="flex h-full w-[92.17%] items-center">
                <HydeLockup className="h-auto w-[62%] max-w-[18rem]" />
              </div>
            </div>
            <div className="col-span-6 flex flex-col justify-between text-c1 text-ink">
              <p className="whitespace-pre-line">{text.company}</p>
              {/*
                Monochrome vector certification mark — inherits --color-ink.
                Was two marks; the ANSI/BHMA Grade 3 box was removed on 2026-08-27 after
                the client confirmed no such certification exists. Ratio narrowed to match.
              */}
              <MediaPlaceholder
                ratio="41 / 46"
                src="/images/company/certification-marks.svg"
                label="ISO 9001 certification mark"
                className="w-[min(4.04rem,5.446vw)] sm:w-[min(4.04rem,2.806vw)]"
              />
            </div>
            <div className="col-span-6 mt-48 text-c1 text-ink-secondary [grid-column-end:-1]">
              {text.tagline}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
