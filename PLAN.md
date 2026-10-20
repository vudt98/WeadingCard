# Wedding invitation — implementation status

## Current direction — 20 October 2026

The requested next version follows the Long Phụng V3 Red reference. See [LONG_PHUNG_REDESIGN_PLAN.md](LONG_PHUNG_REDESIGN_PLAN.md) for the implementation sequence, resource inventory, component changes and acceptance criteria. This new direction supersedes the original ivory/olive visual direction below; the existing functionality remains the baseline.

- [x] Review the current source and reference page content; prepare the redesign plan.
- [x] Attempt reference resource downloads and prepare local SVG fallbacks with source records.
- [x] Implement the red/gold invitation cover, Song Hỷ and arched-photo hero.
- [x] Add family/ceremony details, month calendar, dress code and wedding schedule.
- [x] Complete static RSVP/guestbook states and optional configured gift dialog.
- [x] Run typecheck, lint, 13 tests and build; verify responsive layout, keyboard, reduced motion and subpath assets.
- [ ] Exact visual comparison with the original reference screenshots: source image downloads returned HTTP 403.

The local redesign is implemented. New original dragon, phoenix, double-happiness and swallow SVGs replace unavailable reference assets. Family, ceremony, reception, calendar and schedule follow the selected invitation side. Gifts default to unconfigured; the optional dialog was exercised with browser-only test data. RSVP/guestbook do not accept submissions. See QA.md for executed checks and remaining limitations. No public deployment was performed. The checklist below describes the previous implementation.

The user requests a complete working wedding website and approved sample content on 15 October 2026. Implement the local static MVP in sequential phases in this task; the master prompt in the supplied plan is an example, not a request to stop at scaffolding.

## Phases
- [x] 1. React / TypeScript / Vite, Tailwind, typed config, theme, scripts.
- [x] 2. Responsive invitation, couple, story, countdown, events, gallery, footer.
- [x] 3. Animated envelope, reveals, original music, reduced-motion support.
- [x] 4. URL guest/side personalization and invitation generator.
- [x] 5. Optional RSVP shown honestly as unavailable; no backend introduced.
- [x] 6. Production build, lint, 9 unit tests, responsive browser checks; see QA.md.
- [x] 7a. Prepare GitHub Actions and validate repository-subpath assets locally.
- [ ] 7b. Deploy and verify a public HTTPS URL. Requires GitHub owner/repository and access.

## Reference observations
Inspected https://chinhloan.chinchin.top/ in the in-app browser. Initial cream screen: burgundy handwritten names, heart, personalized guest and open button. Opened page: full photo hero, date/calendar, couple, timeline, album lightbox, two event cards, RSVP and floating music/heart buttons. This implementation uses an original ivory/olive editorial composition, with licensed sample photography instead of copying the reference assets.

## Acceptance criteria
- Build/typecheck/lint/tests pass.
- No overflow at 360, 390, 430, 768 and 1440px.
- Keyboard envelope and lightbox, focus management, music only on click.
- Vietnamese guest input safely rendered, normalized and bounded to 100 code points.
- Both sides select the corresponding +07:00 event, maps and calendar.
- Asset paths work at the root and a GitHub Pages repository subpath.
- No fake submissions or secret keys.

## Open inputs
Real names, wedding dates/locations, personal photos and optional music; GitHub owner/repository and authentication for publication. Use approved sample data until supplied. No real RSVP/guestbook storage requested or configured.

## Local setup recovery — 19 October 2026
- Stopped the agent-owned Vite demo before reinstalling dependencies after a Windows native-module file lock interrupted `npm ci`.
- Reinstalled dependencies successfully with `npm ci`; documented stopping Vite before reinstalling and the Node version required by the ESLint dependency.
