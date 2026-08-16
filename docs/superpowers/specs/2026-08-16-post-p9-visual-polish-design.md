# Post-P9 Visual Polish Design

## Scope

This pass refines the completed P9 responsive site without advancing P10 or P11. It removes obsolete chrome, improves navigation alignment and motion, replaces the homepage hinge visual, and distributes the nine client-provided AI concept images across appropriate product and application contexts.

## Homepage hero carousel

The homepage hero becomes a three-slide carousel:

1. Modern Tubular Door Lock
2. Panic Exit Device (`Gemini_Generated_Image_z58n53z58n53z58n.png`)
3. Heavy Duty Fire Door Lock (`Gemini_Generated_Image_eghjtoeghjtoeghj.png`)

Slides use a restrained cross-fade with a very small positional transition. The carousel advances every six seconds, pauses on pointer hover or keyboard focus, and provides previous/next controls, position indicators, and touch swipe support. Mobile crops are set per slide so embedded copy and primary hardware remain legible. Reduced-motion users receive an instant or near-instant transition.

## Header and navigation

- Remove the global black `Project Planner` promotional strip.
- Recalculate the sticky header offset so the primary navigation begins at the top edge.
- Align the mobile language selector, search control, and menu control on one shared baseline with consistent hit areas and spacing.
- Preserve the existing English/Spanish routes and expandable navigation behavior.

## Welcome brand visual

Replace the decorative hinge image in the homepage company introduction with a clean Hyland logo presentation. The logo remains the only decorative branded element in this area; certification labels remain factual supporting content rather than decorative color.

## AI concept image placement

The remaining images are distributed instead of collected on the homepage:

- `Gemini_Generated_Image_l5tfetl5tfetl5tf.png`: deadbolt product application/gallery.
- `Gemini_Generated_Image_efkxkqefkxkqefkx.png`: panic-exit product application/gallery.
- `Gemini_Generated_Image_74dbcl74dbcl74db.png`: glass patch fitting application/gallery.
- `Gemini_Generated_Image_t2at4et2at4et2at.png`: lever-handle application/gallery.
- `Gemini_Generated_Image_oemunioemunioemu.png`: residential/smart-lock application feature.
- `Gemini_Generated_Image_r07m2or07m2or07m.png`: double-door closer/coordinator application.
- `Gemini_Generated_Image_p0q80ap0q80ap0q8.png`: commercial panic-exit project/application feature.

These are recorded as client-provided AI concept visuals, not verified installation photographs or customer projects. Images are copied locally, converted to optimized WebP files, and referenced without external hotlinks.

## Motion system

Interactive motion remains flat and restrained:

- 180–240 ms transitions for links, controls, menus, and media states.
- Consistent easing for hover, focus, drawer, and carousel behavior.
- No gradients, decorative shadows, metallic UI treatments, or exaggerated parallax.
- `prefers-reduced-motion` disables nonessential movement.

## Verification and records

- Verify all routes still build under static export.
- Inspect representative desktop and mobile widths, including the seven project breakpoints.
- Check carousel keyboard controls, pause behavior, touch behavior, and reduced motion.
- Update `IMAGE_CREDITS.md` and `PROGRESS.md` as a post-P9 visual-polish pass.
- Keep P10 and P11 marked incomplete.

