# Codex — four navigation proposals

Date: 2026-10-04. Agent: Codex. Scope: design comparison only.

The client rejected both earlier navigation options and the homepage concepts. This stage supplies four different discovery mechanisms: direct first-level links, four persistent service columns, a visible search field with document shortcuts, and a page-side files/support rail. All start in a normal closed state. Details and reproduction command: `docs/collaboration/tasks/2026-10-04-navigation-four-options.md`.

## Verification

- Generator completed successfully with four variants and a 67,892-byte fragment. It compiles embedded JavaScript, validates fragment structure and the 1 MB limit, embeds the real HYDE logo/photo, and rejects linked inline parent directories. The canonical E output and the genuine C display copy are checked for identical SHA-256 hashes in the finishing pass.
- Browser QA in the bundled sandbox renderer covered all four variants at viewport widths 320, 600, 736 and 1024 px. For every measured visible variant, root `scrollWidth` equaled `clientWidth`; images loaded. All stage/product heights were 1280 px at the two phone widths and 860 px at the two wider widths, keeping the carousel from jumping between designs.
- Verified mobile Search, model `9001`, catalog Enter and button submission, drawings in Product Finder, explicit no-match text, search result destinations, catalog overview, All sections → Certificates, language-preview disabled choices, panel close and Escape focus restoration. Dynamic destination replacement focuses a real button in the new content. No console warning/error was recorded in the final browser QA.
- QA exposed and fixed two functional issues: optimistic host state restoration was re-rendering an unchanged destination and dropping focus; native form submission was blocked by the preview sandbox before the submit event. Saved-state restoration now skips unchanged views, and native search controls handle local click/Enter without form navigation.
- Phone Search now remains visibly labeled in the direct-link variant. Phone rail icons are omitted where they crowded the actual text. Desktop Product Finder stays on one flex row. Reduced-motion CSS disables short transitions; there are no continuous animation loops.
- Independent read-only finishing review confirmed the mechanisms are distinct and recommended 四栏常显 for visibility, with 直接列出 as the smaller-header alternative. No Impeccable detector is installed in the available project/session; layout and interaction review was performed manually and in the browser. No dependency was installed.

## Boundaries and next step

No production `src/`, `out/`, release build, deployment, Cloudflare operation, other agent files or migration links are changed. Source and canonical output are on E. The small C copy is only the existing inline-reader workaround.

This is a navigation/content preview: local search has seven illustrative destinations; no real PDF transfer, inquiry submission, full production index or language routing is claimed. The rail's whole-page sticky behavior is not established by the iframe. No analytics were inspected and no conversion lift is claimed.

When the client selects a direction, map it to the existing route/locale components, verify longer translations, choose the catalog open/download behavior, and retain all current sections. If using the persistent four-column design, the entire phone 2×2 header should not remain permanently sticky.

## Sync status

The proposals were committed locally after checks passed. Both the normal HTTP/1.1 push and a process-only GitHub address-resolution retry exited 1 with `Failed to connect to github.com:443` after about 21 seconds. No successful push or production deployment is claimed. The committed proposal is preserved for a later network retry; no remote or global Git configuration was changed.
