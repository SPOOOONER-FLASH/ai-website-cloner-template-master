"use client";

import { useState } from "react";
import type { Locale } from "@/data/site";
import {
  MAX_PROUD_MM,
  PUBLISHED_LENGTHS_MM,
  sizeCylinder,
  validCylinderInput,
} from "@/lib/cylinder-length";
import { dict } from "@/lib/i18n-client";

/**
 * Euro cylinder length calculator. The arithmetic lives in src/lib/cylinder-length.ts and
 * is tested against the lookup table the guide already publishes; this file is inputs,
 * words and one result table, styled like the inquiry form so it reads as a working tool
 * rather than a widget.
 */

type Copy = {
  door: string;
  outsideTrim: string;
  insideTrim: string;
  offCentre: string;
  center: string;
  centerHint: string;
  half: string;
  outside: string;
  inside: string;
  calculated: string;
  standard: string;
  proud: string;
  total: string;
  order: string;
  /** Placeholders: {total} {outside} {inside}. */
  orderAs: string;
  noModel: string;
  /** Placeholders: {side} {mm} {max}. */
  proudWarning: string;
  /** Placeholders: {mm} {max}. */
  proudBoth: string;
  asymmetric: string;
  splitNote: string;
  invalid: string;
  published: string;
};

const COPY: { en: Copy; es: Copy; pt: Copy } = {
  en: {
    door: "Door thickness at the lock edge (mm)",
    outsideTrim: "Escutcheon or rose depth, outside (mm)",
    insideTrim: "Escutcheon or rose depth, inside (mm)",
    offCentre: "The lock case is not centered in the door",
    center: "Outside face of the door to the fixing-screw center (mm)",
    centerHint: "Leave unticked for a lock case centered in the leaf, which is most mortise cases in most doors.",
    half: "Half",
    outside: "Outside",
    inside: "Inside",
    calculated: "Calculated",
    standard: "Standard half",
    proud: "Stands proud by",
    total: "Arithmetic total",
    order: "Order from our range",
    orderAs: "{total}mm overall. Halves needed: {outside} outside, {inside} inside.",
    proudBoth:
      "Both halves stand up to {mm}mm proud, more than the {max}mm we treat as the limit. On a door this thin there is no shorter half to order; fit a raised escutcheon or security rose on each side to take up the difference.",
    noModel: "Longer than the 90mm our catalog publishes. Send the three measurements and we will say what can be supplied.",
    proudWarning:
      "The {side} half stands {mm}mm proud, more than the {max}mm we treat as the limit. Use a raised escutcheon or security rose on that side to take up the difference; do not order a shorter half, because there is none that still reaches.",
    asymmetric: "The two halves differ, so the split has a direction. State it outside first, in words, when you order.",
    splitNote: "Our catalog publishes overall lengths, not the split of each model. Ask for the split in writing and we confirm it before anything ships.",
    invalid: "Enter a door thickness above zero, trim depths of 0 to 50mm, and a center that sits inside the door.",
    published: "Overall lengths we publish",
  },
  es: {
    door: "Espesor de la puerta en el canto de la cerradura (mm)",
    outsideTrim: "Profundidad del escudo o roseta, exterior (mm)",
    insideTrim: "Profundidad del escudo o roseta, interior (mm)",
    offCentre: "La caja de cerradura no está centrada en la puerta",
    center: "De la cara exterior de la puerta al centro del tornillo de fijación (mm)",
    centerHint: "Déjelo sin marcar si la caja está centrada en la hoja, que es lo habitual en la mayoría de cajas de embutir.",
    half: "Mitad",
    outside: "Exterior",
    inside: "Interior",
    calculated: "Calculada",
    standard: "Semilongitud estándar",
    proud: "Sobresale",
    total: "Total aritmético",
    order: "Pedir de nuestra gama",
    orderAs: "{total} mm en total. Mitades necesarias: {outside} exterior, {inside} interior.",
    proudBoth:
      "Las dos mitades sobresalen hasta {mm} mm, más de los {max} mm que tomamos como límite. En una puerta tan delgada no existe una mitad más corta; monte un escudo elevado o una roseta de seguridad en cada lado para absorber la diferencia.",
    noModel: "Más largo que los 90 mm que publica nuestro catálogo. Envíenos las tres medidas y le diremos qué se puede suministrar.",
    proudWarning:
      "La mitad {side} sobresale {mm} mm, más de los {max} mm que tomamos como límite. Use un escudo elevado o una roseta de seguridad en ese lado para absorber la diferencia; no pida una mitad más corta, porque no existe ninguna que siga llegando.",
    asymmetric: "Las dos mitades son distintas, así que la división tiene sentido. Indíquela al pedir, primero el exterior y por escrito.",
    splitNote: "Nuestro catálogo publica longitudes totales, no la división de cada modelo. Pida la división por escrito y la confirmamos antes de enviar nada.",
    invalid: "Introduzca un espesor de puerta mayor que cero, profundidades de 0 a 50 mm y un centro que quede dentro de la puerta.",
    published: "Longitudes totales que publicamos",
  },
  pt: {
    door: "Espessura da porta na borda da fechadura (mm)",
    outsideTrim: "Profundidade do espelho ou roseta, lado externo (mm)",
    insideTrim: "Profundidade do espelho ou roseta, lado interno (mm)",
    offCentre: "A caixa da fechadura não está centralizada na porta",
    center: "Da face externa da porta ao centro do parafuso de fixação (mm)",
    centerHint: "Deixe desmarcado se a caixa estiver centralizada na folha, o que vale para a maioria das caixas de embutir.",
    half: "Metade",
    outside: "Externa",
    inside: "Interna",
    calculated: "Calculada",
    standard: "Meio-comprimento padrão",
    proud: "Sobressai",
    total: "Total aritmético",
    order: "Pedir da nossa linha",
    orderAs: "{total} mm no total. Metades necessárias: {outside} externa, {inside} interna.",
    proudBoth:
      "As duas metades sobressaem até {mm} mm, mais que os {max} mm que tratamos como limite. Numa porta tão fina não existe metade mais curta; use um espelho elevado ou uma roseta de segurança em cada lado para absorver a diferença.",
    noModel: "Mais longo que os 90 mm que nosso catálogo publica. Envie as três medidas e diremos o que pode ser fornecido.",
    proudWarning:
      "A metade {side} sobressai {mm} mm, mais que os {max} mm que tratamos como limite. Use um espelho elevado ou uma roseta de segurança desse lado para absorver a diferença; não peça uma metade mais curta, porque não existe nenhuma que ainda alcance.",
    asymmetric: "As duas metades são diferentes, então a divisão tem direção. Informe no pedido, primeiro o lado externo, por escrito.",
    splitNote: "Nosso catálogo publica comprimentos totais, não a divisão de cada modelo. Peça a divisão por escrito e confirmamos antes de qualquer envio.",
    invalid: "Informe uma espessura de porta maior que zero, profundidades de 0 a 50 mm e um centro dentro da porta.",
    published: "Comprimentos totais que publicamos",
  },
};

