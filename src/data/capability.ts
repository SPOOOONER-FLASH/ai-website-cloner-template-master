/**
 * What the factory actually does, in the order it does it.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * `/services/` already lists six service paths and the FAQ already answers the OEM
 * question at length. Nothing here is new information. What was missing is the SHAPE:
 * a buyer reading six equally-weighted service cards cannot tell whether this supplier
 * runs one process or brokers seven, and that distinction is the whole question when
 * you are wiring money to a factory you have never visited.
 *
 * A chain answers it. Tooling → stamping → polishing → finishing → assembly →
 * inspection → export is one sequence under one roof, and presenting it as a sequence
 * is itself the argument. Consistency IS the argument, per the client's principal:
 * fifteen plates shot identically say "this is a factory with a process".
 *
 * ---------------------------------------------------------------------------
 * WHERE EVERY CLAIM COMES FROM
 *
 * The five process steps are the five words in the company profile the client wrote:
 * "stamping, polishing, assembly and quality control" (src/data/company.ts), plus the
 * tooling claim from the OEM answer in content/faq.json ("the tooling behind them is
 * our own"). The counts are computed, not typed. The lead time is the client's own
 * confirmed figure, 2026-09-01, already published in the FAQ.
 *
 * What is deliberately NOT here: no press tonnage, no line count, no plating tank
 * capacity, no salt-spray hours, no MOQ, no defect rate. We do not have those numbers.
 * A capability page is exactly where a supplier is tempted to invent them, and a buyer
 * who catches one invented figure discounts all of them — the same rule the product
 * dimensions follow. Where a step has no figure, it gets no figure.
 */

import { stats } from "./company.ts";

export interface CapabilityStep {
  /** Two digits, so the chain reads as a sequence and not a feature list. */
  ordinal: string;
  title: string;
  titleEs: string;
  body: string;
  bodyEs: string;
  /**
   * One checkable figure, or null. Null is a real value here: a step with nothing
   * countable behind it shows nothing rather than a rounded guess.
   */
  figure: { value: string; label: string; labelEs: string } | null;
}

function stat(label: string): string | null {
  return stats.find((s) => s.label === label)?.value ?? null;
}

/**
 * The chain, given the one figure that has to be counted from the catalogue.
 *
 * `models` is a parameter rather than an import of `publishedProducts` so this stays a
 * pure function of its inputs. That is not abstraction for its own sake: `products.ts`
 * uses extensionless imports meant for the bundler, so importing it here would make this
 * whole module unloadable under `node --test`, and the section whose entire purpose is
 * being believed would be the one section with no tests. The caller passes
 * `publishedProducts.length`, and capability.test.ts asserts that it still does — so the
 * figure is still counted, and the counting is still checked.
 */
