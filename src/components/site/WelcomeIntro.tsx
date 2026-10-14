import type { Locale } from "@/data/site";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { HydeLockup } from "./icons";
import { dict, tx } from "@/lib/i18n";
import styles from "./WelcomeIntro.module.css";

const introCopy = {
  en: {
    // The H1 renders `welcome` then `title` as its two lines. "Welcome" held the first and
    // most heavily weighted line of the only H1 on the site's highest-authority page while
    // carrying no search value; the category and the role sit there now instead.
    welcome: "Panic Exit Devices, Locks and Door Hardware",
    title: "Made in Xiaolan. Since 1998.",
    body: "Nobody praises door hardware on a good day, and that is the job. A lever should feel the same on its last turn as on its first. A lock case should hold its line for years. And on the one day a corridor fills with smoke, a push bar should open the door at the first touch, for whoever reaches it first. We have made that door hardware, architectural ironmongery as the UK trade calls it, since 1998 in Xiaolan, the Zhongshan town that ships close to a third of China's lock exports, and our stamping plant is certified to ISO 9001:2015. It is on doors across Europe, Russia, North and South America, Turkey and Southeast Asia. For years we met our buyers at the Cologne hardware fair; our Spanish-speaking team has exhibited in Lima and Buenos Aires; today we have our own office in Germany. Much of what we make leaves under our customers' brands, and that is the work we are best at. Bring us a drawing or a sample and we will tool it. If a design runs into someone else's patent, our engineers rework the parts or the look until it doesn't. When your name goes on it, we want you to sleep well.",
    company: "Canton Hyland Hardware &\nBuilding Material Co., Ltd.",
    links: [
      { label: "Downloads", href: "/downloads" },
      { label: "Price list", href: "/request/price-list" },
      { label: "About the company", href: "/company" },
    ],
  },
  es: {
    welcome: "Barras antipánico, cerraduras y herrajes para puertas",
    title: "Hecho en Xiaolan. Desde 1998.",
    body: "Nadie elogia un herraje en un día normal, y justamente ese es su trabajo. Una manija tiene que sentirse igual en su último giro que en el primero. Una cerradura tiene que aguantar años sin ceder. Y el día que un pasillo se llena de humo, una barra antipánico tiene que abrir la puerta al primer toque, para quien llegue primero. Fabricamos esos herrajes desde 1998 en Xiaolan, la localidad de Zhongshan de donde sale casi un tercio de las cerraduras que exporta China, y nuestra planta de estampado está certificada según ISO 9001:2015. Están en puertas de Europa, Rusia, Norteamérica y Sudamérica, Turquía y el Sudeste Asiático. Durante años recibimos a nuestros compradores en la feria de ferretería de Colonia; nuestro equipo, que habla español, ha expuesto en Lima y en Buenos Aires; hoy tenemos oficina propia en Alemania. Buena parte de lo que fabricamos sale con la marca de nuestros clientes, y es el trabajo que mejor hacemos. Tráiganos un plano o una muestra y hacemos el molde. Si un diseño choca con la patente de otro fabricante, nuestros ingenieros modifican las piezas o el aspecto hasta que deja de chocar. Cuando su nombre va en ellos, queremos que duerma tranquilo.",
    company: "Canton Hyland Hardware &\nBuilding Material Co., Ltd.",
    links: [
      { label: "Descargas", href: "/es/downloads" },
      { label: "Lista de precios", href: "/es/request/price-list" },
      { label: "Conozca la empresa", href: "/es/company" },
    ],
  },
  pt: {
    welcome: "Barras antipânico, fechaduras e ferragens para portas",
    title: "Feito em Xiaolan. Desde 1998.",
    body: "Ninguém elogia uma ferragem num dia comum, e esse é justamente o trabalho dela. Uma maçaneta precisa ter no último giro a mesma sensação do primeiro. Uma fechadura precisa aguentar anos sem ceder. E no dia em que um corredor se enche de fumaça, uma barra antipânico precisa abrir a porta no primeiro toque, para quem chegar primeiro. Fabricamos essas ferragens desde 1998 em Xiaolan, a cidade de Zhongshan de onde sai quase um terço das fechaduras que a China exporta, e a nossa unidade de estampagem é certificada pela ISO 9001:2015. Elas estão em portas da Europa, da Rússia, das Américas do Norte e do Sul, da Turquia e do Sudeste Asiático. Durante anos recebemos nossos compradores na feira de ferragens de Colônia; nossa equipe, que fala espanhol, já expôs em Lima e em Buenos Aires; hoje temos escritório próprio na Alemanha. Boa parte do que fabricamos sai com a marca dos nossos clientes, e é o trabalho que fazemos melhor. Traga um desenho ou uma amostra e nós fazemos o molde. Se um projeto esbarrar na patente de outro fabricante, nossos engenheiros alteram as peças ou a aparência até que deixe de esbarrar. Quando o seu nome vai nelas, queremos que você durma tranquilo.",
    company: "Canton Hyland Hardware &\nBuilding Material Co., Ltd.",
    links: [
      { label: "Downloads", href: "/pt/downloads" },
      { label: "Lista de preços", href: "/pt/request/price-list" },
      { label: "Conheça a empresa", href: "/pt/company" },
    ],
  },
} as const;

