import collection from "@/data/generated/argentina-collection.json";
import { ArrowLink } from "./ArrowLink";
import { MediaPlaceholder } from "./MediaPlaceholder";

/*
  The Argentina collection (client 2026-10-10: 「阿根廷产品大集合」): every model HYDE makes on
  its own molds for its Argentine OEM customers, built by scripts/argentina/build-collection.mjs.
  Specification rows only — a stated dimension beats a paragraph, and a value the source does
  not state is left out rather than filled in.
*/
type Item = (typeof collection)[number];
type Lang = "en" | "es";

const GROUPS = ["mortise", "aluminum", "deadlock", "sliding"] as const;

const copy = {
  en: {
    eyebrow: "Argentina market",
    title: "HYDE Argentina Collection",
    body: (n: number) =>
      `${n} mortise locks, deadlocks and narrow-stile locks made on HYDE molds for Argentine distributors. Dimensions as published; drawings and samples on request.`,
    ar4: "The AR-4 selection",
    contact: "Ask for drawings and samples",
    contactHref: "/contact/",
    ar4Href: "/products/argentina-ar4/",
    groups: {
      mortise: "Mortise locks",
      aluminum: "Aluminum doors and narrow stiles",
      deadlock: "Deadlocks and bolts",
      sliding: "Sliding doors and roller shutters",
    },
    specs: { faceplate: "Faceplate", case: "Case", levers: "Levers", sheet: "Case sheet", bolt: "Bolt", centers: "Center distance" },
    material: { hierro: "iron", bronce: "brass" } as Record<string, string>,
    shape: { rectangular: "rectangular", redondo: "round", largo: "long", corto: "short" } as Record<string, string>,
    drawing: "Dimension drawing",
  },
  es: {
    eyebrow: "Mercado argentino",
    title: "Colección HYDE Argentina",
    body: (n: number) =>
      `${n} cerraduras de embutir, cerrojos y cerraduras para batientes angostos fabricadas con matrices HYDE para distribuidores argentinos. Medidas según ficha; planos y muestras a pedido.`,
    ar4: "La selección AR-4",
    contact: "Pedir planos y muestras",
    contactHref: "/es/contact/",
    ar4Href: "/es/products/argentina-ar4/",
    groups: {
      mortise: "Cerraduras de embutir",
      aluminum: "Aberturas de aluminio y batientes angostos",
      deadlock: "Cerrojos y pasadores",
      sliding: "Corredizas y cortinas metálicas",
    },
    specs: { faceplate: "Frente", case: "Caja", levers: "Placas", sheet: "Chapa", bolt: "Pasador", centers: "Distancia entre ejes" },
    material: { hierro: "hierro", bronce: "bronce" } as Record<string, string>,
    shape: { rectangular: "rectangular", redondo: "redondo", largo: "largo", corto: "corto" } as Record<string, string>,
    drawing: "Plano con medidas",
  },
} as const;

/* Elabora's four families; Candex names translate word by word from the factory's own. */
const ELABORA_NAMES: Record<string, { en: string; es: string }> = {
  "110": { en: "Security mortise lock", es: "Cerradura de seguridad" },
  "110-frente-chico": { en: "Security mortise lock, short faceplate", es: "Cerradura de seguridad, frente chico" },
  "111": { en: "Security mortise lock", es: "Cerradura de seguridad" },
  "111-doble-perno": { en: "Security mortise lock, double bolt", es: "Cerradura de seguridad, doble perno" },
  "101": { en: "Standard mortise lock", es: "Cerradura común" },
  "102": { en: "Standard mortise lock", es: "Cerradura común" },
  "140": { en: "Aluminum-door mortise lock", es: "Cerradura para aberturas de aluminio" },
  "1140": { en: "Aluminum-door mortise lock", es: "Cerradura para aberturas de aluminio" },
  "1121": { en: "Hook deadlock", es: "Cerrojo de gancho" },
  "1122": { en: "Deadlock, round bolts", es: "Cerrojo de pernos redondos" },
};
const EN_WORDS: [RegExp, string][] = [
  [/^Cerradura/i, "Mortise lock"], [/^Cerrojo/i, "Deadlock"], [/^Puerta Corrediza/i, "Sliding-door lock"],
  [/^Cortina Metalica/i, "Roller-shutter lock"], [/Picaporte partido/i, "split latch"], [/Picaporte entero/i, "solid latch"],
  [/corrediza de arrimar/i, "sliding, surface-mounted"], [/corrediza de embutir/i, "sliding, mortise"],
  [/de medio embutir/i, "half-mortise"], [/de arrimar/i, "surface-mounted"], [/de embutir/i, "mortise"],
  [/Frente de hierro/i, "iron faceplate"], [/Frente de bronce/i, "brass faceplate"], [/\(Rectangular\)/i, "(rectangular bolt)"],
  [/\(Redondo\)/i, "(round bolt)"], [/\(largo\)/i, "(long bolt)"], [/\(corto\)/i, "(short bolt)"], [/entero/i, "solid latch"], [/partido/i, "split latch"],
];

