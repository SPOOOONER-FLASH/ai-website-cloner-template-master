/* Candex product copy → spec rows. Kept apart from build-collection.mjs so it can be tested. */
const num = "\\d+(?:[.,]\\d+)?";
const dims = `(${num})\\s*[x×X]\\s*(${num})\\s*[x×X]\\s*(${num})`;
const mm = (s) => s.replace(",", ".");

/* Spec rows read from the factory's own wording; a value the text does not state is absent. */
export function parseCandex(description) {
  const flat = description.replace(/\n/g, " ");
  const rows = [];
  /* The faceplate is the first "de A×B×C" that is not the case ("caja de …"). */
  const face = [...flat.matchAll(new RegExp(`(caja\\s+)?de\\s*${dims}`, "gi"))].find((m) => !m[1])?.slice(1);
  if (face) rows.push({ key: "faceplate", value: `${mm(face[1])} × ${mm(face[2])} × ${mm(face[3])} mm` });
  const box = flat.match(new RegExp(`caja de\\s*${dims}`, "i"));
  if (box) rows.push({ key: "case", value: `${mm(box[1])} × ${mm(box[2])} × ${mm(box[3])} mm` });
  const levers = flat.match(new RegExp(`(\\d+)\\s*placas de (hierro|bronce)\\s*de\\s*(${num})\\s*mm`, "i"));
  if (levers) rows.push({ key: "levers", value: `${levers[1]} × ${mm(levers[3])} mm`, material: levers[2].toLowerCase() });
  const sheet = flat.match(new RegExp(`chapa de\\s*(${num})\\s*mm`, "i"));
  if (sheet) rows.push({ key: "sheet", value: `${mm(sheet[1])} mm` });
  const bolt = flat.match(/PASADOR\s+(RECTANGULAR|REDONDO|LARGO|CORTO)?\s*(?:Ø\s*(\d+)\s*MM)?/i);
  if (bolt && (bolt[1] || bolt[2])) rows.push({ key: "bolt", shape: (bolt[1] ?? "redondo").toLowerCase(), value: bolt[2] ? `Ø ${bolt[2]} mm` : "" });
  return rows;
}
