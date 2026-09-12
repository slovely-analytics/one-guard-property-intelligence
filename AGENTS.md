# Agent guide

For every AI agent session in this repository, regardless of harness. Read this file before
changing the app. `PRODUCT.md` is the product source of truth; `docs/one-guard-pro-portal-ux-brief.md`
is the strategic UX audit and build spec (§9–16 especially); `docs/PRO-PORTAL-TASKS.md` is the
Phase 0 execution work order derived from the brief, written to be run task-by-task. Read whichever
of those the current task actually touches before writing code.

## Ground truth

- **Stack**: Vite + React 19 + TypeScript, hash routing (`app/src/routing/useHashRoute.ts`), no
  backend. `npm run build` = `tsc -b && vite build`; `npm run lint` = `oxlint`. There is no test
  suite — build and lint are the only automated checks, so run both from `app/` before committing.
- **Deploy**: GitHub Pages via `.github/workflows/deploy-pages.yml`, triggered by a push to `main`
  that touches `app/**`. Never push to `main` directly from an agent session — land changes on a
  branch and open a PR.
- **State**: all app state persists to `localStorage` under a versioned key in `app/src/store.ts`
  (currently `oneguard-demo-v4`; bump the version suffix if you change the persisted shape, so
  stale shapes don't crash old sessions). "Reset demo" in the footer clears it. There is no auth
  and no live ServiceTitan connection — this is a clickable demo on synthetic data, and copy/UI
  must not imply otherwise (see Product Principles in `PRODUCT.md`).
- **Design tokens live in `app/src/modernist.css`** and are the source of truth for the look. Add
  tokens there; don't fork a parallel token file. `app/src/app.css` holds route/component styles
  that consume those tokens.

## Non-negotiable invariants

- **Zero border-radius design language for cards, panels, rules, and photography** — `--radius-sm`,
  `--radius-md`, `--radius-lg` are all `0` and that is intentional brand, not an oversight. Touch
  controls (buttons, inputs, steppers) get `--radius-control: 4px`; tags and filter chips get
  `--radius-pill: 999px`. Do not round a card or panel to make something look more "finished."
- **`--color-accent` (`#ec3013`) is for large/display type, rules, and brand marks only.** Any
  accent surface carrying small text must use `--color-accent-700` (`#ae1800`, 6.41:1). Do not
  substitute `--color-accent-600` (`#dd2b0f`) for this — it measures 4.25:1 and still fails AA
  below 18.66px bold.
- **Semantic status tokens are two separate families that must never look alike**: work state
  (`ready` / `planned` / `review` / `published` / `blocked` / `progress`) and access state, via
  `StatusTag` (`app/src/components/StatusTag.tsx`) — filled vs. outlined rendering of the same
  `--status-*` palette in `modernist.css`. Every status tag carries **colour + glyph + text**;
  never encode state in colour alone (WCAG 1.4.1). Add new states as new `--status-*-fg`/`-bg`
  pairs at ≥4.5:1 (existing pairs are ≥5.7:1) rather than reusing an existing family for a new
  meaning.
- **Tap targets ≥44px (≥48px at ≤640px), body type floor 14px inside `main` at ≤640px**, no
  text/background pair under 4.5:1. These are enforced acceptance checks in
  `docs/PRO-PORTAL-TASKS.md` (P0-2, P0-3) — field surfaces are used one-handed, gloved, in poor
  light, so don't regress them for visual density.
- **Preserve existing a11y patterns and extend them, don't replace them**: `aria-live="polite"` on
  live-updating summaries (work-count banner, calendar range, review detail), `prefers-reduced-motion:
  reduce` support in `app.css`, per-route `document.title`, and focus moving to the new `<h1>` on
  route change. New routes/screens should follow the same pattern, not reinvent it.
- **"Do not restructure the design language."** (verbatim ground rule from
  `docs/PRO-PORTAL-TASKS.md`.) Token and pattern changes should be additive and surgical, driven by
  the brief's gap analysis, not a stylistic rewrite.

## Product conventions

- **One Guard is the property-intelligence and longitudinal-record layer; ServiceTitan is the
  system of record for dispatch, scheduling, jobs, estimates, invoices, and payments.** Don't build
  competing scheduling/dispatch/CRM features — the existing scheduling-boundary disclaimer in the
  product copy is a deliberate positioning choice, not a gap to fill.
- **Evidence before confidence.** Distinguish `Confirmed` vs. `Provisional` on anything derived
  from a visit; never let synthetic, inferred, or unverified data render as if it were confirmed.
  Work records are attributed per contributing company — don't silently rewrite another company's
  history.
- **Role language is fixed**: Homeowner, Property Manager, Service Pro; the shared artifact is the
  **Property Passport**. Keep terminology consistent with `PRODUCT.md` rather than introducing
  synonyms (the brief itself flags "Passport update / addition / entry" drift as a defect to fix,
  not a pattern to copy).
- When implementing a UX brief task, cite its task ID (e.g. `P0-1`) in the commit message and run
  its stated acceptance check before committing — the existing commit history
  (`feat(tokens): semantic status colour families`, `fix(a11y): accent-700 for text-bearing accent
  surfaces`, etc.) follows `type(scope): summary` and traces back to a brief/task-list item.

## Session discipline

- Confirm `git status` and branch before starting; this repo has no `CONTRIBUTING.md`, so branch
  and PR practice is: never commit to `main` directly, work on a task branch, open a PR for review.
- Run `npm run build` and `npm run lint` from `app/` after any change under `app/**` and note the
  result in the PR description — there is no test suite standing in for this.
- Treat `docs/2026-08-19-client-call-notes.md` and `docs/next-meeting-discovery.md` as business
  context (client direction, open questions), not implementation instructions — implementation
  instructions live in the brief and the task list.
