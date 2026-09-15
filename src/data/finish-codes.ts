/**
 * What the letters after a model number mean.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * Our order codes have a grammar, and until now the only place it was written down was
 * in the heads of the people who use it daily. `587 SSBK` is not an opaque SKU — it is
 * a base model, a finish and a lock function concatenated, and once a buyer knows that,
 * a price list of four hundred lines collapses into thirty products and two suffix
 * tables.
 *
 * The client's most-cited article on this site is the one that explains how to read a
 * model number — seven citations against three for every category page combined. That
 * is the market telling us what it wants: not more product pages, but the key to the
 * ones we already have. This file is that key, as data rather than prose, so the table
 * on /finishes is derived from the catalogue instead of being typed out beside it and
 * going stale.
 *
 * ---------------------------------------------------------------------------
 * EVERY ROW CARRIES ITS EVIDENCE, AND THE UNKNOWN ONES STAY UNKNOWN
 *
 * The temptation with a table like this is to complete it. `NB` is obviously Nickel
 * Brushed, or Natural Brass, or Nickel Black — three readings, all plausible, and the
 * buyer who orders the wrong one gets a container of the wrong colour. So each entry
 * records HOW we know:
 *
 *   "catalogue"    a product record spells it out in its own text — the catalogue
 *                  contains `PB=Polish Brass`, `Satin Stainless Steel (SSS)`,
 *                  `SC= Satin chrome`, `Gun metal (GM)` and a handful of others.
 *   "client"       the client confirmed it in writing; the date is in the note.
 *   "unconfirmed"  the code is demonstrably in use — it appears in model numbers or
 *                  finish fields — and nothing we hold says what it expands to.
 *
 * Unconfirmed rows are NOT dropped from the page. A buyer holding a quotation that says
 * `GP` needs to know that we recognise the code and that the expansion has to be asked
 * for; a table that silently omits it looks complete and is worse. See the honesty rule
 * in AGENTS.md — a dash costs a question, a plausible number costs a container.
 *
 * When the factory confirms one, change `evidence` and the note. Nothing else moves:
 * the counts, the page and the audit all derive from this list.
 */

/** How we know what a code means. Drives what the page is allowed to print. */
export type CodeEvidence = "catalogue" | "client" | "unconfirmed";

/**
 * Where the appearance comes from.
 *
 * This matters more than it looks. A plated finish and a solid-metal finish can be the
 * same colour and are not the same product — different wear, different corrosion
 * behaviour, different ANSI/BHMA number on the same colour name. See src/lib/bhma-finish.ts,
 * which refuses to map a finish code without also knowing the base metal.
 */
export type FinishFamily = "plated" | "solid" | "coated" | "process";

export interface FinishCode {
  /** The letters as they appear in an order code, upper case. */
  code: string;
  /** English name. Empty string is not allowed — an unconfirmed code has no name. */
  name: string | null;
  nameEs: string | null;
  family: FinishFamily | null;
  evidence: CodeEvidence;
  /** Shown under the row. Say what is uncertain, not what is reassuring. */
  note?: string;
  noteEs?: string;
}

/**
 * The finish half of an order code.
 *
 * Ordered by family then alphabetically, which is how a specifier scans it: they know
 * whether they want stainless, brass or a coating before they know the code.
 */
