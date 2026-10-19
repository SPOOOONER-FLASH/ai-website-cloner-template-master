#!/usr/bin/env node
/*
  Crawl candex.com.ar's public catalogue into tmp/claude-argentina/raw/ (gitignored).

  Client 2026-10-10: Candex and Elabora are HYDE's OEM customers; the moulds are HYDE's and
  the client states both have authorised use of their photos and copy for an Argentina
  collection on cantonlock.com. This only collects — nothing here publishes.

    node scripts/argentina/crawl-candex.mjs            → raw/candex.json + raw/candex-img/*
*/
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

const OUT = join("tmp", "claude-argentina", "raw");
const IMG = join(OUT, "candex-img");
mkdirSync(IMG, { recursive: true });

const text = (html) => html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ")
  .replace(/&#8211;/g, "–").replace(/&#215;/g, "×").replace(/&amp;/g, "&").replace(/[ \t]+/g, " ")
  .split("\n").map((l) => l.trim()).filter(Boolean).join("\n");
const pick = (html, re) => html.match(re)?.[1] ?? null;

const sitemap = await (await fetch("https://candex.com.ar/product-sitemap.xml")).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+\/catalogo\/[^<]+)<\/loc>/g)].map((m) => m[1]);

const products = [];
for (const url of urls) {
  const html = await (await fetch(url)).text();
  const title = text(pick(html, /property="og:title" content="([^"]+)"/) ?? "").replace(/\s*-\s*Candex.*$/, "");
  const category = text(pick(html, /posted_in">([\s\S]*?)<\/span>/) ?? "").replace(/^Categor[ií]as?:\s*/, "");
  const description = text(pick(html, /id="tab-description"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/) ?? "")
    .replace(/^Descripción del producto\s*/, "");
  const gallery = [...html.matchAll(/woocommerce-product-gallery__image[^>]*>\s*<a href="([^"]+)"/g)].map((m) => m[1]);
  const images = [...new Set([pick(html, /property="og:image" content="([^"]+)"/), ...gallery].filter(Boolean))];
  for (const src of images) {
    const file = join(IMG, basename(new URL(src).pathname));
    if (!existsSync(file)) writeFileSync(file, Buffer.from(await (await fetch(src)).arrayBuffer()));
  }
  products.push({ source: "candex", url, slug: url.split("/catalogo/")[1].replace(/\/$/, ""), title, category, description,
    images: images.map((s) => basename(new URL(s).pathname)) });
  console.log(`${products.length}/${urls.length} ${title} — ${images.length} img`);
}
writeFileSync(join(OUT, "candex.json"), JSON.stringify(products, null, 2) + "\n");
console.log(`wrote ${products.length} products`);
