# Pro Portal — Implementation Tasks (Phase 0)

Companion to `one-guard-pro-portal-ux-brief.md`. That document explains *why*; this one is the
work order. Written to be executed directly by Claude Code against the existing repo.

**Scope of this file:** Phase 0 only — fixes to the build that exists. Phases 1–4 (capture flow,
search, property record, desk board) are new product surfaces and need design before code; they
are specified in §10 and §15 of the brief, not here.

**Target repo:** `one-guard-property-intelligence` (Vite + React SPA, hash routing, GitHub Pages,
state in `localStorage` under `oneguard-demo-v2`).

---

## Ground rules for this pass

1. **Do not restructure the design language.** Zero border-radius on cards/panels/rules, Archivo,
   warm neutral ground and the single hot accent are intentional. Changes below are surgical.
2. **Existing CSS custom properties are the source of truth.** Add tokens; don't replace the file.
3. **Preserve the existing a11y work** — `aria-pressed`, `role="list"`, `aria-live="polite"`,
   `prefers-reduced-motion`, print styles. Several tasks extend these; none should remove them.
4. **Every task below has an acceptance check that can be run in the browser console.** Use them.

---

## P0-1 · Semantic status tokens

**Problem:** `READY`, `IN REVIEW`, `JOB ACCESS`, `ACCESS PENDING`, `PLANNED` all render
`#7c1405` or `#ec3013`. Five meanings, one colour. Also fails WCAG 1.4.1 (colour alone).

**Do:**

Add to the `:root` token block:

```css
--status-ready-fg:      #1f5d3a;  --status-ready-bg:      #e8f2ec;  /* 6.83:1 */
--status-progress-fg:   #7a4a00;  --status-progress-bg:   #fdf1de;  /* 6.70:1 */
--status-review-fg:     #3a3a8c;  --status-review-bg:     #ececf7;  /* 8.28:1 */
--status-blocked-fg:    #ae1800;  --status-blocked-bg:    #ffe0d9;  /* 5.77:1 */
--status-published-fg:  #444141;  --status-published-bg:  #eae7e7;  /* 8.22:1 */
--status-planned-fg:    #605d5d;  --status-planned-bg:    #f8f4f4;  /* 5.97:1 */
--radius-pill: 999px;
```

Replace the current `.tag-accent` / `.tag-neutral` pair with a status-tag component carrying a
modifier per state. Two **separate families** — they answer different questions and must not look
alike:

| Family | Values | Token |
|---|---|---|
| **Work state** | Ready / Planned / In review / Passport updated / Access blocked | `ready` / `planned` / `review` / `published` / `blocked` |
| **Access state** | Standing access / Job access / Access pending | `published` (neutral) / `review` / `blocked` |

Every tag renders **glyph + text**, never colour alone. Suggested glyphs: `●` ready, `○` planned,
`◆` review, `✓` published, `▲` blocked. Radius `var(--radius-pill)`.

**Accept:**
```js
[...document.querySelectorAll('.tag')].map(t => [t.innerText, getComputedStyle(t).color])
// → no two different labels share a colour value
```

---

## P0-2 · Contrast failures

**Problem:** three measured AA failures, all the same root cause — `#ec3013` behind small text.

| Element | Now | Fix |
|---|---|---|
| `.btn-primary` ("Open work") | 3.76:1 | background `--color-accent-700` `#ae1800` → **6.41:1** |
| `.pro-horizon button[aria-pressed="true"]` | 3.76:1 | same |
| `ACCESS PENDING` tag | 3.76:1 | superseded by P0-1 (`--status-blocked-*`) |

**Do not** use `--color-accent-600` `#dd2b0f` as a substitute — measured **4.25:1**, still failing
below 18.66px bold. Keep `--color-accent` `#ec3013` for display type, rules, and brand marks only,
where it is large enough to pass.

**Accept:** every text/background pair in `main` computes ≥ 4.5:1. Reuse the contrast probe in
§6 of the brief.

---

## P0-3 · Tap targets and type floor

**Problem:** primary nav links measure 32 × 22px at 390px viewport. Footer links 13px tall.
`.btn-primary` 40px. Column labels 10px; calendar cells 9–11px.

**Do:**