export const FINISH_CODES: readonly FinishCode[] = [
  {
    code: "SSS",
    name: "Satin Stainless Steel",
    nameEs: "Acero inoxidable satinado",
    family: "solid",
    evidence: "catalogue",
    note: "Written out in full on 42 catalogue records as “Satin Stainless Steel (SSS)”. Solid stainless, not a plating — the colour goes all the way through.",
    noteEs: "Escrito en 42 fichas del catálogo como «Satin Stainless Steel (SSS)». Inoxidable macizo, no un recubrimiento.",
  },
  {
    code: "PSS",
    name: "Polished Stainless Steel",
    nameEs: "Acero inoxidable pulido",
    family: "solid",
    evidence: "catalogue",
    note: "Same 42 records. Mirror polish on the same base metal as SSS.",
    noteEs: "Las mismas 42 fichas. Pulido espejo sobre el mismo metal base que SSS.",
  },
  {
    code: "SS",
    name: "Stainless Steel",
    nameEs: "Acero inoxidable",
    family: "solid",
    evidence: "catalogue",
    note: "The older unqualified form, still on the panic-exit range. Where a record carries SS rather than SSS or PSS, the polish level has not been stated — ask before specifying.",
    noteEs: "La forma antigua sin calificar. Cuando una ficha indica SS y no SSS o PSS, el grado de pulido no está declarado: pregunte antes de especificar.",
  },
  {
    code: "PB",
    name: "Polished Brass",
    nameEs: "Latón pulido",
    family: "plated",
    evidence: "catalogue",
    note: "Five records spell it out, as “PB=Polish Brass” and “PB=polished brass”.",
    noteEs: "Cinco fichas lo escriben como «PB=Polish Brass».",
  },
  {
    code: "AB",
    name: "Antique Brass",
    nameEs: "Latón antiguo",
    family: "plated",
    evidence: "catalogue",
    note: "Written out as “Antique Brass (AB)”.",
    noteEs: "Escrito como «Antique Brass (AB)».",
  },
  {
    code: "AC",
    name: "Antique Copper",
    nameEs: "Cobre antiguo",
    family: "plated",
    evidence: "catalogue",
    note: "Appears both as the code and spelled out as a finish value on the same families.",
    noteEs: "Aparece como código y escrito en las mismas familias de producto.",
  },
  {
    code: "CP",
    name: "Chrome Plated",
    nameEs: "Cromado",
    family: "plated",
    evidence: "catalogue",
    note: "Written out as “Chrome Plated (CP)”.",
    noteEs: "Escrito como «Chrome Plated (CP)».",
  },
  {
    code: "SC",
    name: "Satin Chrome",
    nameEs: "Cromo satinado",
    family: "plated",
    evidence: "catalogue",
    note: "Written out as “SC= Satin chrome”.",
    noteEs: "Escrito como «SC= Satin chrome».",
  },
  {
    code: "SN",
    name: "Satin Nickel",
    nameEs: "Níquel satinado",
    family: "plated",
    evidence: "catalogue",
    note: "Written out as “SN=Satin Nickel”. The most common finish in the lever and cylinder ranges.",
    noteEs: "Escrito como «SN=Satin Nickel». El acabado más frecuente en manillas y cilindros.",
  },
  {
    code: "NP",
    name: "Nickel Plated",
    nameEs: "Niquelado",
    family: "plated",
    evidence: "catalogue",
    note: "Appears spelled out as “Nickel-plated” on records that also carry the code.",
    noteEs: "Aparece escrito como «Nickel-plated» en fichas que también llevan el código.",
  },
  {
    code: "BN",
    name: "Black Nickel",
    nameEs: "Níquel negro",
    family: "plated",
    evidence: "catalogue",
    note: "One record carries “BN Black Nickle” — the factory's own spelling of the expansion.",
    noteEs: "Una ficha indica «BN Black Nickle», con la grafía de la fábrica.",
  },
  {
    code: "GM",
    name: "Gun Metal",
    nameEs: "Gris grafito",
    family: "coated",
    evidence: "client",
    note: "Written out as “Gun metal (GM)” in the catalogue and confirmed by the client on 2026-09-13 for LH852 GMBK. A dark grey, not a black.",
    noteEs: "Escrito como «Gun metal (GM)» y confirmado por el cliente el 2026-09-13 para LH852 GMBK. Un gris oscuro, no un negro.",
  },
  {
    code: "MB",
    name: "Matte Black",
    nameEs: "Negro mate",
    family: "coated",
    evidence: "catalogue",
    note: "Records carrying the code also carry “Matte Black” and “Matt Black” as the written value.",
    noteEs: "Las fichas con el código también indican «Matte Black» escrito.",
  },
  {
    code: "BL",
    name: "Black",
    nameEs: "Negro",
    family: "coated",
    evidence: "catalogue",
    note: "Unqualified black. Where the record does not also say powder-coated or painted, the process has not been stated.",
    noteEs: "Negro sin calificar. Si la ficha no indica además pintura o recubrimiento en polvo, el proceso no está declarado.",
  },
  {
    code: "PVD",
    name: "PVD",
    nameEs: "PVD",
    family: "process",
    evidence: "catalogue",
    note: "A deposition process rather than a colour — PVD names how the layer is applied, and still needs a colour beside it.",
    noteEs: "Un proceso de deposición, no un color: PVD indica cómo se aplica la capa y necesita un color al lado.",
  },

  /* ------------------------------------------------------------------
     In use, not confirmed. These are the factory's questions, printed.
     ------------------------------------------------------------------ */
  {
    code: "SB",
    name: null,
    nameEs: null,
    family: null,
    evidence: "unconfirmed",
    note: "In use on the catalogue's finish lists. Satin Brass is the common industry reading, but nothing we hold states it, and Satin Bronze and Satin Black are also live codes elsewhere in the trade.",
    noteEs: "En uso en el catálogo. «Satin Brass» es la lectura habitual del sector, pero nada en nuestros datos lo confirma.",
  },
  {
    code: "BP",
    name: null,
    nameEs: null,
    family: null,
    evidence: "unconfirmed",
    note: "Brass Plated and Black Powder-coat are both plausible, and records nearby carry “Powder-Coated Black” written out — which argues for the second without settling it.",
    noteEs: "«Brass Plated» y «Black Powder-coat» son ambas posibles; fichas cercanas escriben «Powder-Coated Black», lo que apunta a la segunda sin confirmarla.",
  },
  {
    code: "NB",
    name: null,
    nameEs: null,
    family: null,
    evidence: "unconfirmed",
    note: "Listed beside AB and CP on one record without an expansion. Nickel Brushed, Natural Brass and Nickel Black are all in trade use.",
    noteEs: "Aparece junto a AB y CP sin expansión. «Nickel Brushed», «Natural Brass» y «Nickel Black» se usan en el sector.",
  },
  {
    code: "GP",
    name: null,
    nameEs: null,
    family: null,
    evidence: "unconfirmed",
    note: "Same record as NB. Gold Plated is the likely reading; we have not been told.",
    noteEs: "La misma ficha que NB. «Gold Plated» es la lectura probable; no nos lo han confirmado.",
  },
  {
    code: "CB",
    name: null,
    nameEs: null,
    family: null,
    evidence: "unconfirmed",
    note: "Appears only inside dot-separated finish lists.",
    noteEs: "Sólo aparece dentro de listas de acabados separadas por puntos.",
  },
  {
    code: "BC",
    name: null,
    nameEs: null,
    family: null,
    evidence: "unconfirmed",
    note: "Appears only inside dot-separated finish lists. Not to be read as CB reversed — both codes occur on the same record, so they are two different finishes.",
    noteEs: "Sólo aparece en listas separadas por puntos. No es CB al revés: ambos códigos figuran en la misma ficha, así que son dos acabados distintos.",
  },
  {
    code: "BRN",
    name: null,
    nameEs: null,
    family: null,
    evidence: "unconfirmed",
    note: "Three letters rather than two, which is unusual in this scheme. Bronze and Brown both fit.",
    noteEs: "Tres letras en vez de dos, algo inusual en este esquema. «Bronze» y «Brown» encajan.",
  },
  {
    code: "SP",
    name: null,
    nameEs: null,
    family: null,
    evidence: "unconfirmed",
    note: "Records using the code also carry “Spray Painting” and “Gray Spray Painted” as written values, which suggests a sprayed coating rather than a colour. A sprayed finish needs a colour named beside the code.",
    noteEs: "Las fichas con este código también indican «Spray Painting»: apunta a un lacado y no a un color, y un lacado necesita que se indique el color.",
  },
  {
    code: "BS",
    name: null,
    nameEs: null,
    family: null,
    evidence: "unconfirmed",
    note: "Used in the cylinder range. One unrelated record carries “Brushed Satin” written out, which is suggestive and not evidence.",
    noteEs: "Se usa en la gama de cilindros. Una ficha no relacionada escribe «Brushed Satin», lo que es sugerente pero no probatorio.",
  },
  {
    code: "ORB",
    name: null,
    nameEs: null,
    family: null,
    evidence: "unconfirmed",
    note: "Five records. Oil Rubbed Bronze is what ORB means everywhere else in the trade, and one record nearby carries “Bronze” written out — which is close enough to be suggestive and not close enough to print.",
    noteEs: "Cinco fichas. En el sector ORB significa «Oil Rubbed Bronze»; una ficha cercana escribe «Bronze», lo que es sugerente pero no basta para publicarlo.",
  },
  {
    code: "N",
    name: null,
    nameEs: null,
    family: null,
    evidence: "unconfirmed",
    note: "A single letter, on five records. Too short to guess from — Nickel, Natural and Nylon are all live in this catalogue's vocabulary.",
    noteEs: "Una sola letra, en cinco fichas. Demasiado corta para deducirla: «Nickel», «Natural» y «Nylon» existen en el vocabulario de este catálogo.",
  },
  {
    code: "WL",
    name: null,
    nameEs: null,
    family: null,
    evidence: "unconfirmed",
    note: "Two models only.",
    noteEs: "Sólo dos modelos.",
  },
];

