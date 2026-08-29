# One Guard — Pro Portal
## UX/UI Review and Design Brief

**Subject:** `slovely-analytics.github.io/one-guard-property-intelligence/#/pro` (Service Pro door)
**Reference buyer:** Comfort Professor — HVAC / plumbing / water / generators, Greater Boston (HQ Wilmington, MA)
**Reviewed:** 29 Aug 2026, against the live build (bundle `index-BFKNiasa.js`)
**Audience:** the UX/UI design agent that will take this forward
**Status of subject:** working demo prototype, hash-routed SPA, `localStorage`-backed state (`oneguard-demo-v2`), sample data only

---

## 0. How to read this

Sections 1–3 are the strategic frame — read them before touching a canvas, because half the design problems here are positioning problems wearing a UI costume. Sections 4–8 are the audit. Sections 9–16 are the build spec. Section 17 lists what only the client can answer.

Where a number appears (contrast ratio, pixel height, font size), it was measured off the running build, not estimated. Those are safe to cite.

---

## 1. Executive summary

**The verdict:** the Pro portal is a genuinely good *thesis* rendered as a *reading surface*. It is not yet a tool. A technician cannot work inside it, and a service manager cannot run anything from it. Both can only look at it.

Three things are true at once:

1. **The concept is defensible and unusually well-articulated.** "The record belongs to the property," owner-granted access with expiry, an attributed evidence chain, and management review before anything reaches the owner's permanent record — that is a coherent product philosophy, and the copy carries it better than most funded startups manage. The scheduling-boundary disclaimer ("Dispatch, assignments, and schedule changes remain in ServiceTitan") is a mature, honest positioning choice.

2. **The execution is a browsing experience for a job that happens on a phone, in a basement, with dirty hands.** The single most important screen — creating a Passport update — is four free-text fields (three `<textarea rows="2">` and one `<input type="text">`) with no camera capture, no voice, no structured measurements, no draft state, no validation, and no offline story. That is the adoption cliff. Everything else is secondary.

3. **The "internal use" claim is not yet supported.** There is no property search, no customer or equipment directory, no dispatch, no assignment, no team management, no settings, no reporting, no notifications, and no admin. The Pro navigation is five items: Work, Calendar, Review, Mobile app, Sign up. Two of those five are marketing. A company does not run its internals on three screens.

**The single highest-leverage move:** stop designing the Pro portal as a portal. Design it as a **field capture app with a management review desk attached**, and let the desktop views be a projection of that. Right now it is the reverse — a desktop reading surface with a form bolted on — and the field is where the data actually originates.

**Second highest:** decide, explicitly and in writing, that One Guard is not competing with ServiceTitan. The demo already half-says this. Say it fully, and let it shape the IA: One Guard owns *the property's knowledge*, the FSM owns *the job's money and logistics*. Every screen should be legible as one or the other.

---

## 2. Method and scope

Walked every route the bundle exposes:

`/enter` · `/pro` · `/pro/calendar` · `/pro/review` · `/pro/job` · `/pro/update` · `/mobile` · `/signup` · plus the homeowner and PM doors (`/passport`, `/access`, `/health`, `/maintenance`, `/projects`, `/warranties`, `/portfolio`) for context.

Tested both Pro lenses (Technician / Management), all three work horizons (Today / 7 / 30 days), both calendar modes, the approve-and-publish flow, and the update composer. Measured computed styles, contrast ratios, tap-target geometry, grid behaviour, and the accessibility tree at 390 × 844 and at desktop width.

**Not in scope / not observable:** real data volumes, real auth, performance under load, actual ServiceTitan integration, and any backend. Findings about those are flagged as assumptions.

---

## 3. Strategic frame — what this portal has to be

### 3.1 The wedge

ServiceTitan's field mobile app already stores equipment at the location: age, install date, manufacturer, model, serial, capacity, warranty, memberships, memos, and service history — and shows a technician that history on site. So **"the tech can see the model number" is not a differentiator.** It is table stakes that the incumbent already ships.

What ServiceTitan structurally cannot do is:

- **Portability.** The record dies inside one contractor's tenant. Change contractors, lose the history.
- **Owner control.** The homeowner is a record in the contractor's CRM, not a party who grants and revokes access.
- **Cross-trade continuity.** Northline Plumbing's entry sitting alongside Comfort Professor's, on the same property, is impossible inside a single-tenant FSM.
- **Owner-legible narrative.** FSM job notes are written for the office. The Passport's "owner-ready handoff" is written for the person who owns the house.

**That is the whole product.** The Pro portal's job is to make contributing to that record cheaper than not contributing, and to make consuming it obviously better than reading a ServiceTitan job history. Design every screen against those two sentences.

### 3.2 Competitive note — act on this

Home Alliance ships **Passport™**, positioned as "the permanent digital record for your home … infrastructure that outlasts any single owner" — the same concept, the same word, and it is live. One Guard uses "Property Passport™" throughout both the homeowner and pro surfaces.

