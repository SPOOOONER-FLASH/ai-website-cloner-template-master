# Codex — hinge taxonomy production redirects

- Scope: added origin-level 301 rules for the retired `door-hinges` category and its two product URLs.
- Reason: the Next static export contains client-side redirect documents, but the public origin otherwise returns HTTP 200 to non-JavaScript crawlers.
- Validation: deploy the file to the Cantonlock Nginx extension directory, run `nginx -t`, reload, then verify all three old URLs return one 301 to the canonical `brass-steel-hinges` path.
- Untouched: catalogue content, suffix decoding, related-product logic, cache policy and legacy DedeCMS redirect maps.
