# Workflow as the hero

The homepage combines unframed imagery and one integrated workflow. Hero artwork blends into the page through soft masks, and restaurant photography accompanies the human-control section. A task leads into four connected stages and an illustrative output. The restaurant, research, and content scenarios share the same presentation and remain keyboard accessible.

The optional tour runs from brief to creation to review, then stops. Users can pause it, interrupt it with a stage or scenario selection, and replay it. Reduced-motion preferences skip directly to review. No APIs, account connections, or publishing actions take place. Without JavaScript, the example brief and output remain readable.

The homepage displays assets/hero-connected-flow.webp and assets/restaurant-editorial.webp without independent bordered image cards. flow-hero.css owns the integrated hero layout; the rest of the service website keeps its existing styles.

Verification: tests/browser_checks.py checks the integrated images, normal and reduced-motion tours, keyboard and mobile interactions, native FAQs, local-only examples, navigation anchors, image loading, and horizontal overflow at five viewport widths.
