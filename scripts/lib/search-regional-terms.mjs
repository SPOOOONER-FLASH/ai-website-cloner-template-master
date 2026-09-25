/**
 * Spanish and Portuguese words for each HYDE category, added to the search haystack.
 *
 * WHY. cantonlock.com has one search index, built from the English records, and the /es/ and
 * /pt/ pages fetch that same file. So on 2026-09-24 a buyer on the Spanish site who typed
 * "manija" or "cerradero" — the words our own Spanish pages use — got nothing, and a Brazilian
 * typing "puxador" got nothing either. The pages were translated; the search was not.
 *
 * WHAT GOES IN. For each top-level category: the page word in Latin American Spanish and in
 * Brazilian Portuguese (the register fixed by scripts/normalize-regional-terms.mjs), plus the
 * regional variants a buyer may type but our pages deliberately do not print — Mexican
 * `jaladera` and `contrachapa`, peninsular `manilla` and `pomo`, European Portuguese `aro`.
 * Search should meet the buyer's word; the page keeps the neutral one.
 *
 * Keep it to words a buyer would actually search. Every term is repeated on every product in the
 * category, so a long list costs index size on each of ~520 entries.
 */
export const REGIONAL_TERMS = {
  "panic-exit-devices": "barra antipánico barra antipânico dispositivo de salida barra de empuje",
  "night-latches-rim-locks": "cerradura de sobreponer fechadura de sobrepor",
  "stainless-steel-handles": "manija tirador jaladera maçaneta puxador inoxidable inox",
  "lever-handles": "manija manilla maçaneta palanca",
  "knob-locks": "perilla pomo cerradura de perilla maçaneta bola",
  "bathroom-accessories": "accesorios de baño acessórios de banheiro",
  "brass-steel-hinges": "bisagra bisagras dobradiça dobradiças",
  deadbolts: "cerrojo trava tetra",
  "door-closers": "cierrapuertas cierra puertas mola aérea",
  "grip-handle-sets": "tirador jaladera puxador manija",
  "glass-door-accessories": "puerta de vidrio porta de vidro tirador puxador",
  "hardware-accessories": "cerradero contrachapa contra-testa tope batedor",
  "lock-cases": "cerradura de embutir fechadura de embutir caja de cerradura caixa de fechadura",
  "lock-cylinders": "cilindro cilindro europeo cilindro europeu bombín miolo",
  "sliding-hook-locks": "cerradura de gancho puerta corrediza fechadura de gancho porta de correr",
};

/** Terms for a product or category whose top-level category slug is `slug` (empty if none). */
export const regionalTermsFor = (slug) => REGIONAL_TERMS[slug] ?? "";

/**
 * Words buyers type for a material that are not the material's name (2026-09-24).
 *
 * Buyers in many markets call brass hardware "copper" — a "copper hinge" is a brass hinge in
 * their vocabulary (the client, 2026-09-24: 「brass hinge 也叫 copper hinge，不同国家人叫法不同」).
 * Pure copper is too soft to carry a door, so no product of ours is copper and no page says so.
 * Search should still meet the buyer's word: a brass record gets "copper" (and the Spanish and
 * Portuguese words) in its haystack only, never in its visible copy.
 */
export const materialTermsFor = (material) =>
  /\bbrass\b/i.test(material ?? "") ? "copper cobre latón latão" : "";
