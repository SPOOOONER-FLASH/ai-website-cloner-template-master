# 2026-10-12 指南/新闻 → 产品：实施方案（目标 #166、#167）

> 来源：多代理调研 + 三方案评审（wf_323a996a-00c）。阶段 1 已在 2026-10-12 实现（见文末「进度」）。客户问题在「Client questions」一节。

# Article → product routes: final implementation spec

Basis: read-only checks against `tmp/ship-merge` at `f0b553de5d9b`. `out/` predates `9cb095fa7bc2`. Nothing was edited, built or committed.

## 1. Scores

10 is best on every axis. For implementation risk, 10 means safest.

| | Buyer confidence | Click-through to products | AI-search benefit | Implementation risk | Honesty | Total |
|---|---|---|---|---|---|---|
| **trust-first** | 9 | 7 | 5 | 7 | 10 | **38** |
| **conversion-first** | 7 | 9 | 6 | 4 | 8 | **34** |
| **ai-search-first** | 8 | 8 | 9 | 5 | 8 | **38** |

**trust-first**
- **For:** the best honesty discipline. The certificates row is kept away from the cards, the claim cleanup comes first, and there are no new translation keys.
- **Against:**
  - The quote link uses a query string with `nofollow`. That adds about 820 new nofollow parameter links and makes Ahrefs finding (a) worse.
  - It has no machine-readable layer.
  - It keeps the heading "Products mentioned" in the new block, which is inaccurate on about half the articles (next bullet).
- **Checked:** only 123 of the 246 `relatedModels` appear verbatim in the article body. finish-codes names none of its three models.

**conversion-first**
- **For:**
  - Placement tags.
  - Fragment prefill.
  - `source_article` on the lead.
  - The `UL 305` standard-prefix guard.
  - Validated next-step enums.
- **Against:**
  - It has the most surfaces: aside strips, a rail quote link, a hero link, and a refactor of `ArticleBody` `figure → inserts`. That is the most decoration risk.
  - It plans `mentions` as typed `Product` nodes. That would copy the Product rich-result error onto 820 article pages.

**ai-search-first**
- **For:**
  - `@id`-only `mentions`.
  - `llms.txt` model lists.
  - Fragment prefill.
  - A capped left rail.
- **Against:**
  - It rewrites `relatedModels` through a generated JSON plus a loader that throws on missing slugs. That is a new build-failure surface, it can hit the Windows CRLF problem, and it puts about 110 unreviewed auto-matches into product→article backlinks.
  - Its category ranges for the zero-model guides were guessed from term counts, not from reading the guides.

## 2. What the final plan takes from each

| Taken | From |
|---|---|
| Claim cleanup on product pages ships **in the same release** as the first new link, locked by a guard test | all three (scope from trust-first) |
| End-of-article block placed after the FAQ, in the existing spec-row style; at most 3 cards | trust-first cap, conversion-first/ai-search placement |
| Block heading **"Related products"**, not "Products mentioned" | new. The key exists in all 7 overlay `ui.json` files; es/pt via `tx` |
| Quote link prefilled through the fragment (`/contact/#model=…&from=…`), no `nofollow`, no new parameter URLs | conversion-first, ai-search-first |
| One curated `next` per article from a validated enum; unknown kind throws | conversion-first |
| Certificates is a `next` kind with the scope label "Verified model-scoped reports". No per-card certificate line until the client confirms model mappings | trust-first |
| Prose links: first mention only. Models with a letter and a digit only; bare numbers never linked in prose (`UL 305`, `564mm`) | trust-first, conversion-first guard |
| Table row-header links: whole cell must equal the model. A digit-only model links only if it is in that article's `relatedModels` (needed for the exit-device table) | conversion-first |
| `relatedModels` stays the single source of truth. A report script lists auto-matched models for an editor to add by hand. No generated mapping | trust-first |
| `llms.txt` model lists, `@id`-only JSON-LD `mentions`, guide hero links to its product | ai-search-first |
| Measurement: fix the locale prefix in `pageType`, add `data-link-list`, add `source_article` | trust-first, conversion-first |
| **Rejected by all three, still rejected:** promo dialog on guides, sticky quote bar on phones, logo walls, carousels, typed `Product` in `mentions`, fuzzy model matching | — |
| **Rejected here:** inline aside strips (decoration plus layout refactor), quote link in the guide's left rail (duplicates the TOC anchor) | — |

