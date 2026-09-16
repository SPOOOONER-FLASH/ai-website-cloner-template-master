# Codex — 311 and studio release

Client asked to continue. Source selection is in 9427c7ef5f4 (pushed). Final follow-up also excludes 305 from the homepage demand rail while retaining historical ranking inputs and the product page. Native atlas uses 311 in EN/ES home and Products. Added responsive 320/480/640/840 derivatives for the two direct atlas product photographs; this resolved the initial export performance test failure.

Final verification: 304 tests passed, TypeScript passed, and npm run deploy:prep completed successfully including export performance, SEO, full internal-link checks and source freshness. check-311-studio-export.mjs passed for all four home/Products pages and the two bilingual studio additions. check-product-model-export.mjs still passes for all six model product pages, both libraries and exact download bytes. Browser previously confirmed the actual 311 overview on home/Products.

Complete out/ and out-rayen/ exports are included, including newly generated model and image files. Background edits selected for publication remain only 311 warm grey and 9001 warm stone; rejected 307/70SN/full-atlas images are not shipped. Other sessions' product/specification changes and generated source were not staged by Codex. Git push and server pull are separate; no Cloudflare purge was performed.
