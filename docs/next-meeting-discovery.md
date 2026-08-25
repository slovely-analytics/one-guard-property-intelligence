# One Guard — discovery questions for the next meeting

**Purpose:** leave the room with the five decisions in §6 made, not with more notes.
**Prepared:** 2026-08-20 · Follows `2026-08-19-client-call-notes.md`

---

## How to run it

Tier 1 is six questions and should take half the meeting. They are the ones that change what gets built. Everything in Tier 2 is useful context that can be answered by email if time runs out — Tier 1 cannot.

Open with the artifact request (§2), not with a question. Watching a real job get closed out will answer four of the six Tier 1 questions before you ask them.

**Tone:** these are scoping questions, not a challenge. The framing that works is *"I want to build the right thing first, so I need to understand how the business actually runs today."*

---

## 1. Ask them to bring

- **A real completed work order from last week** — with whatever photos and notes are attached.
- **A tech's phone**, so you can see the app they actually use in the field.
- **A+ Comfort Club numbers** — member count, the three tiers and prices, rough churn.
- **The list of trades they refer out**, and who they refer to.
- **A rough budget and timeline**, and who besides them is working on this.

---

## 2. Tier 1 — the six that decide the next phase

### Q1. "Walk me through a real job from last Tuesday — the call comes in, what happens, through to the invoice going out. Can I see that work order?"

*Why:* Everything about phase 1 depends on what gets captured today and where it lands. This one question maps the whole operational surface.

*Listen for:* what software the tech touches, whether photos actually happen, whether model and serial numbers get recorded, who closes the ticket, how long the paperwork takes.

*Decides:* whether One Guard is a new capture tool or a layer over what already exists.

### Q2. "What software runs the business today — dispatch, invoicing, CRM?"

*Why:* If they run ServiceTitan, Housecall Pro, Jobber, FieldEdge, or Service Fusion, techs will not double-enter into a second app. Phase 1 becomes an integration that pulls completed work orders, notes, and photos. If it's spreadsheets and paper, One Guard *is* the capture tool — a much bigger build.

*Follow-on:* **"What do you hate about it? What does it not do?"** That answer is the wedge, and it's usually the most valuable thing said in the meeting.

*Also ask:* if there's an existing homeowner-facing portal in that software, what does it do, and why isn't it enough?

### Q3. "If a tech has to spend three extra minutes per job capturing for One Guard, does that actually happen? Who can make it happen?"

*Why:* Field capture is where platforms like this die. This tests whether there is both willingness and authority.

*Follow-on:* Are techs paid hourly or per job? Company phones or personal? Piece-rate techs will not absorb unpaid admin time, and that changes the design target from "nice to use" to "faster than not using it."

### Q4. "Who exactly are the tenured customers for the pilot — how many, and how would you introduce this to them?"

*Why:* Sizes the pilot and reveals whether onboarding is a screen or a trusted phone call from someone they know.

*Follow-on:* **Are any of them landlords, Airbnb hosts, or property managers?** If yes, the Property Manager door moves into phase 1. If no, it waits.

### Q5. "Ninety days in, what has to be true for you to say this is working? And what would make you shut it down?"

*Why:* Without a number and a date, a pilot never ends and never fails — it just drifts. Push past "customers like it."

*Push for numbers:* % of jobs captured, % of customers who logged in more than once, how many said they'd pay, how many service calls were resolved faster because the record was there.

### Q6. "Is One Guard a separate business, or a Comfort Professor feature?"

*Why:* Decides branding, entity setup, whether competing trades could ever join, and whether the demo is an investor pitch or a customer tool. Cheap to structure now, expensive to unwind later.

*Follow-on:* Who funds it, what's the budget, who else works on it, and is anyone technical on the team today?

---

## 3. Tier 2 — money and model

