import assert from "node:assert/strict";
import test from "node:test";
import type { PromoCard } from "@/data/types";
import { localisePromoCardCopy, selectActivePromoCard } from "./promo.ts";

const cards = [
  { ctaHref: "/contact/" },
  { ctaHref: "/downloads/catalogue.pdf" },
] as PromoCard[];

test("selectActivePromoCard exposes only the first undismissed offer", () => {
  assert.equal(selectActivePromoCard(cards, [])?.ctaHref, "/contact/");
  assert.equal(
    selectActivePromoCard(cards, ["/contact/"])?.ctaHref,
    "/downloads/catalogue.pdf",
  );
  assert.equal(
    selectActivePromoCard(cards, ["/contact/", "/downloads/catalogue.pdf"]),
    undefined,
  );
});

test("localisePromoCardCopy uses Spanish campaign copy with English fallback", () => {
  const card = {
    title: "Talk to us",
    titleEs: "Hable con nosotros",
    titleLight: "About your project",
    body: "Send the door schedule.",
    bodyEs: "Envíe el cuadro de puertas.",
    ctaLabel: "Contact us",
    ctaLabelEs: "Contactar",
    ctaHref: "/contact/",
    ctaHrefEs: "/es/contact/",
    visual: "logo",
  } as PromoCard;

  assert.deepEqual(localisePromoCardCopy(card, "es"), {
    title: "Hable con nosotros",
    titleLight: "About your project",
    body: "Envíe el cuadro de puertas.",
    ctaLabel: "Contactar",
    ctaHref: "/es/contact/",
    closeLabel: "Cerrar: Hable con nosotros",
  });
});

test("localisePromoCardCopy sends a Spanish campaign to its Spanish route", () => {
  const card = {
    title: "Talk to us",
    titleEs: "Hable con nosotros",
    body: "Send the door schedule.",
    ctaLabel: "Contact us",
    ctaLabelEs: "Contactar",
    ctaHref: "/contact/",
    ctaHrefEs: "/es/contact/",
    visual: "logo",
  } as PromoCard;

  assert.equal(localisePromoCardCopy(card, "es").ctaHref, "/es/contact/");
  assert.equal(localisePromoCardCopy(card, "en").ctaHref, "/contact/");
});

test("localisePromoCardCopy gives the dismiss control a localized name", () => {
  const card = {
    title: "Talk to us",
    titleEs: "Hable con nosotros",
    body: "Send the door schedule.",
    ctaLabel: "Contact us",
    ctaHref: "/contact/",
    visual: "logo",
  } as PromoCard;

  assert.equal(
    localisePromoCardCopy(card, "es").closeLabel,
    "Cerrar: Hable con nosotros",
  );
  assert.equal(localisePromoCardCopy(card, "en").closeLabel, "Close: Talk to us");
});