This is a naming and positioning collision, not a design nitpick. Flag it to the client before any brand work is commissioned. Design implication: the Pro portal's differentiation has to be *the contribution experience and the management review layer*, because the noun is contested.

### 3.3 The reference buyer, concretely

Comfort Professor is not a generic HVAC shop, and the design should reflect what is specific about them:

| Attribute | Design consequence |
|---|---|
| **Multi-trade** — HVAC, plumbing, water filtration, generators, electric | One property record must span trades. Equipment taxonomy cannot be HVAC-shaped. A tech who arrives for a water heater should see the boiler and the softener too. |
| **A+ Comfort Club, three membership tiers** | Recurring maintenance visits are the highest-volume, most template-able job type — and the demo already references "A+ Comfort Club visit." **This is the beachhead.** A maintenance-visit capture template is the fastest path to daily use. |
| **Mass Save rebates / heat-pump conversions** | Massachusetts rebate and incentive work is documentation-hungry: existing equipment, age, fuel type, condition. A property record that pre-fills a rebate application is a hard-dollar reason to adopt. Currently unaddressed. |
| **24/7 emergency service** | A tech dispatched at 2am to an unfamiliar property is the *maximum-value* moment for prior-visit context, and the moment most likely to hit no-signal, one-handed, low-light conditions. Design for it explicitly. |
| **Boston metro, dense old housing stock** | Basements, crawlspaces, tight mechanical rooms, poor connectivity. Offline-first is not a nice-to-have. |
| **Locally owned, ~100 yrs combined leadership experience, education-forward brand** | The "management review before publish" gate maps exactly onto their brand promise ("we'll walk you through everything"). Lean into it — it is the reason this product fits *them* specifically. |
| **Fleet of branded vans, technician-heavy** | Named technicians appearing in the owner's record is a marketing asset. Make attribution feel like credit, not surveillance. |

**Demo fidelity issue:** every sample property is in Fort Worth, TX. If this demo is shown to a Boston company, localise it — Somerville triple-decker, Newton colonial, Cambridge condo, with New England equipment (boilers, oil-to-heat-pump conversions, steam radiators). Small change, large credibility effect.

### 3.4 The three jobs to be done

Everything in the Pro portal should resolve to one of these. If a screen serves none of them, cut it.

1. **PREP** — *"Before I open the truck, what do I already know?"* (technician, 60 seconds, in the van)
2. **CAPTURE** — *"Record what I just learned, once, without typing an essay."* (technician, 90 seconds, on site, phone)
3. **DECIDE** — *"What needs a human judgment before it becomes permanent?"* (manager/dispatcher, desktop, batched)

The current build serves PREP well, DECIDE adequately, and CAPTURE badly. That ordering is exactly backwards relative to product risk.

---

## 4. What works well — keep these

Genuinely good, and the design agent should not "improve" them away:

- **The ledger row as the core object.** When / Property / Work and context / Owner / State and action is the right five-part decomposition of a service visit. It reads.
- **The Technician ↔ Management lens toggle.** One route, two audiences, correctly implemented — content, item count, headline and framing all change (`/pro/review` becomes "My Passport updates" for the tech and "Passport review" for the manager). This is a better pattern than separate role portals and should be extended, not replaced.
- **Access state as a first-class, visible property.** `STANDING ACCESS` / `JOB ACCESS` / `ACCESS PENDING`, with grant provenance and expiry ("Granted by owner Aug 19 · expires 7 days after completion"). No FSM surfaces this. It is the product's signature and it is already legible.
- **"Decision on deck."** Attaching an explicit pending judgment to a work item is a real idea. Most software makes you infer why a job matters. This one states it.
- **Evidence confidence: Confirmed vs. Provisional.** Epistemic honesty as a UI control. Rare and correct for a record meant to outlive the visit.
- **The owner handoff preview inside the composer.** Showing the tech what the homeowner will read, live, is the right forcing function for tone.
- **Editorial visual language.** Archivo throughout, zero border-radius, warm neutral ground (`#f3f2f2`), single hot accent (`#ec3013`), thin rules. It reads as a document rather than a dashboard, which suits "permanent record." Do not sand this into generic SaaS.
- **The markup is better than the average prototype.** `aria-pressed` on toggles, `role="list"`, `aria-live="polite"` on the count summary, `aria-label` on decorative property thumbs, `prefers-reduced-motion` support, and print stylesheets. Whoever built this cared. Preserve that baseline.
- **The scheduling-boundary disclaimer.** Stating what the product does *not* do builds more trust with an operator than any feature claim.

---

## 5. Critical findings

Severity: 🔴 blocks adoption · 🟡 blocks trust or daily use · 🟢 polish

