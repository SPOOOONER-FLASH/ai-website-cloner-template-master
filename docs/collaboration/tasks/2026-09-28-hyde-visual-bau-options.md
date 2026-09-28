# HYDE visual review and four BAU entry options — 2026-09-28

Review only. No website implementation or release is authorized by the selection below. The client requested visual consistency/premium-quality review and four prominent internal-link options, and clarified that FSB is the design reference.

## Evidence and judgment

- Live targets: https://cantonlock.com/, https://cantonlock.com/bau-2027/, https://cantonlock.com/de/bau-2027/, https://www.fsb.de/.
- Root inspected current desktop homepage, AR4, most-requested models, 307/311, English BAU, and a 390 × 844 mobile first viewport. Mobile document width was 390px. This does not verify the entire mobile page, meeting submission, or accessibility.
- At approximately 1440 × 1000, the first image begins at y338 on HYDE and y328 on FSB. The large top whitespace is part of the reference composition; do not treat it as a standalone defect or flatten all spacing.
- Root measured approximately 16.2kpx homepage height versus 10.9kpx for FSB in the same desktop viewport. These are transient browser layout measurements, not an analytics result. Newly added product shelves and topics have expanded the original rhythm.
- All checks of the current homepage agree there are zero direct anchors to either BAU destination. Both BAU pages are accessible; the English page visibly publishes 11–15 January 2027, Hall C4, Stand 523 and a meeting form. Booth allocation was not independently checked against the organiser.
- Independent HTTP reads disagree about Events: one sees an exhibiting entry with a BAU link, the other sees a planned market visit linking to Contact. Do not assert a consistent current Events state. No edge-cache investigation or purge was performed.

Preserve the monochrome palette, Archivo typography, fine rules, rectangular geometry and calm image/caption pattern. Improve hierarchy within that language:

1. **Product image grammar:** most-requested models mix head-on and diagonal views, different visual object scales, variable logo placement and text density. Use neutral backgrounds, complete silhouettes, camera conventions by product family and consistent metadata rows. Do not equalise actual finishes or pretend long bars and small cylinders are the same size.
2. **Section rhythm:** Most-requested → AR4 → 307/311 → Columns reads as several competing homepages. Preserve the earlier client decision that Most-requested is first after the facts strip. Use the existing seasonal slot for BAU instead of adding another large product shelf.
3. **Heading hierarchy:** AR4 currently uses 32px/700 while Most-requested, 307/311 and Columns use 28px/600; the base editorial module captions use 20px/600. Define campaign/section/card roles rather than letting each added module choose its own emphasis.
4. **Brand confidence:** architecture supplies context; authentic product photographs supply manufacturing evidence. Give each a consistent job. The 307/311 real-product module is worth retaining.
5. **Conversion presentation:** the desktop contact offer overlaps photography and part of the 311 specification area. The visible header action says “Buy it now” while the main business is inquiry. Prioritise one clear inquiry action and reduce overlap. Mobile language selection already collapses; no recommendation to rebuild it from desktop alone.

## Four standalone options

### 1. Replace the AR4 seasonal block

Location: after Most-requested and before 307/311, preserving the existing ordering decisions.

One contained, roughly 440–560px desktop module: left one-third typeset BAU title, date, hall/stand and meeting CTA; right two-thirds a disciplined composition of authentic 307/311 and/or cylinder photographs. Avoid repeating the entire six-model BAU grid. Mobile: information and CTA first, one product image below. Keep AR4 products and collection accessible in the catalogue; remove only their homepage seasonal promotion.

Copy: “Meet HYDE at BAU 2027”; “Munich · 11–15 January 2027”; “Hall C4 · Stand 523”; “Book a meeting →”; secondary “Deutsch →”.

Strength: strongest integrated exhibition story and shorter page. Tradeoff: the current AR4 slot is several screens down; this is not a guaranteed first-viewport discovery mechanism.

### 2. Exhibition band immediately below navigation — recommended for reach

Location: between the navigation and main content, optionally across the HYDE site during the exhibition campaign.