7. **The A+ Comfort Club:** how many members, what are the tiers, what's churn, and what do members actually value most? Is it profitable on its own?
8. **Does One Guard replace the Comfort Club, rebrand it, or sit on top as a separate charge?** This decides whether pilot customers are being upgraded or cross-sold.
9. **Do the $19 / $49 / $99 tiers from the Executive Overview still stand,** now that inspection cadence is the axis instead of feature unlocks?
10. **Rank these by what you actually believe funds year one:** homeowner subscription, trade fees, data, lead gen, or better retention of existing Comfort Professor customers.
11. **Is this a new revenue line, or a retention moat for the existing customer base?** Those two build very differently — one optimizes for acquisition, the other for depth on customers you already have.
12. **Is there an exit thesis?** Build to operate, build to sell, or build to defend. The PE comment suggests this is worth asking directly.

---

## 4. Tier 2 — the pro side

13. **Which trades do you already refer out, and to whom?** Are those relationships strong enough that they'd be phase 2 pilots as a favor?
14. **Would you be comfortable if a competing HVAC company joined and could see properties you service?** This is the neutrality question. The answer determines whether a genuinely open network is on the table or whether this is Comfort Professor's platform that admits partners.
15. **What does a partner trade have to prove to get in** — license, insurance, background check? Who verifies it, and who carries the risk if a vetted pro does bad work?
16. **When a partner trade does the work, who owns the customer relationship?**

---

## 5. Tier 2 — product, trust, and the field

**Scope**

17. **If only one ships first, which:** (a) the continuity record — tech logs, next tech sees it; (b) alerts and sensors; (c) scheduling and inspection cadence; (d) the property manager portfolio view?
18. **Who is the next demo for** — investors, pilot customers, partner trades, or internal? By when? This sets the fidelity bar.
19. **What does a homeowner do in the app between service visits?** If there's no honest answer, the subscription has a retention problem that alerts alone won't fix.
20. **Sensors:** integrate with what customers already own (Nest, Ecobee, Flo, Moen), or install hardware? Does Comfort Professor already install anything connected?

**Trust and legal**

21. **Who owns the service record** — the homeowner, the pro who wrote it, or One Guard? This needs an answer before anyone writes terms of service.
22. **Are you comfortable committing publicly to aggregate and de-identified only** for anything sold to institutional buyers?
23. **What happens to the record when the home sells?** Transferring the Passport at closing could be a real selling point — worth designing for deliberately rather than discovering later.
24. **If a homeowner acts on bad platform data and something breaks, who's liable?** Has the insurer been asked?

**Competitive**

25. **What have you already looked at** — Centriq, HomeZada, Frontdoor, Angi, ServiceTitan's homeowner portal? What did they get wrong?
26. **What stops ServiceTitan or Housecall Pro from shipping this next year?**

---

## 6. Decisions to leave the room with

1. **Integrate with existing field-service software, or build capture from scratch.** (Q1, Q2)
2. **The pilot cohort — named, sized, and with a start date.** (Q4)
3. **A success metric with a number and a deadline.** (Q5)
4. **Separate entity, or Comfort Professor feature.** (Q6)
5. **Which surface gets designed next.** (Q17, Q18)

---

## 7. What the answers change on my side

| If… | Then the next build is… |
|---|---|
| They run an FSM with an API | A homeowner portal fed by an integration. Design effort goes to the connection/grant UX and the record view. Fastest credible path to a live pilot. |
| No FSM, or no API access | One Guard is the capture tool. Design effort goes to the Service Pro door and a capture flow fast enough to survive a truck. Materially bigger scope. |
| Pilot cohort includes landlords or PMs | Property Manager door moves into phase 1 rather than phase 3. |
| Demo is for investors | Build the continuity narrative end-to-end — Plumber A logs, owner grants, Plumber B sees. Depth over breadth. |
| Demo is for pilot customers | Build the real thing, thinner. Fewer screens, real data, no fixtures. |
| They want neutrality across competing trades | Entity separation and a data-isolation story need to be designed now, not retrofitted. |
