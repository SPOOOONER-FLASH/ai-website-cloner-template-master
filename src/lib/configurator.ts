import type { FinderProduct } from "./product-finder";

/**
 * The narrowing model behind the guided configurator.
 *
 * ---------------------------------------------------------------------------
 * WHY A CONFIGURATOR WHEN THERE IS ALREADY A PRODUCT FINDER
 *
 * The Finder is a filter: seven facets, all visible, all independent, and a grid of
 * results underneath. It is the right tool for somebody who already knows the vocabulary
 * — they arrive knowing they want a satin stainless mortise lock and want to see the
 * eleven of them.
 *
 * A configurator answers a different question, and it is the question our Clarity
 * sessions actually show: visitors paging through category listings, going back, paging
 * again. They do not know the vocabulary. Asked "material?" cold, they cannot answer.
 * Asked "what are you specifying?" then "which type?" then given the three materials that
 * remain, they can answer every one.
 *
 * The difference that matters is DEAD ENDS. A filter lets you pick satin brass and fire
 * door and find nothing, and the reader concludes we do not make much. A configurator
 * only ever offers a choice that still leads somewhere, so it cannot produce an empty
 * result. Everything here exists to hold that invariant.
 *
 * ---------------------------------------------------------------------------
 * THE RULES
 *
 * 1. Options are derived from the products still matching, never from a fixed list.
 * 2. A step with fewer than two distinct answers is SKIPPED. Asking a question with one
 *    possible answer is a click that teaches the reader nothing.
 * 3. Steps are ordered from the question a stranger can answer to the one only a
 *    specifier can — kind of product first, finish last.
 */

export type StepKey = "category" | "subCategory" | "material" | "doorType" | "finish";

export interface ConfiguratorStep {
  key: StepKey;
  /** The question, in the buyer's words rather than the database's. */
  question: string;
  /** Shown under the question when the term needs explaining. */
  hint?: string;
}

export const STEPS: readonly ConfiguratorStep[] = [
  {
    key: "category",
    question: "What are you specifying?",
    hint: "The kind of hardware, not the model.",
  },
  {
    key: "subCategory",
    question: "Which type?",
  },
  {
    key: "material",
    question: "What should it be made of?",
    hint: "Stainless resists corrosion; zinc alloy and iron cost less on volume.",
  },
  {
    key: "doorType",
    question: "What door does it go on?",
  },
  {
    key: "finish",
    question: "Which finish?",
    hint: "Ask us about any finish you need that is not listed — most are available to order.",
  },
] as const;

export const STEPS_ES: readonly ConfiguratorStep[] = [
  {
    key: "category",
    question: "¿Qué está especificando?",
    hint: "El tipo de herraje, no el modelo.",
  },
  { key: "subCategory", question: "¿De qué tipo?" },
  {
    key: "material",
    question: "¿De qué material?",
    hint: "El acero inoxidable resiste la corrosión; el zamak y el hierro cuestan menos en volumen.",
  },
  { key: "doorType", question: "¿En qué puerta se instala?" },
  {
    key: "finish",
    question: "¿Qué acabado?",
    hint: "Consúltenos cualquier acabado que no aparezca — casi todos se fabrican bajo pedido.",
  },
] as const;

/** Chosen value per step. A step with no entry has not been answered yet. */
export type Answers = Partial<Record<StepKey, string>>;

export interface Option {
  value: string;
  /** How many products remain if this is chosen. Never zero. */
  count: number;
  /** A photograph from one of those products, so the choice is visual. */
  image?: string;
}

/**
 * Trade names for the finish codes, and the cleanup the finish step needs to be usable.
 *
 * `finishes` is the messiest field in the catalogue: 93 distinct values mixing bare codes
 * (`PSS`, `AB`), full names ("Antique Brass"), a placeholder ("All Available"), and
 * twelve dotted code-lists where one record crams five finishes into a single string
 * (`PB.AB.AC.CP.SN`).
 *
 * Offered raw, the finish question shows the reader "PB.AB.AC.CP.SN" as one option, which
 * is not a finish and not a choice. Splitting and expanding here makes the step answerable
 * without editing 435 records that the design colleague may be revising — the underlying
 * data still wants a pass, and that is on the fill-in sheet.
 *
 * The table is the same one scripts/expand-finish-codes.mjs uses. Eight codes
 * (BP NB CB BC GP BRN N PVD) have no sourced name and are deliberately absent: an invented
 * finish name in a specification is worse than an unexpanded code.
 */
