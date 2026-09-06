/**
 * SVG primitives for a dimensioned line drawing.
 *
 * ---------------------------------------------------------------------------
 * WHY SVG AND WHY 1:1
 *
 * The catalogue's product page has one hole FSB's fills and ours cannot: a dimensioned
 * line drawing. It is the thing a specifier actually reads — a photograph tells you what
 * a part looks like, a drawing tells you whether it fits.
 *
 * Everything here is drawn in MILLIMETRES and mapped to the viewBox by a single scale, so
 * the geometry on screen is the geometry in the record. A drawing whose proportions were
 * eyeballed would be worse than no drawing: it invites a reader to measure off it, and
 * every measurement would be wrong.
 *
 * SVG rather than a raster because a drawing is line art — it has to stay sharp when a
 * specifier zooms in to check a hole, and it has to print. It is also text, so the
 * dimensions inside it are readable by a crawler.
 *
 * ---------------------------------------------------------------------------
 * WHAT A DIMENSION LINE IS MADE OF
 *
 * Four parts, and all four matter for it to read as engineering rather than decoration:
 *
 *   extension lines   thin, from the feature, with a small gap so they do not touch it
 *   dimension line    between them, with arrowheads that stop ON the extension lines
 *   the figure        centred, in a gap in the line, never sitting on top of it
 *   units             stated once per drawing, not repeated on every figure
 */

/** Drawing ink. Deliberately not pure black: a 0.35mm line in #000 reads as heavier. */
export const INK = "#16150f";
export const THIN = "#8e8a80";
export const OUTLINE_W = 1.6;
export const HAIR_W = 0.7;
export const ARROW = 4.2;
/** Gap between the feature and the start of its extension line. */
export const GAP = 3;
/** How far a dimension line sits off the part. */
export const OFFSET = 16;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A closed outline. Points are [x, y] pairs in millimetres. */
export function polygon(points, { fill = "none", stroke = INK, width = OUTLINE_W } = {}) {
  const d = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  return `<path d="${d} Z" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"/>`;
}

export function rect(x, y, w, h, opts = {}) {
  return polygon([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], opts);
}

export function circle(cx, cy, r, { fill = "none", stroke = INK, width = OUTLINE_W } = {}) {
  return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
}

/**
 * A centre line through a feature — the long-short-long dash every drawing uses.
 *
 * Not decoration: it is what tells a reader that the dimension is to the CENTRE of the
 * hole and not to its edge, which for a backset is the whole meaning of the number.
 */
export function centreLine(x1, y1, x2, y2) {
  return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${THIN}" stroke-width="${HAIR_W}" stroke-dasharray="14 3 3 3"/>`;
}

function arrowhead(x, y, angleDeg) {
  const a = (angleDeg * Math.PI) / 180;
  const p = (len, spread) => [
    x + Math.cos(a) * len + Math.cos(a + Math.PI / 2) * spread,
    y + Math.sin(a) * len + Math.sin(a + Math.PI / 2) * spread,
  ];
  const [x1, y1] = p(ARROW, ARROW * 0.28);
  const [x2, y2] = p(ARROW, -ARROW * 0.28);
  return `<path d="M${x.toFixed(2)} ${y.toFixed(2)} L${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)} Z" fill="${INK}"/>`;
}

/**
 * A horizontal dimension between x1 and x2, drawn at height y.
 *
 * `from` is where the extension lines start — the edge of the feature being measured —
 * so the line reaches back to the part instead of floating beside it.
 */
export function dimH(x1, x2, y, label, { from = y, textSize = 11 } = {}) {
  const lo = Math.min(x1, x2);
  const hi = Math.max(x1, x2);
  const mid = (lo + hi) / 2;
  const width = String(label).length * textSize * 0.56;
  const dir = from < y ? 1 : -1;

  return [
    `<line x1="${lo}" y1="${from + GAP * dir}" x2="${lo}" y2="${y + 4 * dir}" stroke="${THIN}" stroke-width="${HAIR_W}"/>`,
    `<line x1="${hi}" y1="${from + GAP * dir}" x2="${hi}" y2="${y + 4 * dir}" stroke="${THIN}" stroke-width="${HAIR_W}"/>`,
    `<line x1="${lo}" y1="${y}" x2="${mid - width / 2 - 4}" y2="${y}" stroke="${INK}" stroke-width="${HAIR_W}"/>`,
    `<line x1="${mid + width / 2 + 4}" y1="${y}" x2="${hi}" y2="${y}" stroke="${INK}" stroke-width="${HAIR_W}"/>`,
    arrowhead(lo, y, 0),
    arrowhead(hi, y, 180),
    `<text x="${mid}" y="${y + textSize * 0.35}" font-size="${textSize}" fill="${INK}" text-anchor="middle" font-family="'Archivo','Helvetica Neue',Arial,sans-serif">${esc(label)}</text>`,
  ].join("\n    ");
}

