# Fullscreen section navigation

## Scope

Seven chapters: hero, workflow, service, human control, tools, FAQ, and contact. Existing imagery and interactive workflow remain intact. Desktop labels use a minimum 15px primary-label scale; small supporting notes are at least 13px. Section padding and content widths are shared.

## Interaction

On fine-pointer screens at least 1024px wide and 650px high, one wheel gesture advances one chapter with a short eased vertical transition. Momentum from that gesture must not skip more chapters. Page Up and Page Down provide keyboard equivalents; chapter links remain ordinary anchors. A right-side chapter navigation indicates position.

Sections have a viewport minimum height, not a clipping maximum. Oversized content, including expanded FAQs and browser zoom, scrolls naturally within its section before the next chapter. Narrow, coarse-pointer, and short viewports use natural document scrolling. Reduced-motion users get immediate transitions. Browser zoom gestures, editable controls, and modified clicks must be preserved.

## Verification

Browser checks cover chapter heights, readable desktop labels, forward/backward wheel and keyboard navigation, normal and reduced-motion transitions, tall FAQ content, natural mobile scrolling, existing workflow/menu/tool interactions, and assets. Inspect screenshots at 1440x900 and 1366x768 before publishing to the established Pages branch.