White or cool-light-grey field with fine rules; approximately 64–80px desktop height. Left title, centre date/location, right simple meeting link and Deutsch link. Do not add a floating layer, flashing treatment, countdown, or extra hero. Mobile becomes two or three legible lines; priority is BAU and the CTA, with the date/stand below.

Copy: “HYDE at BAU 2027” / “11–15 Jan · Munich · C4 / 523” / “Book a meeting →” / “Deutsch”.

Strength: reliable first-view discovery, small impact on the FSB composition, works from product and guide pages. Tradeoff: limited room for product storytelling. Retain ordinary visible links in Company and the mobile menu for navigation continuity.

### 3. BAU as the first main banner during the campaign

Location: the homepage hero's first visible frame, replacing its campaign content temporarily.

Large quiet composition built from authentic product photography, with BAU in HTML type, clear date/stand and meeting action. Match the incumbent grid and image/caption language. Mobile must show the event and CTA without depending on an automatic transition. If the carousel is retained, BAU is the first frame; a later rotating frame alone is insufficient for reliable discovery.

Strength: maximum homepage prominence and a clear commercial priority. Tradeoff: the initial panic-exit category introduction changes. Return the original hero after the exhibition; continue linking the product ranges from the BAU page.

### 4. Convert one of the two sourcing teaser entries

Location: the existing pair immediately under the hero (“Source by range or by project”). Preserve the distributor/contact entry and convert the other entry to a BAU appointment invitation for the campaign period.

Maintain the incumbent rectangular paired composition, dark real-product photo and simple text. BAU title and date should have stronger hierarchy than the small supporting line. On mobile, put the BAU entry first or render its title/CTA visibly above the horizontal rail so it is not hidden offscreen.

Copy: “Meet us in Munich”; “BAU 2027 · Hall C4, Stand 523”; “Book a meeting →”; “Deutsch →”. Update the shared pair heading to describe its final two destinations accurately; do not leave a specifier promise on a meeting link.

Strength: uses an early existing slot, preserves the hero and avoids additional homepage height. Tradeoff: replaces the general specifier entry and is less prominent than the main banner.

## Common link requirements

- English meeting action → `/bau-2027/`; explicit German link/action → `/de/bau-2027/`.
- Keep the EN/DE cross-links already present on the landing pages. Link directly to the German BAU destination; `/de/events/` was observed returning 404.
- Add descriptive BAU anchors to Company/mobile navigation and relevant Events content regardless of the selected visual option. Do not rely exclusively on a popup, carousel transition, image-embedded text or click handler.
- No invented future exhibition booth or metal product imagery. The documented client showroom photo may be used only as showroom context, never as a BAU stand photograph.

## Read-only verification and provenance

Method: two independent delegated assessments, A `/root/visual_design_review` and B `/root/visual_evidence_review`, plus root live inspection and separate BAU link audit.

A reviewed the first viewport from the current screenshot without detector output. Its independent browser profile was unavailable; mobile/lower sections were assessed by root, not retroactively attributed to A. A's tentative first-viewport Nielsen ratings were 12/20 (heuristics 2,3,4,6,8 scored; others n/a). This is not a site-wide usability score; root's FSB measurement qualifies A's whitespace concern.

B ran the Impeccable detector once on 12 narrow homepage markup files: zero findings, exit 0. The deterministic result describes this local checkout. It does not contradict visual hierarchy concerns or prove that local markup matches production. B's fresh-browser attempts failed; it used the actual desktop screenshot and live HTTP evidence. Production overlay injection was omitted for the read-only scope, no server was started, and no user-visible overlay is claimed. No ignore file was supplied.

The source checkout differs from production: no current BAU route is present locally, and local Events/home copy is older than the observed landing pages. Locate the current published source before implementing any selected option. Existing push conflicts in other agents' CSS/importer work are recorded in the latest handoffs; no sync, merge, release, purge or edits to those paths were performed.

No product source changed; `npm run check` was not run because this is a live design review and the shared release outputs are owned by other work. No implementation is claimed complete. The next task is to select an entry treatment, recover the matching published source, implement in the HYDE lane and run the required full check/release workflow.
