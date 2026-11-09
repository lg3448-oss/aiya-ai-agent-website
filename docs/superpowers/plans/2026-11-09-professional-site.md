# AI Pilot professional service website

**Goal:** Make the service understandable and reviewable through a concrete workflow, clear deliverables, and answers to buying questions.

**Architecture:** Retain the static HTML/CSS/JavaScript site, current brand artwork, and existing menu/tool interactions. Add a data-driven workflow example with accessible scenario tabs and stage buttons; native details elements handle FAQs. No backend, API calls, new credentials, analytics, external fonts, or fabricated claims.

**Design:** White #ffffff, ink #071a3d, blue #155cf3, pale blue #f3f8ff, cyan #22d3ee, slate #536b89. Use the existing sans-serif family with a more deliberate scale, left alignment, and a compact desktop header. One dark blue workflow board provides the principal visual contrast. Keep photography as an illustrative example, never a customer endorsement.

## Execution

- [x] Add browser checks for scenario selection, stage selection, arrow-key tab navigation, native FAQ keyboard behavior, and no-JavaScript readability; run them against the old page to confirm missing features.
- [x] Update index.html: specific service proposition; restaurant/research/content workflow example; four deliverables; access and approval discussion; three delivery phases; six FAQs. Keep visible contact alternatives and the example tool picker.
- [x] Add workflow data and isolated rendering to script.js. A scenario changes its brief, steps, and example output. A stage changes its output without network traffic. Arrow keys/Home/End move scenario tabs. All states use appropriate ARIA attributes.
- [x] Consolidate styles.css around existing blue/white branding with responsive layouts, visible focus, native FAQ expansion, and brief user-triggered transitions that respect reduced motion.
- [x] Run all browser checks at 320, 390, 768, 1024, and 1440 pixels. Inspect screenshots, fix clipping/overlap, verify anchors and console errors, update README and keep the local preview available.

## Constraints and review

Sample results are explicitly illustrative. Do not invent customers, metrics, prices, fixed timelines, certifications, or security promises. State that scope, access, approvals, ongoing support, and fees are agreed during planning. Existing uncommitted fixes remain part of this local working copy. Do not publish without a user request.