- Nav links: min-height 44px, vertical padding to match, ≥8px separation.
- `.btn`, `.btn-primary`: min-height 44px desktop, **48px at ≤640px**.
- `.pro-horizon button`: min-height 44px.
- Footer links: min-height 44px (padding, not font-size — keep them visually quiet).
- Type floor: **nothing below 14px inside `main` at ≤640px**. Raise `.pro-ledger-head` labels
  (10px), row metadata (11px), and all `.pro-calendar-team-row` text (9–11px).

**Accept:**
```js
// at 390px width
[...document.querySelectorAll('main a, main button')]
  .filter(e => e.getBoundingClientRect().height < 44)          // → []
[...document.querySelectorAll('main *')]
  .filter(e => !e.children.length && e.innerText.trim()
    && parseFloat(getComputedStyle(e).fontSize) < 14)          // → []
```

---

## P0-4 · Deep links

**Problem:** routes carry no identifiers, and a cold load of `#/pro` renders the door-chooser
instead of the work list. Verified twice: set `location.hash = '#/pro'`, reload, get the landing.
A dispatcher cannot text a technician a link to a job.

**Do:**

- Parameterise: `#/pro/job/:jobId`, `#/pro/review/:updateId`. Keep `#/pro`, `#/pro/calendar`,
  `#/pro/review` as index routes.
- Persist the selected door to `localStorage` and read it on boot. Any `#/pro*` route on cold load
  renders the Pro shell directly — the door-chooser is `#/enter` only.
- Unknown route → a real 404 view, not a silent fallback to the landing.
- `Open work` navigates to the job's own URL. Reloading that URL returns to the same job.

**Accept:** `location.hash = '#/pro/job/<id>'; location.reload()` → the same job detail renders.

---

## P0-5 · Per-route titles, heading structure, skip link

**Problem:** `document.title` is `"One Guard — Property Intelligence"` on every route. The Pro page
has exactly one heading (`H1: Service work`) and zero `H2`–`H6`. No skip link.

**Do:**

- Set `document.title` on route change: `"1847 Maple Grove — Water heater · One Guard"`,
  `"Service work · One Guard"`, `"Passport review · One Guard"`.
- Give each major section a real heading. On `#/pro`: `H2` for the work ledger. On `#/pro/job`:
  `H2` for Relevant property record / Prior evidence / Owner instruction / What this visit should
  resolve / Management decision.
- Add a skip-to-content link as the first focusable element.
- **Move focus to the new `<h1>` on every route change.** SPA route changes leave focus on the
  clicked element by default; screen-reader users get no announcement. This is the single most
  commonly missed SPA a11y bug.

**Accept:** `document.title` differs across all six pro routes; `document.querySelectorAll('h2').length > 0`
on each; tabbing from page load reaches the skip link first.

---

## P0-6 · Nudge owner is a dead end

**Problem:** clicking `Nudge owner` on the `ACCESS BLOCKED` row produces no state change, no toast,
no route change. Row still reads `ACCESS BLOCKED` afterwards. Verified.

**Do:** optimistic state → button becomes `Nudge sent · 2:14 PM`, disabled for a cooldown window,
with a toast carrying a 10s undo. Record the event so it can appear on the access timeline later.
If a nudge genuinely cannot be sent in a demo build, the button should say so rather than lie.

**Accept:** clicking changes visible state and emits a toast.

---

## P0-7 · Stale label after publish

**Problem:** after `Approve and publish`, the review card still reads
`PROPOSED PASSPORT ADDITION`. The status chip correctly flips to `PUBLISHED`, but the section
heading does not. No success confirmation, no undo.

**Do:** section heading follows state — `PROPOSED PASSPORT ADDITION` → `PUBLISHED PASSPORT ENTRY`.
Add a confirmation toast with a 10s undo, then an immutable stamp: *Published Aug 21, 11:04 AM by
Dana Whitfield*.

**Accept:** publish, then assert no element contains `PROPOSED` for a published item.

---

## P0-8 · Cross-surface state drift

**Problem:** after publishing, `#/pro` shows `1302 Alder St → PASSPORT UPDATED` while
`#/pro/calendar` shows the same stop as `READY`. Verified. A record product that contradicts itself
loses the argument the first time a manager notices.

**Do:** derive every surface's status chip from one shared state selector. The calendar must not
compute status independently.

