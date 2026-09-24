#!/usr/bin/env node
/**
 * Re-collects the competitor copy the three market style guides were written from.
 *
 * docs/copy/style-guides/ describes how US, Latin-American and Brazilian hardware
 * manufacturers write. Those descriptions are only as good as the pages behind them, so
 * the page list lives here and the pages can be fetched again whenever someone asks
 * "is that still how Kallay writes?".
 *
 * The output goes to tmp/claude-copy-corpus/ (gitignored) on purpose: it is other
 * companies' copyrighted text, collected to be read and analysed, never to be committed
 * or pasted onto our pages.
 *
 *   node scripts/collect-copy-corpus.mjs            # all markets
 *   node scripts/collect-copy-corpus.mjs br mx      # only these markets
 *
 * Pages behind a Cloudflare bot check (Hager, Pado, Stam, Imab, Allegion brands,
 * Grainger, Home Depot MX) are listed in the README as not sampled. Do not work around
 * the check; pick an open company with the same position instead.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const PAGES = {
  us: [
    "https://www.baldwinhardware.com/",
    "https://www.baldwinhardware.com/products/c/door-knobs-levers-roses",
    "https://www.emtek.com/",
    "https://www.emtek.com/all-products/door-hardware/deadbolts/",
    "https://www.fsb.de/en/",
    "https://www.assaabloy.com/us/en",
    "https://www.detex.com/",
    "https://www.detex.com/products/life-safety-security-door-hardware/advantex/",
    "https://www.detex.com/products/life-safety-security-door-hardware/value-series/",
    "https://marksusa.com/",
    "https://www.townsteel.com/",
    "https://pbbinc.com/",
    "https://deltana.net/",
  ],
  mx: [
    "https://www.truper.com/",
    "https://www.truper.com/ficha_tecnica/Cerraduras-de-sobreponer-clasicas.html",
    "https://www.truper.com/ficha_tecnica/Cerradura-de-sobreponer-3-barras-8091.html",
    "https://www.phillips.com.mx/",
    "https://www.phillips.com.mx/es/productos/Embutir/x-1100-.html",
    "https://www.helvex.com.mx/",
  ],
  ar: [
    "https://www.kallay.com/",
    "https://www.kallay.com/productos/cerraduras",
    "https://trabex.com/",
    "https://www.fratellicurrao.com.ar/",
    "https://www.easy.com.ar/",
  ],
  pe: [
    "https://cantol.com.pe/",
    "https://cantol.com.pe/sobre-nosotros/",
    "https://cantol.com.pe/producto/candado-clasico-arco-largo-cc-40/",
    "https://forte.com.pe/",
  ],
  br: [
    "https://www.papaiz.com.br/pt/index",
    "https://www.papaiz.com.br/pt/produtos/linha-de-fechaduras",
    "https://www.aliancametalurgica.com.br/",
    "https://www.aliancametalurgica.com.br/produto/fechadura-linie-ext-5051-pf-2/",
    "https://www.soprano.com.br/",
    "https://www.soprano.com.br/acesso-e-seguranca/abertura-e-fechamento/fechaduras-para-portas-de-vidro",
  ],
};

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";

async function get(url) {
  try {
    const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow", signal: AbortSignal.timeout(25000) });
    return { status: res.status, html: await res.text() };
  } catch {
    // Node's fetch rejects some Latin-American TLS chains that curl accepts.
    try {
      return { status: "curl", html: execFileSync("curl", ["-sL", "-k", "--max-time", "25", "-A", UA, url], { encoding: "utf8", maxBuffer: 50e6 }) };
    } catch (error) {
      return { status: `failed: ${error.message}`, html: "" };
    }
  }
}

const text = (s) => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
  .replace(/&#x27;|&#39;|&rsquo;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&[a-z]+;/g, " ")
  .replace(/\s+/g, " ").trim();

function extract(html) {
  const body = html.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, "");
  const all = (re) => [...new Set([...body.matchAll(re)].map((m) => text(m[1])).filter(Boolean))];
  const meta = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i);
  return [
    `TITLE: ${text((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) ?? [, ""])[1])}`,
    `META: ${meta ? text(meta[1]) : ""}`,
    ...["h1", "h2", "h3"].map((h) => `${h.toUpperCase()}: ${all(new RegExp(`<${h}[^>]*>([\\s\\S]*?)<\\/${h}>`, "gi")).filter((t) => t.length < 160).join(" | ")}`),
    ...all(/<(?:p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>/gi).filter((t) => t.length > 40).map((t) => `P: ${t}`),
  ].join("\n");
}

const markets = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(PAGES);
const outDir = "tmp/claude-copy-corpus";
mkdirSync(outDir, { recursive: true });
for (const market of markets) {
  const parts = [];
  for (const url of PAGES[market] ?? []) {
    const { status, html } = await get(url);
    parts.push(`== ${url} [${status}]\n${html ? extract(html) : ""}`);
    console.log(`${market}  ${String(status).padEnd(6)} ${url}`);
  }
  writeFileSync(`${outDir}/${market}.txt`, parts.join("\n\n"));
}
console.log(`\nwritten to ${outDir}/ (gitignored — read it, do not publish it)`);
