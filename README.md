# AIYA AI Agent Website

A responsive, interactive landing-page demo for AIYA's AI agent offering. The visual direction is inspired by premium editorial SaaS sites while using original AIYA branding, copy, layout, and artwork.

## Preview locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Features

- Responsive white-and-blue AI Pilot service website
- Self-hosted Manrope headings and DM Sans body typography
- Short service copy and one three-step delivery explanation
- Integrated, unframed hero artwork alongside a connected business workflow
- Optional pausable workflow tour that stops for human review
- Clear managed-service positioning, deliverables, and launch process
- Interactive restaurant marketing, market research, and content operations examples
- Four selectable workflow stages with explicitly illustrative outputs
- Accessible scenario tabs with arrow-key, Home, and End navigation
- Native FAQ accordion that also works without JavaScript
- Accessible example tool picker (no live account connections)
- Keyboard-accessible mobile navigation and reduced-motion support
- Optimized WebP images and content visible without JavaScript
- Zero build dependencies; ready for GitHub Pages

## Publish

Enable GitHub Pages from the repository's `main` branch and root directory.

## Scope

This is a static marketing site. It does not run agents, authenticate users,
connect third-party accounts, or collect API credentials. The primary contact
button opens the visitor's email app; email and phone details are also visible.

## Browser verification

With Python, Google Chrome, and the Python `playwright` package installed:

```bash
python tests/browser_checks.py
```

The checks start a local HTTP server and cover menu closing and accessibility,
tool selection, scenario/stage selection, keyboard navigation, FAQ expansion,
reduced motion, local-only workflow interactions, navigation targets,
JavaScript-disabled content, images, and horizontal overflow at
320, 390, 768, 1024, and 1440 pixels. Screenshots are saved to
`output/playwright/` (ignored by Git).
