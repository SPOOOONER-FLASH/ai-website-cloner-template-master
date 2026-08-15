/**
 * P1 — homepage imagery.
 *
 * Downloads the 11 homepage photos from the Pexels CDN and fits each one into a
 * 300 KB budget.
 *
 * Strategy: 2x the display size is the target, but two of the large heroes cannot
 * reach 300 KB at 2x without crushing JPEG quality into visible artefacts. So the
 * search walks DIMENSIONS DOWN FIRST (2.0x -> 1.0x) and only then quality, with a
 * hard quality floor of 60. A slightly smaller image at honest quality beats a
 * full-size one that looks broken.
 *
 * Cropping happens on the CDN (`fit=crop` with explicit w/h), so each file arrives
 * at exactly the aspect ratio its slot expects — no local processing, no letterboxing.
 *
 * Re-runnable: existing files are overwritten.
 *
 *   node scripts/download-homepage-images.mjs
 */
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = "public/images";
const MAX_BYTES = 300 * 1024;
const SCALES = [2, 1.75, 1.5, 1.25, 1];
const QUALITIES = [78, 68, 60];

/**
 * `w`/`h` are the CSS pixel size the slot renders at on a 1512px viewport.
 * `base` is the photo's real CDN path, read from its og:image — it is NOT derivable
 * from the id. Older photos use `pexels-photo.jpg` with no id suffix (e.g. 16515).
 */
const SLOTS = [
  // --- Heroes ---
  { file: "hero-architectural-door-handle.jpg", id: "16515", base: "https://images.pexels.com/photos/16515/pexels-photo.jpg", w: 1440, h: 696 },
  { file: "hero-product-collection.jpg", id: "13620442", base: "https://images.pexels.com/photos/13620442/pexels-photo-13620442.jpeg", w: 1440, h: 741 },
  { file: "hero-designed-for.jpg", id: "3276079", base: "https://images.pexels.com/photos/3276079/pexels-photo-3276079.jpeg", w: 970, h: 646 },
  { file: "hero-company-corridor.jpg", id: "7533836", base: "https://images.pexels.com/photos/7533836/pexels-photo-7533836.jpeg", w: 1440, h: 960 },
  { file: "hero-insights-hallway.jpg", id: "6908564", base: "https://images.pexels.com/photos/6908564/pexels-photo-6908564.jpeg", w: 1440, h: 879 },
  // --- 1:1 teaser cards ---
  { file: "card-distributors-lever.jpg", id: "2835653", base: "https://images.pexels.com/photos/2835653/pexels-photo-2835653.jpeg", w: 680, h: 680 },
  { file: "card-specifiers-lever.jpg", id: "8134755", base: "https://images.pexels.com/photos/8134755/pexels-photo-8134755.jpeg", w: 680, h: 680 },
  { file: "project-office-corridor.jpg", id: "8089087", base: "https://images.pexels.com/photos/8089087/pexels-photo-8089087.jpeg", w: 680, h: 680 },
  { file: "project-civic-entrance.jpg", id: "17240673", base: "https://images.pexels.com/photos/17240673/pexels-photo-17240673.jpeg", w: 680, h: 680 },
  { file: "card-contact-glass-doors.jpg", id: "13094990", base: "https://images.pexels.com/photos/13094990/pexels-photo-13094990.jpeg", w: 680, h: 680 },
  { file: "card-faq-white-corridor.jpg", id: "19966755", base: "https://images.pexels.com/photos/19966755/pexels-photo-19966755.jpeg", w: 680, h: 680 },
];

const url = (slot, w, h, q) =>
  `${slot.base}?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}&q=${q}`;

async function fetchAtBudget(slot) {
  let smallest = null;
  for (const scale of SCALES) {
    const w = Math.round(slot.w * scale);
    const h = Math.round(slot.h * scale);
    for (const q of QUALITIES) {
      const res = await fetch(url(slot, w, h, q));
      if (!res.ok) throw new Error(`${slot.file}: HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length <= MAX_BYTES) return { buf, q, w, h, scale };
      if (!smallest || buf.length < smallest.buf.length) smallest = { buf, q, w, h, scale };
    }
  }
  return smallest; // never happened in practice; keeps the function total
}

await mkdir(OUT_DIR, { recursive: true });

const report = [];
// Sequential on purpose: 11 files, and it keeps the CDN happy.
for (const slot of SLOTS) {
  const { buf, q, w, h, scale } = await fetchAtBudget(slot);
  await writeFile(join(OUT_DIR, slot.file), buf);
  const kb = buf.length / 1024;
  const flag = buf.length <= MAX_BYTES ? "ok  " : "OVER";
  report.push({ file: slot.file, w, h, scale, q, kb, over: buf.length > MAX_BYTES });
  console.log(
    `${flag} ${slot.file.padEnd(36)} ${`${w}x${h}`.padEnd(11)} ${scale}x  q=${String(q).padEnd(3)} ${kb.toFixed(1)} KB`,
  );
}

const over = report.filter((r) => r.over);
const total = report.reduce((n, r) => n + r.kb, 0);
const belowTarget = report.filter((r) => r.scale < 2);
console.log(`\n${report.length} files, ${total.toFixed(0)} KB total, largest ${Math.max(...report.map((r) => r.kb)).toFixed(1)} KB`);
console.log(over.length ? `OVER BUDGET: ${over.map((r) => r.file).join(", ")}` : "all within the 300 KB budget");
if (belowTarget.length) {
  console.log(
    `below 2x (budget-limited): ${belowTarget.map((r) => `${r.file} @ ${r.scale}x`).join(", ")}`,
  );
}