| # | Finding | Sev | Evidence | Recommendation |
|---|---|---|---|---|
| F1 | **Capture is prose-typing.** The update composer is 3 × `textarea rows="2"` + 1 text input. No camera, no voice, no structured fields, no templates, no draft, no validation, no offline. | 🔴 | `#/pro/update` DOM | Rebuild as a mobile-first, capture-first flow. See §10.4. This is the project. |
| F2 | **No pro mobile experience exists.** `/mobile` markets a *homeowner* app only. The pro surfaces are responsive web with 22px-tall nav links. | 🔴 | `#/mobile`; nav link heights measured at 390px | Design a dedicated field surface (PWA or native shell). The desktop views are the secondary artifact. |
| F3 | **No deep links.** Routes carry no IDs (`#/pro/job`, not `#/pro/job/1847-maple`). Loading `#/pro` cold renders the door-chooser, not the work list — verified twice. | 🔴 | Route strings in bundle; cold-load test | Addressable URLs for every job, property, and review item. A dispatcher must be able to text a tech a link. Non-negotiable for a work tool. |
| F4 | **No search, no property directory, no equipment index.** Pro nav is Work / Calendar / Review / Mobile app / Sign up. There is no way to answer "what do we know about 14 Elm St?" | 🔴 | Nav enumeration | Add global search (§9) and a Properties section. This is the largest single gap between "demo" and "internal tool." |
| F5 | **Status semantics collapse into one colour.** `READY`, `IN REVIEW`, `JOB ACCESS`, `ACCESS PENDING`, `PLANNED` all render `rgb(124,20,5)` or `#ec3013`. The token set has no success/warning/info/neutral-info ramp. | 🟡 | Computed styles; `--color-*` audit | Introduce a semantic status palette. See §11.1. Status must be distinguishable at a glance and without colour alone. |
| F6 | **Primary button fails WCAG AA.** `#f3f2f2` on `#ec3013` = **3.76:1** at 12px/800. Same ratio on the selected horizon chip and the `ACCESS PENDING` tag at 11px. | 🟡 | Measured | Use `--color-accent-700 #ae1800` for any accent surface carrying small text — measured **6.41:1**. Note `--color-accent-600 #dd2b0f` reaches only **4.25:1**, which still fails AA below 18.66px bold. Keep `#ec3013` for large display type, rules and brand marks only. |
| F7 | **Tap targets far below minimum.** Primary nav links 22px tall; "Reset demo data" 19px; footer links 13px; primary `Open work` button 40px. WCAG 2.5.5 / platform HIG want ≥44px. | 🟡 | Measured at 390 × 844 | Field-facing targets ≥48px with ≥8px separation. Gloves and wet hands are the real operating condition. |
| F8 | **Type floor is too small for the field.** Column labels 10px; calendar cells 9–11px; secondary metadata 11px; body 15px. | 🟡 | Measured | Field minimum 16px body / 14px meta. Reserve ≤12px for desktop-only chrome. See §11.2. |
| F9 | **Dead-end action.** `Nudge owner` produces no state change, no toast, no route change, no confirmation. | 🟡 | Clicked; row remains `ACCESS BLOCKED` | Every action needs an outcome: optimistic state, undo window, and a visible trace on the access timeline. |
| F10 | **No empty, loading, error, offline, or permission-denied states anywhere.** | 🟡 | Full route walk | Spec all five for every list and detail surface. See §12. |
| F11 | **Management lens is a filter, not a console.** It adds one row and "Decision:" lines. No assignment, no capacity, no reassignment, no exception queue, no SLA, no reporting. | 🟡 | Lens comparison | Split Management into its own surface with real operating primitives. See §10.6. |
| F12 | **Calendar is unusable on a phone.** Team grid is a 850px fixed track (`150px + 7 × 100px`) inside a 390px viewport, with 9px times and 10px status chips in 65px cells. | 🟡 | Computed `grid-template-columns` | Mobile calendar = agenda list, not a grid. Grid is a desktop-only projection. |
| F13 | **Document title never changes across routes.** Always "One Guard — Property Intelligence." No H2s — the entire page is a single H1 plus unlabelled sections. No skip link. | 🟢 | AX tree | Per-route titles, sectioned heading hierarchy, skip-to-content link. |
| F14 | **Stale label after state change.** After publishing, the review card still reads "PROPOSED PASSPORT ADDITION." No success confirmation, no undo. | 🟢 | Approve-and-publish flow | Label should follow state. Add a confirmation with a 10s undo, then a permanent published stamp. |
| F15 | **Photo contrast on the door cards.** White body copy over unmasked greyscale photography on the Homeowner and Property Manager cards. | 🟢 | Visual | Scrim or solid panel behind text. |
| F16 | **Cross-surface state drift.** After publishing an update, the work list shows `1302 Alder St → PASSPORT UPDATED` while the calendar shows the same stop as `READY`. | 🟡 | Verified after approve-and-publish | One state model, projected into every view. A record product cannot contradict itself. |
| F17 | **Marketing routes inside the work IA.** "Mobile app" and "Sign up" sit in the technician's primary nav. | 🟢 | Nav | Move to a footer or an account menu. A tech on shift should never see "Sign up." |

