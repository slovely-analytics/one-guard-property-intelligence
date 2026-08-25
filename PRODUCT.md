# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Property side:** homeowners and property managers who need to understand a property's condition, authorize access, make maintenance and capital decisions, and keep a durable record of work.
- **Service Pro side:** field technicians and service-company management. Technicians need to understand the property before a visit and record what changed; management needs to understand current and upcoming work, make operational decisions, review follow-through, and keep Property Passports complete.
- **Initial operating context:** Comfort Professor and its trusted, tenured membership customers provide the intended pilot environment. Expansion to other trades and broader markets is a later-stage ambition, not a current coverage claim.

## Product Purpose

One Guard is a shared, permissioned service record for a property and the connection layer between the people responsible for a property and the people who service it. It turns each service visit into durable property knowledge so both sides can understand what has happened, what needs attention, and what should happen next.

Success begins with a closed loop: service work produces attributed evidence and an updated Property Passport; owners or managers can understand the result and make the next decision; service teams can arrive at later work with useful context instead of starting over.

## Positioning

The service record belongs to the property rather than a single contractor or transaction. One Guard connects cross-trade equipment, observations, documents, work history, owner decisions, and future planning into a longitudinal Passport that can outlast an individual vendor relationship.

## Operating Context

- The product has three doors sharing one data spine: Homeowner, Property Manager, and Service Pro.
- The Service Pro door includes role-aware experiences for technicians and service-company management; it is the operational counterpart to the property-owner experience, not a separate generic CRM.
- A representative lifecycle is: upcoming work -> permission and property context -> service visit -> evidence and notes -> review or follow-up decision -> owner-ready handoff -> updated Passport.
- ServiceTitan is the intended operational system of record for customer/location, memberships, scheduling/dispatch, jobs, estimates, invoices, payments, and pricebook. One Guard is the property-intelligence and longitudinal-record layer. Exact tenant capabilities, API scopes, sync behavior, and any write-back remain to be verified before production integration.

## Capabilities and Constraints

- Property access is granted by the owner or authorized property manager, can be scoped and time-boxed, and must remain visible and revocable.
- Work records are attributed. A service company can add its own evidence and corrections but should not silently rewrite another company's history.
- Service Pro must support both near-term execution and forward-looking decisions without forcing technicians to duplicate ordinary job data already captured in ServiceTitan.
- Property condition, recommendations, and synthesized health must distinguish evidence, confidence, unknowns, and human judgment. AI may assist extraction or summarization but must not independently diagnose safety or certify condition.
- The present React/Vite application is a clickable demonstration using synthetic sample data and licensed or credited imagery. It does not establish a live ServiceTitan connection, authenticated production permissions, national service coverage, or validated commercial outcomes.
- The commercial model, trade monetization, credential-verification process, sensor strategy, and any property-data aggregation remain open business decisions.

## Brand Commitments

- Product name: **One Guard**.
- Core artifact and product term: **Property Passport**.
- Role language: **Homeowner**, **Property Manager**, and **Service Pro**.
- Product claims should emphasize continuity, permission, evidence, and useful coordination rather than surveillance, autonomous diagnosis, or an open contractor social network.

## Evidence on Hand

- `docs/2026-08-19-client-call-notes.md` contains the revised client direction, three-role thesis, permission model, phasing, and unresolved business questions.
- `docs/next-meeting-discovery.md` contains the prioritized discovery agenda for the operating workflow and ServiceTitan boundary.
- `app/src/screens/ProToday.tsx`, `app/src/roles.ts`, and `app/src/data.ts` demonstrate the current Service Pro route, technician persona, sample jobs, and access states.
- `app/src/screens/Access.tsx` and the grant state in `app/src/store.ts` demonstrate the owner side of the permission model: pending requests approved with scope and duration, revocable grants, and an access log. The Comfort Professor grant is live-wired to the Service Pro door, so revoking it withholds the water-heater job's record until access is restored.
- The repository contains demo property, system, work-history, maintenance, project, and warranty data. All examples remain illustrative unless replaced with validated pilot data.

## Product Principles

1. **One property record, two coordinated sides.** Property stakeholders and Service Pros see role-appropriate views of the same underlying history.
2. **Useful in the moment, durable afterward.** Every workflow should help the current job while improving the next visit and the owner's future decisions.
3. **Permission is a product feature.** Access, scope, attribution, expiry, and auditability must be understandable rather than hidden infrastructure.
4. **Integrate instead of double-entering.** Preserve operational systems of record and ask Service Pros only for the property knowledge those systems do not reliably retain or share.
5. **Evidence before confidence.** Show sources, dates, authorship, unknowns, and review state; never make synthetic or inferred information look confirmed.