## 3. Rules for every stage

- **Never invent a fact.**
  - Cards show only what `ProductCard`/`cardFigure` already render from the product record.
  - Counts come from `publishedProducts` and are never typed.
  - No certificate is shown next to a product.
- **No Chinese on HYDE pages.** `audit-no-chinese` stays in `test:export`.
- **Locale strings.** Reuse existing keys only:
  - Checked in all 7 overlays: "Related products", "Request a quote", "Ask a question", "Next step", "Compare {name}", "See all {count} {name}", "Certificates", "Verified model-scoped reports", "Downloads", "Read next".
  - Checked in fr/ja/ar only: "Finish codes", "Price list", "Documents".
  - es/pt strings are inline in `tx(locale, en, {es, pt})`, copied from their existing use: `ProductsEditorialOverview` ("El siguiente paso" / "O próximo passo"), `ProductDetail` ("Solicitar cotización" / "Pedir orçamento"), `SiteHeader` (certificates).
  - Then run `node scripts/i18n-extract-ui.mjs && node scripts/i18n-lint.mjs`.
- **Ownership and coordination.**
  - `NewsDetail.tsx` and `GuideCover.tsx` sit under a Codex "guides DCB" row in NOW.md dated 09-22. That row is stale: the last `NewsDetail` commit was `cee95849e6ef` on 10-09. Carry on and announce the change in the agent-update.
  - `content/i18n/**` is claimed by the multilingual session. Stage 1 makes targeted row deletions only. Add a NOW.md row first.
  - Never run a full `translate-products` regeneration.
  - RAYEN lane: do not touch.
- **E1 title experiment** (readout 2026-10-14): leave `seoTitle*`/`seoDescription*` alone on `door-preparation-161-and-86-2026`, `door-hardware-hs-codes-2026` and `glass-door-thickness-and-cutouts-2026`. The block is code-wide, so these pages get it too. Record that confound in the agent-update.
- **Commit, push, release.**
  - Commit: `git commit -F <msgfile> -- <paths>`, then `npm run ship`.
  - Release: `npm run release:hyde` on the johns machine, then check `git status --short out/ | grep -c '^??'` reads 0.
  - End with one line reminding the client to purge.

---

## Stage 1: today. Claim cleanup plus a buyer block on all 82 articles × 10 locales

### 1A. Claim cleanup on product pages (content only)

| Record | Remove | Also remove from |
|---|---|---|
| `content/products/028-panic-exit-device-trim.json` | feature `"Standards: ANSI Grade 2"` (en l.121, es/pt l.171/178) | 7 overlay `products.json` (fr l.393 etc.) |
| `content/products/5831-sset-heavy-duty-cylindrical-lock.json` | `"Standards: ANSI Grade 3, tested for over 200,000 cycles"` (whole line; the cycle claim goes with it) | 7 overlays (fr l.4830) |
| `content/products/black-tubular-lever-lock-set.json` | `"Standards: ANSI Grade 3"` | 7 overlays (fr l.16053) |
| `300-panic-exit-device.json`, `307-panic-exit-device.json`, `310-panic-exit-device.json` | spec row `label: "Fire Rating"` (en, es, pt) | 7 overlay spec rows (fr l.1610/1954/2160), at the same index so `spec-table-parity` passes |
| The 19 HYDE records with ISO 9001 in `certifications[]`: 023 ETAN, 305, 309-D, 314, 317, 320, 600, Black Tubular Lever Lock Set, Cylindrical Knob Lock, Glass Door Patch Fitting Set, Keyed Deadbolt Lock Set, Night Latch & Rim Lock, Stainless Steel Door Hinge, Stainless Steel Flush Bolt, Stainless Steel Glass Door Pull Handle, Stainless Steel Lever Handle Lock, Stainless Steel Wall Hook, Tubular Knob Lock, Wooden Door Floor Hinge | the ISO 9001 entry (this removes "The 305 holds ISO 9001 (ISO 9001:2015)" from the product FAQ and from the `ProductDetail.tsx:846` certifications section) | overlay FAQ strings, if any are stored (grep `ISO 9001` in `content/i18n/*/products.json`) |

- The company-level wording "ISO 9001 since 2002" stays.
- The 200,000-cycle rows (85 records), the "Fire Door" name on 305 and "own office in Germany" are **client questions, not edits**.
- After the edits, run `node scripts/i18n-lint.mjs && npm run titles:check`. A count assertion may fire in `hardware-term-usage` / `published-counts`. Read it, and change the test only when the count is genuinely affected.

