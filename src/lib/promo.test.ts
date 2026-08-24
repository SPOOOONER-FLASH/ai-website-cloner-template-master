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
    visual: "logo",
  } as PromoCard;

  assert.deepEqual(localisePromoCardCopy(card, "es"), {
    title: "Hable con nosotros",
    titleLight: "About your project",
    body: "Envíe el cuadro de puertas.",
    ctaLabel: "Contactar",
  });
});
