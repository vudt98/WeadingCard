# Verification — 15 October 2026

## Executed checks

| Check | Result |
|---|---|
| `npm install` | Completed; package-lock.json generated |
| `npm run lint` | Passed, no warnings |
| `npm run typecheck` | Passed |
| `npm test` | 9 tests passed |
| `npm run build` | Passed, output in dist/ |
| `npm audit` | 0 vulnerabilities, including development dependencies |
| Local development HTTP | 200 at localhost:5173 |
| Production repository subpath | Built site served under `/wedding/`, CSS/JS/images/fonts/audio resolve correctly |
| Built files over HTTP | All 29 files returned 200 |
| Production browser console | No error entries observed |
| Fresh development restart after QA | Passed; dependency scanning restricted to index.html so the ignored QA fixture cannot be scanned as source |

Node 20.17.0 was used for the local checks. Installation emitted an engine warning for a development lint dependency requiring Node 20.19+; all configured checks ran successfully. Use Node 22 LTS for fresh installations and CI, as configured in the workflow. No system runtime was changed.

## Responsive browser checks

Inspected screenshots in Codex's Chromium-based in-app browser. Scrollbars account for the 15px difference between viewport width and document client width. No horizontal overflow after fixes.

| Viewport width | Document client width | Body scroll width | Result |
|---|---|---|---|
| 360 | 345 | 345 | Passed |
| 390 | 375 | 375 | Passed |
| 430 | 415 | 415 | Passed |
| 768 | 753 | 753 | Passed |
| 1440 | 1425 | 1425 | Passed |

Screenshots are saved locally in `artifacts/`: viewport-360/390/430/768/1440.jpg, desktop-final.jpg, envelope-desktop.jpg, gallery-desktop.jpg, mobile-generator.jpg and long-guest-mobile.jpg. QA artifacts and temporary production fixtures are ignored by Git.

## Interaction checks

- Open envelope with mouse and Enter; background is inert while closed. Focus moves into main content after the opening animation.
- Vietnamese `guest` from URL appears correctly in envelope and hero, including “Bạn Long và gia đình nhỏ”.
- Both family tabs change the date, time, venue, directions link, calendar link and countdown. Switching updates `ben` in the URL and removes `fbclid`.
- Refresh reads the persisted side. Invalid side defaults to groom; missing guest defaults to “Quý khách”.
- A 100-code-point guest containing emoji and HTML-like text renders as literal text with no nested image element or horizontal overflow at 360px. Fixed the letter height so long names cannot cover the open button. The envelope excerpt is limited to three lines; the full guest name appears after opening.
- Gallery opens, moves with ArrowRight, traps Tab, closes with Escape and restores focus to its opener. All six rendered image instances loaded successfully after scrolling to the album.
- Audio is paused initially. Clicking the music button starts the local original piano audio; clicking again pauses it. No automatic playback on opening the envelope.
- Invitation generator creates a Unicode-safe link, preserves the repository subpath, removes tracking/hash and selects the intended side. Clipboard copy returned the real success status.
- Directions and calendar hrefs were checked for the selected venue and correct UTC (+07:00 conversion). No external calendar event or RSVP was submitted.
- RSVP clearly says it is not receiving or storing responses. No pretend submission success, backend, tracking or private guest list was introduced.

## Reviewed but not tested on separate devices

- MotionConfig honors user reduced-motion preferences; CSS disables continuous effects and smooth scrolling for reduced motion. The OS preference was not changed or emulated during QA.
- Real Android Chrome, iOS Safari, screen readers and Lighthouse were not run. Browser viewport checks do not replace these device tests.
- GitHub Actions has been prepared, but has not run remotely. No GitHub remote, owner/repository destination or authenticated deployment tool was supplied. Public HTTPS deployment remains pending.
