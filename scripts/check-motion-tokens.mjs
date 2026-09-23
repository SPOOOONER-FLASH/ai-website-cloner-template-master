import { readFileSync } from "node:fs";

const components = [
  "src/components/site/HeroCarousel.tsx",
  "src/components/site/SiteHeader.tsx",
  "src/components/site/LocalePicker.tsx",
  "src/components/site/SearchDialog.tsx",
  "src/components/site/ProductImageZoom.tsx",
];

const failures = [];
for (const file of components) {
  const source = readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  if (/\bduration-(?:\d+|\[\d+)/.test(source) || /\b\d+(?:\.\d+)?ms\b/.test(source)) {
    failures.push(`${file}: use a named --motion-* token for UI timing`);
  }
}

const globalCss = readFileSync("src/app/globals.css", "utf8");
const motionBlock = globalCss
  .split("/* -- Hero carousel")[1]
  ?.split("/* -- Module stack")[0]
  ?.replace(/\/\*[\s\S]*?\*\//g, "");
if (!motionBlock || /\b\d+(?:\.\d+)?ms\b/.test(motionBlock)) {
  failures.push("src/app/globals.css: carousel, overlays and image zoom must use --motion-* tokens");
}

const guideCss = readFileSync("src/components/site/GuideEditorial.module.css", "utf8");
if (/\b\d+(?:\.\d+)?ms\b/.test(guideCss)) {
  failures.push("src/components/site/GuideEditorial.module.css: use the shared motion tokens");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Motion token guard passed for audited components and styles.");
}
