# Verification — Long Phụng redesign, 20 October 2026

## Executed checks for the new version

| Check | Result |
| --- | --- |
| Typecheck | Passed |
| ESLint | Passed |
| Vitest | 13 tests passed, including month alignment, leap year, timezone boundary and side-specific schedules |
| Production build | Passed; static output in `dist/` |
| Responsive Chrome headless | 360, 390, 430, 768, 1440px: document width equals viewport width; no broken images |
| Production root and `/wedding/` | Both load correctly; images/fonts/scripts/styles/audio work; generated invitation links preserve the subpath |
| Network and console | No failed resources or page errors in the browser checks; no external page requests |
| Main text contrast | Gold/background 6.05:1, muted/background 8.65:1, ivory/background 12.80:1, button text/gold 7.09:1 |

The environment lacked Node/npm and dependencies. Node 22.14.0 and npm 10.9.2 were downloaded into ignored `artifacts/`, and `npm ci` installed the existing lockfile. Playwright and formatting tools were installed only in ignored QA/cache directories. No application dependency or lockfile change was needed. Esbuild required running outside the process sandbox after an `EPERM` startup failure; tests and build then passed.

## Browser interactions checked

- Enter and Space open the cover. Tab stays within the cover; focus moves to main after closing. Background is usable again.
- Guest names and the requested side load from URL. Switching side updates hero date, ceremony, reception, calendar selection, schedule, venue and URL; refreshing preserves selection.
- Calendar selects 9 January for the bride's side and 10 January for the groom's side.
- Album opens, advances with ArrowRight, traps Shift+Tab, closes with Escape and restores focus. Background branches are inert while the dialog is open and restored afterwards.
- Audio starts paused, plays after the music button and pauses again on request.
- Invitation generator preserves Vietnamese names and selected side; clipboard success waits for the actual browser result.
- A long Unicode guest name containing HTML-like text renders literally; no inserted image elements or horizontal overflow at 360px.
- Reduced motion was emulated and the page remained usable; normal-motion cover opening was also exercised.
- RSVP and guestbook have no submission form. The unconfigured gift section has no misleading open/payment button.
- The configured gift branch was tested using an isolated intercepted browser response with visibly fictitious account data and a local illustration. No fixture data was written to `src/config/wedding.ts`. Open/close, Escape, focus restoration, download link, clipboard success and clipboard rejection states passed.

## Visual inspection and artifacts

Inspected the desktop cover, desktop hero, mobile cover and mobile hero screenshots. Fixed a 4px mobile overflow caused by ornamental artwork. Final responsive checks pass at all five widths.

Screenshots and temporary QA scripts are ignored under `artifacts/`: `envelope-desktop.png`, `envelope-mobile.png`, `hero-desktop.png`, `hero-mobile.png`, and `final-360/390/430/768/1440.png`. Earlier `page-*.png` are pre-fix screenshots; use `final-*.png` for the finished layout.

## Verification limits

- Reference showcase/decorative asset downloads returned HTTP 403. This version uses original local SVG replacements and the existing sample photography. Exact screenshot matching to the source was not verified.
- Real Android/iOS devices, Safari, screen-reader software and Lighthouse were not tested.
- Lunar dates remain blank until supplied; no unverified lunar conversion was added.
- This is a local implementation/build. No public deployment or real RSVP/guestbook storage was configured.

---

# Historical verification — 15 October 2026

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