### 1B. `ArticleBuyerBlock` (new server component)

**Files**
- NEW `src/components/site/ArticleBuyerBlock.tsx`
- `src/components/site/NewsDetail.tsx`:
  - render the block right after the FAQ `section` (about l.418) and before `article.attachment`
  - add a contents entry
  - press-kit heading
  - `download` attribute

**Props:** `{ section, slug, related: Product[], route?: ArticleRoute, locale, base }`. `related` is the list `NewsDetail` already resolves at l.173-176.

**Render order**, inside `<section id="article-products" data-link-list="article-products" class="mt-48">`:
1. **Heading.** `<h2 class="text-h3 text-ink">` reading "Related products". Only when `related.length > 0`.
2. **Cards.** The first 3 `related` as `<ProductCard product locale />` in `grid grid-cols-1 gap-24 sm:grid-cols-2 xl:grid-cols-3 mt-24`. This is the `ProjectDetail.tsx:204-206` pattern.
3. **Remaining models.** If `related.length > 3`, the rest go in a `<ul class="mt-24 space-y-8">` of `model — localized name` links, using the same markup as the left rail (`NewsDetail.tsx:313-321`).
4. **Contact row.** Always rendered, in the spec-row style (`mt-48 block border-t border-ink pt-16`, kicker span and `short-marker-arrow` label).
   - If `related.length`: label "Request a quote", href `${base}/contact/#` + `new URLSearchParams({ model: related.slice(0,3).map(p=>p.model).join(", "), from: \`${section}/${slug}\` })`. Add `product: tr(p,"name",locale)` only when exactly one product is related.
   - Otherwise: label "Ask a question", href `${base}/contact/#from=…`.
   - No `rel`. No kicker on this row.
5. **Next row.** Only if `route?.next`: kicker "Next step", label and href from `nextLink(route.next, locale, base)`:

| `next` value | href | label |
|---|---|---|
| `compare:<cat>` | `/compare/<cat>/` | `tx("Compare {name}")` with `lower(categoryName)` |
| `category:<cat>` | `/products/<cat>/` | `tx("See all {count} {name}")`, count = published HYDE products in `<cat>` |
| `finishes` | `/finishes/` | "Finish codes" |
| `certifications` | `/certifications/` | "Certificates", plus a second line "Verified model-scoped reports" |
| `price-list` | `/request/price-list/` | "Price list" |
| `documents` | `/documents/` | "Documents" |
| anything else | — | `throw new Error(\`Unknown article next step "${next}" (${section}/${slug})\`)` |

**Two more changes in `NewsDetail.tsx`**
- Contents rail (l.170): when `related.length`, append `{ id: "article-products", text: "Related products", level: 2 }` after the FAQ entry.
- Attachments block (l.497-517):
  - Heading becomes `section === "guides" ? tx(locale,"Downloads",{es:"Descargas",pt:"Downloads"}) : t.pressKit`.
  - Use `download={file.format === "html" ? undefined : true}`, so the printable master-key sheet opens instead of saving.

**Never:** badge, shadow, animation, price, stock, rating, adjective, certificate line, or a `rel="nofollow"`.

### 1C. Fragment prefill in the inquiry form

- NEW `src/lib/inquiry-prefill.ts`: `prefill(search: string, hash: string) → { product, model, from }`.
  - The query string wins.
  - The hash (`URLSearchParams(hash.slice(1))`) is the fallback.
  - Values are trimmed and capped at 200 characters.
- `src/components/site/InquiryForm.tsx` l.146-149: in the existing `useEffect`, call `prefill(location.search, location.hash)`.
  - Old `?model=` links keep working.
  - Stage 1 does **not** send `from`; stage 2 does.

### 1D. Data file `content/article-routes.json` (new)

**Format.** The key is `<section>/<slug>`, the same form as the existing `seeAlso` field.

```json
{
  "articles": {
    "<section>/<slug>": {
      "next": "compare:<cat> | category:<cat> | finishes | certifications | price-list | documents",
      "noProducts": "<one-sentence reason, required when the article has no relatedModels>"
    }
  }
}
```

