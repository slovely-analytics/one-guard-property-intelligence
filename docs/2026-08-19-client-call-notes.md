# Client call — One Guard

**Date:** 2026-08-19 (revised 2026-08-20 with follow-up clarifications)
**Scribe:** Steve
**Attendees:** One Guard client
**Purpose:** Re-set product context and lock final direction ahead of continued mockup/demo work.

---

## 1. Raw notes (as captured)

### 1a. On the call

- Product is for the **homeowner primarily**, over property management.
- Want to **pitch to trades**: roofers, HVAC, inspection services — **not only locally, but nationally**.
- **A lot of PE companies would eat up this data.** If we can build a subscription-based tier system, we could gain many homeowners who don't want to deal with the ins and outs of how to handle their homes.
- Homeowners **need alerts** and **ways to connect to the back office for support**.
- Market to **high-end homeowners, Airbnbs, property management** companies.
- A good subscription could be **setting up monthly / quarterly / annual inspections**.
- **Add sensors** to HVAC, water heaters, etc.

### 1b. Clarified afterward (2026-08-20)

- **Correction to "homeowner primarily":** target **both** homeowners **and** property management companies. Not one over the other.
- **Origin:** this is a **side project from an existing trades company, [Comfort Professor](https://comfortprofessor.com/)**. Pilot and experiment with the business and its **trusted, tenured customers**.
- **Login page as three giant sections** — homeowner, property management, and vendors/technicians — because **all three groups use the product**.
- Platform should **quickly centralize and normalize the connections between maintenance techs and homeowners / property management companies**.
- The **revenue model needs to make sense for property owners** to want a tier — the sensor idea is one such reason.
- **The toilet example:** a plumber installs a toilet and logs notes, materials used, and photos. Next time there's a problem, a *different* plumber arrives, the homeowner connects them to the property through the platform, and they can see the prior notes and pictures.

---

## 2. The actual thesis

Stripping it down: **One Guard is a shared, permissioned service record for a property, and the connection layer between the people who own properties and the people who fix them.**

The toilet example is the whole product in miniature. Today, the knowledge of what was installed, what parts were used, and what the tech saw behind the wall lives in one contractor's job notes — in their field-service software, on paper, or nowhere. It dies when that contractor is replaced. One Guard's proposition is that this record belongs to **the property**, not the vendor, and travels with it.

That reframes everything else. The Property Passport isn't a filing cabinet the homeowner maintains — it is **populated as a byproduct of work being done**, by the techs doing it. Sensors, alerts, assessments, and scores are all downstream of that record existing and being trustworthy.

**Notable:** Comfort Professor already runs the "A+ Comfort Club" — three membership tiers, monthly or annual, built around inspections and tune-ups. One Guard is in large part the **productization of a subscription that already exists and already has paying, tenured customers**. That is a materially better starting position than a cold launch, and it means the pilot has a built-in control group.

---

## 3. Three audiences, three doors

The client's instinct to split the login three ways is right — these are genuinely different products sharing one data spine.

**On wording.** Frame the door as a role, not an entity ("I'm a…"). Recommended:

| Door | Recommended label | Why |
|---|---|---|
| Homeowner | **Homeowner** | Plain, correct, no better synonym. Covers small landlords too. |
| Property management | **Property Manager** | Role-framing beats "Property Management Company" — shorter, and works for a one-person landlord with six doors as well as a firm. Alternative if portfolio scale is the emphasis: **Portfolio Manager**. |
| Vendors / technicians | **Service Pro** | "Pro" is the established term in this market (Angi, Thumbtack, Housecall). Covers both the shop owner and the tech in the truck. "Vendor" is procurement language and reads cold; "Technician" excludes the office. Alternatives: **Trade Partner**, **Service Partner**. |

Each door implies a different core screen:

- **Homeowner** → my property, its systems, what needs attention, who's coming.
- **Property Manager** → portfolio roll-up, exception list across doors, spend and vendor performance.
- **Service Pro** → today's jobs, the property record for the job I'm walking into, capture what I did.

The Pro door is the one that does not exist in any form in the current mockups, and it is the door the entire data model depends on.

---

## 4. The permission model — answering open question #1

The client's answer was right and worth stating as a design principle:

> Customers must allow certain companies to connect to their account to see their home's detail. **Not open like Facebook.**

This is the trust primitive of the platform. Suggested shape:

- **Connections are grants,** made by the property owner to a specific company, and **revocable at any time**.
- **Scoped.** A grant can be the full property record, a single system, or a single job. A plumber called for the toilet does not need the HVAC service history.
- **Time-boxed by default.** Access opens when a job is scheduled and closes some period after it completes. Standing access is an explicit choice, appropriate for the primary provider (Comfort Professor, for pilot customers) and for a PM firm managing the property.
- **Visible.** The owner sees a plain list — who has access, what they can see, when it expires — and an audit trail of what was viewed and when.
- **Write access is separate from read access.** A pro who logged work owns their entry; they shouldn't be able to alter another vendor's history. The record is append-only and attributed, and disputes get a correction, not a deletion.

This also cleanly answers the PE-data question from the original call: **what can be sold is aggregate and de-identified, and consent is captured at the grant layer.** If a homeowner has to affirmatively connect each company, the platform cannot credibly resell property-level detail without a separate, explicit, separately-revocable consent. Recommend building the data posture around that constraint now rather than retrofitting it.

---

## 5. Phasing — answering open question #2

The client's answer: **phase one works with the existing company and its trades to get a working feedback loop between property owner and tradesmen.** Concretely:

**Phase 1 — closed loop, one shop.** Comfort Professor techs capture work on real jobs for tenured A+ Comfort Club customers. Those customers see it in the homeowner portal. Nothing else ships. The question being answered is the only one that matters: *will techs actually capture, and do owners actually care?*

**Phase 2 — non-competing trades.** Comfort Professor covers HVAC, plumbing, water filtration, and generators in Greater Boston. The adjacent trades it does *not* compete with — roofing, electrical, appliance repair, pest, chimney — are the natural first outside pros, because they have no reason to fear a competitor's platform. This matters (see §7).

**Phase 3 — property managers.** Multi-door portfolios, which is where the connection-management pain is worst and where willingness to pay is highest.

**Phase 4 — sensors, scoring, network scale, data.** Everything from the original call that assumed a populated record already exists.

---

## 6. Trade incentives and gating — the unresolved half of open question #2

The client is unsure whether trades pay, whether incentives are strong enough, and whether gating is needed to prevent fraud or sketchy behavior. My read:

**The incentive to the pro is real but must be immediate and selfish, not ecosystem-flavored.** The pitch that works: *you arrive at the job already knowing the model, the serial, the age, what the last tech did, and what they photographed.* That is less diagnostic time, fewer second truck rolls, fewer callbacks, and better upsell context (a 14-year-old water heater sells its own replacement). Pros will not adopt a platform to be good citizens of a network; they will adopt it if it saves them a return trip.

**Do not charge pros in phase 1 or 2.** Charging before demonstrable lead flow kills adoption and gives you nothing to price against. Revisit once pros are receiving work they wouldn't otherwise have had — at which point lead fees or a subscription both become defensible.

**Gate on credentials, not on payment.** License, insurance certificate, and a real business identity. This does the fraud-prevention job the client is worried about, and doubles as a quality signal to homeowners — "vetted pro" only means something if the vetting exists. Verification is also the natural thing to charge for later, since it has real cost.

**The real adoption risk isn't willingness — it's data entry.** See the first follow-up question in §8.

---

## 7. Flags

**Structural: does a contractor-owned platform get competing contractors?** One Guard would be owned by an HVAC and plumbing company. HVAC and plumbing shops in Greater Boston are Comfort Professor's direct competitors, and are unlikely to enter their service records into a competitor's system. This is not fatal, but it shapes the plan:

- Phase 2 recruiting should target **non-competing trades first** (roofing, electrical, appliance, chimney) where the conflict doesn't exist.
- If the ambition is genuinely a national multi-trade network, the platform likely needs **separation from Comfort Professor** at some point — distinct entity, distinct brand, and a credible statement about who can see whose job data. Worth deciding early, because it is much cheaper to structure now than to unwind later.
- The honest alternative is also viable: position it as **Comfort Professor's customer platform** that happens to admit partner trades. Smaller, but real, and it makes the pilot the product rather than a stepping stone.

**"National" remains an operations claim.** Comfort Professor is Greater Boston. The demo can show vetted-pro dispatch convincingly; coverage is what gets questioned in the room. Keep national as the vision slide, not the pilot promise.

**The record's value is proportional to its completeness.** A half-populated Passport is worse than none — it teaches both owners and pros that the platform can't be trusted as the source of truth. Phase 1 should aim for depth on a small number of properties rather than breadth.

---

## 8. Follow-up questions for the client

**Highest priority:**

1. **Does Comfort Professor already run field-service software** — ServiceTitan, Housecall Pro, Jobber, or similar? If so, techs will not double-enter job notes into a second app, and One Guard's phase 1 becomes an **integration** (pull completed work orders, notes, and photos) rather than a new capture surface. This single answer changes the architecture more than anything else in this document. If there is no FSM, then One Guard *is* the capture tool and has to be genuinely fast to use in a truck.
2. **Who captures, and on what?** Tech in the field on a phone, or office staff afterward from the invoice? Field capture is where platforms like this usually die — if it adds three minutes per job, it doesn't happen.

**Also needed:**

3. **How many tenured customers are in the pilot pool, and are any of them already property managers or landlords?** If yes, the PM door moves into phase 1; if no, it can wait.
4. **When a property is professionally managed, who holds the account** — the owner or the PM? And what happens when the PM contract ends, or the home sells? ("The Passport transfers with the house" is potentially a strong selling point at closing, and worth designing for deliberately rather than discovering later.)
5. **Is Comfort Professor's A+ Comfort Club the intended subscription**, rebranded and digitized, or is One Guard a separate paid tier stacked on top? This decides whether pilot customers are being upgraded or cross-sold, and whether the $19 / $49 / $99 tiers in the Executive Overview still stand.
6. **Sensors — does "leverage existing solutions" mean integrating with what the homeowner already has** (Nest, Ecobee, Flo, Moen) rather than shipping hardware? Confirming, since it makes sensors an integration backlog item rather than a hardware business.

---

## 9. Next steps

- [ ] Design the **Service Pro** door and the job-capture flow — the missing third of the product, and the source of all record data.
- [ ] Design the **connection/grant** UX: request access, owner approves, scope, expiry, revoke, audit list. This is the trust story and the demo's most differentiated moment.
- [ ] Build the **continuity demo**: Plumber A installs and logs → Plumber B is granted access → Plumber B sees the history. That narrative sells the platform better than the sensor story does, and it needs no hardware.
- [ ] Rework the login/entry screen into three role doors.
- [ ] Rework onboarding plan comparison around inspection cadence (visits are now loggable and schedulable; monthly is situational).
- [ ] Elevate advisor / back-office access to a persistent shell element.
- [ ] Get answers to §8 (especially #1) before committing to an architecture.

---

## 10. Status of earlier open questions

| Question | Status |
|---|---|
| Do trades pay? | **Open**, deliberately. Free through phase 2; revisit when lead flow is demonstrable. Gate on credentials, not payment. |
| Aggregate vs. property-level data to institutions? | **Resolved in principle** — permission-gated connections make aggregate/de-identified the only defensible product without separate explicit consent. |
| Own hardware or BYO? | **TBD, leaning integrate** with existing market solutions. Confirm via §8.6. |
| Does cadence imply physical visits? | **Resolved** — visits are logged and scheduled; monthly is situational, not a blanket promise. |
| Fate of the PM Portfolio screen? | **Resolved** — it stays. PM is a co-equal audience with its own door, not a deprioritized surface. |
| Who can see a property's detail? | **Resolved** — owner-granted, revocable, scoped connections. Explicitly not an open social graph. |
