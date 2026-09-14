import { products } from "./products";
import { keyableProducts } from "../lib/keyable-products";
import drawingIndex from "../../public/images/drawings/index.json";
import type { Locale } from "./site";

/**
 * The columns rail: a few subjects the catalogue can answer in depth, on the homepage.
 *
 * ---------------------------------------------------------------------------
 * WHY THESE EXIST AND WHY THEY SIT BESIDE 307 AND 311
 *
 * The flagship pair above this rail answers "what do you make". It does not answer the
 * question a specifier actually arrives with, which is shaped like "I have a pair of fire
 * doors" or "I have forty doors and three grades of key holder". Those are subjects, not
 * products, and each one is already written up properly — an explanatory article, and
 * where the answer is a set of parts rather than one part, a hardware package too.
 *
 * The rail is the route in. Demand data says this is where the return is: the articles
 * are what gets cited (the model-number explainer was cited seven times against three for
 * every category page combined), and the master key system was the single highest-exposure
 * line on the client's own Alibaba storefront — 256 impressions in thirty days — against
 * nothing at all on this site until the article was written.
 *
 * ---------------------------------------------------------------------------
 * EVERY FIGURE ON A CARD IS COUNTED, NOT TYPED
 *
 * `figure` is a function of the catalogue, not a string somebody keyed in. A card that
 * says "63 models can be keyed alike or master keyed" has to keep being true after the
 * next import, and the only version of that which survives is one that recounts. When a
 * count cannot be derived it is left out rather than approximated — see the dash rule in
 * AGENTS.md. Add a column by adding an entry here; nothing else needs touching.
 */

export interface FeatureColumn {
  id: string;
  href: { en: string; es: string };
  eyebrow: { en: string; es: string };
  title: { en: string; es: string };
  body: { en: string; es: string };
  /** One counted fact, or undefined when the catalogue cannot support one. */
  figure?: { en: string; es: string };
  image: { src: string; label: string; labelEs: string };
  /** An optional second action — a file to take away, shown under the main link. */
  extra?: { href: string; en: string; es: string };
}

/** Products whose own record says they can be keyed alike or master keyed. */
export function keyableModelCount(): number {
  return keyableProducts(products).length;
}

/**
 * Dimension drawings we have actually produced, counted from the generator's own index.
 *
 * Read from `public/images/drawings/index.json` rather than typed, for the same reason
 * every other figure on this rail is counted: the generator adds drawings as the
 * catalogue publishes geometry, so a hard-coded number is wrong the next time somebody
 * runs `npm run assets:drawings`.
 *
 * `partial` marks a drawing where some feature was left undrawn because its dimension is
 * not published. Those are counted too — a drawing that stops where the data stops is
 * still a drawing, and pretending otherwise would mean completing outlines from
 * imagination, which is the one thing this generator refuses to do.
 */
export function dimensionDrawingCount(): number {
  return Object.keys(drawingIndex as Record<string, unknown>).length;
}

