# Codex — compact Language with rightward reveal

Date: 2026-10-04. Scope: follow-up to the navigation design proposals.

The client supplied the current always-visible ES/PT/FR/DE/JA/KO/TR/RU/AR/EN row and asked for one `Language` entry with a rightward slide animation, because the header lacks whitespace. The new focused proposal uses the files/support rail context from the latest navigation comparison. It does not select or implement a production navigation redesign.

## Design and behavior

- Closed header: globe, Language, current language abbreviation and a direction indicator. Ten codes are no longer permanently visible. A large flexible gap remains between primary navigation and the language action.
- A right-aligned, opaque language panel appears below the header. `translateX(-24px)` to `0` and a left-to-right clip reveal create motion toward the right without crossing the screen's right edge. It is an overlay, so opening does not change the header height or move primary links. Closing reverses the reveal. Duration defaults to 360 ms and can be adjusted locally from 240–520 ms.
- The panel has all ten actual language labels, with native-script names and their codes in two columns. Phone margins are 16 px; the panel stays inside the preview. The real HYDE logo and actual 9001 photograph supply context; no metal geometry is generated.
- Native buttons retain their ordinary focus styles and tab order. The trigger has `aria-expanded` and `aria-controls`; opening focuses the current language. Selection, Escape and the close button restore trigger focus. Outside pointer clicks and focus moving outside the language group close without stealing the destination's focus. Closed and closing choices are inert. Reduced-motion CSS removes transitions and displacement.
- Language selection is local to this design preview: it updates the current abbreviation and selected state, and does not claim to translate the page or navigate a production locale route. Actual implementation should reuse `LocalePicker`'s existing route mapping. Content links are local destination previews, not PDF transfers or contact submission.
- Only the selected language is saved to optional conversation state. Open/closed state is transient, which avoids old state acknowledgements closing a newly opened panel. No query, personal data, image or network request is saved/sent.

## Verification

- The generator validates ten language choices, inline-fragment structure, embedded JavaScript syntax and the 1 MB limit. It normalizes template CRLF to LF for reproducible Windows output. Generated size: 40,735 bytes. Real logo/photo assets are embedded once. Final syntax, Git whitespace checks and identical SHA-256 for canonical/display copies passed in the finishing pass.
- Browser QA covered 320, 736 and 1024 px viewports (fragment widths 273, 689 and 977 px). Root `scrollWidth` equaled `clientWidth`, all ten language labels fitted their controls, and the panel stayed within the fragment. The actual photo/logo loaded.
- Before/after opening, primary navigation coordinates were unchanged and header heights remained 135 / 151 / 98 px at the three widths. At the phone width the open panel finished at x=16–257 px, width 241 px. Desktop motion was observed while the panel moved toward its final right-aligned position.
- Tested Português, العربية and English selection, current-selection focus, Escape, the explicit close button, outside click to Products without focus theft, and Tab from the last language to Catalog PDF closing the panel. No final browser console error/warning was recorded.
- A real QA failure was corrected: checking `document.activeElement` from a `focusout` microtask could observe the temporary body focus before the next language received focus and cancel its click. Closing now responds to the new `focusin` target. Transient open state is no longer restored from host state events.
- Reduced-motion support was reviewed in CSS; the device's operating-system preference was not changed. No production build or broad test suite was necessary for this proposal fragment. The unavailable Impeccable detector was not installed; layout and behavior were reviewed manually and in the browser.

## Reproduce and boundaries

From `E:\cantonlock-vis`:

```powershell
node scripts/build-language-slide-preview.mjs --asset-root 'E:\cantonlock-hyde\public' --inline-output 'C:\Users\86132\Downloads\cantonlock\tmp\codex-inline-nav\hyde-language-slide.html'
```

Editable source: `docs/design-references/2026-10-04-language-slide.template.html`. Canonical output: `docs/design-references/2026-10-04-language-slide.html`. The small display copy uses the already verified genuine C directory; main source/output remain on E. The generator rejects linked parent directories for the inline copy.

No production `src/`, `LocalePicker`, `out/`, release build, Cloudflare action, migration link or other agent work is changed. The earlier four-proposal commit was preserved locally after GitHub connection failures; this proposal's commit/push is reported separately. A future selected production change should preserve the existing locale links and verify motion, focus, zoom, long labels and short mobile viewports against the real header.

The first push of this stage was rejected because remote main had advanced. A completed fetch identified `3a85cb22c212` (home exit hero image) as the new remote commit. Both proposal commits were rebased onto it without conflicts; its product-image change was preserved. The sparse checkout omitted the committed proposal files after rebase, so only the four task-owned design-reference files were restored from their commits. The Language fragment was regenerated and its checks and copy hash passed again.
