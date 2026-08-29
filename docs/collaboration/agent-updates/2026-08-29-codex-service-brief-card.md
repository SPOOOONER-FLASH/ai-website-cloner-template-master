# Codex · Service brief card

| | |
|---|---|
| Scope | Replaced the inert “useful package” aside with a plain-language, fully clickable enquiry brief card |
| UX | The whole panel routes to Contact; existing hover/focus frame, short marker and hard-shadow language remain consistent |
| Tests | `node --test src/lib/services.test.ts`; `npm run typecheck`; `npm run lint -- --max-warnings=0`; browser accessibility tree and overflow check |
| Untouched | Product data, Spanish routes, editorial imagery and generated `out/` until the release build |
| Risk | The card collects no onsite data; it remains a static conversion path to the existing contact workflow |
| Next | Ship the selected D pointer-follow product-image zoom as a separate objective |
