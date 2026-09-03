<!-- AUTO-GENERATED from AGENTS.md — do not edit directly.
     Run `bash scripts/sync-agent-rules.sh` to regenerate. -->

---
description: Project conventions for AI Website Clone Template
alwaysApply: true
---
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Website Reverse-Engineer Template

## What This Is
A reusable template for reverse-engineering any website into a clean, modern Next.js codebase using AI coding agents. The Next.js + shadcn/ui + Tailwind v4 base is pre-scaffolded — just run `/clone-website <url1> [<url2> ...]`.

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict)
- **UI:** shadcn/ui (Radix primitives, Tailwind CSS v4, `cn()` utility)
- **Icons:** Lucide React (default — will be replaced/supplemented by extracted SVGs)
- **Styling:** Tailwind CSS v4 with oklch design tokens
- **Deployment:** Vercel

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npm run typecheck` — TypeScript check
- `npm run check` — Run lint + typecheck + build

## Code Style
- TypeScript strict mode, no `any`
- Named exports, PascalCase components, camelCase utils
- Tailwind utility classes, no inline styles
- 2-space indentation
- Responsive: mobile-first

## Design Principles
- **Pixel-perfect emulation** — match the target's spacing, colors, typography exactly
- **No personal aesthetic changes during emulation phase** — match 1:1 first, customize later
- **Real content** — use actual text and assets from the target site, not placeholders
- **Beauty-first** — every pixel matters

## Project Structure
```
src/
  app/              # Next.js routes
  components/       # React components
    ui/             # shadcn/ui primitives
    icons.tsx       # Extracted SVG icons as React components
  lib/
    utils.ts        # cn() utility (shadcn)
  types/            # TypeScript interfaces
  hooks/            # Custom React hooks
public/
  images/           # Downloaded images from target site
  videos/           # Downloaded videos from target site
  seo/              # Favicons, OG images, webmanifest
docs/
  research/         # Inspection output (design tokens, components, layout)
  design-references/ # Screenshots and visual references
