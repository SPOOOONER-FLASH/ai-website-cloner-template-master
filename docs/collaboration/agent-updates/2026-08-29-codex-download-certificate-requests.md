# Codex — certificate requests in Downloads

- **Scope:** the Downloads page now lists all three verified Canton Hyland certificate/report records with issuer, reference, issue date and exact model scope.
- **Access boundary:** the current scans remain request-only because the issuer text restricts redistribution; the page routes each record to a prefilled certificate enquiry instead of presenting a misleading or incomplete public PDF.
- **Quality:** also removed the remaining React ref-cleanup warning from the product large-image viewer.
- **Tests:** `npm test` (81 passed), `npm run typecheck`, `npm run lint`, `git diff --check`.
- **Untouched:** no product certification mapping, KALE document, Spanish product route, navigation preview, image watermark or generated `out/` was changed in this source commit.
- **Next:** build the static release, publish it, and verify all three request rows at the public edge.