**Example entries (real slugs):**
```json
{
  "articles": {
    "guides/strike-plates-and-keeps-2026": { "next": "category:knob-locks" },
    "guides/door-hardware-hs-codes-2026": { "next": "price-list", "noProducts": "Customs classification guide; no single model is its subject." },
    "guides/mortise-lock-case-comparison-2026": { "next": "compare:lock-cases" }
  }
}
```

**Loader:** NEW `src/data/article-routes.ts`, `articleRoute(section, slug)`. It loads JSON the same way `src/data/downloads.ts` does.

**Stage 1 seed** (top 25 by Bing citations plus the certificate-citing pieces). Category slugs were confirmed against `out/compare/`.

| Key | `next` | `noProducts` |
|---|---|---|
| guides/strike-plates-and-keeps-2026 | category:knob-locks | |
| guides/door-preparation-161-and-86-2026 | compare:lock-cases | No HYDE lock publishes the 54 mm (161) cross bore; no fit is claimed. |
| guides/door-hardware-hs-codes-2026 | price-list | (above) |
| news/finish-codes-us26d-626-630 | finishes | |
| guides/finish-code-reference-2026 | finishes | |
| guides/chrome-finish-differences-2026 | finishes | |
| guides/euro-cylinder-size-chart-2026 | category:lock-cylinders | |
| news/fitting-a-euro-cylinder | category:lock-cylinders | |
| news/euro-cylinder-length-and-split | category:lock-cylinders | |
| guides/brass-alloys-and-dezincification-2026 | category:lock-cylinders | No record publishes DZR or an alloy grade. |
| guides/fire-door-hardware-what-must-be-rated-2026 | certifications | |
| guides/en-1125-vs-en-179-2026 | certifications | |
| news/en-1125-or-ansi-which-standard-your-project-needs | certifications | |
| news/ul-305-is-a-listing-not-a-grade | certifications | |
| news/what-a-test-report-actually-covers | certifications | |
| guides/certification-and-test-validation-2026 | certifications | (only if relatedModels is empty) |
| guides/qualifying-a-hardware-supplier-2026 | certifications | (only if relatedModels is empty) |
| news/push-bar-or-touch-bar-panic-exit-devices | compare:panic-exit-devices | |
| guides/exit-device-comparison-2026 | compare:panic-exit-devices | |
| guides/backset-door-thickness-chart-2026 | compare:lock-cases | |
| news/door-coordinator-double-fire-door | compare:door-closers | |
| guides/door-closer-mounting-positions-2026 | compare:door-closers | |
| guides/hinge-grades-and-count-2026 | compare:brass-steel-hinges | No record publishes an EN 1935 / A156.1 grade. |
| guides/lever-return-and-en-1906-2026 | category:stainless-steel-handles | No record publishes an EN 1906 grade. |
| guides/spindle-sizes-and-length-2026 | category:stainless-steel-handles | |
| guides/stainless-grade-selection-201-304-316-2026 | category:stainless-steel-handles | |
| guides/corrosion-resistance-en-1670-2026 | documents | No record publishes an EN 1670 grade or salt-spray hours. |

- `compare:lock-cylinders` is banned: that page has no table, and only 13 of 45 records carry a size.
- Do not add DC01, DSL02 or FB001 to door-coordinator. Its body names none of them (checked: 0 hits each).

### 1E. Edits to existing fields (run `npm run content` afterwards)

| File | Change |
|---|---|
| `content/guides/master-key-hierarchy-planning-2026.json` | `"attachmentIds": ["master-key-plan-sheet", "master-key-plan-print"]` (both exist in `content/downloads.json`) |
| `content/news/finish-codes-us26d-626-630.json` | remove `"3431 SSET"`: zinc alloy labelled US32D contradicts the article's own argument. Its body names no related model, so do **not** add EPT01 until an editor writes it into the body. |
| `content/news/push-bar-or-touch-bar-panic-exit-devices.json` | `"seeAlso": "guides/exit-device-comparison-2026"` |
| `content/news/fitting-a-euro-cylinder.json` | `"seeAlso": "news/euro-cylinder-length-and-split"` (its body already says "our note on why 70 is the total") |
| `content/guides/corrosion-resistance-en-1670-2026.json` | `"seeAlso": "guides/stainless-grade-selection-201-304-316-2026"` |

### Stage 1 tests (append each new file to the explicit `"test"` list in `package.json`)

