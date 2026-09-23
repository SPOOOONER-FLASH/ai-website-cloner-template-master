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
 * The market keeps telling us it wants the key rather than more product pages. As of
 * 2026-09-22 the four most-cited articles on this site are, in order: the push-bar vs
 * touch-bar comparison (44 citations), the finish-code guide (20), the Spanish handing
 * page (17) and this file's own subject, how to read a model number (9) — against three
 * for every category page combined.
 * This file is that key, as data rather than prose, so the table on /finishes is
 * derived from the catalogue instead of being typed out beside it and
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
  namePt: string | null;
  family: FinishFamily | null;
  evidence: CodeEvidence;
  /** Shown under the row. Say what is uncertain, not what is reassuring. */
  note?: string;
  noteEs?: string;
  notePt?: string;
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
    namePt: "Aço inoxidável acetinado",
    family: "solid",
    evidence: "catalogue",
    note: "Written out in full on 42 catalogue records as “Satin Stainless Steel (SSS)”. Solid stainless, not a plating — the colour goes all the way through.",
    noteEs: "Escrito en 42 fichas del catálogo como «Satin Stainless Steel (SSS)». Inoxidable macizo, no un recubrimiento.",
  },
  {
    code: "PSS",
    name: "Polished Stainless Steel",
    nameEs: "Acero inoxidable pulido",
    namePt: "Aço inoxidável polido",
    family: "solid",
    evidence: "catalogue",
    note: "Same 42 records. Mirror polish on the same base metal as SSS.",
    noteEs: "Las mismas 42 fichas. Pulido espejo sobre el mismo metal base que SSS.",
  },
  {
    code: "SS",
    name: "Stainless Steel",
    nameEs: "Acero inoxidable",
    namePt: "Aço inoxidável",
    family: "solid",
    evidence: "catalogue",
    note: "The older unqualified form, still on the panic-exit range. Where a record carries SS rather than SSS or PSS, the polish level has not been stated — ask before specifying.",
    noteEs: "La forma antigua sin calificar. Cuando una ficha indica SS y no SSS o PSS, el grado de pulido no está declarado: pregunte antes de especificar.",
  },
  {
    code: "PB",
    name: "Polished Brass",
    nameEs: "Latón pulido",
    namePt: "Latão polido",
    family: "plated",
    evidence: "catalogue",
    note: "Five records spell it out, as “PB=Polish Brass” and “PB=polished brass”.",
    noteEs: "Cinco fichas lo escriben como «PB=Polish Brass».",
  },
  {
    code: "AB",
    name: "Antique Brass",
    nameEs: "Latón antiguo",
    namePt: "Latão antigo",
    family: "plated",
    evidence: "catalogue",
    note: "Written out as “Antique Brass (AB)”.",
    noteEs: "Escrito como «Antique Brass (AB)».",
  },
  {
    code: "AC",
    name: "Antique Copper",
    nameEs: "Cobre antiguo",
    namePt: "Cobre antigo",
    family: "plated",
    evidence: "catalogue",
    note: "Appears both as the code and spelled out as a finish value on the same families.",
    noteEs: "Aparece como código y escrito en las mismas familias de producto.",
  },
  {
    code: "CP",
    name: "Chrome Plated",
    nameEs: "Cromado",
    namePt: "Cromado",
    family: "plated",
    evidence: "catalogue",
    note: "Written out as “Chrome Plated (CP)”.",
    noteEs: "Escrito como «Chrome Plated (CP)».",
  },
  {
    code: "SC",
    name: "Satin Chrome",
    nameEs: "Cromo satinado",
    namePt: "Cromo acetinado",
    family: "plated",
    evidence: "catalogue",
    note: "Written out as “SC= Satin chrome”.",
    noteEs: "Escrito como «SC= Satin chrome».",
  },
  {
    code: "SN",
    name: "Satin Nickel",
    nameEs: "Níquel satinado",
    namePt: "Níquel acetinado",
    family: "plated",
    evidence: "catalogue",
    note: "Written out as “SN=Satin Nickel”. The most common finish in the lever and cylinder ranges.",
    noteEs: "Escrito como «SN=Satin Nickel». El acabado más frecuente en manillas y cilindros.",
  },
  {
    code: "NP",
    name: "Nickel Plated",
    nameEs: "Niquelado",
    namePt: "Niquelado",
    family: "plated",
    evidence: "catalogue",
    note: "Appears spelled out as “Nickel-plated” on records that also carry the code.",
    noteEs: "Aparece escrito como «Nickel-plated» en fichas que también llevan el código.",
  },
  {
    code: "BN",
    name: "Black Nickel",
    nameEs: "Níquel negro",
    namePt: "Níquel preto",
    family: "plated",
    evidence: "catalogue",
    note: "One record carries “BN Black Nickle” — the factory's own spelling of the expansion.",
    noteEs: "Una ficha indica «BN Black Nickle», con la grafía de la fábrica.",
  },
  {
    code: "GM",
    name: "Gun Metal",
    nameEs: "Gris grafito",
    namePt: "Metal escurecido",
    family: "coated",
    evidence: "client",
    note: "Written out as “Gun metal (GM)” in the catalogue and confirmed by the client on 2026-09-13 for LH852 GMBK. A dark grey, not a black.",
    noteEs: "Escrito como «Gun metal (GM)» y confirmado por el cliente el 2026-09-13 para LH852 GMBK. Un gris oscuro, no un negro.",
  },
  {
    code: "MB",
    name: "Matte Black",
    nameEs: "Negro mate",
    namePt: "Preto fosco",
    family: "coated",
    evidence: "catalogue",
    note: "Records carrying the code also carry “Matte Black” and “Matt Black” as the written value.",
    noteEs: "Las fichas con el código también indican «Matte Black» escrito.",
  },
  {
    code: "BL",
    name: "Black",
    nameEs: "Negro",
    namePt: "Preto",
    family: "coated",
    evidence: "catalogue",
    note: "Unqualified black. Where the record does not also say powder-coated or painted, the process has not been stated.",
    noteEs: "Negro sin calificar. Si la ficha no indica además pintura o recubrimiento en polvo, el proceso no está declarado.",
  },
  {
    code: "PVD",
    name: "PVD",
    nameEs: "PVD",
    namePt: "PVD",
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
    name: "Satin Brass",
    nameEs: "Latón satinado",
    namePt: "Latão acetinado",
    family: "plated",
    evidence: "client",
    /*
      The client's own term was 铜砂光. It is kept here as the provenance, not in the note:
      client rule 2026-09-23, the public site never shows Chinese — "官网永远不要显示中文的
      任何东西，你可以做镜像或者留存数据". The note used to quote it and printed it on
      /finishes/ and /es/finishes/.
    */
    note: "Client confirmation, 2026-09-15: brass, brushed rather than polished. The satin counterpart to BP/PB.",
    noteEs: "Confirmación del cliente, 2026-09-15: latón cepillado en lugar de pulido. La versión satinada de BP/PB.",
  },
  {
    code: "BP",
    name: "Polished Brass",
    nameEs: "Latón pulido",
    namePt: "Latão polido",
    family: "plated",
    evidence: "client",
    note: "Client confirmation, 2026-09-15: 铜亮光. ⚠ Same finish as PB, with the letters reversed — and PB is the form written out in full on five catalogue records. BP/PB and NB/BN are the two reversal pairs in this table; they are the most likely place for a finish to be ordered wrong.",
    noteEs: "Confirmación del cliente, 2026-09-15: 铜亮光. ⚠ Es el mismo acabado que PB con las letras invertidas, y PB es la forma escrita en cinco fichas del catálogo. BP/PB y NB/BN son los dos pares invertidos de esta tabla: el punto donde es más probable pedir un acabado equivocado.",
  },
  {
    code: "NB",
    name: "Black Nickel",
    nameEs: "Níquel negro",
    namePt: "Níquel preto",
    family: "plated",
    evidence: "client",
    note: "Client confirmation, 2026-09-15: 黑镍. ⚠ This is the same finish as BN, two rows above, with the letters the other way round. Both are in use on catalogue records. Quote the model's own code as printed and do not normalise it.",
    noteEs: "Confirmación del cliente, 2026-09-15: 黑镍. ⚠ Es el mismo acabado que BN, dos filas más arriba, con las letras invertidas. Ambos se usan en el catálogo. Cite el código tal y como aparece en la ficha del modelo y no lo normalice.",
  },
  {
    code: "GP",
    name: "Polished Gold",
    nameEs: "Oro pulido",
    namePt: "Dourado polido",
    family: "plated",
    evidence: "client",
    note: "Client confirmation, 2026-09-15: 亮金色, a bright gold plate. The only gold in the range — nothing else here shares it, so GP is unambiguous on an order.",
    noteEs: "Confirmación del cliente, 2026-09-15: 亮金色, un dorado brillante. Es el único dorado de la gama, así que GP no se presta a confusión en un pedido.",
  },
  {
    code: "CB",
    name: "Bright Chrome",
    nameEs: "Cromo brillante",
    namePt: "Cromo brilhante",
    family: "plated",
    evidence: "client",
    note: "Client confirmation, 2026-09-15: 光铬. ⚠ BC was confirmed as the same finish in the same message. An earlier note here reasoned that CB and BC must differ because one record lists both; that record is now best read as listing one finish twice. Confirm against a sample before a first order.",
    noteEs: "Confirmación del cliente, 2026-09-15: 光铬. ⚠ BC se confirmó como el mismo acabado en el mismo mensaje. Una nota anterior deducía que CB y BC debían ser distintos porque una ficha lista ambos; hoy lo más razonable es leer esa ficha como el mismo acabado escrito dos veces. Confirme contra muestra antes de un primer pedido.",
  },
  {
    code: "BC",
    name: "Bright Chrome",
    nameEs: "Cromo brillante",
    namePt: "Cromo brilhante",
    family: "plated",
    evidence: "client",
    note: "Client confirmation, 2026-09-15: 光铬 — the same words given for CB. See that row. Both spellings appear in the catalogue and neither is being retired, so read whichever the model prints.",
    noteEs: "Confirmación del cliente, 2026-09-15: 光铬, las mismas palabras dadas para CB. Vea esa fila. Ambas grafías están en el catálogo y ninguna se retira, así que lea la que imprima el modelo.",
  },
  {
    code: "BRN",
    name: "Black",
    nameEs: "Negro",
    namePt: "Preto",
    family: "coated",
    evidence: "client",
    note: "Client confirmation, 2026-09-15: 黑色. ⚠ Read this one carefully if you know the letters from elsewhere: in general trade use BRN reads as brown or bronze, and here it does not — the factory uses it for black. ORB and BL are also black in this catalogue. Three codes, one colour.",
    noteEs: "Confirmación del cliente, 2026-09-15: 黑色. ⚠ Atención si conoce estas letras de otro sitio: en el sector BRN suele leerse como marrón o bronce, y aquí no — la fábrica lo usa para negro. ORB y BL también son negros en este catálogo. Tres códigos, un color.",
  },
  {
    code: "SP",
    name: "Polished Stainless Steel",
    nameEs: "Acero inoxidable pulido",
    namePt: "Aço inoxidável polido",
    family: "solid",
    evidence: "client",
    note: "Client confirmation, 2026-09-15: 不锈钢抛亮光. Same finish as PSS at the top of this table, on a shorter code. Solid stainless, not a plating.",
    noteEs: "Confirmación del cliente, 2026-09-15: 不锈钢抛亮光. El mismo acabado que PSS al principio de esta tabla, con un código más corto. Inoxidable macizo, no un recubrimiento.",
  },
  {
    code: "BS",
    name: "Satin",
    nameEs: "Satinado",
    namePt: "Acetinado",
    family: "process",
    evidence: "client",
    note: "Client confirmation, 2026-09-15: 砂光. ⚠ It states the polish level and not the metal — satin stainless and satin brass are both 砂光 and are not interchangeable. Where a model prints BS alone, ask which base metal before specifying, exactly as with SS.",
    noteEs: "Confirmación del cliente, 2026-09-15: 砂光. ⚠ Indica el grado de pulido pero no el metal: inoxidable satinado y latón satinado son ambos 砂光 y no son intercambiables. Cuando un modelo indique sólo BS, pregunte por el metal base antes de especificar, igual que con SS.",
  },
  {
    code: "ORB",
    name: "Black",
    nameEs: "Negro",
    namePt: "Preto",
    family: "coated",
    evidence: "client",
    note: "Client confirmation, 2026-09-15: 黑色. ⚠ In North American usage ORB is oil-rubbed bronze, a dark brown with copper showing through the wear points. It does not mean that here. If a drawing calls for oil-rubbed bronze, this code will not supply it — ask.",
    noteEs: "Confirmación del cliente, 2026-09-15: 黑色. ⚠ En uso norteamericano ORB es «oil-rubbed bronze», un marrón oscuro con el cobre asomando en los puntos de desgaste. Aquí no significa eso. Si un plano pide oil-rubbed bronze, este código no lo sirve: pregunte.",
  },
  {
    code: "N",
    name: null,
    nameEs: null,
    namePt: null,
    family: null,
    evidence: "unconfirmed",
    note: "A single letter, on five records. Too short to guess from — Nickel, Natural and Nylon are all live in this catalogue's vocabulary.",
    noteEs: "Una sola letra, en cinco fichas. Demasiado corta para deducirla: «Nickel», «Natural» y «Nylon» existen en el vocabulario de este catálogo.",
  },
  {
    code: "WL",
    name: "White",
    nameEs: "Blanco",
    namePt: "Branco",
    family: "coated",
    evidence: "client",
    note: "Client confirmation, 2026-09-15: 白色. A coating, so the colour is on the surface — treat it as you would MB for wear at the strike and around the fixings.",
    noteEs: "Confirmación del cliente, 2026-09-15: 白色. Es un recubrimiento, así que el color está en la superficie: trátelo como MB en cuanto al desgaste en el cerradero y alrededor de las fijaciones.",
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
  namePt: string | null;
  evidence: CodeEvidence;
  note?: string;
  noteEs?: string;
  notePt?: string;
}