---

## 6. Accessibility audit (WCAG 2.1 AA)

Measured against the live build. Not exhaustive — no assistive-tech testing was performed.

**Failures**

| Criterion | Element | Measured | Required |
|---|---|---|---|
| 1.4.3 Contrast (Minimum) | `Open work` primary button, `#f3f2f2` on `#ec3013`, 12px/800 | **3.76:1** | 4.5:1 |
| 1.4.3 | Selected horizon chip `Today`, 13px | **3.76:1** | 4.5:1 |
| 1.4.3 | `ACCESS PENDING` tag, `#ec3013` on `#f3f2f2`, 11px | **3.76:1** | 4.5:1 |
| 1.4.1 Use of Colour | Status tags — five distinct states, one hue | Colour-only | Add glyph/shape/weight differentiation |
| 2.5.5 Target Size | Nav links 32 × 22px; footer links 13px tall | 22px | 44 × 44px |
| 1.3.1 Info and Relationships | One H1, zero H2–H6; sections unlabelled | — | Sectioned headings |
| 2.4.2 Page Titled | Title identical on all routes | — | Unique per route |

**Passes / good practice already present**

- `lang="en"` set; `focus-visible` styles defined
- `aria-pressed` correctly reflects toggle state on both lens and horizon controls
- `aria-live="polite"` on the work-count summary — the right call
- `role="list"` / `role="listitem"` on the ledger; `role="img"` + `aria-label` on background-image property thumbs
- `prefers-reduced-motion: reduce` honoured
- No horizontal page overflow at 390px (`scrollWidth === innerWidth`)
- Print stylesheet present

**Not verified, must be tested before launch:** keyboard focus order through the lens/horizon/ledger sequence; screen-reader announcement of state changes on approve/publish; focus management on route transitions (SPA route changes almost never move focus correctly by default); colour-blind legibility of the status system once expanded.

---

## 7. Visual design and design-system assessment

**Existing token foundation** (already in the build — build on it, do not restart):

```
--color-bg        #f3f2f2      --color-accent      #ec3013
--color-surface   #eae9e9      --color-accent-2    #e15b47
--color-text      #201e1d      --color-divider     #201e1d66
--color-neutral-100…900  #f8f4f4 → #2d2b2b   (9 steps)
--color-accent-100…900   #fff2ef → #4d170e   (9 steps)
--font-heading / --font-body  "Archivo", system-ui   (heading weight 800)
--space-1…8      4 / 8 / 12 / 16 / 24 / 32px
--radius-sm/md/lg  0 / 0 / 0
--shadow-sm/md/lg  subtle, three steps
```

**Assessment**

- **Strong:** one typeface, one accent, zero radius, warm neutral ground. Coherent and distinctive. The editorial register is the right emotional match for "permanent record."
- **Gap 1 — no semantic colour layer.** Nine neutrals and nine accents, but nothing that means *good*, *warning*, *blocked*, or *informational*. A work application needs this before anything else. See §11.1.
- **Gap 2 — spacing scale skips.** 4/8/12/16/24/32 with no 20, 40, 48, 64. Dense field layouts and airy desktop layouts both need more room at the top of the scale.
- **Gap 3 — no elevation or density system.** Shadows are defined but barely used; there is no articulated "comfortable vs. compact" density mode. A tech on a phone and a dispatcher scanning 40 rows need different densities of the same component.
- **Gap 4 — zero radius is a field-ergonomics liability at small sizes.** Keep 0 for cards, panels and rules (it is the brand), but allow `--radius-pill` for status tags and `4px` for touch controls, so tappable things read as tappable.
- **Risk:** Archivo 800 for headings plus 10–11px metadata creates an extreme contrast in weight and size with nothing in between. The mid-scale is missing, which is why dense screens read as noisy.

**Hierarchy notes.** On the work list, the eye lands on the red `Open work` buttons — the least informative element on the row. It should land on **property + work type**, then **state**, then action. Currently red is doing four jobs at once (brand, primary action, status, emphasis) and therefore does none of them well. Constrain red to one job — primary action — and give status its own visual language.

---

## 8. Gap map — what "internal use" actually requires

Present (✅), partially present (◐), absent (✗).

