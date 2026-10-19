# 2026-10-13 Claude: "How to verify a door-hardware certificate" (certification guide, ten languages)

- **Why:** the client's Clarity AI-visibility report showed competitors cited for certificate questions and us not. The guide explained what a certificate is, but not where each one is looked up.
- **What:** `certification-and-test-validation-2026` gets a new section before "What we hold, stated plainly":
  - a table of the four documents (CE + notified body number, DoP, ISO 9001, UL listing), with who issues each, where it is checked and what must match;
  - the NANDO lookup, and test report vs certificate of constancy of performance vs DoP (EN 1125, EN 179, EN 16034 / EN 1634-1);
  - ISO 9001: the IAF MLA accreditation bodies (UKAS, DAkkS, ANAB, CNAS), IAF CertSearch, the CNCA lookup, the three-year cycle;
  - UL Product iQ by file number, and that a Recognized Component is not a listing;
  - tested vs certified vs listed, and four red flags at the lookup stage.
  - Plus two FAQ entries.
- **HYDE claim:** only what the site already states: the stamping plant holds ISO 9001:2015, certificate 69125Q0026**** (masked), valid to 29 October 2028, available on request. The plant is not named. Nothing on QC process, prices or suppliers.
- **Languages:** en/es/pt on the record; fr/de/ja/ko/tr/ru/ar overlays. Overlay `sourceHash.body` moved to the new English hash (it was current). `faq` was already stale before this change and is left stale.
- **Checks:**
  - pass: `npm run content`, i18n-lint, titles:check, us-spelling, regional-terms;
  - pass: article-catalogue-claims, guide-library and article-description-length (8/8; sparse checkout widened with `public/images/drawings` and `door-prep`);
  - pass: article-faq.
- **Not done:** no `out/` build. HYDE release (`release:hyde`) is for whoever holds the baton.