**Accept:**
```js
// after publishing, in Management lens
// status for 1302 Alder on #/pro === status on #/pro/calendar
```

---

## P0-9 · Calendar on mobile

**Problem:** `.pro-calendar-team-row` is `grid-template-columns: 150px 100px ×7` — an 850px fixed
track inside a 390px viewport, with 9px times and 10px status chips in 65px cells. Contained by an
overflow scroller, so no page overflow, but unreadable.

**Do:** below 640px, replace the team × day grid with an **agenda list** — horizontal day-selector
strip, then a vertical list of stops for the selected day using the same row component as `#/pro`.
Keep the grid ≥640px, with a sticky technician column and 14px minimum type.

**Accept:** at 390px, `.pro-calendar-team-row` is not rendered; the agenda list is.

---

## P0-10 · Marketing routes out of the work nav

**Problem:** `Mobile app` and `Sign up` sit in the technician's primary navigation. A tech on shift
should never see "Sign up."

**Do:** Pro nav is `Work · Calendar · Review`. Move the other two to the footer or an account menu.

---

## P0-11 · Door card contrast

**Problem:** white body copy over unmasked greyscale photography on the Homeowner and Property
Manager cards on `#/enter`. Also: the three `.door` buttons expose no accessible name in the
accessibility tree.

**Do:** add a scrim (`linear-gradient` overlay, or a solid panel behind the text block) sufficient
for 4.5:1 on the body copy. Give each `.door` button an `aria-label` — *"Enter as Service Pro"*.

---

## P0-12 · Localise the demo data

**Problem:** every sample property is in Fort Worth, TX. The reference buyer is in Greater Boston.
Shown to Comfort Professor, this reads as a generic template.

**Do:** replace sample properties with New England stock and equipment:

| Now | Replace with |
|---|---|
| 1847 Maple Grove Ln, Fort Worth | 42 Highland Ave, Somerville MA — 1912 two-family |
| 1302 Alder St, Fort Worth | 88 Chestnut St, Newton MA — 1948 colonial |
| 77 Quarry Ridge Rd, Fort Worth | 215 Broadway #4, Cambridge MA — 2006 condo |
| 220 Birchwood Ct #A–D | 30 Winter St #1–4, Medford MA |
| 918 Calloway Dr | 7 Grove Ln, Brookline MA |

Equipment should match the region: oil and gas **boilers**, steam radiators, indirect water heaters,
and at least one **oil-to-heat-pump conversion** with a Mass Save rebate note on file. Keep the
existing Rheem water heater — it's fine — but the HVAC should not be all-condenser.

Technician names, `Comfort Professor` as the provider, and the `A+ Comfort Club` reference are
already correct. Leave them.

---

## Suggested commit sequence

```
1  P0-1  feat(tokens): semantic status colour families
2  P0-2  fix(a11y): accent-700 for text-bearing accent surfaces
3  P0-3  fix(a11y): 44/48px targets, 14px type floor in field views
4  P0-11 fix(a11y): door card scrim + accessible names
5  P0-4  feat(routing): parameterised job/review routes, session door
6  P0-5  feat(a11y): per-route titles, heading structure, focus management
7  P0-8  refactor(state): single status selector across surfaces
8  P0-7  fix(review): label follows state, publish confirmation + undo
9  P0-6  fix(work): nudge owner produces state
10 P0-9  feat(calendar): agenda layout below 640px
11 P0-10 chore(nav): marketing routes out of work IA
12 P0-12 chore(data): Greater Boston demo dataset
```

Tasks 1–4 are independent and parallelisable. 5 and 6 should land together. 7 must precede 8.

---

## Regression checks before merge

Run at 390 × 844 **and** 1440 × 900, on every pro route:

- [ ] No text/background pair in `main` below 4.5:1
- [ ] No interactive element in `main` under 44px tall
- [ ] No text in `main` under 14px at ≤640px
- [ ] `document.scrollingElement.scrollWidth === innerWidth` (no horizontal overflow)
- [ ] `document.title` unique per route
- [ ] Every route deep-links and survives reload
- [ ] Keyboard: tab reaches skip link → nav → lens → horizon → rows in visual order
- [ ] `prefers-reduced-motion: reduce` still honoured
- [ ] Print stylesheet still produces a readable work list
- [ ] `localStorage.clear()` → first load renders correctly with no saved state