| Capability | State | Notes |
|---|---|---|
| Daily work list, horizon filtering | ✅ | Good |
| Job context / prior evidence | ✅ | Best screen in the build |
| Owner-granted access visibility | ✅ | Signature feature |
| Passport update composer | ◐ | Exists; wrong shape entirely (F1) |
| Management review and publish | ✅ | Works, persists |
| Team calendar (read-only) | ◐ | Desktop only, mobile broken (F12) |
| **Global search** | ✗ | Blocker |
| **Property / customer directory** | ✗ | Blocker |
| **Equipment index across the book of business** | ✗ | Blocker |
| **Deep-linkable jobs and properties** | ✗ | Blocker |
| **Offline capture and sync** | ✗ | Blocker for field use |
| **Photo / video capture from device** | ✗ | Blocker for field use |
| Assignment, dispatch, reassignment | ✗ | Explicitly out of scope — keep it that way, but show FSM state read-only |
| Notifications / inbox (access granted, update returned) | ✗ | Needed |
| Team roster, roles, permissions | ✗ | Needed for a company account |
| Settings, branding, templates, admin | ✗ | Needed |
| Reporting (capture rate, review latency, record completeness) | ✗ | This is how the owner justifies the subscription |
| Membership (A+ Comfort Club) visit tracking | ✗ | Highest-value beachhead, currently only a text mention |
| Rebate / incentive documentation support | ✗ | Boston-specific hard-dollar hook |
| ServiceTitan sync status and conflict handling | ✗ | Referenced in copy, absent in UI |
| Onboarding / empty-company first-run | ✗ | Needed |

---

## 9. Target information architecture

Replace the five-item flat nav. Two distinct surfaces, one shared object model.

### 9.1 Field surface (phone-first, the primary product)

```
Today            default landing; route stops in time order
  └ Job          /pro/job/:jobId
      ├ Brief    prior record, access scope, owner instruction, decision on deck
      ├ Capture  /pro/job/:jobId/capture   ← the money screen
      └ History  full property timeline, all trades, all contractors
Search           properties, equipment, serials — one field, one result list
Mine             my submitted updates: draft / in review / returned / published
```

Four destinations. That is the whole field app. Anything else goes in an account sheet.

### 9.2 Desk surface (management, desktop)

```
Board       exception-first work console (replaces the Management lens)
Review      publish queue with bulk actions and return reasons
Properties  directory → property record → equipment → timeline
Calendar    team time map, read-only mirror of the FSM
Insights    capture rate, review latency, record completeness, access health
Admin       team, roles, templates, branding, integrations
```

### 9.3 Routing rules (hard requirements)

- Every route carries its identifier: `/pro/job/:jobId`, `/pro/property/:propertyId`, `/pro/review/:updateId`.
- A cold load of any authenticated route renders that route — never a door-chooser. Role comes from the session, not from a click.
- `document.title` reflects the route: `1847 Maple Grove — Water heater · One Guard`.
- Back/forward behave. Route changes move focus to the new `<h1>`.
- Unknown route → a real 404 with a search field, not a silent fallback.

---

## 10. Screen specs

### 10.1 App shell

**Field (< 768px):** sticky bottom tab bar, 4 items, 56px tall, 24px icons with labels. Top bar carries only the property/job title and a back affordance. Persistent, dismissible offline banner when disconnected: *"Working offline — 2 updates will send when you reconnect."*

**Desk (≥ 1024px):** left rail, 220px, collapsible to 64px icons. Top bar carries global search (⌘K), an unread indicator, and the account menu. Lens toggle moves into the account menu — role is who you are, not a view you pick.

Remove "Mobile app" and "Sign up" from work navigation entirely.

### 10.2 Today (field) / Board (desk)

Keep the five-part row decomposition. Changes:

- **Sort by time, group by day.** Show a "now" marker and elapsed/remaining time on the current stop.
- **Row states:** `Upcoming` · `En route` · `On site` · `Captured` · `In review` · `Published` · `Blocked`. Seven states, seven distinct treatments (§11.1).
- **Access blocked is an exception, not a row.** Pin blocked items to the top of the list in a distinct band with a working `Request access` action.
- **Field row = one tap target**, full-width, ≥96px tall, with the property photo as a 64px leading thumb, work type as the primary line, and equipment summary as the secondary. Swipe left → Navigate. Swipe right → Start capture.
- **Desk Board is exception-first:** default view is *blocked + awaiting review + overdue capture*, not the full day. A manager opens software to see what is wrong.
- **Counts must be actionable.** "1 access blocked" should be a filter chip, not static text.

### 10.3 Job brief

Best screen in the current build. Keep the structure — access scope, relevant property record, prior evidence with attribution, owner instruction, what this visit should resolve, management decision on deck. Additions:

- **Above the fold on a phone:** address, equipment, one-line "last time we were here," and the access state. Everything else below.
- **Attribution is the product** — show contractor logos or initials on prior entries. Seeing "Northline Plumbing" in your own record is the portability promise made visible.
- **Equipment card is tappable** → full equipment record with serial, warranty status, install date, all history across all contractors.
- **Owner instruction gets visual privilege.** It is the only content on the screen written by the person paying. Do not let it read like metadata.
- **One primary action, pinned to the bottom on mobile:** `Start capture`.
- **Add "Not what I expected"** — a fast path when the record is wrong. Record accuracy depends on techs being able to dispute it cheaply.

### 10.4 Capture — the screen the project lives or dies on

Current: four text fields on a desktop page. Target: a guided, mostly-tapping, camera-forward mobile flow that a technician completes in under 90 seconds with one hand.