- NEW `src/data/product-claims.test.ts` (fs only). Across EN/es/pt fields and the 7 overlay `products.json` files, for HYDE records (`sites` absent or including `hyde`):
  - no `/ANSI(\/BHMA)?\s*(Grade|grado)/i`
  - no spec label `/^fire rating$/i`
  - no value matching `/\d[\d.,]*\s*(hours?|heures|Stunden|horas)\b.*(fire|feu|Brand|fuego|fogo)/i`
  - no `certifications[]` entry matching `/ISO 9001/`
- NEW `src/data/article-routes.test.ts`:
  - (a) every key is an existing published article file
  - (b) every `next` parses to a known kind
  - (c) `<cat>` is `categoryPath[0]` of at least 1 published HYDE record, and is not `lock-cylinders` for `compare:`
  - (d) every article whose English body contains `GZU-` or `CELAB` has `next: "certifications"`. This currently covers 3 news pieces, checked.
  - (e) `noProducts` is a non-empty sentence and the article's `relatedModels` is empty
- NEW `src/lib/inquiry-prefill.test.ts`:
  - query beats hash
  - hash-only `#model=575+ABET%2C+564&from=guides%2Fstrike-plates-and-keeps-2026` yields `"575 ABET, 564"`
  - empty input yields empty strings
- NEW `scripts/check-article-routes.mjs` (`--check`, appended to `test:export`). For each `out/{,es/,pt/,fr/,de/,ja/,ko/,tr/,ru/,ar/}{guides,news}/*/index.html`, slice `<main>…</main>` and:
  - fail if there is no `href="<prefix>/contact/` link
  - fail if any `href="…/contact/?` link appears
  - fail if a seeded route's href is missing
  - print coverage: product-or-next links, contact links
- Run `npm test`, `npm run typecheck`, `npm run lint`, and the impeccable detector once on the changed UI.

### Stage 1 acceptance checks against `out/` (after `release:hyde`)

| Check | Expected |
|---|---|
| `node scripts/check-article-routes.mjs --check` | contact route in `<main>` on 820/820 article pages (82 × 10); 0 `/contact/?` links in article `<main>` |
| `grep -o 'href="/contact/#[^"]*"' out/guides/strike-plates-and-keeps-2026/index.html` | `/contact/#model=575+ABET%2C+564&amp;from=guides%2Fstrike-plates-and-keeps-2026` |
| same file | `id="article-products"`; links `/products/knob-locks/575-abet-tubular-lock/` and the 564 product; `href="/products/knob-locks/"` |
| `out/fr/guides/strike-plates-and-keeps-2026/index.html` | `/fr/contact/#model=…` and `/fr/products/knob-locks/` |
| `out/guides/door-hardware-hs-codes-2026/index.html` | no "Related products" heading; `/contact/#from=guides%2Fdoor-hardware-hs-codes-2026`; `href="/request/price-list/"` |
| `out/news/finish-codes-us26d-626-630/index.html` | `href="/finishes/"`; no `3431-sset` link anywhere in `<main>` |
| `out/guides/master-key-hierarchy-planning-2026/index.html` | 2 × `/downloads/master-key-plan-sheet.`; heading reads Downloads, not Press kit |
| `grep -rlE 'ANSI (Grade\|grado)' out/products out/*/products` | empty |
| `grep -rl 'Fire Rating' out/products/panic-exit-devices/{300,307,310}-panic-exit-device` | empty, including the JSON-LD `additionalProperty` |
| `grep -rl 'holds ISO 9001' out` | empty |
| Screenshots of en, ar (RTL) and ja strike-plates and finish-codes at 375 px and 1440 px | cards don't overflow the body column; no layout shift (card images have width/height) |
| `audit-no-chinese`, `audit-dead-links`, `git status --short out/ \| grep -c '^??'` | pass, pass, 0 |

**Docs in the same commit:**
- NEW `docs/collaboration/tasks/2026-10-12-article-product-routes.md`, holding this spec and the client questions (§8).
- One dated line at the top of `docs/collaboration/CLIENT-RUNBOOK.md`, then `npm run runbook:docx`.
- An agent-update that names the neutral-lane changes (`content/products`, `InquiryForm`, `NewsDetail`).

---

## Stage 2: measurement and data integrity (1–2 days)

**Files**
- `src/lib/engagement.ts`:
  - `pageType()` strips every non-en prefix from `locales` (`src/data/locales.ts:34`), not only `es|pt`.
  - `linkIntent(href, from, list?)` sets `item_list_name = list ?? pageType`.
  - `contact_click` gains `placement`.