export const FUNCTION_CODES: readonly FunctionCode[] = [
  {
    code: "ET",
    name: "Entrance — keyed outside",
    nameEs: "Entrada — con llave por fuera",
    namePt: "Entrada — chaveada por fora",
    evidence: "catalogue",
    note: "The most common suffix in the catalogue. Key outside, turn or lever inside.",
    noteEs: "El sufijo más frecuente del catálogo. Llave por fuera, pomo o manilla por dentro.",
  },
  {
    code: "BK",
    name: "Privacy — bathroom, turn button inside",
    nameEs: "Privacidad — baño, botón interior",
    namePt: "Banheiro — botão de giro por dentro",
    evidence: "catalogue",
    note: "Not keyed. A turn button inside and an emergency release outside — see the LH852 GMBK rose, where the coin slot is visible in the product photograph.",
    noteEs: "Sin llave. Botón interior y desbloqueo de emergencia exterior.",
  },
  {
    code: "PS",
    name: "Passage — no locking",
    nameEs: "Paso — sin bloqueo",
    namePt: "Passagem — sem travamento",
    evidence: "catalogue",
    note: "Latch only. Specified for corridors and rooms that must never be lockable.",
    noteEs: "Sólo picaporte. Se especifica en pasillos y estancias que nunca deben poder cerrarse con llave.",
  },
  {
    code: "CL",
    name: "Communication",
    nameEs: "Comunicación",
    namePt: "Comunicação",
    evidence: "catalogue",
    note: "Named on model 5807 SSCL.",
    noteEs: "Indicado en el modelo 5807 SSCL.",
  },
  {
    code: "CC",
    name: "Entrance and communication",
    nameEs: "Entrada y comunicación",
    namePt: "Entrada e comunicação",
    evidence: "catalogue",
    note: "Named on model 5870 SSCC.",
    noteEs: "Indicado en el modelo 5870 SSCC.",
  },
  {
    code: "CR",
    name: "Classroom",
    nameEs: "Aula",
    namePt: "Sala de aula",
    evidence: "catalogue",
    note: "Named on model 5807 SSCR. Keyed outside only; the inside lever is always free.",
    noteEs: "Indicado en el modelo 5807 SSCR. Con llave sólo por fuera; la manilla interior queda siempre libre.",
  },
  {
    code: "EL",
    name: "Exit latch",
    nameEs: "Picaporte de salida",
    namePt: "Trinco de saída",
    evidence: "catalogue",
    note: "Named on model 5807 SSEL.",
    noteEs: "Indicado en el modelo 5807 SSEL.",
  },
  {
    code: "DK",
    name: "Double key",
    nameEs: "Doble llave",
    namePt: "Chave dupla",
    evidence: "client",
    note: "Eight cylinders and one lock case carry it (counted 2026-09-22). Confirmed by the client in writing, 2026-09-21: DK is the cylinder that opens with a key from both sides. He added the caveat himself, and it belongs here: different customers use this code differently and there is no industry-wide standard for it. So treat DK on an incoming enquiry as a question rather than an instruction — confirm which function the buyer means before quoting, because the code alone does not settle it.",
    noteEs: "Lo llevan ocho cilindros y una caja de cerradura (contados el 2026-09-22). Confirmado por el cliente por escrito el 2026-09-21: DK es el cilindro que abre con llave por ambos lados. Él mismo añadió la advertencia, y va aquí: distintos clientes usan este código de forma distinta y no hay un estándar del sector. Así que un DK en una consulta entrante es una pregunta, no una instrucción: confirme qué función quiere el comprador antes de cotizar.",
  },
  {
    code: "KT",
    name: null,
    nameEs: null,
    namePt: null,
    evidence: "unconfirmed",
    note: "Twelve cylinders, on the 60, 65, 70, 80 and 90mm lengths (counted 2026-09-22). Key-and-Turn — key one side, thumbturn the other — fits the pattern beside DK, and is not confirmed.",
    noteEs: "Doce cilindros, en las longitudes de 60, 65, 70, 80 y 90 mm (contados el 2026-09-22). «Llave y pomo» encaja con el patrón junto a DK, pero no está confirmado.",
  },
  {
    code: "IK",
    name: null,
    nameEs: null,
    namePt: null,
    evidence: "unconfirmed",
    note: "Three cylinders (counted 2026-09-22), and all three are the shortest in the range — 45, 45 and 47mm. A 45mm overall is below what a double euro cylinder needs, so the pattern is consistent with a single-sided cylinder. That is a pattern, not a confirmation, and it stays unconfirmed until the factory says so.",
    noteEs: "Tres cilindros (contados el 2026-09-22), y los tres son los más cortos de la gama: 45, 45 y 47 mm. Un total de 45 mm queda por debajo de lo que necesita un cilindro europeo de doble entrada, así que el patrón encaja con un cilindro de una sola cara. Eso es un patrón, no una confirmación, y sigue sin confirmar hasta que lo diga fábrica.",
  },
  {
    code: "PT",
    name: null,
    nameEs: null,
    namePt: null,
    evidence: "unconfirmed",
    note: "One tubular lock.",
    noteEs: "Una cerradura tubular.",
  },
  {
    code: "BS",
    name: null,
    nameEs: null,
    namePt: null,
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
  namePt: string | null;
  evidence: CodeEvidence;
  note?: string;
  noteEs?: string;
  notePt?: string;
}

export const DOOR_CONFIGURATION_CODES: readonly DoorConfigurationCode[] = [
  {
    code: "S",
    name: "Single door",
    nameEs: "Puerta de una hoja",
    namePt: "Porta simples",
    evidence: "catalogue",
    note: "On panic exit devices only — 316-S carries “Door Type = Single Door”. On other ranges the same letter marks a variant we have no statement for.",
    noteEs: "Sólo en barras antipánico: 316-S indica «Door Type = Single Door». En otras gamas la misma letra marca una variante sin declarar.",
  },
  {
    code: "D",
    name: "Double door",
    nameEs: "Puerta de dos hojas",
    namePt: "Porta dupla",
    evidence: "catalogue",
    note: "On panic exit devices only — 316-D carries “Door Type = Double Door”, and 309-D is named as the double-door device. A double-leaf escape door needs the coordinated pair, not two singles.",
    noteEs: "Sólo en barras antipánico: 316-D indica «Door Type = Double Door». Una puerta de escape de dos hojas necesita el conjunto coordinado, no dos unidades individuales.",
  },
];