/**
 * The function half of an order code.
 *
 * These are read out of the catalogue's own `Function` spec rows rather than assumed:
 * every confirmed entry below has at least one product record that carries both the
 * suffix and a written function. The cylinder suffixes have no such record — those
 * products ship with empty spec arrays — so they stay unconfirmed, and they are on the
 * factory question list for exactly that reason.
 */
export interface FunctionCode {
  code: string;
  name: string | null;
  nameEs: string | null;
  evidence: CodeEvidence;
  note?: string;
  noteEs?: string;
}

export const FUNCTION_CODES: readonly FunctionCode[] = [
  {
    code: "ET",
    name: "Entrance — keyed outside",
    nameEs: "Entrada — con llave por fuera",
    evidence: "catalogue",
    note: "The most common suffix in the catalogue. Key outside, turn or lever inside.",
    noteEs: "El sufijo más frecuente del catálogo. Llave por fuera, pomo o manilla por dentro.",
  },
  {
    code: "BK",
    name: "Privacy — bathroom, turn button inside",
    nameEs: "Privacidad — baño, botón interior",
    evidence: "catalogue",
    note: "Not keyed. A turn button inside and an emergency release outside — see the LH852 GMBK rose, where the coin slot is visible in the product photograph.",
    noteEs: "Sin llave. Botón interior y desbloqueo de emergencia exterior.",
  },
  {
    code: "PS",
    name: "Passage — no locking",
    nameEs: "Paso — sin bloqueo",
    evidence: "catalogue",
    note: "Latch only. Specified for corridors and rooms that must never be lockable.",
    noteEs: "Sólo picaporte. Se especifica en pasillos y estancias que nunca deben poder cerrarse con llave.",
  },
  {
    code: "CL",
    name: "Communication",
    nameEs: "Comunicación",
    evidence: "catalogue",
    note: "Named on model 5807 SSCL.",
    noteEs: "Indicado en el modelo 5807 SSCL.",
  },
  {
    code: "CC",
    name: "Entrance and communication",
    nameEs: "Entrada y comunicación",
    evidence: "catalogue",
    note: "Named on model 5870 SSCC.",
    noteEs: "Indicado en el modelo 5870 SSCC.",
  },
  {
    code: "CR",
    name: "Classroom",
    nameEs: "Aula",
    evidence: "catalogue",
    note: "Named on model 5807 SSCR. Keyed outside only; the inside lever is always free.",
    noteEs: "Indicado en el modelo 5807 SSCR. Con llave sólo por fuera; la manilla interior queda siempre libre.",
  },
  {
    code: "EL",
    name: "Exit latch",
    nameEs: "Picaporte de salida",
    evidence: "catalogue",
    note: "Named on model 5807 SSEL.",
    noteEs: "Indicado en el modelo 5807 SSEL.",
  },
  {
    code: "DK",
    name: null,
    nameEs: null,
    evidence: "unconfirmed",
    note: "Ten cylinders carry it. Double Key — key on both sides — is the standard reading in the euro-cylinder trade, and our records for these models carry no specifications at all, so we are not printing it as fact.",
    noteEs: "Diez cilindros lo llevan. «Doble llave» es la lectura habitual, pero estas fichas no tienen especificaciones, así que no lo damos por hecho.",
  },
  {
    code: "KT",
    name: null,
    nameEs: null,
    evidence: "unconfirmed",
    note: "Sixteen cylinders. Key-and-Turn — key one side, thumbturn the other — fits the pattern beside DK, and is not confirmed.",
    noteEs: "Dieciséis cilindros. «Llave y pomo» encaja con el patrón junto a DK, pero no está confirmado.",
  },
  {
    code: "IK",
    name: null,
    nameEs: null,
    evidence: "unconfirmed",
    note: "Two cylinders only.",
    noteEs: "Sólo dos cilindros.",
  },
  {
    code: "PT",
    name: null,
    nameEs: null,
    evidence: "unconfirmed",
    note: "One tubular lock.",
    noteEs: "Una cerradura tubular.",
  },
  {
    code: "BS",
    name: null,
    nameEs: null,
    evidence: "unconfirmed",
    note: "One cylindrical lock. Shares its letters with the finish code BS, which is why the parser reads position rather than letters — see src/lib/order-code.ts.",
    noteEs: "Una cerradura cilíndrica. Comparte letras con el acabado BS, por eso el analizador lee la posición y no las letras.",
  },
];