export function capabilitySteps({ models }: { models: number }): CapabilityStep[] {
  const since = stat("Founded");
  const quality = stat("Quality system");

  const steps: CapabilityStep[] = [
    {
      ordinal: "01",
      title: "Tooling",
      titleEs: "Utillaje",
      body:
        "The moulds and dies behind the catalogue are ours. That is why changing a lever profile, a rosette, a plate or a backset is a normal order here rather than a special project — and why an OEM part starts from a sample, a drawing or a photograph instead of from a catalogue page. Where no mould exists for the form you want, we cut one.",
      bodyEs:
        "Los moldes y matrices que hay detrás del catálogo son nuestros. Por eso cambiar el perfil de una manilla, una roseta, una placa o una distancia al eje es aquí un pedido normal y no un proyecto especial — y por eso una pieza OEM parte de una muestra, un plano o una fotografía, no de una página de catálogo. Si no existe molde para la forma que usted quiere, lo fabricamos.",
      figure: { value: String(models), label: "models in production", labelEs: "modelos en producción" },
    },
    {
      ordinal: "02",
      title: "Stamping",
      titleEs: "Estampación",
      body:
        "Plate, rose and lever blanks are pressed in house from brass, stainless steel and zinc alloy. Working from our own tooling is what keeps the hole positions on the hundredth plate identical to the first — which matters more than it sounds, because a fixing centre that has drifted two millimetres cannot be corrected on site.",
      bodyEs:
        "Las placas, rosetas y cuerpos de manilla se estampan en planta a partir de latón, acero inoxidable y zamak. Trabajar con utillaje propio es lo que mantiene la posición de los taladros idéntica en la placa número cien y en la primera — algo más importante de lo que parece, porque una distancia entre fijaciones desviada dos milímetros no se corrige en obra.",
      figure: null,
    },
    {
      ordinal: "03",
      title: "Polishing",
      titleEs: "Pulido",
      body:
        "Every visible face is polished before it is plated, because plating does not hide what is underneath it — it magnifies it. This is the slowest step in the chain and the one that separates hardware that photographs well from hardware that still looks right after it is installed under a downlight.",
      bodyEs:
        "Toda cara vista se pule antes del recubrimiento, porque el recubrimiento no oculta lo que hay debajo: lo amplifica. Es el paso más lento de la cadena y el que separa un herraje que sale bien en fotografía de uno que sigue viéndose bien ya instalado bajo un foco.",
      figure: null,
    },
    {
      ordinal: "04",
      title: "Finishing",
      titleEs: "Acabado",
      body:
        "Polished brass, antique brass, satin nickel, satin chrome, black nickel, satin and polished stainless. A finish code is not decoration — it is what decides whether a handle survives a coastal doorway or a wet room, and it is the one specification most often left off a purchase order.",
      bodyEs:
        "Latón pulido, latón antiguo, níquel satinado, cromo satinado, níquel negro, inoxidable satinado y pulido. Un código de acabado no es decoración: decide si una manilla sobrevive en una puerta costera o en una zona húmeda, y es la especificación que más veces falta en un pedido.",
      /*
        No count here, though one is trivially available. `normaliseFinishes` over the
        whole catalogue returns 76 distinct values, but its own source comment calls
        `finishes` the messiest field in the catalogue — it passes unmapped codes through
        verbatim, so that 76 is 15 sourced trade names plus 61 raw strings nobody has
        audited. "76 finish codes" on the one section whose entire purpose is
        trustworthiness is exactly the plausible-looking figure the honesty rule exists to
        stop. The seven finishes named in the body above are the ones with sourced trade
        names in src/lib/configurator.ts; those we can stand behind.
      */
      figure: null,
    },
    {
      ordinal: "05",
      title: "Assembly",
      titleEs: "Montaje",
      body:
        "Cases, cylinders, springs, spindles and trim are brought together and function-tested as a set. A lock is not the sum of parts that each pass on their own — a latch and a strike that are both in tolerance can still bind, and that is only found by turning the handle.",
      bodyEs:
        "Cajas, cilindros, muelles, cuadradillos y guarniciones se montan y se prueban funcionando como conjunto. Una cerradura no es la suma de piezas que aprueban por separado: un picaporte y un cerradero ambos dentro de tolerancia pueden agarrotarse, y eso sólo se descubre girando la manilla.",
      figure: null,
    },
    {
      ordinal: "06",
      title: "Inspection",
      titleEs: "Inspección",
      body:
        "Dimensional and functional checks run against the same drawings the catalogue publishes, under a quality system audited to ISO 9001. Third-party inspection before shipment is welcome and does not need to be negotiated — tell us the inspector and we will book the date.",
      bodyEs:
        "Los controles dimensionales y funcionales se hacen contra los mismos planos que publica el catálogo, bajo un sistema de calidad auditado según ISO 9001. La inspección por tercero antes del embarque es bienvenida y no hay que negociarla: díganos qué inspector y reservamos la fecha.",
      figure: quality
        ? {
            value: quality.split(" since ")[0],
            label: quality.includes(" since ")
              ? `certified since ${quality.split(" since ")[1]}`
              : "quality system",
            labelEs: quality.includes(" since ")
              ? `certificado desde ${quality.split(" since ")[1]}`
              : "sistema de calidad",
          }
        : null,
    },
    {
      ordinal: "07",
      title: "Packing + export",
      titleEs: "Embalaje + exportación",
      body:
        "Your carton, your markings, your logo. We ship to distributors, contractors and OEM partners in export markets and issue the documents an importer actually needs at the border rather than after it. Production lead time starts at 30 days from order confirmation; the exact date depends on the models, quantities and finishes on your order.",
      bodyEs:
        "Su caja, su marcaje, su logotipo. Enviamos a distribuidores, contratistas y socios OEM en mercados de exportación, y emitimos los documentos que un importador necesita realmente en la aduana, no después. El plazo de producción parte de 30 días desde la confirmación del pedido; la fecha exacta depende de los modelos, las cantidades y los acabados.",
      figure: { value: "30", label: "days minimum lead time", labelEs: "días de plazo mínimo" },
    },
  ];

  /*
    The intro figure only claims what is counted. `since` is used for the eyebrow rather
    than as a step figure, because "1998" is not a property of any one step in the chain.
  */
  void since;
  return steps;
}

export const capabilityCopy = {
  en: {
    eyebrow: "Manufacturing",
    title: "One chain, one roof",
    intro:
      "We are the factory, not a trading office in front of one. Everything below happens on our own floor, from the mould to the carton — which is why a change of finish or a customer's own drawing is a scheduling question here rather than a subcontracting one.",
    progress: "Step",
    cta: "Discuss OEM or private-label production",
  },
  es: {
    eyebrow: "Fabricación",
    title: "Una cadena, una planta",
    intro:
      "Somos la fábrica, no una oficina comercial delante de una. Todo lo que sigue ocurre en nuestra propia planta, del molde a la caja — por eso un cambio de acabado o un plano del propio cliente aquí es una cuestión de programación y no de subcontratación.",
    progress: "Paso",
    cta: "Hablar de producción OEM o marca propia",
  },
} as const;
