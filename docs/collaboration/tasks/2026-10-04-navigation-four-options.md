# Four new HYDE navigation proposals

Date: 2026-10-04. Agent: Codex.

The client rejected the prior navigation options and the three homepage concepts, and redirected the task to four new navigation options. The purpose is to make important content visible and recognizably clickable. This stage is a design proposal, not a production header change.

## Finding and approach

Live inspection of https://cantonlock.com/ confirms that Downloads sits under Buy it now, while Guides is under Resources and Certificates under Company. The old proposals still asked visitors to infer a parent category and open its panel; their initially expanded menus obscured the closed-state discovery problem. No analytics were inspected, so this is an information-architecture diagnosis, not a measured click-rate claim.

Four new mechanisms, all initially closed:

| Direction | Initial visibility | Tradeoff |
|---|---|---|
| 直接列出 | Downloads, Products, Documents, Guides and Certificates are direct top-level actions. Contact sales is a filled button. Product Finder, Factory & OEM and FAQ have secondary direct links. | Most compact route to named important sections, but adding more first-level items will crowd long translations. |
| 四栏常显 | Downloads / Products / Technical / Contact form four persistent columns. The actual catalog, 3D, drawing, certificate, guide and inquiry actions are already visible. On phones they reflow into a 2×2 grid. | Clearest discovery; uses more header height. Recommended when surfacing technical content is the primary goal. |
| 搜索直达 | A real, visible search input; Catalog PDF, Drawings and Test reports directly below it. Contact is independent. | Best for buyers with a known model/reference; search alone does not explain the whole range, so product and guide links remain. |
| 资料侧栏 | Product/application/factory navigation at the top. A labeled catalog/document/contact rail beside page content; on phones it becomes a compact strip directly below the header. | Reduces top-row competition; spends page width on desktop. Actual whole-page sticky behavior must be verified during implementation, as the inline iframe only demonstrates the rail layout. |

Original HYDE horizontal logo SVGs and the real 9001 lever photograph are used. No imagined product, altered component, new dimension, fake certificate or numeric conversion result is added. The current site's destinations inform the labels. No new product section is deployed.

## Prototype behavior and limits

- Primary destinations replace the visible content with a local landing-page preview, rather than merely changing a status label.
- Menus open by click/keyboard, show their expanded state, and close on Escape. Closed-menu Escape does not move focus. Removed content/result buttons hand keyboard focus to a real button in the new content; no artificial tab order is added.
- Search is local to seven illustrative product/document destinations. Click and Enter both update local results without form navigation, so they also work inside the renderer's `sandbox="allow-scripts"` iframe. It is not the complete production product index. The explicit no-match message identifies this limit. The preview does not send search input to an API or save it to the host.
- The language panel is explicitly an English navigation preview; other language choices are disabled. Production language routing is not simulated as working translation.
- Catalog and documents are content previews, not actual PDF transfers or a report repository. Contact displays the verified public `tec@cantonlock.com`; it does not send inquiries.
- A native four-variant carousel switches the designs. Optional controls adjust spacing and descriptive subtitles. Selecting a destination can save only the concept/destination and local page selections to conversation state; photos and user-entered search terms are not saved.
- Reduced-motion CSS suppresses menu/content transitions. There are no ambient motion loops, remote fonts or API calls.

## Reproduce

Source: `docs/design-references/2026-10-04-navigation-four-options.template.html`.

Generated fragment: `docs/design-references/2026-10-04-navigation-four-options.html`.

From `E:\cantonlock-vis`:

```powershell
node scripts/build-navigation-four-options.mjs --asset-root 'E:\cantonlock-hyde\public' --inline-output 'C:\Users\86132\Downloads\cantonlock\tmp\codex-inline-nav\hyde-navigation-four-options.html'
```

The generator embeds the actual black/white HYDE logos and `hyde-real-lever-plate.webp`, checks syntax, four variants and the 1 MB limit, and refuses linked parent directories for the inline copy. Main source and generated output remain on E; the small display copy uses the already verified genuine C workspace path because the migrated visualization directory is a junction rejected by the app's reader.

Verification results and the finishing review are in the accompanying agent update. No `src/`, `out/`, release build, Cloudflare operation or other agent work is included. Implementation should map the chosen arrangement to the existing locale navigation and search components, retaining the complete route set and testing longer locale labels before release.

The finishing review recommends 四栏常显, with 直接列出 as the compact alternative. The catalog shortcuts in this prototype lead to the Downloads content preview, not a one-click PDF transfer. The rail directly exposes catalog/documents/contact; guides and certificates remain one step inside Documents. A production implementation must decide whether the PDF should download or open, and should not keep the entire phone 2×2 navigation permanently sticky.