/**
 * Page intro block — `main`'s second child, between the two `.modules` containers.
 *
 * 2026-10-13, the chapter from the preview the client approved (「然后要这个」), with the HYDE
 * mark kept and its history added (「hyde的 logo 别丢 … 老logo 到新logo的变化」):
 * - left: the H1, then the letterhead: the Hyland mark (1998) giving way to HYDE (2026), the
 *   legal name, the ISO mark and three links;
 * - right: the copy's opening sentences as one large statement whose words brighten as it
 *   scrolls through the view, then the rest of the copy in two columns.
 * The split is the first sentence that names 1998, so every locale's own translation divides
 * at the same thought however its sentences fall (ja has five before it, the rest four).
 * Every effect is a CSS scroll timeline with from-only keyframes: reduced motion, print and
 * browsers without view() timelines get the finished state.
 *
 * SERVER COMPONENT. Nothing here needs state.
 */
export function WelcomeIntro({
  locale = "en",
  homeAccent = false,
}: {
  locale?: Locale;
  homeAccent?: boolean;
}) {
  const text = dict(introCopy, locale);
  const sentences = text.body.split(/(?<=[.!?。؟])\s*(?=\S)/u);
  const at = sentences.findIndex((sentence) => sentence.includes("1998"));
  const statement = (at > 0 ? sentences.slice(0, at) : sentences.slice(0, 1)).join(" ");
  // The rest sits in two columns split between sentences, never mid-sentence: what we make and
  // where it goes, then what we do for a brand.
  const restSentences = at > 0 ? sentences.slice(at) : sentences.slice(1);
  const half = Math.floor(restSentences.length / 2);
  const rest = [restSentences.slice(0, half).join(" "), restSentences.slice(half).join(" ")];
  // CJK has no spaces to split on: there the statement brightens as one run.
  const words = /[\u3040-\u30ff\u4e00-\u9fff]/u.test(statement) ? [statement] : statement.split(/(\s+)/);
  const count = words.filter((w) => w.trim()).length;
  let k = 0;

  return (
    <div className={cn("layout", homeAccent && "home-accent-surface home-accent-module")}>
      <div className={cn("col-content grid w-full grid-cols gap-x", styles.chapter)}>
        <h1 className={cn("text-h1 text-ink", styles.h1, homeAccent && "home-accent-marker")}>
          {text.welcome}
          <span className="block text-h1-light">{text.title}</span>
        </h1>

        <div className={styles.content}>
          <p className={styles.statement} style={{ "--n": count } as CSSProperties}>
            {words.map((w, i) => (w.trim() ? <span key={i} style={{ "--k": k++ } as CSSProperties}>{w}</span> : w))}
          </p>
          <div className={styles.rest}>
            {rest.map((part) => <p key={part.slice(0, 24)} className="copy text-ink">{part}</p>)}
          </div>
        </div>

        <div className={styles.letterhead}>
          <figure
            className={styles.marks}
            aria-label={tx(locale, "Our mark: Hyland from 1998, HYDE from 2026", {
              es: "Nuestra marca: Hyland desde 1998, HYDE desde 2026",
              pt: "Nossa marca: Hyland desde 1998, HYDE desde 2026",
            })}
          >
            <span className={styles.mark} data-era="1998">
              {/* eslint-disable-next-line @next/next/no-img-element -- the original 1998 artwork, shown as it was */}
              <img src="/images/brand/hyland-mark.png" srcSet="/images/brand/hyland-mark.png 2x" alt="" width={254} height={150} loading="lazy" decoding="async" />
              <span className={styles.year}>1998</span>
            </span>
            <span className={styles.line} aria-hidden="true" />
            <span className={styles.mark} data-era="2026">
              <HydeLockup className={styles.lockup} />
              <span className={styles.year}>2026</span>
            </span>
          </figure>
          <p className="mt-32 whitespace-pre-line text-c1 text-ink">{text.company}</p>
          {/* Monochrome vector certification mark — inherits --color-ink. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- a small inline SVG mark */}
          <img src="/images/company/certification-marks.svg" alt="ISO 9001 certification mark" width={41} height={46} className={styles.iso} />
          <ul className={styles.rail}>
            {text.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={cn(homeAccent && "home-accent-action")}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
