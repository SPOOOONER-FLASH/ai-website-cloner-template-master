# Claude · 2026-10-14 · Hardware knowledge base, 8 chapters (task 96)

## What changed

- **New folder `docs/knowledge/hardware/`**: 8 chapters plus a README, about 4,100 lines.
  - Eight research subagents wrote the chapters in parallel from about 250 web sources: manufacturer installation instructions and catalogues, standards summaries, and accessibility guides. They also drew on our own product JSONs, real photos, and the audit verdicts.
  - Each chapter covers 10 things: how it works, installation, what a correct scene looks like, function, materials and processes, teardown, demo shots, our models with data doubts, standards (as background knowledge only), and sources.
  - The 161 uncertain figures are marked 「待核实」.
- **README** sums up the top 10 rules for judging an installation image and the main data problems the client needs to confirm. No product data was changed.
- **`ai-image-standard.md` section 3** now includes the extra judging methods from the knowledge base.
- **Word copies on the desktop**, in `hyde\03-研究与方案\`:
  - `2026-10-14-五金知识库（8章）.docx`: the README and the 8 chapters merged into one file. To rebuild it, concatenate the README and `0*.md`, then run `build-client-runbook-docx.mjs --src`.
  - `2026-10-14-AI出图标准-给美工.docx`: regenerated.

## Risks

- Some sources were read only as search summaries, because several sites blocked fetching.
- GB 50016, GB 50763 and BS 8300 were not read in the original.
- The standards sections must never become a certification claim on the site.

## Next

- After the client confirms the data problems (finish codes, miscategorised products, wording that implies certification), fix the product JSONs.
- Before any new image audit or AI image work, read the relevant chapter first.