/**
 * The door-configuration letter.
 *
 * ---------------------------------------------------------------------------
 * CONFIRMED FOR PANIC EXIT DEVICES, AND ONLY THERE
 *
 * `316-S` and `316-D` are the same device in two configurations, and the catalogue says
 * so in its own spec rows: 316-S carries `Door Type = Single Door`, 316-D carries
 * `Door Type = Double Door`. 309-D is named "Double Door Panic Exit Device" outright.
 * That is two independent confirmations on the escape-hardware range, which is where the
 * distinction matters most — a double-leaf escape door needs the coordinated pair, and
 * ordering the single costs a site its fire certificate.
 *
 * The same letter appears on `DV12-S` (a door viewer) and `HY007-S` (a lock case), where
 * it cannot mean single door. So the scope is stated rather than generalised: on a panic
 * exit device the letter is the leaf count; anywhere else it is a variant marker whose
 * meaning the factory has not given us.
 */
export interface DoorConfigurationCode {
  code: string;
  name: string | null;
  nameEs: string | null;
  evidence: CodeEvidence;
  note?: string;
  noteEs?: string;
}

export const DOOR_CONFIGURATION_CODES: readonly DoorConfigurationCode[] = [
  {
    code: "S",
    name: "Single door",
    nameEs: "Puerta de una hoja",
    evidence: "catalogue",
    note: "On panic exit devices only — 316-S carries “Door Type = Single Door”. On other ranges the same letter marks a variant we have no statement for.",
    noteEs: "Sólo en barras antipánico: 316-S indica «Door Type = Single Door». En otras gamas la misma letra marca una variante sin declarar.",
  },
  {
    code: "D",
    name: "Double door",
    nameEs: "Puerta de dos hojas",
    evidence: "catalogue",
    note: "On panic exit devices only — 316-D carries “Door Type = Double Door”, and 309-D is named as the double-door device. A double-leaf escape door needs the coordinated pair, not two singles.",
    noteEs: "Sólo en barras antipánico: 316-D indica «Door Type = Double Door». Una puerta de escape de dos hojas necesita el conjunto coordinado, no dos unidades individuales.",
  },
];