scripts/            # Asset download scripts
```

## CLAUDE AND CODEX SHARE THIS WORKING TREE — LIGHTWEIGHT HANDOFF

Claude and Codex work on the same checkout. The client prioritizes short feedback loops:
there is **no global agent lock** and either agent may work on non-overlapping files. Speed
must not become silent overwrite, accidental bulk staging, or a rebuild that drops the
other agent's committed source.

### Before editing

```bash
git status --short
git log --oneline -5
git diff --name-only
git log -5 -- docs/collaboration/agent-updates/
```

- Treat every unfamiliar uncommitted path as the other agent's work. Do not restore,
  format, move, stage, or commit it — **and do not delete it**. `rm -rf` from Git Bash
  bypasses the Recycle Bin, and an untracked path is not in git history either, so the
  work is simply gone. Claude destroyed `tmp/codex-ar4-workbook-inspect` this way on
  2026-08-27 while tidying `git status`.
- Scratch work goes in `tmp/<agent>-<purpose>/`, which is gitignored. It is yours to
  delete only if the prefix is your own name. `ls` it before removing anything.
- Before touching an already modified file, inspect `git diff -- <file>`. If the work
  overlaps, wait for its focused commit or review it read-only; do not overwrite it.
- Ownership below is the default routing rule, not a reason to ignore an explicit client
  request or a review finding.

### A dirty tree is not a blocker

You will open this repo and find thousands of paths you did not touch. That is normal here:
`out/` alone is ~2350 files, and another agent may be mid-build. It is **not** a signal to
stop, audit, or ask. Read the two lines below and start working.

| What you see | What it means | What you do |
|---|---|---|
| `out/` is dirty | Someone holds the release-build baton | Do not build, do not run `deploy:prep`, do not stage `out/`. Commit source; say in your update that the build is theirs. |
| Files staged that are not yours | Another agent is mid-commit | Commit with `git commit -- <your paths>`. Pathspec form ignores the rest of the index, so their staging survives untouched. |
| A file you need is already modified | Overlap, possibly | `git diff -- <file>`. Different lines → work. Same lines → stop on that file only, and go do something else on your list. |
| Anything else unfamiliar | Someone's work in progress | Leave it. Do not restore, clean, format, move, or delete it. |

**Do not spend turns re-auditing.** Three commands settle it — `git status --short`,
`git log --oneline -5`, and `cat docs/collaboration/NOW.md`. If they do not settle it,
the answer is "not mine, carry on", not another investigation.

### The claim board

`docs/collaboration/NOW.md` answers one question: *whose are these files?* Add a row
before a **bulk** write (more than three files, or any glob — `content/products/*.json`,
`out/`, `public/images/**`, a cross-directory rename). Delete your own row when that work
is committed. Never delete someone else's.

One row costs ~50 tokens. On 2026-08-31 Codex stopped a trade-show task to work out who
had added ~140 product JSONs and a full `out/` diff mid-session; that investigation cost
thousands of tokens and a halt. The row would have cost fifty.

**It is not a lock and it grants nothing.** The client asked for short feedback loops and
explicitly ruled out locks — a lock blocks the other agent's commit. If the board shows
someone on a path you wanted, go do something else on your list; do not wait, and do not
ask. If a row looks stale, assume they forgot to delete it and carry on under the dirty-tree
rules above.

**Do not wait for the other agent.** If your part is done and theirs is not, commit yours
and report. Whoever finishes last commits last; there is no merge ceremony.

### Write it down or it did not happen

Anything said only in a chat turn is gone at the next context compaction. Anything in
`AGENTS.md`, `HANDOFF.md`, `docs/collaboration/tasks/` or an agent-update is re-read by
every session that follows.

So: a decision, a confirmed fact, a piece of evidence, or a hand-off **goes in a tracked
file in the same commit as the work**. One fact, one place — when `HANDOFF.md` and a task
file disagree, the task file wins and `HANDOFF.md` should be reduced to a pointer.

Checkpoint every two or three finished objectives: commit, write the update, and let the
context shrink. A long unbroken session is not thoroughness, it is an un-saved file.

**No agent here can watch its own context meter.** There is no "compact at 80%" any of us
can schedule — compaction is something the harness does to us, and it is lossy: it
summarises a transcript only this session can read. The checkpoint above is the version
that works, because an agent-update is durable, is shared with the other two agents, and
survives the session ending. Treat "am I getting long?" as "have I committed and written
the update yet?" — if yes, a fresh session costs almost nothing; if no, that is the bug.

#### Auto-compaction: what is already true, and what is on us

Client instruction, 2026-09-02: "自动压缩，artifacts 请保留."

Half of that is already handled by the tool and needs nothing from us. **Claude Code
compacts on its own**, on the ratio of estimated tokens to the window — around 85% it
warns, around 93% it compacts — and it is on unless `CLAUDE_CODE_DISABLE_AUTO_COMPACT` is
set. It will not cut in the middle of a tool call, and it keeps the most recent messages.
Nobody needs to add that logic to this repo; it is not ours to add, and a session that
believes it is scheduling its own compaction is wrong about what it can see.

The half that IS on us is the second clause. Compaction preserves a *summary of the
conversation*; it preserves nothing about the work except what was already written to
disk. So an artifact is not "kept" because it was mentioned in chat — it is kept because
it is a tracked file. Before a session gets long, these must exist on disk, not in the
transcript:

| Artifact | Where it lives |
|---|---|
| A decision, and why the alternative was rejected | the agent-update, or a comment at the code it explains |
| A measurement (coverage %, page counts, a URL that 301s) | the script that produced it, so it can be re-run |
| A generated deliverable (fill-in sheets, audits, reports) | a generator under `scripts/`, never a one-off paste |
| Work handed to the other agent or the client | `docs/collaboration/` |

The generator rule is the one that actually gets broken. A sheet pasted into chat and
saved by hand is gone the moment its numbers go stale, and no later session can tell
whether "75 products have no photograph" is still true. A sheet with a generator in
`scripts/` is re-derivable forever — `npm run sheets` reprints both fill-in sheets from
`content/products` in one second. Write the generator, then run it; do not write the
output.

### Finish and communicate quickly

- Commit each finished, tested objective promptly; do not accumulate unrelated work.
- Stage only explicit paths with `git add -- <paths>`. Never use unreviewed bulk staging in
  a dirty shared tree.
- **Write the commit message to a file first, then `git commit -F <file>`.** Never chain a
  heredoc behind `&&` after `git add`: if the add fails — a stale `.git/index.lock` is
  enough — the `&&` short-circuits, the heredoc never runs, and a later append writes a
  file containing only the tail. On 2026-09-01 that shipped commit `1bff2077` with a
  warning line as its subject and the whole explanation missing. It was already pushed,
  and rewriting a pushed commit to fix a message is not worth interrupting another agent,
  so the message stayed wrong. Write the file, check it exists, then commit.
- Include one short update under `docs/collaboration/agent-updates/` in the same commit.
  Record agent, scope, tests, untouched work, risks, and the next useful assist/review.
- **Push as soon as a commit is green. Do not sit on work.** The server pulls every five
  minutes, so an unpushed commit helps nobody and an unpushed *branch* is invisible to the
  other agents, who will then redo it. Client instruction, 2026-08-31: "做完你就立即推送部署".
  Run the checks, commit, `git push`, and say so. If the checks do not pass, fix or revert —
  do not leave the work parked locally as a third option.
- A local commit is not a push, deployment, or production verification. State each one
  separately. Pushing source is not deploying either: `out/` still has to be rebuilt and
  committed by whoever holds the release baton. Cloudflare purge is client-only; use the
  rule below.
- Review the other agent's finished commit read-only when useful. Put any fix in a new,
  focused commit so authorship and rollback stay clear.

### Anything the client must do by hand goes in the runbook, in full

`docs/collaboration/CLIENT-RUNBOOK.md` is the one place that tells Spooner what to do on
the server, in Cloudflare, in Search Console and in Clarity. When you finish work that
needs a manual step, add or update the section there — do not leave the instructions in a
chat reply, which is gone at the next compaction.

Write it for somebody who is not a developer and is being asked to run a command that can
take the site down. Every step names **where to click, what to type, what success looks
like, and what to do when it does not appear**. A command whose success is silent says so.
A command that can break the site is preceded by its check (`nginx -t` before
`nginx -s reload`) and by an explicit "stop here and send me a screenshot" if the check
fails. "Reload nginx" is not an instruction; it is an assumption that the reader already
knows what you know.

### Cloudflare purge is client-only

- Agents must not open the Cloudflare dashboard to click `Purge Everything`, automate the
  dashboard, obtain or use an API token, or call the zone purge endpoint. The client performs
  the zone-wide purge manually.
- Never imply that a zone-wide purge happened without direct evidence. A dashboard login page,
  a timed-out control session, an absent API token, a fresh edge cache key, and a successful
  origin deployment are five different facts.
- The release builder still owns `npm run deploy:prep`, the complete tracked `out/` commit,
  push, server/origin proof and public edge verification. Finish the release note with one
  short reminder for the client to purge; do not spend turns troubleshooting Cloudflare purge.

### Who owns what

| Area | Owner |
|---|---|
| Design, editorial imagery, brand assets | Codex |
| `src/app/es/**` (Spanish copy) | Codex |
| `content/**`, `scripts/**`, `src/data/**`, `src/lib/**` | Claude |
| `content/promo.json` | Codex: card copy only. Claude: timing only. |
| Building and committing `out/` | **The current release builder; use the rule below** |

`out/` is committed and a rebuild touches ~2350 files. Normal work should commit source
first. If `out/` is already dirty, that agent has the release-build baton; the other agent
must not rebuild or touch `out/`. The release builder incorporates the latest committed
source from both agents, runs `npm run deploy:prep`, commits the complete generated diff,
and records production verification separately. This is a soft handoff, not a lock.

### Decisions the client made are locked by tests, not by comments

`src/lib/promo-settings.test.ts` asserts the promo timing the client asked for. If you
believe a locked value should change, change the test in the same commit so the override
is deliberate and reviewable. `npm test` runs in CI.

## MOST IMPORTANT NOTES
- The primary Claude/Codex sessions use the lightweight shared-tree protocol above. When launching agent teams, give each spawned teammate its own worktree branch and merge at the end; do not let multiple teammates write the shared checkout.
- After editing `AGENTS.md`, run `bash scripts/sync-agent-rules.sh` to regenerate platform-specific instruction files.
- After editing `.claude/skills/clone-website/SKILL.md`, run `node scripts/sync-skills.mjs` to regenerate the skill for all platforms.

# Website Inspection Guide

## How to Reverse-Engineer Any Website

This guide outlines what to capture when inspecting a target website via Chrome MCP or browser DevTools.

## Phase 1: Visual Audit

### Screenshots to Capture
- [ ] Every distinct page — desktop, tablet, mobile
- [ ] Dark mode variants (if applicable)
- [ ] Light mode variants (if applicable)
- [ ] Key interaction states (hover, active, open menus, modals)
- [ ] Loading/skeleton states
- [ ] Empty states
- [ ] Error states

### Design Tokens to Extract
- [ ] **Colors** — background, text (primary/secondary/muted), accent, border, hover, error, success, warning
- [ ] **Typography** — font family, sizes (h1-h6, body, caption, label), weights, line heights, letter spacing
- [ ] **Spacing** — padding/margin patterns (look for a scale: 4px, 8px, 12px, 16px, 24px, 32px, etc.)
- [ ] **Border radius** — buttons, cards, avatars, inputs
- [ ] **Shadows/elevation** — card shadows, dropdown shadows, modal overlay
- [ ] **Breakpoints** — when does the layout shift? (inspect with DevTools responsive mode)
- [ ] **Icons** — which icon library? custom SVGs? sizes?
- [ ] **Avatars** — sizes, shapes, fallback behavior
- [ ] **Buttons** — all variants (primary, secondary, ghost, icon-only, danger)
- [ ] **Inputs** — text fields, textareas, selects, checkboxes, toggles

## Phase 2: Component Inventory

For each distinct UI component, document:
1. **Name** — what would you call this component?
2. **Structure** — what HTML elements / child components does it contain?
3. **Variants** — does it have different sizes, colors, or states?
4. **States** — default, hover, active, disabled, loading, error, empty
5. **Responsive behavior** — how does it change at different breakpoints?
6. **Interactions** — click, hover, focus, keyboard navigation
7. **Animations** — transitions, entrance/exit animations, micro-interactions

### Common Components to Look For
- Navigation (top bar, sidebar, bottom bar)
- Cards / list items
- Buttons and links
- Forms and inputs
- Modals and dialogs
- Dropdowns and menus
- Tabs and segmented controls
- Avatars and user badges
- Loading skeletons
- Toast notifications
- Tooltips and popovers

## Phase 3: Layout Architecture

- [ ] **Grid system** — CSS Grid? Flexbox? Fixed widths?
- [ ] **Column layout** — how many columns at each breakpoint?
- [ ] **Max-width** — main content area max-width
- [ ] **Sticky elements** — header, sidebar, floating buttons
- [ ] **Z-index layers** — navigation, modals, tooltips, overlays
- [ ] **Scroll behavior** — infinite scroll, pagination, virtual scrolling

## Phase 4: Technical Stack Analysis

- [ ] **Framework** — React? Vue? Angular? Check `__NEXT_DATA__`, `__NUXT__`, `ng-version`
- [ ] **CSS approach** — Tailwind (utility classes), CSS Modules, Styled Components, Emotion, vanilla CSS
- [ ] **State management** — Redux (check DevTools), React Query, Zustand, Pinia
- [ ] **API patterns** — REST, GraphQL (check network tab for `/graphql` requests)
- [ ] **Font loading** — Google Fonts, self-hosted, system fonts
- [ ] **Image strategy** — CDN, lazy loading, srcset, WebP/AVIF
- [ ] **Animation library** — Framer Motion, GSAP, CSS transitions only

## Phase 5: Documentation Output

After inspection, create these files in `docs/research/`:
1. `DESIGN_TOKENS.md` — All extracted colors, typography, spacing
2. `COMPONENT_INVENTORY.md` — Every component with structure notes
3. `LAYOUT_ARCHITECTURE.md` — Page layouts, grid system, responsive behavior
4. `INTERACTION_PATTERNS.md` — Animations, transitions, hover states
5. `TECH_STACK_ANALYSIS.md` — What the site uses and our chosen equivalents