- `src/components/site/EngagementTracker.tsx` l.139: `anchor.closest('[data-link-list]')?.getAttribute('data-link-list')`.
- `data-link-list` attribute values:
  - `article-rail` on the existing left-rail div
  - `article-products` (already present from stage 1)
  - `article-body` and `article-table` (stage 3)
- `InquiryForm.tsx` l.225: `if (from) payload.set("source_article", from)`. `trackLead` gets `sourceArticle`, and `LeadEvent` in `src/lib/analytics-events.ts` gains the optional field.
- **Integrity.** Fix or remove the 11 unresolved `relatedModels`: `D101`, `808 SS ET`, `301-S` ×3, `Brass Piano Hinge`, `LH852 SSET`, `6491 SSET`, `JU-071`, `400`, `6094 PBBK`.
  - Correct a model only to the exact `model` string on a record.
  - Remove RAYEN-only models.
  - A model whose product has no photo may stay listed.
- **Coverage.** Add an `article-routes.json` decision for the other 20 guides, after reading each body.
  - Add `relatedModels` only where the body names the model.
  - Otherwise use `next` plus `noProducts`.
  - This is a bulk write, so add a NOW.md row first.
- NEW `scripts/report-article-links.mjs` and an `articles:links` script. It prints, per article:
  - `relatedModels` that resolve, that await a photo, and that are unknown
  - models named in the body but not in `relatedModels` (letter+digit rule)
  - the route
  This is the editor's backlog list. Nothing is auto-added.

**Tests**
- `src/lib/engagement.test.ts`: `/fr/guides/x` and `/ar/news/y` resolve to `article`; `list` resolves to `item_list_name`.
- `src/lib/analytics-events.test.ts`: `source_article` is passed through.
- NEW `src/data/article-product-links.test.ts`, modelled on `project-product-links.test.ts`:
  - (a) every `relatedModels` entry exactly equals a HYDE record's `model`
  - (b) every published guide has at least 1 resolved related product or an `article-routes.json` entry

**Acceptance**
- `check-article-routes.mjs` coverage line reads: product-or-next route in 82/82 per locale; contact route 82/82.
- A GA4 DebugView click on a `/fr/guides/…` card shows `item_list_name=article-products`.
- A test submission from `/contact/#model=607+SSET&from=…` carries `source_article`. Test values only.

---

## Stage 3: model links inside prose and tables

**Files**
- NEW `src/lib/article-products.ts` (pure; no JSON or Next imports):
  - `isLinkableModel(m)`: `/[A-Za-z]/.test(m) && /\d/.test(m) && m.length >= 3 && !deny.has(m)`.
  - `mentionPattern(models)`: longest first, `(?<![\w-])MODEL(?![\w-]|\s?mm\b)`.
  - `firstMentions(blocks, models) → Map<blockIndex, Map<model, href>>`: paragraphs only, first occurrence per article.
  - `rowHeaderHref(cellText, index, related)`: whole-cell equality. A digit-only model qualifies only if it is in `related`.
- `src/components/site/InlineText.tsx`:
  - Add an optional `links?: ReadonlyMap<string,string>` prop, applied only to plain-text segments after the existing TOKEN split.
  - Rewrite the "No links" comment: links come only from the published-model index, never from content markup. The TOKEN regex is unchanged.
- `src/components/site/ArticleBody.tsx` and `NewsDetail.tsx` news paragraph branch (about l.370): pass per-block `links`; `data-link-list="article-body"` on the body root.
- `src/lib/article-layout.ts`: `TableCell` gains `href?`.
- `src/components/site/DataTable.tsx` l.22: when `cell.href` is set, render `<a href>` inside `<th scope="row">`. Sorting is unchanged. Use `data-link-list="article-table"` on the figure.
- `ArticleReading.module.css`: one `.body a` rule (brand colour, underline). No icon.
- `content/article-routes.json` gains top-level `"noAutoLink": []`, a model deny list maintained from the report script.

**Tests:** NEW `src/lib/article-products.test.ts`:
- `"UL 305"`, `"564mm"`, `"306-DX"` and `"LC85200"` (when the model is `LC8520`) do not match.
- The longest model wins (`9014 SSET` over `9014`).
- No match inside headings; first mention only.
- A cell `"307"` links only when `related` contains `307`.
- A RAYEN-only model never links.

Add `src/lib/article-layout.test.ts` coverage that `href` stays on its row after sorting.