const FINISH_NAMES: Record<string, string> = {
  PB: "Polished Brass",
  AB: "Antique Brass",
  AC: "Antique Copper",
  SN: "Satin Nickel",
  SC: "Satin Chrome",
  CP: "Chrome Plated",
  SB: "Satin Brass",
  SP: "Bright Polished",
  BN: "Black Nickel",
  MB: "Matt Black",
  SS: "Stainless Steel",
  SSS: "Satin Stainless Steel",
  PSS: "Polished Stainless Steel",
  NP: "Nickel Plated",
  ORB: "Oil Rubbed Bronze",
};

/** Says nothing and cannot be chosen against. */
const FINISH_PLACEHOLDERS = new Set(["all available", "available", "n/a", "customized"]);

export function normaliseFinishes(raw: readonly string[] = []): string[] {
  const out = new Set<string>();
  for (const entry of raw) {
    for (const part of entry.split(/[.,/]|\s+or\s+/i)) {
      const value = part.trim().replace(/,$/, "");
      if (!value) continue;
      if (FINISH_PLACEHOLDERS.has(value.toLowerCase())) continue;
      out.add(FINISH_NAMES[value.toUpperCase()] ?? value);
    }
  }
  return [...out];
}

/** Every value a product offers for one step. Multi-valued for finishes and door types. */
function valuesFor(product: FinderProduct, key: StepKey): string[] {
  switch (key) {
    case "category":
      return product.categoryPath[0] ? [product.categoryPath[0]] : [];
    case "subCategory":
      return product.categoryPath[1] ? [product.categoryPath[1]] : [];
    case "material":
      return product.material ? [product.material] : [];
    case "doorType":
      return product.doorTypes ?? [];
    case "finish":
      return normaliseFinishes(product.finishes);
  }
}

/** Does this product satisfy every answer given so far? */
export function satisfies(product: FinderProduct, answers: Answers): boolean {
  return (Object.entries(answers) as [StepKey, string][]).every(
    ([key, value]) => !value || valuesFor(product, key).includes(value),
  );
}

/** The products still in play. */
export function remaining(products: FinderProduct[], answers: Answers): FinderProduct[] {
  return products.filter((product) => satisfies(product, answers));
}

/**
 * The options for one step, given what has been answered.
 *
 * Counts come from the products that would remain, so an option showing "4" leads to four
 * products and an option leading to none is simply absent — that is the no-dead-end
 * invariant, enforced by construction rather than by checking afterwards.
 */