export function featureColumns(): FeatureColumn[] {
  const keyable = keyableModelCount();
  const drawings = dimensionDrawingCount();

  return [
    {
      id: "master-key",
      href: {
        en: "/news/master-key-systems-how-many-levels-you-need/",
        es: "/es/news/master-key-systems-how-many-levels-you-need/",
      },
      eyebrow: { en: "Column · Keying", es: "Columna · Amaestramiento" },
      title: {
        en: "How many levels your master key system needs",
        es: "Cuántos niveles necesita su amaestramiento",
      },
      body: {
        en: "A hierarchy is a decision about who passes which door, not a hardware specification. Five levels, from grand-grand master down to the change key, and what we need from you to cut the chart.",
        es: "Una jerarquía es una decisión sobre quién pasa por qué puerta, no una especificación de herraje. Cinco niveles, del gran maestro general a la llave de cambio, y qué necesitamos de usted para trazar el esquema.",
      },
      figure: {
        en: `${keyable} models can be keyed alike or master keyed`,
        es: `${keyable} modelos admiten llave igual o amaestramiento`,
      },
      /*
        The one column with something to DO at the end of it. The article asks for a door
        schedule; without the sheet that request lands on a buyer who has never drawn one.
        Kept as a secondary link so the column still leads with the reading — a form
        offered before the explanation reads as a lead-capture form.
      */
      extra: {
        href: "/downloads/master-key-plan-sheet.xlsx",
        en: "Download the plan sheet (XLSX)",
        es: "Descargar la hoja de plan (XLSX)",
      },
      image: {
        src: "/images/editorial/hyde-real-cylinder-plate.webp",
        label: "Canton Hyland brass lock cylinders and keys",
        labelEs: "Cilindros de latón y llaves de Canton Hyland",
      },
    },
    {
      id: "door-coordinator",
      href: {
        en: "/news/door-coordinator-double-fire-door/",
        es: "/es/news/door-coordinator-double-fire-door/",
      },
      eyebrow: { en: "Column · Fire doors", es: "Columna · Puertas cortafuego" },
      title: {
        en: "Why a double fire door needs a coordinator",
        es: "Por qué una cortafuego de dos hojas necesita selector",
      },
      body: {
        en: "Two closers and no coordinator means the leaves close in whichever order the springs decide. If the active leaf lands first the door never latches — and an unlatched fire door is not a fire door.",
        es: "Dos cierrapuertas sin selector significa que las hojas cierran en el orden que decidan los muelles. Si la hoja activa llega primero, la puerta nunca acuña — y una cortafuego sin acuñar no es una cortafuego.",
      },
      figure: {
        en: "Coordinated range 55–85kg per leaf",
        es: "Rango coordinado de 55–85 kg por hoja",
      },
      image: {
        src: "/images/products-hyde/dc02-door-coordinator.webp",
        label: "DC02 door coordinator, zinc-plated steel, with its two support brackets",
        labelEs: "Selector de cierre DC02, acero zincado, con sus dos soportes",
      },
    },
    {
      id: "drawings",
      href: {
        en: "/news/mortise-lock-backset-and-centre-distance-guide/",
        es: "/es/news/mortise-lock-backset-and-centre-distance-guide/",
      },
      eyebrow: { en: "Column · Drawings", es: "Columna · Planos" },
      title: {
        en: "Backset and centre distance: reading a lock case number",
        es: "Entrada y distancia entre ejes: leer una referencia de cerradura",
      },
      body: {
        en: "Two numbers decide whether a case fits the door in front of you, and both are already in the model number. Our drawings show them to scale — and stop wherever the dimension stops, rather than completing an outline we cannot state.",
        es: "Dos números deciden si una caja entra en la puerta que tiene delante, y ambos están ya en la referencia. Nuestros planos los muestran a escala — y se detienen donde se detiene la cota, en lugar de completar un contorno que no podemos afirmar.",
      },
      figure: {
        en: `${drawings} dimension drawings, drawn only from published dimensions`,
        es: `${drawings} planos acotados, trazados solo con cotas publicadas`,
      },
      image: {
        src: "/images/editorial/news-mortise-lock-inspection.webp",
        label: "A Canton Hyland mortise lock case being measured",
        labelEs: "Medición de una cerradura de embutir de Canton Hyland",
      },
    },
  ];
}

export function featureColumnsHeading(locale: Locale = "en"): string {
  return locale === "es" ? "Columnas" : "Columns";
}

export function featureColumnsLede(locale: Locale = "en"): string {
  return locale === "es"
    ? "Temas que el catálogo puede responder a fondo, no productos sueltos."
    : "Subjects the catalogue can answer in depth, rather than products on their own.";
}

export function featureColumnsCta(locale: Locale = "en"): string {
  return locale === "es" ? "Leer la columna" : "Read the column";
}