**Acceptance**
- `out/guides/mortise-lock-case-comparison-2026/index.html`: `<th scope="row"><a href="/products/lock-cases/…">` on every row whose cell is a published LC model.
- `out/guides/exit-device-comparison-2026/index.html`: rows 300…320 linked.
- `out/news/ul-305-is-a-listing-not-a-grade/index.html`: 0 `/products/` links inside body `<p>`.
- No `<a>` inside any `h2`/`h3` in article `<main>`.
- Each prose model is linked at most once per page.

---

## Stage 4: machine-readable signals and hero link

**Files**
- `src/app/llms.txt/route.ts` (guide/news lines about l.78-85): append ` Models: m1, m2, … (+N).`, capped at 8, from the resolved `related`.
- `src/components/site/JsonLd.tsx`:
  - `productSchema` gets `"@id": "<product url>#product"`.
  - `newsArticleSchema` gets `mentions: related.map(p => ({ "@id": "<same-locale product url>#product" }))`.
  - **No typed `Product`** in `mentions`.
  - Pass `related` from the guides/news routes (en, es, pt) and from `locale-pages/ArticlePages.tsx`.
- `src/components/site/GuideCover.tsx` l.16: when the hero `src` equals a published product's `heroImage.src`, link to that product page instead of the raw `.webp`. First case: the LC07 hero on the mortise guide links to `/products/lock-cases/lc07-85-45mm-lock-case/`.

**Tests:** `src/lib/json-ld.test.ts`:
- the `mentions` count equals the visible `related` count on a fixture
- every `mentions` item has only `@id`
- no new `@type: Product` node on article pages

**Acceptance**
- `grep -c '"mentions"' out/guides/strike-plates-and-keeps-2026/index.html` returns 1.
- The offline required-field check over article pages finds 0 Product errors.
- `out/llms.txt` lines carry `Models:`.

---

## Stage 5: readout, then client-gated items

- **Readout at +14 and +28 days.** Compare per placement (`item_list_name`), not as a site total.
  - GA4 `select_item`
  - `contact_click`
  - `generate_lead` with `source_article`, split by `first_touch` (`ai:chatgpt`, `ai:copilot`, …)
  - Bing AI Performance: product-URL citations (28 on 2026-10-12) against article citations (2,330), which must not fall
  - Clarity scroll reach to `#article-products`, dead clicks
- **Only after the client answers:**
  - a model-scoped certificate line on a card, on an exact `coversModel` match only
  - the 200,000-cycle rows
  - ISO 9001 prominence

---

## Ahrefs fixes (ordered by impact)

1. **(d) Short and long meta descriptions.**
   - Ship `9cb095fa7bc2` with the stage 1 `release:hyde`.
   - Add a second fallback in `lengthenWithSummary` (`scripts/build-product-titles.mjs` about l.625-643): when the text is still under 110 characters, insert the client-confirmed sentence "Made in Guangdong, China. Lead time from 30 days." It is confirmed in `src/data/category-sourcing.ts:17`, and localized wording already exists in `content/i18n/<loc>/ui.json`.
   - Keep `DESC_MAX` at 150. Run `node scripts/build-product-titles.mjs --write && node scripts/i18n-lint.mjs && npm run titles:check`.
   - Leave ja/ko at their 90-character cap; it is expected, about 1,430 flags.
   - Lengthen the 8 author-page descriptions (`AuthorProfile.tsx:27`) with facts already on the profile.
   - Bring static pages over 160 characters (glossary, model-lookup, finishes, certifications, downloads, configurator, product-category) down to 160 or fewer, and extend the 160-character test to overlays and static pages. Leave the E1 pages until 10-14.
2. **(a) One nofollow internal link on 5,490 pages, plus 870 parameter URLs.**
   - Stage 1 already makes `InquiryForm` read the fragment, so this becomes a call-site change.
   - `ProductDetail.tsx:365`: `quoteHref = \`${base}/contact/#${quoteParams}\``. Remove `rel="nofollow"` at :625 and update the crawl-budget comment in `Button.tsx:18-29`.
   - Apply the same change at `Configurator.tsx:532`, `ConfiguratorStudio.tsx:186`, `(en)/downloads/page.tsx:123`, `es/downloads/page.tsx:138`, `pt/downloads/page.tsx:138` and `(en)/video/[slug]/page.tsx:164`.
   - Acceptance: 0 `rel="nofollow"` and 0 `/contact/?` across `out/**/index.html`.
