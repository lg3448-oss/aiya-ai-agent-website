# Frequently asked questions

`faq.html` is a standalone, naturally scrolling reference page. It uses the same local fonts, palette, navigation and footer as the homepage. Twelve questions are grouped under Getting started, Tools & control, and Scope, costs & support.

Answers follow the existing service description. They do not introduce fixed prices, timelines, access guarantees or new integration promises. Native `details` elements keep the content usable without JavaScript. Category links jump to the three groups; email links provide the next step.

The homepage navigation and its FAQ section link to the page. `navigation.js` holds the existing shared menu behaviour for both pages; workflow and screen-scrolling scripts remain on the homepage.

Verification: `tests/browser_checks.py` includes navigation, accordion, responsive and no-JavaScript checks. Visual review covered 390px, 768px and 1440px layouts.
