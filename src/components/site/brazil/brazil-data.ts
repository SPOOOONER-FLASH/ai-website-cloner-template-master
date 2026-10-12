import collection from "@/data/generated/brazil-collection.json";
import type { DoorConfig } from "./DoorDiagram";

/*
  The Brazil panic-bar collection (client 2026-10-12: 「建立一个巴西逃生锁专栏」), built by
  scripts/brazil/build-collection.mjs. Customer brands are kept in the data for tracing only
  and are never rendered (docs/collaboration/tasks/2026-10-12-brazil-panic-bars.md).
*/
export type Lang = "en" | "pt";
export type Family = "single" | "double" | "trim" | "accessory";
export type Colour = "black" | "grey" | "white" | "red" | "silver";
export type Outside = "none" | "lever" | "lever-key";

export interface BrazilItem {
  id: string;
  model: string;
  family: Family;
  door?: DoorConfig["door"];
  locking?: DoorConfig["locking"];
  outside: Outside;
  colours: Colour[];
  nameEn: string;
  namePt: string;
  specs: { labelEn: string; labelPt: string; valueEn: string; valuePt: string }[];
  image: string;
  /** HYDE's own catalogue page, where the model has one. */
  href?: string;
}

export const items = collection as BrazilItem[];

export const FAMILIES: Family[] = ["single", "double", "trim", "accessory"];

export const COLOUR_HEX: Record<Colour, string> = {
  black: "#1d1d1b",
  grey: "#8c8f91",
  white: "#f4f4f1",
  red: "#b22a22",
  silver: "#c9cbcc",
};

export const t = {
  en: {
    title: "Panic bars for Brazil",
    families: {
      single: "Single doors",
      double: "Double doors",
      trim: "Outside levers and locks",
      accessory: "Parts and accessories",
    } satisfies Record<Family, string>,
    familyOne: {
      single: "Single door",
      double: "Double door",
      trim: "Outside access",
      accessory: "Accessory",
    } satisfies Record<Family, string>,
    locking: { lateral: "Side latch", vertical: "Top and bottom rods" },
    outside: { none: "No outside access", lever: "Outside lever", "lever-key": "Outside lever with key" } satisfies Record<Outside, string>,
    colours: { black: "Black", grey: "Grey", white: "White", red: "Red", silver: "Aluminium" } satisfies Record<Colour, string>,
    contact: "Ask for samples and prices",
    contactHref: "/contact/",
  },
  pt: {
    title: "Barras antipânico para o Brasil",
    families: {
      single: "Portas de uma folha",
      double: "Portas de duas folhas",
      trim: "Maçanetas e fechaduras externas",
      accessory: "Peças e acessórios",
    } satisfies Record<Family, string>,
    familyOne: {
      single: "Porta de uma folha",
      double: "Porta de duas folhas",
      trim: "Acesso externo",
      accessory: "Acessório",
    } satisfies Record<Family, string>,
    locking: { lateral: "Trava lateral", vertical: "Travamento vertical" },
    outside: { none: "Sem acesso externo", lever: "Maçaneta externa", "lever-key": "Maçaneta externa com chave" } satisfies Record<Outside, string>,
    colours: { black: "Preto", grey: "Cinza", white: "Branco", red: "Vermelho", silver: "Alumínio" } satisfies Record<Colour, string>,
    contact: "Pedir amostras e preços",
    contactHref: "/pt/contact/",
  },
} as const;

export const itemName = (item: BrazilItem, lang: Lang) => (lang === "pt" ? item.namePt : item.nameEn);

/** One line saying what the bar does, in the order an installer reads it. */
export function functionLine(item: BrazilItem, lang: Lang): string {
  const c = t[lang];
  if (item.family === "trim" || item.family === "accessory") return item.outside !== "none" ? c.outside[item.outside] : c.familyOne[item.family];
  return [c.familyOne[item.family], item.locking ? c.locking[item.locking] : null].filter(Boolean).join(" · ");
}
