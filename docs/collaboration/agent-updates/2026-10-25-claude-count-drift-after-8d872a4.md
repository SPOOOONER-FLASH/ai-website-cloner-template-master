# 2026-10-25 · Claude · Count drift after the three new products (8d872a44ccf), in ten languages

This is the 7-locale follow-up that the engineering session asked for with 8d872a44ccf (SH02, D104 SS, 8829 BL).

## What was already done

The three products are translated in all seven `products.json` overlays. `i18n-batch` reports 0 untranslated and 0 stale, including `--unpublished`.

## What was not done

Three articles had their count moved in exactly one sentence, the sentence that `article-catalogue-claims.test.ts` registers. Every other mention of the same number stayed old:

| Article | What moved | What stayed (EN / ES / PT / 7 overlays) |
|---|---|---|
| `guides/dimensional-interchangeability-2026` | EN FAQ 4 and the overlay FAQs moved to 257, 14% and forend 8 | <ul><li>summary 255</li><li>body[16] 255</li><li>table: center distance 15%, forend 7</li><li>ES/PT FAQ 255</li></ul> |
| `news/lever-handle-range-lh852-lh853-lh855` | EN body[9] and the overlay body[9] moved to 63 | <ul><li>heading 62</li><li>FAQ 62</li><li>"the other six" (8829 BL is the seventh, and a different lock)</li><li>ES/PT body[9] 62</li></ul> |
| `news/brass-piano-hinge-is-a-finish-not-a-metal` | EN body[7] and the overlay body[7] moved to 30 and five | <ul><li>FAQ: 29 records, four with no material</li><li>ES/PT everywhere</li><li>"counted on 22 September 2026": on that day the site had 29</li></ul> |

### Why the test did not catch it

`claim()` uses `includes()` over the whole article. Once one copy of a sentence is right, the test passes, however many other copies are wrong.

### The fix

Each place that states a count is now registered on its own:
- the dimensional summary, the counting sentence and the five table rows;
- the lever heading, both "Of the N" sentences, "the other seven" and the list of six records with no rows;
- the hinge FAQ.

New assertions stop a later edit from making two of the rewritten sentences untrue:
- **Dimensional body[18] and FAQ 4.** They now read "center distance, forend and case size … are the three we publish least". The test asserts that forend and case size are tied and that center distance is third. The old sentence, "the two we publish least", was already false: case size 8 is below center distance 37.
- **The lever article.** It now names 8829 BL as the one entry that is neither a tubular set nor a bare record. The test asserts that this is still true.

## Wording decisions

- The hinge count date changed to **25 October 2026** in all ten languages, because the count was re-taken today. The registered FAQ sentence carries that date. When the count moves, update the date and the number together.
- The 8829 BL sentence uses only its record:
  - magnetic mortise lever lock;
  - 160mm lever;
  - 86 × 48mm lock case;
  - 85 × 22mm faceplate.

  Its localized names come from the product overlays.
- Draft `news/why-the-catalogue-is-this-wide` still says 613 in its overlays. It is `draft: true` and does not render, so it was left alone.

## Tests

- `i18n-lint`, `titles:check`, `stamp-article-revisions --check` and the heading-marker check: all clean.
- `article-catalogue-claims`: passes. It needs `public/images/drawings` and `public/images/door-prep`. They were borrowed by junction, the junctions were removed, then `git sparse-checkout reapply`.
- `i18n-batch --stale`: 0 for news and guides in all seven locales.

## For the engineering session

When a product changes a count, run:

```bash
node --test src/data/article-catalogue-claims.test.ts
```

then search the article for the old number in all ten homes:
- `body`, `bodyEs` and `bodyPt`;
- `faq.en`, `faq.es` and `faq.pt`;
- `summary*`;
- the seven overlays.

Fixing only the sentence the test prints leaves the others. The test now prints more of them, but not every phrasing.

## Release

The engineering session releases. A message goes to it after the push.