**Principles**

1. **Photo first, prose last.** Open the camera, not a keyboard. Photos are the highest-value, lowest-effort evidence a tech produces.
2. **Templates by work type.** Maintenance visit, diagnostic, replacement, install, emergency. Comfort Professor's A+ Comfort Club tune-up is the first template to ship — it is the highest-volume job and the most repeatable.
3. **Structured before unstructured.** Anode depletion %, temperature rise, static pressure, amp draw, refrigerant charge, combustion readings, water hardness — steppers, sliders and chips, not sentences. Structured fields are queryable later; prose is not.
4. **Voice as a first-class input**, not an accessibility afterthought. Transcribe, then let the tech confirm or edit. Talking beats typing in a mechanical room, every time.
5. **Draft is the default state.** Autosave every keystroke to local storage; survive app kill, call interruption, dead zone, and battery death.
6. **Offline-first with an honest sync queue.** Show queued item count, per-item status, and retry. Never silently drop a capture.

**Flow**

```
1  Evidence     camera / roll · auto-tag to equipment · optional annotation (arrow, circle)
2  Work done    template chips, multi-select, + "other" free text
3  Findings     structured measurements for this equipment type
4  Confidence   Confirmed / Provisional  (keep — it is excellent)
5  Next step    chip suggestions from the template + free text
6  Preview      owner-ready handoff, exactly as the homeowner will read it
7  Submit       → management review
```

**Specs**

- Steps 1–5 each fill one phone screen. Progress indicator. Back never loses input.
- Every input ≥48px. Primary action pinned to the bottom safe area.
- The owner preview is **always visible** on desk (side-by-side) and **always one tap away** on field. It is the quality mechanism.
- Validation is soft and specific: *"No photo attached — owner records with photos are opened 3× more often. Add one?"* with `Add photo` / `Skip`. Never a blocking modal.
- Character guidance, not hard limits: work performed ~200 chars, finding ~300, next step ~150. Show a gentle counter past the target.
- Cancel confirms and keeps the draft. Never discard a technician's work silently.

### 10.5 Review queue (management)

The approve/publish flow works. Make it a queue rather than a page:

- **List → detail with keyboard navigation.** `J`/`K` to move, `A` to approve, `R` to return. A manager clearing 15 updates on a Friday afternoon needs velocity.
- **Return reasons as chips** — Needs photo · Wording unclear · Not owner-appropriate · Mark provisional · Wrong equipment — plus optional free text. Chips make return reasons reportable; free text does not.
- **Diff view:** what the property record says now vs. what it will say after publishing. This is a permanent record; show the delta.
- **Bulk approve** for low-risk templates (routine maintenance with photos and Confirmed confidence) with a per-item audit trail.
- **Publish confirmation with a 10s undo**, then an immutable published stamp with timestamp and approver. Fix F14 — labels follow state.
- **SLA visibility:** age of oldest pending item, surfaced on Board. Review latency is the failure mode that kills this product in month three.

### 10.6 Desk Board (replaces the Management lens)

The lens toggle is a good pattern for *content framing*; it is the wrong pattern for *a different job*. Management needs its own surface:

- Exception queue as the default view (blocked · awaiting review · capture overdue · access expiring).
- Per-technician capture-rate strip — who is contributing, who is not. This is the adoption instrument.
- Access health: pending grants, expiring grants, revoked access, with a working nudge that actually sends and logs.
- Property coverage: which of our customers have a complete record and which are thin. Directly monetisable — thin records are quoting risk.
- Read-only ServiceTitan mirror with sync status and last-sync timestamp. Say what is authoritative and when it was last true.

### 10.7 Property record (new, required)

The object the whole product is named after currently has no Pro-side screen.

```
Header      address · type · year built · membership tier · primary provider · access state
Systems     equipment cards by trade — HVAC, plumbing, water, electric, generator
            each: make/model/serial · installed · age · warranty · condition · next service
Timeline    every visit, every contractor, chronological, filterable by system and by trade
Documents   permits, warranties, manuals, rebate paperwork, invoices
Plan        capital plan — what fails when, estimated ranges  (already exists homeowner-side)
Access      who has access, what scope, granted when, expires when, full history
```

Reachable from search, from any job, and from the calendar. This is the screen a Comfort Professor salesperson opens before quoting a heat-pump conversion, and the screen that makes Mass Save documentation trivial.

### 10.8 Calendar

Keep the concept — capacity, access risk and Passport decisions on one time map is a good idea and no FSM shows it that way. Fix the delivery:

- **Mobile: agenda list, not a grid.** Day selector strip + vertical list of stops. Never a 7-column matrix on a phone.
- **Desktop: keep the team × day grid.** Minimum cell 14px type; horizontal scroll with a sticky technician column.
- **Encode access risk on the surface** — a blocked stop should be visible in the grid without opening detail.
- Restate the ServiceTitan boundary inline, not only in a footnote.
- **Fix the cross-surface state drift.** Verified: after publishing an update, the work list shows `1302 Alder St → PASSPORT UPDATED` while the calendar shows the same stop as `READY`. One state model, rendered everywhere, or the record loses credibility the first time a manager notices.