const FIELD_CLASS =
  "field min-h-42 w-full rounded-card border border-line bg-surface px-16 py-10 text-c1 text-ink";

const fill = (template: string, vars: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m);

const num = (s: string) => (s.trim() === "" ? Number.NaN : Number(s.replace(",", ".")));

export function CylinderCalculator({ locale }: { locale: Locale }) {
  const t = dict(COPY, locale);
  const [door, setDoor] = useState("60");
  const [outTrim, setOutTrim] = useState("4");
  const [inTrim, setInTrim] = useState("4");
  const [offCentre, setOffCentre] = useState(false);
  const [center, setCentre] = useState("30");

  const input = {
    doorMm: num(door),
    outsideTrimMm: num(outTrim),
    insideTrimMm: num(inTrim),
    centerFromOutsideMm: offCentre ? num(center) : undefined,
  };
  const ok = validCylinderInput(input);
  const r = ok ? sizeCylinder(input) : null;
  const fmt = (n: number) => (locale === "en" ? String(n) : String(n).replace(".", ","));

  return (
    <section className="col-content grid grid-cols gap-x gap-y-48" aria-live="polite">
      <form
        className="col-span-full space-y-24 lg:col-span-5 xl:col-span-9"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="block space-y-8 text-c1 text-ink">
          <span>{t.door}</span>
          <input className={FIELD_CLASS} inputMode="decimal" value={door} onChange={(e) => setDoor(e.target.value)} />
        </label>
        <label className="block space-y-8 text-c1 text-ink">
          <span>{t.outsideTrim}</span>
          <input className={FIELD_CLASS} inputMode="decimal" value={outTrim} onChange={(e) => setOutTrim(e.target.value)} />
        </label>
        <label className="block space-y-8 text-c1 text-ink">
          <span>{t.insideTrim}</span>
          <input className={FIELD_CLASS} inputMode="decimal" value={inTrim} onChange={(e) => setInTrim(e.target.value)} />
        </label>
        <label className="flex items-start gap-12 text-c1 text-ink">
          <input type="checkbox" className="mt-6" checked={offCentre} onChange={(e) => setOffCentre(e.target.checked)} />
          <span>{t.offCentre}</span>
        </label>
        {offCentre ? (
          <label className="block space-y-8 text-c1 text-ink">
            <span>{t.center}</span>
            <input className={FIELD_CLASS} inputMode="decimal" value={center} onChange={(e) => setCentre(e.target.value)} />
          </label>
        ) : (
          <p className="text-c2 text-ink-secondary">{t.centerHint}</p>
        )}
      </form>

      <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
        {r ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[28rem] border-collapse text-start">
                <thead>
                  <tr className="border-b border-line">
                    {[t.half, t.calculated, t.standard, t.proud].map((h) => (
                      <th key={h} scope="col" className="py-12 pe-16 text-c2 font-semibold text-ink-secondary">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([
                    [t.outside, r.outside],
                    [t.inside, r.inside],
                  ] as const).map(([label, h]) => (
                    <tr key={label} className="border-b border-line">
                      <th scope="row" className="py-12 pe-16 text-c1 font-normal text-ink">{label}</th>
                      <td className="py-12 pe-16 text-c1 text-ink">{fmt(h.calculatedMm)} mm</td>
                      <td className="py-12 pe-16 text-c1 font-semibold text-ink">{fmt(h.halfMm)} mm</td>
                      <td className="py-12 text-c1 text-ink">{fmt(h.proudMm)} mm</td>
                    </tr>
                  ))}
                  <tr className="border-b border-line">
                    <th scope="row" className="py-12 pe-16 text-c1 font-normal text-ink">{t.total}</th>
                    <td colSpan={3} className="py-12 text-c1 text-ink">{fmt(r.totalMm)} mm</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-32 text-c2 uppercase tracking-[0.08em] text-ink-secondary">{t.order}</p>
            <p className="mt-8 text-h3 text-ink">
              {r.publishedMm !== null
                ? fill(t.orderAs, { total: fmt(r.publishedMm), outside: fmt(r.outside.halfMm), inside: fmt(r.inside.halfMm) })
                : t.noModel}
            </p>
            <ul className="mt-24 space-y-12 text-c1 text-ink-secondary">
              {r.outside.proudMm > MAX_PROUD_MM && r.inside.proudMm > MAX_PROUD_MM ? (
                <li>{fill(t.proudBoth, { mm: fmt(Math.max(r.outside.proudMm, r.inside.proudMm)), max: String(MAX_PROUD_MM) })}</li>
              ) : (
                ([
                  [t.outside, r.outside.proudMm],
                  [t.inside, r.inside.proudMm],
                ] as const)
                  .filter(([, mm]) => mm > MAX_PROUD_MM)
                  .map(([side, mm]) => <li key={side}>{fill(t.proudWarning, { side: side.toLowerCase(), mm: fmt(mm), max: String(MAX_PROUD_MM) })}</li>)
              )}
              {r.asymmetric ? <li>{t.asymmetric}</li> : null}
              <li>{t.splitNote}</li>
            </ul>
            <p className="mt-24 text-c2 text-ink-secondary">
              {t.published}: {PUBLISHED_LENGTHS_MM.join(", ")} mm
            </p>
          </>
        ) : (
          <p className="text-c1 text-ink-secondary">{t.invalid}</p>
        )}
      </div>
    </section>
  );
}