function name(item: Item, lang: Lang): string {
  if (item.source === "elabora") return ELABORA_NAMES[item.id.replace(/^ar4-/, "")]?.[lang] ?? item.model;
  const es = (item as { nameEs?: string }).nameEs ?? item.model;
  const trimmed = es.replace(/^(Cerradura|Cerrojo|Puerta Corrediza|Cortina Metalica)\s+(\S+)\s*/i, "$1 ");
  if (lang === "es") return trimmed.trim();
  return EN_WORDS.reduce((s, [re, en]) => s.replace(re, en), trimmed).trim();
}

function specValue(spec: Item["specs"][number], lang: Lang): string {
  const t = copy[lang];
  const s = spec as { key: string; value: string; material?: string; shape?: string };
  if (s.key === "levers" && s.material) return `${s.value} ${t.material[s.material] ?? s.material}`;
  if (s.key === "bolt") return [t.shape[s.shape ?? ""] ?? s.shape, s.value].filter(Boolean).join(" · ");
  return s.value;
}

function Card({ item, lang }: { item: Item; lang: Lang }) {
  const t = copy[lang];
  const itemName = name(item, lang);
  return (
    <article className="flex flex-col border border-line bg-surface">
      <MediaPlaceholder
        src={item.image}
        ratio="1 / 1"
        label={`HYDE ${item.model} ${(item as { drawing?: boolean }).drawing ? `— ${t.drawing}` : itemName}`}
        sizes="(min-width: 1280px) 24vw, (min-width: 640px) 32vw, 48vw"
      />
      <div className="flex flex-1 flex-col gap-8 border-t border-line p-16">
        <p className="text-c2 font-semibold uppercase tracking-[0.12em] text-ink">{item.model}</p>
        <h3 className="text-balance text-c1 font-semibold leading-tight text-ink">{itemName}</h3>
        <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-12 gap-y-4 text-c2">
          {item.specs.map((spec) => (
            <div key={spec.key} className="contents">
              <dt className="text-ink-secondary">{t.specs[spec.key as keyof typeof t.specs]}</dt>
              <dd className="text-ink tabular-nums">{specValue(spec, lang)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

export function ArgentinaCollection({ lang = "en" }: { lang?: Lang }) {
  const t = copy[lang];
  const items = collection as Item[];
  return (
    <section className="layout" aria-label={t.title} data-content-module="argentina-collection">
      <div className="col-content grid w-full grid-cols gap-x gap-y-32">
        <div className="col-span-full xl:col-span-12">
          <p className="text-c2 uppercase tracking-[0.12em] text-ink-secondary">{t.eyebrow}</p>
          <h1 className="mt-8 text-h1 text-ink">{t.title}</h1>
        </div>
        <div className="col-span-full xl:col-span-10 xl:col-start-15">
          <p className="text-c1 text-ink">{t.body(items.length)}</p>
          <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
            <ArrowLink href={t.contactHref}>{t.contact}</ArrowLink>
            <ArrowLink href={t.ar4Href}>{t.ar4}</ArrowLink>
          </div>
        </div>

        {GROUPS.map((group) => {
          const inGroup = items.filter((item) => item.group === group);
          if (!inGroup.length) return null;
          return (
            <div key={group} className="col-span-full mt-48">
              <h2 className="border-b border-ink pb-12 text-h3 text-ink">
                {t.groups[group]} <span className="text-ink-secondary tabular-nums">{inGroup.length}</span>
              </h2>
              <div className="mt-24 grid grid-cols-2 gap-16 sm:grid-cols-3 xl:grid-cols-4 xl:gap-24">
                {inGroup.map((item) => (
                  <Card key={item.id} item={item} lang={lang} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