export function optionsFor(
  products: FinderProduct[],
  answers: Answers,
  key: StepKey,
): Option[] {
  const pool = remaining(products, { ...answers, [key]: undefined });
  const counts = new Map<string, { count: number; image?: string }>();

  for (const product of pool) {
    for (const value of valuesFor(product, key)) {
      const entry = counts.get(value) ?? { count: 0, image: undefined };
      entry.count += 1;
      if (!entry.image && product.heroImage?.src) entry.image = product.heroImage.src;
      counts.set(value, entry);
    }
  }

  return [...counts.entries()]
    .map(([value, { count, image }]) => ({ value, count, image }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

/**
 * The next question worth asking, or null when there is nothing left to ask.
 *
 * Skips any step whose options do not actually divide what is left. With one option the
 * question has one answer; with none the attribute is unpublished for these products,
 * and asking would be worse than skipping because the reader would read the empty step
 * as a fault.
 *
 * Also stops once the field is down to `enough` products — past that the reader is better
 * served by seeing them than by answering another question about them.
 */
export function nextStep(
  products: FinderProduct[],
  answers: Answers,
  steps: readonly ConfiguratorStep[] = STEPS,
  enough = 3,
): ConfiguratorStep | null {
  if (remaining(products, answers).length <= enough) return null;
  for (const step of steps) {
    if (answers[step.key]) continue;
    if (optionsFor(products, answers, step.key).length > 1) return step;
  }
  return null;
}

/** Every step that will be asked, for the progress rail — including the ones done. */
export function stepPath(
  products: FinderProduct[],
  answers: Answers,
  steps: readonly ConfiguratorStep[] = STEPS,
): StepKey[] {
  const asked: StepKey[] = [];
  const running: Answers = {};
  for (const step of steps) {
    const answer = answers[step.key];
    if (answer) {
      asked.push(step.key);
      running[step.key] = answer;
      continue;
    }
    if (optionsFor(products, running, step.key).length > 1) asked.push(step.key);
  }
  return asked;
}

/**
 * Answers as URL search params, and back.
 *
 * The configuration lives in the URL so it can be sent to a colleague or pasted into an
 * enquiry — which for a door schedule is the normal way this gets used. FSB does the same
 * thing, and it is the difference between a toy and something a specifier can work with.
 */
export function answersToParams(answers: Answers): URLSearchParams {
  const params = new URLSearchParams();
  for (const step of STEPS) {
    const value = answers[step.key];
    if (value) params.set(step.key, value);
  }
  return params;
}

export function answersFromParams(params: URLSearchParams | null): Answers {
  const answers: Answers = {};
  if (!params) return answers;
  for (const step of STEPS) {
    const value = params.get(step.key);
    if (value) answers[step.key] = value;
  }
  return answers;
}

/**
 * Drop the answer to `key` AND everything asked after it.
 *
 * Going back to "material" while keeping a finish chosen under the old material can leave
 * a combination no product has — the one way this UI could still show an empty result.
 * Later answers were chosen from options the earlier one produced, so they do not survive
 * it changing.
 */
export function reviseAt(answers: Answers, key: StepKey): Answers {
  const out: Answers = {};
  for (const step of STEPS) {
    if (step.key === key) break;
    if (answers[step.key]) out[step.key] = answers[step.key];
  }
  return out;
}

/**
 * What each choice actually means, in a sentence.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * The configurator asks "what are you specifying?" and offers `night-latches-rim-locks`
 * and `lock-cases`. A specifier knows the difference. An architect's assistant pricing a
 * refurbishment, or a distributor's buyer opening a new category, does not — and the
 * whole premise of a guided tool is that it can be used by somebody who cannot answer the
 * Finder's questions cold. Offering a term without defining it hands that reader the same
 * problem in a friendlier layout.
 *
 * FSB does this on every option in their configurator, and it is the part of their tool
 * that is genuinely hard to copy: it is writing, not code.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS AND IS NOT IN HERE
 *
 * These are DEFINITIONS OF TRADE TERMS, not claims about our products. "A mortise lock
 * case is let into a pocket cut in the edge of the door" is true of every mortise lock
 * ever made; it commits this company to nothing and can be checked against any hardware
 * reference. Nothing here says a Canton Hyland product is certified, rated, tested or
 * suitable for a given use — those claims live with the certificates that name a model.
 *
 * Values with no entry simply show no note. A definition invented to fill the gap would
 * be the one sentence on the page nobody had checked.
 */
export const OPTION_NOTES: Record<string, string> = {
  /* Categories */
  "panic-exit-devices":
    "A bar across the inside face of the door that unlatches under pressure, so a person leaving in a crowd needs no handle, no key and no instruction.",
  "lock-cases":
    "The mechanism itself, let into a pocket cut in the edge of the door. Handles and cylinders are ordered separately and fit to it.",
  "knob-locks":
    "Lock and handle in one assembly, bored straight through the door face. The commonest lock on an interior door because it needs two holes and no chiselling.",
  "lever-handles":
    "Handles on roses or backplates, fitted to a lock case bought separately. A lever can be opened with an elbow or a closed fist, which a knob cannot.",
  "stainless-steel-handles":
    "Pull and door handles in stainless steel, for entrances and glass doors where the handle is the visible hardware.",
  "night-latches-rim-locks":
    "Mounted on the face of the door rather than inside it. Latches behind you on closing, and can be held open when a door needs to stay free.",
  "door-closers":
    "Controls the door's swing and closes it every time. Needed wherever a door must not be left standing open.",
  "brass-steel-hinges":
    "Carries the door's weight and its whole life of movement. The item most often under-specified, and the one that fails first when it is.",
  "glass-door-accessories":
    "Patch fittings, clamps and locks that grip toughened glass without a frame, holding the leaf at its corners.",
  "lock-cylinders":
    "The keyed part. Changing the cylinder rekeys the door without touching the lock case.",
  deadbolts:
    "A bolt thrown by key or thumbturn with no spring behind it, so it cannot be pushed back. Fitted above a latch, not instead of one.",
  "bathroom-accessories":
    "Grab rails, hooks, holders and shelves — the fittings a washroom needs beyond its door.",
  "hardware-accessories":
    "Strikes, spindles, screws, stops and the parts that make the rest fit.",
  "grip-handle-sets": "A long pull on the outside with a lock behind it, for a main entrance door.",
  "sliding-hook-locks":
    "For a sliding leaf, where a bolt cannot travel straight out. A hook swings from the case into the keep.",

  /* Sub-categories */
  "tubular-locks": "Latch and spindle in a slim tube. Lighter duty than cylindrical, and quicker to fit.",
  "heavy-duty-cylindrical-locks":
    "A chassis inside the door with the working parts around the spindle. The pattern used in schools, hospitals and offices, where one door is opened thousands of times a year.",
  "light-duty-cylindrical-locks":
    "The same pattern, built for a residential opening rather than a corridor in constant use.",
  "commercial-locks":
    "Cylindrical locks in the function sets a commercial specification asks for — classroom, storeroom, entrance, passage.",
  "door-viewers": "A wide-angle lens through the door leaf, so the person inside can see the caller without opening.",
  "door-flush-bolts":
    "Holds the inactive leaf of a pair shut, let in flush so nothing stands proud of the edge.",
  "glass-door-handles": "Pulls fixed through drilled toughened glass, with no frame to fix to.",
  "glass-door-patch-fittings":
    "Corner castings that clamp toughened glass and carry the pivot, lock or rail.",
  latches: "The sprung bolt that holds a door closed without locking it.",
  "door-stoppers": "Stops the leaf, and the handle on it, before either reaches the wall.",
  "security-door-guards":
    "Lets the door open a few centimetres on a restrictor, so a caller can be spoken to before being let in.",
  indicators: "Shows occupied or vacant from outside, for a cubicle or a washroom.",
  "exterior-trim":
    "The outside handle for a panic device: the escape bar works from inside regardless, and this decides whether the door can also be opened from outside.",
  "multi-point": "Throws several bolts up and down the leaf from one turn, pulling a tall door tight.",
  "fire-door": "Devices for openings that must hold a fire back and still let people out.",
  alarmed: "Sounds when the bar is pushed, for a door that is a legal exit but not a normal one.",
  "power-transfer-devices":
    "Carries current from frame to leaf, so an electrified lock keeps working as the door swings.",
  "special-applications": "Devices for openings the standard patterns do not cover.",
  "house-numbers": "Numerals and letters for the outside of the building.",
};

export const OPTION_NOTES_ES: Record<string, string> = {
  "panic-exit-devices":
    "Una barra en la cara interior de la puerta que abre al ser empujada, de modo que quien sale entre una multitud no necesita manilla, ni llave, ni instrucciones.",
  "lock-cases":
    "El mecanismo en sí, embutido en una caja abierta en el canto de la puerta. Las manillas y los cilindros se piden aparte y se montan sobre él.",
  "knob-locks":
    "Cerradura y pomo en un solo conjunto, taladrado a través de la hoja. Es la cerradura más común en puerta interior porque necesita dos taladros y ningún rebaje.",
  "lever-handles":
    "Manillas sobre roseta o placa, para una cerradura que se compra por separado. Una manilla se abre con el codo o con el puño cerrado; un pomo no.",
  "stainless-steel-handles":
    "Tiradores y manillones en acero inoxidable, para accesos y puertas de vidrio donde el tirador es el herraje visible.",
  "night-latches-rim-locks":
    "Se montan sobre la cara de la puerta, no dentro. Cierran al batir, y pueden dejarse en resbalón cuando la puerta debe quedar libre.",
  "door-closers":
    "Controla el barrido de la puerta y la cierra siempre. Necesario donde una puerta no puede quedarse abierta.",
  "brass-steel-hinges":
    "Soporta el peso de la hoja y todo su movimiento. Es la pieza que más se subespecifica, y la primera que falla cuando ocurre.",
  "glass-door-accessories":
    "Herrajes de sujeción, pinzas y cerraduras que agarran el vidrio templado sin marco, sosteniendo la hoja por las esquinas.",
  "lock-cylinders":
    "La parte con llave. Cambiar el cilindro amaestra de nuevo la puerta sin tocar la cerradura.",
  deadbolts:
    "Un pestillo accionado por llave o pomo giratorio, sin muelle detrás, de modo que no puede empujarse hacia dentro. Se instala sobre el resbalón, no en su lugar.",
  "bathroom-accessories":
    "Barras de apoyo, perchas, portarrollos y repisas — los accesorios que un aseo necesita más allá de su puerta.",
  "hardware-accessories":
    "Cerraderos, cuadradillos, tornillos, topes y las piezas que hacen encajar el resto.",
  "grip-handle-sets": "Un manillón largo por fuera con cerradura detrás, para puerta de acceso principal.",
  "sliding-hook-locks":
    "Para hoja corredera, donde un pestillo no puede salir en línea recta. Un gancho gira desde la caja hasta el cerradero.",

  "tubular-locks": "Resbalón y cuadradillo en un tubo estrecho. Menos servicio que la cilíndrica, y más rápida de instalar.",
  "heavy-duty-cylindrical-locks":
    "Un chasis dentro de la puerta con el mecanismo alrededor del cuadradillo. Es el modelo de colegios, hospitales y oficinas, donde una misma puerta se abre miles de veces al año.",
  "light-duty-cylindrical-locks":
    "El mismo modelo, dimensionado para una puerta de vivienda y no para un pasillo en uso constante.",
  "commercial-locks":
    "Cerraduras cilíndricas en las funciones que pide una especificación comercial — aula, almacén, acceso, paso libre.",
  "door-viewers": "Una lente gran angular a través de la hoja, para ver quién llama sin abrir.",
  "door-flush-bolts":
    "Mantiene cerrada la hoja pasiva de una puerta de dos hojas, embutido a haces para que nada sobresalga del canto.",
  "glass-door-handles": "Tiradores pasantes sobre vidrio templado taladrado, sin marco donde fijar.",
  "glass-door-patch-fittings":
    "Herrajes de esquina que aprietan el vidrio templado y alojan el pivote, la cerradura o el travesaño.",
  latches: "El pestillo de muelle que mantiene la puerta cerrada sin bloquearla.",
  "door-stoppers": "Detiene la hoja, y la manilla que lleva, antes de que ninguna alcance la pared.",
  "security-door-guards":
    "Permite abrir unos centímetros sobre un limitador, para hablar con quien llama antes de dejarle pasar.",
  indicators: "Indica libre u ocupado desde fuera, para una cabina o un aseo.",
  "exterior-trim":
    "La manilla exterior de un dispositivo antipánico: la barra funciona desde dentro en cualquier caso, y esto decide si además se puede abrir desde fuera.",
  "multi-point": "Lanza varios puntos arriba y abajo de la hoja con un solo giro, apretando una puerta alta.",
  "fire-door": "Dispositivos para huecos que deben contener el fuego y aun así dejar salir a la gente.",
  alarmed: "Suena al empujar la barra, para una puerta que es salida legal pero no de uso normal.",
  "power-transfer-devices":
    "Lleva corriente del marco a la hoja, para que una cerradura eléctrica siga funcionando mientras la puerta gira.",
  "special-applications": "Dispositivos para huecos que los modelos estándar no cubren.",
  "house-numbers": "Números y letras para el exterior del edificio.",
};

export function noteFor(value: string, locale: "en" | "es" = "en"): string | undefined {
  return locale === "es" ? OPTION_NOTES_ES[value] : OPTION_NOTES[value];
}

/**
 * The configuration as the line a specifier would write on a door schedule.
 *
 * ---------------------------------------------------------------------------
 * This is the piece taken from FSB, and the reason it is worth taking.
 *
 * Their configurator composes an article number in front of you — `12 · 1003 · 02310 ·
 * 0105` — and each segment resolves as you answer. Watching a real identifier assemble is
 * what makes their tool feel like machinery rather than a form, and it is the single most
 * imitable thing on that site.
 *
 * We cannot compose an article number the way they do: their product images are Cloudinary
 * layer stacks (`l_product-finder:dk:ros:...`) composited per component, and ours are
 * whole-product photographs. But we have something that assembles just as legibly and is
 * more use at the end — THE SCHEDULE LINE. It is the sentence these buyers actually write
 * into a door schedule, and by the last answer they can copy it straight out.
 *
 * Unanswered positions are returned as null rather than dropped, so the line holds its
 * final shape from the first render and the reader can see how many decisions are left
 * without counting steps.
 */
export function specificationLine(
  answers: Answers,
  steps: readonly ConfiguratorStep[] = STEPS,
): { key: StepKey; value: string | null }[] {
  return steps.map((step) => ({
    key: step.key,
    value: answers[step.key] ?? null,
  }));
}
