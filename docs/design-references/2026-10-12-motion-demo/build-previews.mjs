// Builds the standalone previews into one folder of double-click files: <out>/<name>.html with
// scripts, styles and fonts inlined, and beside them img/ holding the preview's own image folder
// (public/img/<name>/) plus every other image path the page names literally.
//
//   node build-previews.mjs welcome menu finder finder-a finder-b finder-c [--out <dir>]
//
// vite.config.js builds index.html only and belongs to the main demo, so each entry gets its own
// inline config here. Default output: dist/previews/.
import fs from "node:fs";
import path from "node:path";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

const root = import.meta.dirname;
const argv = process.argv.slice(2);
const at = argv.indexOf("--out");
const out = at >= 0 ? path.resolve(argv[at + 1]) : path.join(root, "dist", "previews");
const names = argv.filter((a, i) => !a.startsWith("--") && !(at >= 0 && i === at + 1));
if (!names.length) throw new Error("name at least one preview, e.g. welcome");

const copy = (rel) => {
  const from = path.join(root, "public", rel);
  const to = path.join(out, rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true });
};

fs.mkdirSync(out, { recursive: true });
const missing = [];
for (const name of names) {
  const entry = path.join(root, `${name}.html`);
  if (!fs.existsSync(entry)) throw new Error(`no ${name}.html`);
  const tmp = path.join(root, "dist", `.build-${name}`);
  await build({
    root, base: "./", configFile: false, logLevel: "warn", publicDir: false,
    plugins: [react(), viteSingleFile()],
    build: { outDir: tmp, emptyOutDir: true, rollupOptions: { input: entry } },
  });
  const html = fs.readFileSync(path.join(tmp, `${name}.html`), "utf8");
  fs.writeFileSync(path.join(out, `${name}.html`), html);
  fs.rmSync(tmp, { recursive: true, force: true });

  if (fs.existsSync(path.join(root, "public/img", name))) copy(`img/${name}`);
  for (const ref of new Set(html.match(/img\/[\w\-./]+\.(?:webp|png|jpe?g|svg|mp4|avif)/g) ?? [])) {
    if (fs.existsSync(path.join(root, "public", ref))) copy(ref);
    else missing.push(`${name}: ${ref}`);
  }
  console.log(`built ${name}.html`);
}
// A name built from a template string (img/x/${slug}.webp) shows up here only if its folder was not
// copied whole; anything listed is a real gap in the built preview.
if (missing.length) console.log(`not found under public/:\n  ${missing.join("\n  ")}`);
console.log(`→ ${out}`);