---

## 11. Design system extensions

### 11.1 Semantic status tokens (required — highest-priority system work)

```
--status-ready-fg      #1f5d3a   --status-ready-bg      #e8f2ec   6.83:1
--status-progress-fg   #7a4a00   --status-progress-bg   #fdf1de   6.70:1
--status-review-fg     #3a3a8c   --status-review-bg     #ececf7   8.28:1
--status-blocked-fg    #ae1800   --status-blocked-bg    #ffe0d9   5.77:1  (existing accent-700 / -200)
--status-published-fg  #444141   --status-published-bg  #eae7e7   8.22:1
--status-planned-fg    #605d5d   --status-planned-bg    #f8f4f4   5.97:1
```

All six pairs verified ≥ 5.7:1 — safe at tag sizes. Rules:

- Every status tag pairs **colour + glyph + text**. Never colour alone (WCAG 1.4.1).
- Access state and work state are **different token families** — they answer different questions and must never look alike. Today they are identical, which is F5.
- Reserve `--color-accent #ec3013` for large brand type and rules. Any accent surface carrying small text uses `--color-accent-700 #ae1800` (6.41:1). `--color-accent-600 #dd2b0f` measures 4.25:1 and is *not* safe for body-size text.

### 11.2 Type scale

| Token | Field | Desk | Use |
|---|---|---|---|
| `display` | 28/32 800 | 32/36 800 | Screen title |
| `heading` | 20/26 800 | 22/28 800 | Section |
| `subhead` | 17/24 600 | 16/22 600 | Card title |
| `body` | 16/24 400 | 15/22 400 | Primary content |
| `meta` | 14/20 400 | 13/18 400 | Secondary |
| `label` | 13/16 600 tracked | 11/14 600 tracked | Column headers, tags |

**Hard floor: 14px in any field-facing surface.** Retire the 9px and 10px values entirely (F8, F12).

### 11.3 Spacing and density

Extend to `--space-5 20px`, `--space-10 40px`, `--space-12 48px`, `--space-16 64px`.

Two density modes on list surfaces: **Comfortable** (field default, 96px rows) and **Compact** (desk default, 56px rows). One component, two token sets.

### 11.4 Radius

Keep `0` for cards, panels, rules, and photography — it is the brand. Add `--radius-control 4px` for buttons and inputs, and `--radius-pill 999px` for status tags and filter chips, so tappable objects read as tappable.

### 11.5 Component inventory to build

Ledger row (field / desk / compact) · Status tag (6 semantic × 2 size) · Access badge (4 states) · Property thumb (3 size) · Equipment card · Evidence thumbnail with confidence marker · Capture step shell · Voice input control · Measurement stepper · Template chip group · Confidence selector · Owner-preview panel · Review queue item · Diff block · Sync-queue indicator · Offline banner · Toast with undo · Empty state (7 variants) · Skeleton loader (3 shapes) · Global search field + result row · Bottom tab bar · Desk rail.

---

## 12. States — specify all of these

| Surface | Empty | Loading | Error | Offline | Permission denied |
|---|---|---|---|---|---|
| Today | "No stops scheduled. Your route syncs from ServiceTitan each morning." + last-sync time | 3 skeleton rows | "Couldn't load your route. Showing your last synced day (8:14 AM)." + Retry | Banner + cached route + queued-capture count | — |
| Job brief | "No prior record for this property. You're writing the first entry." | Skeleton | Retry inline; never a blank screen | Full brief from cache; disable actions that need network | "Owner hasn't granted access to this system. Request access →" |
| Capture | Fresh template | — | Field-level, non-blocking | Queued locally with visible position in queue | — |
| Review | "Nothing waiting. Last published 2 hours ago." | Skeleton | Retry | Read-only with a clear notice | "Only managers can publish." |
| Search | "Search properties, equipment, or serial numbers" + recents | Debounced spinner | Retry | Search cached properties only, labelled as such | — |
| Property | "No equipment recorded yet. Add the first system →" | Skeleton | Retry | Cached | Scoped partial view showing what is hidden and why |

**Additional required states:** first-run for a company with no data; a technician's first shift; access expiring within 24h; sync conflict (record changed while offline); a returned update the tech must fix.

---

## 13. Voice and copy

The existing copy is the strongest asset in the product. It is plain, declarative, and confident — "The record belongs to the property," "Know the job before you open the truck," "Attributed entries only." Preserve that register and codify it:

