import assert from "node:assert/strict";
import test from "node:test";
import { parseCandex } from "./parse-candex.mjs";

const row = (rows, key) => rows.find((r) => r.key === key)?.value;

test("a lock: faceplate, case, levers and sheet from the factory's wording", () => {
  const rows = parseCandex("PASADOR RECTANGULAR FRENTE DE HIERRO\nDe 2.25x25x220 mm. Con 4 placas de hierro de 2 mm, picaporte entero, caja de 14x65x140 mm, chapa de 1.5 mm ZINCADA AZUL.");
  assert.equal(row(rows, "faceplate"), "2.25 × 25 × 220 mm");
  assert.equal(row(rows, "case"), "14 × 65 × 140 mm");
  assert.equal(row(rows, "levers"), "4 × 2 mm");
  assert.equal(row(rows, "sheet"), "1.5 mm");
});

test("the case is never mistaken for the faceplate when no faceplate is stated", () => {
  const rows = parseCandex("CORTINA METALICA\nPara 2 fallebas. Con 6 placas de Bronce de 2 mm, caja de 20x60x158 mm, chapa de 1.5 mm.");
  assert.equal(row(rows, "faceplate"), undefined);
  assert.equal(row(rows, "case"), "20 × 60 × 158 mm");
});
