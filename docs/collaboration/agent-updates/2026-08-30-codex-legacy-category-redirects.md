# Codex: legacy category redirects

- Agent: Codex, completing Kimi's finished Bing redirect mapping.
- Scope: preserve eleven evidence-backed legacy `tid` destinations, route the merged door-hinge product to `brass-steel-hinges`, and regenerate the Nginx include from its source script.
- Validation: `node scripts/build-legacy-redirects.mjs` regenerated the checked-in file; `git diff --check` passed; all mapped category, company and contact destinations exist in the current static export.
- Untouched: Kimi's metadata/SEO pages, product content, watermarked originals, Cloudflare settings and unrelated deployment files.
- Production note: the Nginx include must be installed and pass `nginx -t` before reload; source deployment alone does not activate server-side legacy redirects.