3. **(e) Titles.**
   - `locale-pages/ArticlePages.tsx:50/54` and `ProjectPages.tsx:33/40`: append ` | Canton Hyland` when it is missing, then pass through `fitTitle`. That brings the 4 ja titles to 25-30 characters.
   - Shorten the ru `023 ETAN` name at `content/i18n/ru/products.json:221` by dropping «для устройств», giving about 61 characters. Coordinate with the multilingual session's claim.
4. **(c) "Wrong format" sitemaps.**
   - First confirm in the Ahrefs UI that the 10 flagged URLs end in `/feed.xml`; viewing the list needs no paid export.
   - Then drop the feed `Sitemap:` lines in `src/app/robots.ts:30-33` and relax `src/data/discover-readiness.test.ts:34,38-50` in the same commit. The feeds stay discoverable via `<link rel="alternate">`.
   - Optional: move `xhtml:link` after `priority` in `src/lib/locale-sitemap-xml.ts:26` to satisfy the XSD.
5. **(b) Product rich-results error (offers / review / aggregateRating).**
   - No honest code fix exists. `JsonLd.tsx:33-39` forbids invented prices and ratings.
   - Record it as a client decision: keep as is, or the client authorizes a public indicative FOB range per model.
   - Never add a placeholder offer, a price of 0, self-written reviews, or a `@type` rename. Stage 4 must not spread this error to article pages, hence `@id`-only `mentions`.

---

## Client questions to file (`docs/collaboration/tasks/2026-10-12-article-product-routes.md`)

1. Current ISO 9001 certificate: issuer, number and expiry.
2. Is Intertek "607 SS ET" the "607 SSET" record?
3. Which current product, if any, is KD070/30-290?
4. CELAB certificate number and model list.
5. Is there written Intertek permission for advertising use?
6. The 200,000-cycle rows (85 records from stahlock.com): keep with a qualifier, or remove?
7. Keep "Fire Door" in the name of model 305?
8. "Own office in Germany" (homepage) or "contact points, not subsidiaries" (company page)?
9. Product rich results: keep as is, or publish indicative FOB ranges?

---

## Out of scope, recorded

- `promo.ts:21` strips only `es|pt`, so the client's chosen promo never fires on fr/de/ja/ko/tr/ru/ar news. Fix it separately with `promo-settings.test.ts`.
- The left-rail label "Products mentioned" is inaccurate on about half the articles: 123 of 246 related models are not named in the body. Relabelling it is a Codex/design call.
- `LH851` has an empty spec table, and some landing pages are thin. These are a content backlog item.

**Not checked:** nothing was rendered in a browser. I did not confirm that `ProductCard` renders inside overlay article routes (`product-card-locale.test` exists). "Finish codes", "Price list" and "Documents" were verified in fr/ja/ar `ui.json` only.

**Risk:**
- Stage 1 edits overlay rows inside the multilingual session's claim; add the NOW.md row first.
- `out/` is older than the source, so verify the real exit code of `release:hyde` before reporting the release.

## 进度

- 2026-10-12 阶段 1 已实现：1A 删除无证书支撑的产品认证说法（028/5831/black-tubular 的 ANSI 等级，300/307/310 的 Fire Rating，19 条产品级 ISO 9001）；1B ArticleBuyerBlock；1C 询价表单读片段（#model=…&from=…）并随询盘发 source_article；1D content/article-routes.json 29 条；1E 五处内容字段。Ahrefs (a)：产品页报价链接改片段、去掉 nofollow。
- 2026-10-12 阶段 2–4 已上线（r48 fe4e1c479cb）：十语 pageType、item_list_name/placement、source_article；3 个 relatedModels 修正 + article-product-links 测试；正文首次提及与表格行首型号链接（article-products.ts）；产品 JSON-LD @id、文章 mentions（只 @id）；llms.txt 附 Models（60 行）。
- 2026-10-13：check-article-routes.mjs 导出检查已接入 test:export（十语 810 篇文章页全部有买家区块与 /contact/# 链接，每语 59/81 篇带产品链接）；GuideCover 主图链到产品、Ahrefs (c)(e) 已于 10-12 上线。
- 未做：+14 天和 +28 天看 GA4 select_item / generate_lead.source_article 与 Bing 产品页引用数（10-12 为 28）。
