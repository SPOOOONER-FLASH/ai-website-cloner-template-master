#!/usr/bin/env node
/**
 * Layout previews for the BAU 2027 column (client 2026-09-28: three directions, EN and DE each,
 * the client picks one). Static HTML + PNG, not site code: the engineering session builds
 * /bau-2027/ from whichever direction is chosen.
 *
 * Rules (docs/collaboration/tasks/2026-09-28-bau-2027-column.md):
 *   - every string comes from content/bau-2027.json, verbatim;
 *   - photographs are the existing /images/products-hyde/ heroes of the featured models only;
 *     nothing generated, no composited stand render. The cylinder-system entry has no single
 *     model photograph, so it is a text card;
 *   - German runs 20–30% longer than English, so every direction is rendered in both.
 *
 *   node scripts/build-bau-2027-previews.mjs          # writes the HTML
 *   node scripts/build-bau-2027-previews.mjs --png    # also screenshots with local Chrome
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const OUT = "docs/design-references/2026-09-28-bau-2027";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const bau = JSON.parse(readFileSync("content/bau-2027.json", "utf8"));
const products = Object.fromEntries(
  bau.featured.filter((f) => f.slug).map((f) => [f.slug, JSON.parse(readFileSync(`content/products/${f.slug}.json`, "utf8"))]),
);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const img = (slug) => `../../../public${products[slug].heroImage.src.replace("/images/products/", "/images/products-hyde/")}`;
const [label, rest] = [(t) => t.split(":")[0], (t) => t.split(":").slice(1).join(":").trim()];

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&display=swap");
:root{--ink:#11110f;--ink2:#6e6e73;--line:#deddd8;--alt:#f5f5f7;--tint:#efefeb;--dark:#2c2c2e}
*{box-sizing:border-box;margin:0}
body{font-family:Archivo,ui-sans-serif,system-ui,sans-serif;color:var(--ink);background:#fff;font-size:16px;line-height:1.5}
.page{max-width:1440px;margin:0 auto;padding:0 32px}
.bar{display:flex;justify-content:space-between;align-items:center;height:72px;border-bottom:1px solid var(--line);margin-bottom:56px}
.bar img{height:22px}.bar span{font-size:13px;color:var(--ink2);letter-spacing:.02em}
.tag{position:absolute;top:24px;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;font-size:12px;padding:4px 10px;border-radius:2px;z-index:9}
.kicker{font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--ink2)}
h1{font-size:48px;line-height:1.08;font-weight:600;letter-spacing:-.02em;max-width:22ch;text-wrap:balance}
h2{font-size:28px;line-height:1.2;font-weight:600;letter-spacing:-.01em}
.lede{font-size:19px;line-height:1.55;max-width:62ch}
.muted{color:var(--ink2)}
.facts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid var(--ink)}
.facts div{padding:16px 16px 18px 0;border-right:1px solid var(--line);margin-right:16px}.facts div:last-child{border:0}
.facts dt{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink2);margin-bottom:6px}.facts dd{font-size:17px;font-weight:500}
.grid{display:grid;gap:24px}.g3{grid-template-columns:repeat(3,minmax(0,1fr))}.g2{grid-template-columns:repeat(2,minmax(0,1fr))}
.card{border:1px solid var(--line);background:#fff;display:flex;flex-direction:column}
.card figure{aspect-ratio:1/1;background:#fff;border-bottom:1px solid var(--line)}.card figure img{width:100%;height:100%;object-fit:contain;display:block}
.card .t{padding:16px 18px 20px}.card b{display:block;font-size:17px;margin-bottom:4px}.card p{font-size:14px;color:var(--ink2)}
.card.text{background:var(--alt);justify-content:flex-end;min-height:100%}.card.text .t{padding:24px}
.form{background:var(--alt);padding:32px;border:1px solid var(--line)}
.form h2{margin-bottom:8px}.form .i{color:var(--ink2);margin-bottom:24px;font-size:15px}
.f{display:grid;grid-template-columns:1fr 1fr;gap:16px 16px}.f .w{grid-column:1/-1}
label{display:block;font-size:13px;font-weight:600;margin-bottom:6px}
.in{height:44px;border:1px solid #c9c8c2;background:#fff;width:100%}
.ta{height:96px;border:1px solid #c9c8c2;background:#fff}
.chips{display:flex;flex-wrap:wrap;gap:8px}.chip{border:1px solid #c9c8c2;background:#fff;padding:8px 12px;font-size:14px;white-space:nowrap}.chip.on{border-color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
.checks{display:grid;grid-template-columns:1fr 1fr;gap:6px 16px;font-size:14px}.checks span::before{content:"";display:inline-block;width:14px;height:14px;border:1px solid #9a9993;background:#fff;margin-right:8px;vertical-align:-2px}
.btn{display:inline-block;background:var(--ink);color:#fff;font-weight:600;padding:14px 22px;margin-top:8px}
.priv{font-size:13px;color:var(--ink2);margin-top:12px}
.about{display:grid;grid-template-columns:4fr 8fr;gap:48px;border-top:1px solid var(--line);padding-top:32px}
.nc{background:var(--dark);color:#fff;padding:40px;display:flex;justify-content:space-between;align-items:flex-end;gap:32px}.nc p{color:#c7c7cc;max-width:60ch;margin-top:8px}.nc .btn{background:#fff;color:var(--ink);white-space:nowrap}
.sec{margin-top:80px}.sec>h2{margin-bottom:8px}.sec>.muted{max-width:70ch;margin-bottom:28px}
footer{height:80px}
@container pg (max-width:760px){.page{padding:0 16px}h1{font-size:32px}.facts,.g3,.g2,.about,.f,.checks{grid-template-columns:1fr}.facts div{border-right:0;border-bottom:1px solid var(--line);margin-right:0}.nc{flex-direction:column;align-items:flex-start}.split{grid-template-columns:1fr!important}.big{font-size:64px!important}.sticky{position:static!important}}
`;

function blocks(L, lang) {
  const t = bau[lang];
  const facts = `<dl class="facts">${t.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("")}</dl>`;
  const cards = bau.featured
    .map((f) =>
      f.slug
        ? `<article class="card"><figure><img src="${img(f.slug)}" alt=""></figure><div class="t"><b>${esc(label(f[lang]))}</b><p>${esc(rest(f[lang]))}</p></div></article>`
        : `<article class="card text"><div class="t"><p style="color:var(--ink);font-size:16px">${esc(f[lang])}</p></div></article>`,
    )
    .join("");
  // Checkbox labels: the model number alone (the card above carries the description); the
  // cylinder-system entry, which has no model, keeps its own first clause.
  const models = bau.featured.map((f) => (f.slug ? label(f[lang]).split(" ")[0] : f[lang].split(",")[0].split(" sowie")[0]));
  const fm = t.form;
  const form = (compact) => `<section class="form"><h2>${esc(fm.heading)}</h2><p class="i">${esc(fm.intro)}</p><div class="f">
    <div><label>${esc(fm.name)}</label><div class="in"></div></div><div><label>${esc(fm.company)}</label><div class="in"></div></div>
    <div><label>${esc(fm.email)}</label><div class="in"></div></div><div><label>${esc(fm.country)}</label><div class="in"></div></div>
    <div class="w"><label>${esc(fm.day)}</label><div class="chips">${fm.days.map((d, i) => `<span class="chip${i === 1 ? " on" : ""}">${esc(d)}</span>`).join("")}</div></div>
    <div class="w"><label>${esc(fm.time)}</label><div class="chips">${fm.times.map((d, i) => `<span class="chip${i === 2 ? " on" : ""}">${esc(d)}</span>`).join("")}</div></div>
    <div class="w"><label>${esc(fm.products)}</label><div class="checks"${compact ? ' style="grid-template-columns:1fr"' : ""}>${models.map((m) => `<span>${esc(m)}</span>`).join("")}</div></div>
    <div class="w"><label>${esc(fm.message)}</label><div class="ta"></div></div></div>
    <span class="btn">${esc(fm.submit)}</span><p class="priv">${esc(fm.privacy)}</p></section>`;
  const featured = (cols = "g3") => `<section class="sec"><h2>${esc(t.featuredHeading)}</h2><p class="muted">${esc(t.featuredIntro)}</p><div class="grid ${cols}">${cards}</div></section>`;
  const about = `<section class="sec about"><h2>${esc(t.about.heading)}</h2><p class="lede" style="font-size:17px">${esc(t.about.body)}</p></section>`;
  const nc = `<section class="sec nc"><div><h2>${esc(t.notComing.heading)}</h2><p>${esc(t.notComing.body)}</p></div><span class="btn">${esc(t.notComing.cta)}</span></section>`;
  const head = `<p class="kicker">${esc(t.kicker)}</p>`;
  return { t, facts, form, featured, about, nc, head, cards };
}

const LAYOUTS = {
  A: (b, lang) => `
    ${b.head}
    <div class="split" style="display:grid;grid-template-columns:7fr 5fr;gap:48px;align-items:end;margin:20px 0 40px">
      <div><p class="big" style="font-size:132px;line-height:.9;font-weight:700;letter-spacing:-.04em">C4<span style="color:var(--ink2)">·</span>523</p>
      <p style="font-size:34px;font-weight:600;margin-top:18px;letter-spacing:-.01em">${esc(b.t.facts[0].value)}</p></div>
      <div><h1 style="font-size:34px">${esc(b.t.title)}</h1><p class="lede" style="margin-top:16px;font-size:17px">${esc(b.t.intro)}</p></div>
    </div>
    ${b.facts}
    ${b.featured()}
    <section class="sec split" style="display:grid;grid-template-columns:5fr 7fr;gap:48px;align-items:start">
      <div><h2>${esc(b.t.about.heading)}</h2><p style="margin-top:12px;font-size:17px">${esc(b.t.about.body)}</p></div>${b.form(false)}
    </section>
    ${b.nc}`,
  B: (b, lang) => `
    ${b.head}
    <h1 style="margin:14px 0 14px">${esc(b.t.title)}</h1>
    <p class="lede muted" style="margin-bottom:36px">${esc(b.t.intro)}</p>
    <div class="split" style="display:grid;grid-template-columns:8fr 4fr;gap:32px;align-items:start">
      <div><div class="grid g3">${b.cards}</div>
        <section class="sec" style="margin-top:48px">${b.facts}</section>
        ${b.about.replace('class="sec about"', 'class="sec about" style="grid-template-columns:1fr;gap:12px"')}
      </div>
      <div class="sticky" style="position:sticky;top:24px">${b.form(true)}</div>
    </div>
    ${b.nc}`,
  C: (b, lang) => `
    <div class="split" style="display:grid;grid-template-columns:5fr 7fr;gap:56px;align-items:start">
      <div>${b.head}<h1 style="margin:14px 0 16px;font-size:44px">${esc(b.t.title)}</h1><p class="lede" style="font-size:17px">${esc(b.t.intro)}</p>
        <dl style="margin-top:32px;border-top:1px solid var(--ink)">${b.t.facts.map((f) => `<div style="display:grid;grid-template-columns:120px 1fr;gap:16px;padding:12px 0;border-bottom:1px solid var(--line)"><dt class="muted" style="font-size:13px;text-transform:uppercase;letter-spacing:.08em">${esc(f.label)}</dt><dd style="font-weight:500">${esc(f.value)}</dd></div>`).join("")}</dl></div>
      ${b.form(false)}
    </div>
    ${b.featured()}
    ${b.about}
    ${b.nc}`,
};

const NAMES = { A: "A 事实卡优先", B: "B 产品优先", C: "C 预约优先" };
mkdirSync(OUT, { recursive: true });
const files = [];
// Desktop previews are fluid; the phone ones pin the container to 390 px. The narrow rules are
// container queries, so they follow that width, not Chrome's window (headless will not go
// narrower than about 500 px).
const variants = [];
for (const key of Object.keys(LAYOUTS)) for (const lang of ["en", "de"]) {
  variants.push({ key, lang, mobile: false });
  if (lang === "de") variants.push({ key, lang, mobile: true });
}
for (const { key, lang, mobile } of variants) {
  const b = blocks(key, lang);
  const WIDTH = mobile ? "width:390px;margin:0" : "";
  const MOB = mobile ? " · 390px" : "";
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BAU 2027 · ${key} · ${lang.toUpperCase()}</title><style>${CSS}</style></head>
<body><div class="cq" style="container:pg/inline-size;position:relative;margin:0 auto;${WIDTH}"><span class="tag">${NAMES[key]} · ${lang.toUpperCase()}${MOB}</span><div class="page"><header class="bar"><img src="../../../public/images/brand/hyde/hyde-logo-horizontal-black.svg" alt="HYDE"><span>Preview · not a live page</span></header>${LAYOUTS[key](b, lang)}<footer></footer></div></div></body></html>`;
  const file = join(OUT, `${key}-${lang}${mobile ? "-mobile" : ""}.html`);
  writeFileSync(file, html);
  files.push(file);
}
console.log(`wrote ${files.length} previews to ${OUT}`);

if (process.argv.includes("--png") && existsSync(CHROME)) {
  sharp.cache(false);
  const shots = files.map((f) => (f.endsWith("-mobile.html") ? [f, 390, ""] : [f, 1440, "desktop"]));
  for (const [file, width, kind] of shots) {
    const png = file.replace(/\.html$/, kind ? `-${kind}.png` : ".png");
    const tmp = resolve(png + ".tmp.png");
    execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=4000", `--window-size=${width < 800 ? 500 : width},${width < 800 ? 9000 : 4000}`, `--screenshot=${tmp}`, "file:///" + resolve(file).replace(/\\/g, "/")], { stdio: "ignore" });
    // Trim the white run below the last content row.
    const { data, info } = await sharp(readFileSync(tmp)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let last = info.height - 1;
    outer: for (; last > 0; last--) for (let x = 0; x < info.width; x += 3) { const i = (last * info.width + x) * 3; if (data[i] < 245) break outer; }
    await sharp(readFileSync(tmp)).extract({ left: 0, top: 0, width: Math.min(info.width, width), height: Math.min(info.height, last + 48) }).png().toFile(png);
    execFileSync("cmd", ["/c", "del", tmp.replace(/\//g, "\\")]);
    console.log(`${png}  ${info.width}×${last + 48}`);
  }
}