- **Say what is true, including the boundaries.** The ServiceTitan disclaimer earns more trust than any feature claim. Extend that honesty to sync status, offline state, and access scope.
- **Field copy is imperative and short.** "Photograph the label." Not "Please be sure to capture an image of the equipment label."
- **Never blame the technician.** "No photo yet" — not "You forgot to add a photo."
- **Owner-facing text is a different voice** from tech-facing text: warmer, jargon-free, no abbreviations. The composer preview is where the tech learns this distinction, which is exactly right.
- **Resolve the terminology drift.** "Passport update" / "Passport addition" / "proposed addition" / "entry" all appear for the same object. Pick one noun and use it everywhere. Given §3.2, consider whether "Passport" survives at all.

---

## 14. Device and platform strategy

**Recommendation: field-first PWA, desk web app, shared design system.**

- **Field:** installable PWA with service-worker caching, IndexedDB draft and queue storage, and `getUserMedia` capture. Native shell later if push notifications and background sync prove insufficient. Target: iPhone in a case, one-handed, gloved, in a basement with one bar of signal.
- **Desk:** responsive web, 1280px design width, works down to 1024px. Below 1024px it becomes the field layout rather than a squeezed desk layout.
- **Breakpoints:** the build already uses 620 / 640 / 880. Rationalise to **640 (field) / 1024 (desk) / 1440 (wide desk)**.
- **Test on:** iPhone SE (smallest realistic screen), iPhone 15 Pro, a mid-range Android, and a 1366 × 768 office laptop. Not on a 27" display.
- Prove the offline path in a real basement before designing anything else on top of it.

---

## 15. Roadmap

**Phase 0 — Fix what exists (1–2 weeks)**
Contrast (F6), tap targets (F7), type floor (F8), semantic status tokens (F5), per-route titles and heading structure (F13), deep links (F3), dead-end nudge (F9), stale label (F14), localise the demo data to Greater Boston (§3.3). Ships a demo that survives scrutiny.

**Phase 1 — Capture (4–6 weeks) — the actual product**
Mobile capture flow, camera, voice, A+ Comfort Club maintenance template, structured measurements, draft persistence, offline queue, owner preview. Nothing else matters until a technician will use this unprompted.

**Phase 2 — Find and see (3–4 weeks)**
Global search, property record screen, equipment index, cross-contractor timeline. Turns a route list into a knowledge base.

**Phase 3 — Run it (4–5 weeks)**
Desk Board, review queue with keyboard velocity and return reasons, notifications, team roster and roles, capture-rate reporting, admin and templates.

**Phase 4 — Prove the value (ongoing)**
Insights, membership visit tracking, Mass Save rebate documentation export, ServiceTitan sync UI, PM portfolio bridge.

---

## 16. How to know it worked

Design against measurable outcomes, not screens shipped.

| Metric | Target | Why |
|---|---|---|
| Capture completion rate (visits with a submitted update) | > 80% within 60 days | The only metric that matters. Below this, the record is incomplete and the whole thesis fails. |
| Time to complete a capture | < 90s median | Above ~2 minutes, techs stop doing it. |
| Captures with ≥1 photo | > 90% | Photos are what make the owner record credible. |
| Review latency (submit → publish) | < 4h median | Slow review teaches techs their work disappears. |
| Returned-update rate | < 15% | Higher means the capture flow is not guiding well enough. |
| Property record completeness | > 70% of the book of business with ≥3 systems recorded | This is what the owner is actually buying. |
| Tech-initiated record corrections | trending up | Proof that techs trust and use the record, rather than ignoring it. |

**Validate before building Phase 1.** Five ride-alongs with Comfort Professor technicians — one maintenance visit, one diagnostic, one replacement, one emergency, one multi-unit — observing what they actually record today, on what, and when. Then paper-prototype the capture flow in a real basement. Every assumption in §10.4 should survive contact with a mechanical room before it gets built.

---

## 17. Open questions for the client

1. **ServiceTitan integration depth** — read-only mirror, or bidirectional? This determines whether the Pro portal is a companion or a second place to type. It is the biggest unresolved design constraint in the product.
2. **Who pays?** Contractor subscription, homeowner subscription, or PM portfolio licence? The Pro portal's entire value framing changes depending on the answer.
3. **Is Comfort Professor a design partner or a prospect?** If a partner, run §16's ride-alongs before Phase 1. If a prospect, Phase 0 plus a localised demo is the right scope.
4. **"Passport" naming** — is the collision with Home Alliance's Passport™ known and accepted? (§3.2)
5. **Multi-contractor reality** — what actually happens when Comfort Professor and a competitor both hold access? The cross-attribution promise is the product's moat and its thorniest UX problem.
6. **Membership tie-in** — should A+ Comfort Club tiers drive record depth and capture templates? Strong argument for yes.
7. **Data retention and portability at sale** — the homeowner sells the house. What transfers, on what consent, and who designs that handoff?

---

*Prepared from a hands-on walkthrough of the live build, 29 August 2026. All measurements taken from the running application. Sources: the demo application itself; comfortprofessor.com; ServiceTitan Field Mobile App documentation; passport.homealliance.com.*
