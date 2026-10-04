# WooSign showcase design

Approved scope: home, searchable 50-component gallery and detail pages, tokens and
getting started. Site is separate from the existing native preview app.

Visual direction: Paper & Ink. Cream #F4EFE6 canvas, white #FFFFFF islands,
ink #171513 type/inverse, ember #D35B1F actions, section #EAE4D8 and ceremonial
#C98A3C gold. Use the bundled Woobottle face for Latin display headings, a system
Korean sans for body and a monospace face only for source code. No external fonts.

Layout: split home hero with a working composed UI specimen; a quiet navigation
bar; an indexed component directory and spacious live-preview workbench; tokens
shown as usable swatches and specimens. Mobile stacks the hero, collapses directory
navigation and keeps all actions reachable. Keyboard focus and reduced motion are
supported. Light/dark theme persists locally.

Implementation: React/TypeScript/Vite using this repository's actual components
through a web-aware alias, without changing the npm library or installing new
runtime dependencies. Hash navigation supports static hosting and deep links.
All 50 component demos have working interactions, code snippets, searchable
metadata, state controls where relevant and real prop documentation extracted from
public source types. Site output stays excluded from the npm package.
