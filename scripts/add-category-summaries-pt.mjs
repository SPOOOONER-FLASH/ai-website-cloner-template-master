#!/usr/bin/env node
/**
 * Adds `summaryPt` to content/categories.json.
 *
 * `namePt` was written on 2026-09-16 and the summary was not, so seventeen Portuguese
 * category pages carried a Portuguese heading over an English standfirst — and the same
 * English sentence went into the meta description and the CollectionPage markup, which is
 * what a search result shows.
 *
 * Keyed on the slug and written only when absent, so a summary somebody improves by hand
 * later survives a re-run. That is the rule from AGENTS.md: a generator with a
 * "fall back to the source value" branch quietly undoes hand-improved output.
 *
 * Usage: node scripts/add-category-summaries-pt.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";

const FILE = "content/categories.json";

const PT = {
  "panic-exit-devices":
    "Barras de empurrar e barras de toque para rotas de fuga, em versões para porta corta-fogo, com alarme, de porta dupla e de travamento em dois pontos.",
  "night-latches-rim-locks":
    "Fechaduras de sobrepor e fechaduras de canto do catálogo Canton, para montagem na face da porta.",
  "stainless-steel-handles":
    "Puxadores e barras de apoio em aço inoxidável para portas de madeira, metálicas e de vidro.",
  "lever-handles":
    "Conjuntos de maçaneta em aço inoxidável e zamak, para portas comerciais e residenciais, em preparação tubular ou de embutir.",
  "knob-locks":
    "Fechaduras de bola cilíndricas e tubulares, nas funções de entrada, banheiro, passagem e comunicação.",
  "bathroom-accessories":
    "Ferragens e acessórios de banheiro do catálogo oficial Canton.",
  "care-grab-bars":
    "Barras de apoio para banheiros acessíveis — articuladas, fixas e em L.",
  "brass-steel-hinges":
    "Linhas de dobradiça em latão, aço inoxidável e aço para portas arquitetônicas.",
  deadbolts: "Trancas de cilindro simples e de cilindro duplo do catálogo Canton.",
  "door-closers":
    "Ferragens de fechamento de porta, inclusive aplicações com mola de piso embutida.",
  "grip-handle-sets":
    "Conjuntos de maçaneta com espelho, puxadores e puxadores embutidos para portas de entrada e de correr.",
  "glass-door-accessories":
    "Ferragens de aperto e puxadores para conjuntos de vidro temperado sem caixilho.",
  "hardware-accessories":
    "Olho mágico, batentes, passa-fios, ferrolhos, indicadores, trincos e protetores de porta.",
  "lock-cases":
    "Caixas de fechadura de embutir em várias combinações de backset, distância entre eixos e linguetas.",
  "lock-cylinders":
    "Cilindros de perfil europeu e com chave, inclusive para sistemas de chave-mestra.",
  "sliding-hook-locks":
    "Ferragens de gancho para portas de correr e perfis estreitos.",
  "floor-springs-and-pivots":
    "Molas de piso, pivôs superiores, molas aéreas e dobradiças hidráulicas para portas pivotantes de madeira, metálicas e de vidro temperado.",
};

const raw = JSON.parse(readFileSync(FILE, "utf8"));
const categories = Array.isArray(raw) ? raw : raw.categories;

let written = 0;
let already = 0;
const missing = [];

for (const category of categories) {
  if (!category.summary) continue;
  if (category.summaryPt) {
    already += 1;
    continue;
  }
  const pt = PT[category.slug];
  if (!pt) {
    missing.push(category.slug);
    continue;
  }
  category.summaryPt = pt;
  written += 1;
}

if (missing.length) {
  console.error(`No Portuguese summary for: ${missing.join(", ")}`);
  console.error("Add it above rather than shipping a half-translated category page.");
  process.exit(1);
}

if (written) writeFileSync(FILE, `${JSON.stringify(raw, null, 2)}\n`);
console.log(`${FILE}: ${written} written, ${already} already had Portuguese.`);
