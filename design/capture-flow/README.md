# Pro capture flow — Phase 1 design (brief §10.4)

Design-only deliverable, drafted 2026-08-29. Ten artboards (`*.dc.html`) plus
`canvas.json` make up the reviewable canvas: the 7-step mobile capture flow on
the wh-flush demo job, an offline-queue variant, and a flowing design spec that
carries all behavior (autosave, soft validation, voice rules, open questions).

Published (editable) canvas: https://claude.ai/code/artifact/7ccef9aa-9d0e-4b12-9962-2fa612bc3a20

These files are the source of truth for regeneration. The seeded viewer page
(`pro-capture-flow.html`) is a build artifact — gitignored; re-seed it from
these files with the Claude Code `design` skill's helper, then republish to the
artifact URL above. The `.dc.html` files don't render standalone in a plain
browser (they expect the canvas runtime).
