# 2026-10-12 Claude: homepage opening curtain, smooth scroll, factory story as in the demo

- **Requests (client screen recording 23-00-23 of the motion demo):**
  - 「我要这个 那个滚动的视频 要这些图片……这个滑动效果」
  - 「为什么预览的这么好 线上不一样」
  - 「首页打开我要那个加载动画」
- **`HomeIntro` (new):**
  - The demo's curtain: the icon turns in, the wordmark wipes, a rule draws, and the curtain parts. It finishes at about 1.46 s.
  - Pure CSS in the HTML, so it starts with the first paint, and its last keyframe hides it without JavaScript.
  - An inline script marks `<html data-intro="skip">` for later views in the same session and for reduced motion.
  - It renders outside `<main>`: main is `isolate`, so a z-index inside it could not cover the header. The first build showed exactly that.
- **`HomeSmoothScroll` (new):**
  - Lenis 1.3.26, the demo's version. It is the one new dependency (package.json and package-lock.json; the lock adds only lenis).
  - Homepage only. Off for coarse pointers and for reduced motion.
- **FactoryStory:**
  - Five steps: CNC machining joins as step 3 with `factory-cnc-machining.webp`, the only photo from that set the client has cleared (2026-09-17). It is exported as `factoryCncMachining` in `src/data/company.ts` so the company page grid is unchanged. Its responsive config and variants are added.
  - Body copy now says "cut, stamp, machine, polish…"; the 7 overlay locales are updated.
  - The wipe now pushes in with scale (1.02 → 1 → 1.08) using the demo's curtain ease.
  - Shot state is `data-shot` = past/on/next.
  - The progress bars fill continuously from `--story-p`.
  - StoryStage reads step positions every frame instead of an IO band, which a fast scroll jumped over.
- **Not swapped:**
  - The recording's polishing and assembly photos are `factory-polishing-workshop.webp` and `factory-assembly-quality-line.webp`. IMAGE_CREDITS lists them as "verify authenticity", so they stay out until the client confirms both are photographs of their own factory. The swap is two lines in `STEP_IMAGES`.
- **Desktop:** `hyde\待用参考图片` holds the 8 old homepage module images, the 3 from the Columns module, and the 2 story photos retired here.
- **Checks:** npm test 481/481 passed; tsc, eslint, motion:check and i18n-lint are clean. The curtain and all five story steps were screenshotted on the dev server (`shoot-live-home.mjs`). I did not run a full build or test:export; that belongs to the release session.
- **Not touched:** the RAYEN lane and `out/`.

## 2026-10-13: follow-up from the release check

- **Release check (engineering session):** 66dcac4 is live. The curtain and the 5 steps work. A first jump straight into the story showed black frames for about 2.5 s while the lazy stage photos loaded.
- **Fix:** `StoryStage` now observes the section with `rootMargin: 150% 0px` and, on first approach, sets the stage images to `loading="eager"`.
- **Live check on origin** (`https://cantonlock.com/?nocache=…`; plain `/` is still the Cloudflare-cached old page until the client purges): wheel-scrolled with Lenis, `data-shot` stepped onnnn → ponnn → pponn → pppon → ppppo, `--story-p` reached 1.0, and all 5 stage images loaded.

## 2026-10-13: the recording's polishing and assembly photos, confirmed and swapped in

- **Client:** asked whether `factory-polishing-workshop.webp` and `factory-assembly-quality-line.webp` are real photographs of their own factory, answered 「是啊是自家的实拍」.
- **Records:**
  - IMAGE_CREDITS.md: both rows changed from "verify authenticity" to "confirmed 2026-10-13", plus a paragraph saying only these two were cleared.
  - `build-branded-editorial-list.mjs` → `DOCUMENTED_FACTORY_PHOTOGRAPHS`, with branded-company-list.json regenerated.
  - HYDE-marked copies in `company-hyde/`; responsive 480/960/1440 variants for both libraries.
- **Story:** steps 4 and 5 now use these photos via new `factoryPolishingWorkshop` / `factoryAssemblyLine` (company.ts). The company page and `companyEditorialStudies` are unchanged.
- **Signage:** the Hyland sign and bins in frame are the factory's own and are not retouched.
- **Assembly text:** the step sentence used to describe the old photo (bagging, pallets). It now matches the new one, in ten languages.
- **Retired photos:** `polishing-line` and `assembly-line` stay on the company page; copies are in Desktop `hyde\待用参考图片\工厂故事-换下的图`.
