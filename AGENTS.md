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

## TWO AGENTS SHARE THIS WORKING TREE — READ BEFORE EDITING ANYTHING

Claude and Codex both work on this repository, on the **same checkout**, taking turns.
They are not on separate branches, so git never reports a conflict. The failure mode is
a **silent overwrite**: one agent sets a value because the client asked for it, the other
changes it while working on something adjacent, and nothing anywhere says so. This has
already happened twice to `content/promo.json` (`delaySeconds` 10 → 20 → 10).

### Before you start working

```bash
node scripts/agent-lock.mjs status                        # is anyone mid-task?
node scripts/agent-lock.mjs claim <claude|codex> --task "what you are doing"
```

If it refuses, **the other agent is mid-task**. Do not force it because you are impatient
— pick up something in your own area, or stop and ask the human. Only `--force` when you
know for certain the other side has stopped.

### When you finish

```bash
node scripts/agent-lock.mjs release
```

That prints a hand-off line telling the other agent the tree is free. **Release as soon as
you stop working**, not at the end of the session — a held lock blocks the other side.

A `pre-commit` hook refuses commits while the other agent holds the lock. Enable it once
per clone: `git config core.hooksPath .githooks`

### Who owns what

| Area | Owner |
|---|---|
| Design, editorial imagery, brand assets | Codex |
| `src/app/es/**` (Spanish copy) | Codex |
| `content/**`, `scripts/**`, `src/data/**`, `src/lib/**` | Claude |
| `content/promo.json` | Codex: card copy only. Claude: timing only. |
| Building and committing `out/` | **One side per session — agree first** |

`out/` is committed and a rebuild touches ~2350 files. If both sides rebuild, whoever
commits last decides what ships, and nobody can see whose source changes made it in.

### Decisions the client made are locked by tests, not by comments

`src/lib/promo-settings.test.ts` asserts the promo timing the client asked for. If you
believe a locked value should change, change the test in the same commit so the override
is deliberate and reviewable. `npm test` runs in CI.

## MOST IMPORTANT NOTES
- When launching Claude Code agent teams, ALWAYS have each teammate work in their own worktree branch and merge everyone's work at the end, resolving any merge conflicts smartly since you are basically serving the orchestrator role and have full context to our goals, work given, work achieved, and desired outcomes.
- After editing `AGENTS.md`, run `bash scripts/sync-agent-rules.sh` to regenerate platform-specific instruction files.
- After editing `.claude/skills/clone-website/SKILL.md`, run `node scripts/sync-skills.mjs` to regenerate the skill for all platforms.

@docs/research/INSPECTION_GUIDE.md