/** A vertical dimension between y1 and y2, drawn at x. */
export function dimV(y1, y2, x, label, { from = x, textSize = 11 } = {}) {
  const lo = Math.min(y1, y2);
  const hi = Math.max(y1, y2);
  const mid = (lo + hi) / 2;
  const height = textSize * 1.4;
  const dir = from < x ? 1 : -1;

  return [
    `<line x1="${from + GAP * dir}" y1="${lo}" x2="${x + 4 * dir}" y2="${lo}" stroke="${THIN}" stroke-width="${HAIR_W}"/>`,
    `<line x1="${from + GAP * dir}" y1="${hi}" x2="${x + 4 * dir}" y2="${hi}" stroke="${THIN}" stroke-width="${HAIR_W}"/>`,
    `<line x1="${x}" y1="${lo}" x2="${x}" y2="${mid - height / 2}" stroke="${INK}" stroke-width="${HAIR_W}"/>`,
    `<line x1="${x}" y1="${mid + height / 2}" x2="${x}" y2="${hi}" stroke="${INK}" stroke-width="${HAIR_W}"/>`,
    arrowhead(x, lo, 90),
    arrowhead(x, hi, -90),
    `<text x="${x}" y="${mid}" font-size="${textSize}" fill="${INK}" text-anchor="middle" dominant-baseline="central" transform="rotate(-90 ${x} ${mid})" font-family="'Archivo','Helvetica Neue',Arial,sans-serif">${esc(label)}</text>`,
  ].join("\n    ");
}

/** A leader pointing at a feature, for a diameter or a note. */
export function leader(x, y, tx, ty, label, { textSize = 11 } = {}) {
  const anchor = tx < x ? "end" : "start";
  const pad = tx < x ? -4 : 4;
  return [
    `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="${THIN}" stroke-width="${HAIR_W}"/>`,
    `<circle cx="${x}" cy="${y}" r="1.6" fill="${INK}"/>`,
    `<text x="${tx + pad}" y="${ty}" font-size="${textSize}" fill="${INK}" text-anchor="${anchor}" dominant-baseline="central" font-family="'Archivo','Helvetica Neue',Arial,sans-serif">${esc(label)}</text>`,
  ].join("\n    ");
}

/**
 * Wraps the drawing in an SVG that scales to its container and works in both themes.
 *
 * `currentColor` is not used: a technical drawing has to stay legible, and inheriting a
 * page's text colour would put a 0.7mm hairline in whatever grey the surrounding copy
 * happens to be. Instead the ink is fixed and a dark-scheme override lifts it — the same
 * decision the artifacts make, for the same reason.
 */
export function svgDocument({ body, width, height, title, note }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width.toFixed(0)} ${height.toFixed(0)}" role="img" aria-labelledby="t d">
  <title id="t">${esc(title)}</title>
  <desc id="d">${esc(note)}</desc>
  <style>
    .ink { stroke: ${INK}; }
    text { fill: ${INK}; }
    @media (prefers-color-scheme: dark) {
      path, line, circle { stroke: #e9e5da; }
      path[fill]:not([fill="none"]) { fill: #e9e5da; }
      text { fill: #e9e5da; }
    }
  </style>
  <g>
    ${body}
  </g>
</svg>
`;
}

/** The units note every drawing carries once, bottom-left. */
export function unitsNote(x, y, text = "All dimensions in millimetres") {
  return `<text x="${x}" y="${y}" font-size="10" fill="${THIN}" font-family="'Archivo','Helvetica Neue',Arial,sans-serif">${esc(text)}</text>`;
}
