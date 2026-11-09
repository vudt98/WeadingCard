# Verification — Long Phụng redesign, 20 October 2026

## Responsive widths and playback recovery — 5 November 2026

- Current responsive limits follow saved Mai Lan CSS at 768px: outer card 480/900px, album max-width 432/600px with height 340/520px, calendar inner width 296/352px. Text/event/RSVP content is centered within 560px, portraits within 680px and countdown within 500px. Container-unit font/spacing values are capped at their original 500px design size so widening the shell does not enlarge copy without bounds. Opening/seal/music code and local photo paths are unchanged.
- Album advances every 4200ms, with the existing 1100ms animation. Viewer close starts a fresh interval, bypassing stale hover and focus-restoration blockers. Explicit Pause survives opening/closing the viewer; reduced motion, background visibility and near-viewport gating still suspend playback. Fresh keyboard input restores normal focus protection.
- `artifacts/check-responsive-coverflow.mjs` passes 21 isolated component-handler checks, including autoplay after viewer close while hover/restored focus remain and explicit Pause persistence. This is a React/DOM mock harness, not a browser rendering/device test.
- `npm run typecheck`, `npm run lint`, `npm test` (25 tests) and `npm run build` pass. Computer Use browser/native hosts remain unavailable, so responsive screenshots and physical touch/focus are unverified. Preview stays available for user review.

## I Do soundtrack and independent music control — 21 October 2026

The selected local soundtrack is now the user-provided `public/audio/i-do.mp3` through `wedding.music`/`asset()`. The music button carries `data-music-control`; its pointer, touch, focus and Enter/Space activation preserve pending/running auto-scroll. Tab delegates interruption to the destination's focus handler, so navigation between playback controls also preserves scrolling. Manual wheel/scroll keys and interaction with other controls still pause scrolling.

Native Chrome checks pass in development and production: the actual MP3 decodes/plays, mouse pause/resume during the 2s startup delay does not cancel automatic scrolling, and mouse/touch/Enter/Space change real audio state while scroll position keeps advancing. Tab between playback controls preserves scrolling; ArrowDown with music focused and wheel over the music button still interrupt it. The full browser regression suite passes, including post-door audio, blocked-playback retry, other input interruptions, reduced motion, animations and geometry. Typecheck, lint, all 16 tests and production build pass.

## Independent viewport animation mechanism — 21 October 2026

The application now follows the audited original mechanism. `useInvitationReady` waits at least 1s and for font readiness (font wait capped at 2.5s), without reading the door state. All entrances then observe stationary wrappers in the card viewport with the existing 0.1 threshold, -50px bottom margin and one-time latch. The separate click-driven hero/countdown scope and post-door lower-content gate are removed. Door completion continues to unlock the card, start audible music and begin the 2s auto-scroll delay. Reduced motion and immediate keyboard-focus visibility are preserved. This supersedes the earlier synchronized/post-door animation implementations documented below.

The full native Chrome suite passes. An immediate click starts the doors first; all four hero animationstart events occur after the independent 1s loading gate while the doors are moving. A delayed 5s click finds all eight in-view hero/countdown entrances already finished behind the closed cover. Animation startTime values remain unchanged after opening. Off-screen text still waits for its first manual/automatic scroll entry and visibly progresses through intermediate opacity. Opening geometry has zero measured displacement at 320/390/768/1440px and in reduced motion; all 50 source timing/effect placements, eight keyframes and 31 opening/story/album geometry targets pass. Auto-scroll begins 2031ms after completed doors at 60px/s; music, keyboard, local images, ending and blocked-playback recovery pass. Focused production checks repeat both opening cases and verify native audio playback. Reviewed `opening-independent-motion.png`; typecheck, lint, all 16 tests and build pass.

## Original demo trigger audit — 21 October 2026

This is a read-only source/runtime audit, not a behavior change. The original Frame mounts after its layout/font loading gate, independently of the door. Transition observes viewport entry and does not read door state; the original door button only starts its own CSS transition. Cover completion enables music/unlocks scrolling and does not restart top text.

Native Chrome verification against the original public preview used a 5s wait before clicking Open. Four hero animationstart events occurred around 1655ms with `doorOpen:false`; immediately before the click at roughly 5490ms, all four animations were finished with opacity 1 and the cover still closed. After opening, the cover was removed and no additional top animationstart events appeared. Trace: `artifacts/reference-audit/original-opening.json`; reproducer: `artifacts/audit-original-opening-network.mjs`. The probe allowed only GET/HEAD requests. The application has now adopted this independent trigger. Earlier wording suggesting exact shared-clock synchronization in the demo is superseded.

## Top animation synchronized with opening doors — 21 October 2026

The latest correction starts only the hero/countdown reveal scope on the actual open-button gesture, alongside the doors. The remaining page still waits for completed opening. Source effects/delays are unchanged; the triptych stays static, music stays silent during opening and auto-scroll still waits 2s after door completion. Stable start/finish callbacks and a persistent opening scope prevent replay on cover removal.

The browser samples intermediate opacity for all eight in-view top effects at 800ms while the doors are moving, confirms the four hero text effects finish before the 2.5s doors, checks the countdown keeps ticking and verifies identical animation startTime values after the cover disappears. Later date text remains untriggered during opening. Focused development and production checks, the full browser suite, typecheck, lint, all 16 tests and build pass. All 50 source effect/timing placements and existing geometry/keyboard/reduced-motion checks pass; automatic scrolling still begins 2047ms after completed doors. Reviewed `opening-synced-motion.png`. Earlier post-opening-only timing statements below are superseded.

## Restored opening entrances — 21 October 2026

The latest request supersedes the static hero/countdown exception recorded below. The four hero text effects are restored with 1.5s duration and zero delay: names/announcement fadeInUp, Save the date fadeInLeft, date fadeInRight. Three opening photos remain visible without entrance effects. Countdown photo/tint fadeIn and quote fadeInUp use 1.5s duration plus 0.5s delay; its timer independently fades in over 1.5s with zero delay. Observation starts only after completed doors and triggers once on entry to the card viewport.

The full browser suite verifies all eight effects wait under the closed cover, all four hero texts show intermediate opacity after opening, countdown layers show independent intermediate states, the clock keeps ticking and all eight complete at their source timings. Eight source keyframes at six timestamps and all 50 source effect/duration/delay placements pass. Opening geometry remains stationary at 320/390/768/1440px, and all 31 opening/story/album geometry targets remain within 1px at 515/390/320px. Existing auto-scroll (2044ms measured), music, ending, keyboard and reduced-motion checks pass.

Production checks also verify that text waits until completed doors, visibly enters, and completes independently of the static triptych. The full path of the original music icon was recovered from the reference caller: `assets/mp3/icons/music-4.png`. It is now local through the config asset helper, replacing the interim SVG; native music playback, keyboard toggle, blocked retry and local icon decoding pass in production. Typecheck, lint, all 16 tests and build pass.

## Reference ending and post-opening music — 21 October 2026

The ending now follows the saved reference: album-to-RSVP gap 33.63px, three-line invitation, 436.4×350 status card at x32.2, 459px gift pill at x19.55, final 500×365 photo, transparent-to-85%-black gradient, 47px UTM Edwardian title and 16px Lora thanks copy (all measured on the 500px canvas and scaled with card width). Optional guestbook, extra schedule/details and invitation tools default to hidden through `wedding.crimson.sections`, so the card ends at the thanks photo. RSVP remains unavailable; the unconfigured gift button is disabled and described honestly.

`checkEndingAndMusic()` in `scripts/check-animations.mjs` compares seven ending placements and the album gap against the saved DOM at 515/390/320px; all match within 1px, with no overflow. Existing eight-keyframe/42-placement and 31 opening/story/album comparisons pass. Reviewed `ending-390.png` and `music-playing.png`.

Audio is mounted/preloaded before opening but starts paused. The real open gesture prepares it muted at zero volume. Only completed doors trigger restart at zero and audible local playback; browser tests verify call timestamps, actual currentTime movement and 0.28 volume. The music disc is 30px, top/right 10px within the card, rotates in 5s, has a 44px keyboard/touch target and shows a slash when paused. Enter pauses, Space resumes; reduced motion suppresses rotation. Injected `NotAllowedError` verifies truthful paused state and a retry prompt; restoring native playback and pressing the music button recovers. No runtime errors. The original PNG has now been recovered from the complete `assets/mp3/icons/music-4.png` path and stored locally, replacing the earlier SVG approximation; provenance is recorded in ASSET_CREDITS.md.

Full browser regression, production ending/music tests, typecheck, ESLint, all 16 unit tests and production build pass. Audio remains the project's original local piano track; no source song, backend or tracking was imported. Earlier manual-music/footer statements below are historical.

## Auto-scroll reopening correction — 21 October 2026

Reproduced the reported failure by preloading the previous `wedding:auto-scroll-started:v1` flag, opening the doors and waiting 5600ms: the card remained at scrollTop 0 with playback false. The prior once-per-tab policy blocked the expected replay after refreshing/reopening.

Removed that session gate and renamed the config option to `autoStartAfterOpen`. Every new page opening now schedules playback after completed doors plus the configured 2000ms. Existing stored flags are ignored; browser storage does not need clearing. User input can still cancel the pending start/current playback, and reduced motion never auto-starts. This supersedes the earlier once-per-session statements below.

The complete browser suite passes, including same-tab reopening, idle controls, keyboard/reduced motion, input cancellation, original effect comparison and measured reference layout. The final run measured 2048ms and 61px/s.

Chrome measured 2049ms from cover removal to first movement and 60px/s. Tests deliberately retain the stale flag and verify both an initial opening and another navigation/opening in the same tab. Production checks pass for delayed start with stale storage, stable geometry, album focus/lock and fallback completion with transition events suppressed. A focused idle-button check confirms playback remains stopped and opacity returns to 1 after the 800ms idle period plus its fade. Typecheck, lint, 16 tests and build pass.

## Current content — saved Crimson Elegance HTML/CSS import

The supplied saved page replaces the earlier Long Phụng content direction. The existing split-door opening remains. Layout and typography were adapted from saved DOM/inline styles; `font*.css` declarations were reused with local font URLs. All 16 source photo backgrounds and 7 fonts were downloaded into `public/crimson/`; the saved heart-calendar PNG was copied. Names, family/event data and personalized guest names remain in wedding config; photos are explicitly illustrative.

- Typecheck, ESLint, all 13 Vitest tests and production build passed.
- Chrome headless at 320, 390, 430, 768 and 1440px: width at most 500px, no horizontal overflow, long Vietnamese guest name displays, all images decode, local fonts load, no failed resources/page errors/external requests.
- Changing side updates URL, reception venue and calendar selected day. Gallery Enter/click, arrow navigation, Escape and focus restoration passed. Guest link generator passed; floating music control was made compact and footer padding adjusted after finding pointer overlap at 320px.
- No RSVP form that claims submission; the unavailable state is visible. Guestbook stays unavailable, gifts unconfigured, source demo messages are not imported. Audio stays paused until user interaction.
- Normal-motion opening retains an opaque image seal travelling with the right panel, correct main focus after opening. Reduced-motion Enter/Space opens immediately. Music icon white/burgundy contrast verified after visual QA.
- Built separately with base `/wedding/`: CSS, image backgrounds, local photos, font CSS and relative font URLs load; invitation links preserve `/wedding/`. All observed requests stay on local origin and under the base path.
- Screenshots reviewed: hero, event cards/calendar, story, album, RSVP and desktop feed. The design is a responsive adaptation; source absolute coordinates and full editor/runtime CSS are not imported wholesale. No claim of pixel-identical output after substituting configured content.

QA artifacts (ignored): `check-crimson-page.mjs`, `crimson-browser-results.json`, `crimson-*.png`, `check-crimson-subpath.mjs` and `crimson-subpath-dist/` in `artifacts/`. Asset provenance is in ASSET_CREDITS.md and `public/crimson/asset-sources.json`.

## Seal / split-door update — 20 October 2026

### Applied original reference assets and verified motion

This supersedes the initial CSS/SVG seal interpretation below. The original seal-10 and dark-linen PNGs are local under `public/images/opening/`; both paths use `asset()` through wedding config. Two panels slide simultaneously for 2.5s with ease-in-out; the 110px seal stays opaque, follows the right panel and shrinks to 95%. The bottom pill button fades over 0.4s. Cover names/date are accessible descriptions rather than visible cover text, matching the minimal reference.

Typecheck, lint, 13 tests and production build passed after this change. `artifacts/check-reference-opening.mjs` checked 320×568, 390×844, 667×375 and 1440×1000 in headless Chrome: centered seal/decoded image, local-only resources, CSS duration, seal displacement and opacity during opening, button fade, Tab/Enter, focus to main, body scroll and inert restoration, no horizontal overflow or JS errors. Reduced-motion Space and completion with transition events suppressed also passed. Viewport screenshots `artifacts/reference-cover-*.png` and `reference-opening-390.png` were captured; mobile closed/mid-opening screenshots were visually reviewed.

Reference mechanics were read from the linked public door-effect module, not guessed from a static screenshot. Exact font parity is not claimed: VIP Brisca is unavailable and the button uses local Cormorant Garamond.

### Initial interpretation (historical)

Typecheck, ESLint, 13 Vitest tests and production build passed. Chrome headless tested 320×568, 390×844, 667×375 and 1440×1000 against the production preview. Checked Tab trapping, Enter activation, both panels moving during the transition, cover removal, background inertness released, body scroll restored, main-content focus, no horizontal document overflow and no page errors. Reduced motion with Space activation opens immediately and restores focus. QA scripts and screenshots are under ignored `artifacts/check-seal-opening.mjs` and `artifacts/seal-*.png`.

The reference public HTML specifies a 2.5-second door effect, dark linen texture, seal-10, background `#7d1f2a` and a bottom button. No connected browser was available for direct reference animation inspection. The gold seal is drawn locally with CSS/SVG; exact reference artwork and motion parity are unverified.

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
# Reference animation QA — 20 October 2026

Final result: typecheck, lint (zero warnings), all 13 unit tests, production build and the browser animation checks pass.

Inspected local `preview_Elegance .html` without running its third-party scripts. Entrance names, timings, delays and iteration counts are present in saved DOM attributes. Source keyframes are unavailable because its companion resources are missing; displacement/scale are reconstructed as documented in PLAN.md.

Automated browser check: `node --experimental-websocket scripts/check-animations.mjs` (Node 20, Vite on port 5173 and an agent-owned headless Chrome on debugging port 9223). Checks cover delayed hero playback after keyboard opening, entrance completion, all six effect variants, repeating map pulse, individual gallery animation, keyboard album navigation/focus restoration, immediate reveal on focus, no horizontal overflow at 320/390/768/1440px, immediate reduced-motion opening, disabled transforms/pulse, image decoding and runtime errors. Screenshots in ignored `artifacts/animation-qa/` were reviewed for hero, story and album layout.

Removed a stale, CSS-hidden schedule decoration image reference after browser QA found its local SVG absent. Wedding content, photo order, RSVP availability and music activation behavior are preserved.

# Typography and auto-scroll QA — 20 October 2026

Final result: typecheck, lint with zero warnings, all 16 unit tests, production build and the extended browser checks pass.

Saved reference DOM specifies bold invitation/family/event/venue labels. The active page previously inherited `font-synthesis: none` despite bundling only regular Lora files. Scoped weight synthesis now allows the reference bold emphasis; responsive heading/venue/address/story/album sizes and album shadow follow the saved values.

The auto-scroll controller appears after opening, starts once per tab session after 2.2 seconds, advances at 60px/s using frame timestamps, and stops at the current document bottom. First-run state uses optional sessionStorage only. Wheel/touch/pointer/scroll keys/focus, dialogs and tab hiding stop playback; returning to a tab does not restart it. Reduced motion skips automatic playback and uses an instant manual jump. No audio autoplay, backend or tracking was added.

Validation: three scrolling-math unit tests (refresh-rate independence, end bounds, background-gap cap), the existing 13 unit tests, and browser checks in `scripts/check-animations.mjs` for first-run timing/speed, manual pause/resume, interruption, bottom completion, same-tab reload, reduced motion, synthesized bold and no overflow at 320/390/768/1440px. Reviewed `typography-events.png` and `typography-families.png` in ignored `artifacts/animation-qa/`.

# Viewport-trigger regression — 20 October 2026

Re-read the saved template's per-node one-time entrance settings. Its runtime companion files remain unavailable. Reproduced the current bug by programmatically restoring a date heading into the viewport behind the closed cover, returning to the top and opening: Motion's earlier `useInView({ once: true })` had already latched the hidden heading, so it animated off-screen. The new browser regression failed before the fix and passes afterward.

Reveal now observes an untransformed outer layout box only after opening. Each inner Motion element starts once at 15% visibility with a 64px bottom inset (both configurable). It retains its delay/duration, keyboard-focus bypass and reduced-motion overrides. Browser frame sampling during actual 60px/s auto-scroll confirms unseen family/event text starts waiting, has visible intermediate opacity after entry, completes, and never starts below the viewport. Later text stays waiting through pause/resume; manual scroll also produces intermediate animation states.

Typecheck, lint, all 16 unit tests, build and the extended `scripts/check-animations.mjs` checks pass. Story and album screenshots reviewed after the layout-wrapper change.

# Scroll-control visibility and Sunday calendar — 20 October 2026

The play/pause control fades out and ignores pointer input while scroll events continue, then returns after 800ms idle (configurable via `controlIdleDelayMs`). Keyboard focus keeps it visible and operable; it remains in the tab order when visually hidden. Reduced motion removes the fade transition.

The saved template calendar theme is `rgba(255, 195, 0, 1)`. The Sunday heading and dates now use `#ffc300` through `wedding.calendar.sundayColor`, including selected Sunday dates. Other weekday colors and the wedding heart remain intact.

Typecheck, lint, all 16 tests, production build and extended browser checks pass. Tested manual/automatic movement, idle return, keyboard visibility and Sunday styling for both invitation sides; reviewed `artifacts/animation-qa/calendar-sundays.png`.

# Verified original animation parity — 20 October 2026

Retrieved the public page and the exact CSS/chunk hashes referenced by the saved HTML. This supersedes earlier reconstruction limits: original fades use ±100% translation; zoom starts at scale 0.3 with opacity 1 at 50%; continuous pulse reaches opacity 0.8 at midpoint; observer uses threshold 0.1 and bottom rootMargin -50px. Scoped native CSS keyframes now reproduce these values and browser interpolation. Independent family, story, calendar and background entrances follow saved per-node settings.

With `QA_REFERENCE_DIR=artifacts/reference-animation`, `scripts/check-animations.mjs` extracts original keyframes into an isolated browser fixture and compares computed opacity/transform matrices at six timestamps for all eight effects. All comparisons pass. An additional 50 placement checks match effect, duration and delay against `preview_Elegance .html`. No vendor JavaScript is executed in the app. Sources and mapping: `ANIMATION_REFERENCE.md`.

The full browser checks for real auto-scroll intermediate states, waiting/offscreen nodes, manual scroll, pause/resume, keyboard/focus, reduced motion, local images, Sunday calendar and responsive layout pass. Story/calendar screenshots reviewed. Typecheck, lint, all 16 unit tests and production build pass.

# Static hero and measured Love Story/Album — 20 October 2026

The user explicitly confirms the hero should already be visible under the opening doors, with no entrance once opening completes. Its four text entrances are removed; later sections retain viewport-triggered effects. This supersedes earlier hero-animation checks. The original CSS parity test now checks 46 remaining placements; static hero visibility is checked before and immediately after opening.

Love Story follows the saved portrait/copy coordinates: captions under each portrait, groom copy to the right, bride portrait staggered up to the right and bride copy below the groom caption. Text remains in normal flow so configured longer copy/names can expand the layout. Album follows the original 500px mosaic with nine unequal/paired tiles, white Album title over the cover and the script title in its center gutter. Each image remains a keyboard-operable lightbox trigger; extra configured photos continue as paired rows.

The browser parses the supplied HTML and normalizes measured positions to its 500px canvas. Twenty story/album positions and sizes match within 1px at 515/390/320px viewports. Mobile/desktop screenshots reviewed in `artifacts/animation-qa/*-layout-*.png`. Narrow-screen overflow is checked against clientWidth, including native scrollbar width. Full scroll/animation/keyboard/reduced-motion checks pass; typecheck, lint, all 16 unit tests and build pass.

# Static countdown, taller center photo and auto-start — 20 October 2026

The full opening area now stays visible underneath the doors: hero, countdown photo, translucent backdrop, quote and ticking timer have no entrance effects. Later sections still animate on entry. This supersedes earlier countdown-animation expectations; the CSS parity check now covers 42 remaining source placements.

Triptych widths/heights match the 500px source: sides 151×233, center 163×279. Hero text spacing, countdown photo top (648.01), overlay top/height (781.98/163) and timer position/size (63.6,851.51,375,85) are now proportional to the invitation width. Expanded browser geometry checks match 31 opening/story/album positions and sizes within 1px at 515/390/320px; screenshots reviewed.

The original auto-scroll caller passes 2000ms. Auto-start now waits 2s after doors finish and retains 60px/s, once per tab session. Frame updates sync with browser/anchor adjustments to avoid snapping back. Browser checks measure the door-removal→first-scroll interval, a small initial step, steady speed and position resync, as well as all existing interruptions, controls, reduced motion, local assets, keyboard lightbox and calendar checks. Countdown ticking is tested while its display remains static. Typecheck, lint, all 16 unit tests and production build pass.

# Opening viewport stability — 20 October 2026

Final result: typecheck, lint, all 16 unit tests, build and the full browser suite pass. Modal cleanup also excludes its own departing controls from focus restoration, preventing development Strict Mode from focusing “Mở thiệp” again and canceling pending auto-start.

Reproduced a scrollbar-induced layout shift: at a 390px desktop viewport, locking body overflow expanded the invitation to 390px; restoring overflow after the doors opened narrowed it to 375px. The middle photo moved from y=140.59/height=217.72 to y=135.16/height=209.33, despite scrollY staying zero.

A stable root scrollbar gutter now keeps invitation width constant during scroll lock/unlock. Modal locking/focus uses a layout effect, and initial/restored/main focus uses preventScroll. A restored history/anchor position is reset at the open-button action while both doors are still closed.

The browser regression samples page, hero, middle photo, countdown photo and countdown overlay every animation frame through door opening and 600ms afterward. At 320/390/768/1440px and reduced-motion 390px, maximum geometry change and scroll displacement are both 0px. Additional checks cover restored scroll, lightbox opening/closing without underlying shifts and existing keyboard/focus/auto-scroll behavior.

# Card-contained scrolling and delayed auto-start — 21 October 2026

The root document stays fixed. A centered card (maximum 500px) owns a viewport-height scrolling surface with a stable thin gutter at its right edge. This supersedes the previous root-gutter implementation. Entrance observers, scroll coordinates, restored-position reset and modal locks all use this surface; floating controls are positioned inside the card. Album/gift portals live outside the scrolling/container-query content.

`scripts/check-animations.mjs` passes: no opening geometry/scroll movement at 320/390/768/1440px and reduced-motion 390px; document scroll stays zero; scrollbar and controls remain within the card; a desktop wheel outside the card leaves playback running; a full-viewport album locks the card and restores focus/position on Escape. Existing manual/automatic text entrances, idle control visibility, input interruptions, bottom completion, session behavior, Sunday colors and local image decoding pass. Original CSS comparisons still pass for eight effects at six timestamps and 42 placements. All 31 measured opening/story/album targets remain within 1px at 515/390/320px.

Measured first automatic movement occurs 2049ms after the doors disappear, at 61px/s against the configured 60px/s. User input during the delay cancels pending playback without recording a successful first start. Reduced motion never auto-starts. Production checks also pass for the initial scroll lock (without development Strict Mode), stable unlocking/focus, delayed playback, portal album and suppressed-transition fallback followed by its own full delay. No runtime errors.

Reviewed `artifacts/animation-qa/card-scroll-desktop.png` and `opening-layout-390.png`. Typecheck, ESLint, all 16 unit tests and production build pass. Development preview remains at http://127.0.0.1:5173/; production preview at http://127.0.0.1:5174/.
# C141 magazine update — 5 November 2026

- Active invitation follows the new supplied HTML composition using the user's current local photos/music and wedding data. Existing split-door opening and seal implementation were not edited.
- `npm run typecheck`, `npm run lint`, `npm test` (16 tests) and `npm run build` pass.
- Headless Chrome checks at 320, 390, 768 and 1440px cover keyboard opening with reduced motion, personalized guest, URL side switching, local soundtrack path, all body images decoding, album keyboard navigation/Escape/focus restoration, no horizontal scroll, runtime exceptions or external requests.
- Normal-motion opening and delayed auto-scroll checked separately. Mobile hero, portraits, event and ending screenshots visually reviewed. Temporary script/screenshots: ignored `artifacts/check-magazine.mjs` and `artifacts/magazine-*.png`.
- C141's absent Hastegi/Arcittya/Activists font binaries use existing local serif/script fonts. Photos and content deliberately remain the user's; this is a composition match, not a pixel-identical copy with source demo assets. RSVP remains unavailable and gifts remain unconfigured until real accounts are supplied.

# Mai Lan lightbox trial — 5 November 2026

- Replace the gallery's viewer with `WeddingLightbox.tsx` and scoped `photo-viewer.css`. Source-inspired 85% black fullscreen backdrop, top corner close/counter, photo max-width 1024px, 48px mobile/64px desktop thumbnails, active ring and contained rounded image. Keep the inline album composition and all current local images.
- Use existing `useModal` and `InvitationPortal` for Escape, focus containment/restoration, background inertness and invitation scroll locking. Opening, seal and music code unchanged.
- New component handler integration harness passes 15 checks: selected opening image, wraparound/thumbnails, keyboard, swipe/diagonal filtering, gesture-click suppression, double tap, navigation reset, pinch limit, pan clamping, touch cancellation, pinch-to-one-finger blocking, resize reset, reduced-motion centering and close callback. Script: ignored `artifacts/check-local-lightbox.mjs`; it mocks React/DOM and does not verify rendering or device behavior.
- Added five Vitest gesture/zoom/wrap boundary tests. `npm run typecheck`, `npm run lint`, `npm test` (21 tests) and `npm run build` all pass.
- Browser/native Computer Use hosts remain unavailable. No direct UI screenshots, actual focus traversal or hardware touch verification performed for this trial. User authorized implementation for preview evaluation despite this remaining limitation.

# Mai Lan 3D card album — 5 November 2026

- Inline album now uses `PhotoGallery.tsx` + `coverflow.css` instead of the collage. Match the supplied card source's 1000px perspective, 60% lateral steps, 150px depth steps, 45-degree rotations, minimum 0.7 scale, 1100ms transition and 1400ms autoplay with 6-second interaction cooldown. Cards use local photos and measured natural aspect ratios; center opens the existing lightbox.
- Add keyboard arrows/Home/End, active-card focus request, swipe and click suppression, explicit pause/resume, hover/focus/tab visibility/near-viewport/inert/lightbox gates and reduced-motion handling. Opening/seal/music are untouched.
- Four new Vitest tests cover center/neighbor geometry, wraparound and distant-card interaction bounds. Typecheck, lint, all 25 tests and production build pass.
- `artifacts/check-coverflow.mjs` passes 19 isolated component-handler checks for autoplay timing/gates, side-card selection, correct lightbox index, cooldown, keyboard/focus request, wrapping, horizontal/vertical/cancelled swipes, accidental-click suppression, persistent pause, background visibility, reduced motion and empty album. It mocks DOM and React; it does not verify physical gestures, layout or actual browser focus.
- Browser/native hosts still report unavailable. No direct screenshot/device verification is claimed. Local preview returns HTTP 200 and stays running for user review.

## UI/UX plan implementation — 9 November 2026

Typecheck, lint, 57 unit tests and production build pass. Browser QA: `artifacts/check-upgrade.mjs`, `upgrade-audit.json`, `upgrade-network.json`, `upgrade-hero-*.png`.

Verified Chrome at 320×568, 390×844, 768×1024, 1024×768, 1366×600 and 1440×900 with DPR 1/2/3. Portrait aspect ratio is preserved; desktop shortcut remains in the first viewport; no horizontal overflow. Visually reviewed 390px and 1366px captures. Both side selections have independent reception and ceremony calendar dates and corresponding locations. Calendar weekdays/year/day 29, hero shortcut focus/scroll, unavailable RSVP/gift states, responsive album preview, zoom-to-original and Escape close pass. Normal-motion opening leaves auto scroll idle; manual start and keyboard interruption pass. Reduced-motion checks run throughout the layout/album checks.

At 250 KB/s, 100ms latency and disabled cache, measured image-body bytes decreased from 1,308,502 to 199,453 for the prior hero versus the new 1440px variant; transfer durations were 5.43s and 0.94s. This is an individual-resource comparison, not a total-page benchmark. Original photos remain untouched. Physical-device and subjective fine-detail comparisons remain manual; no per-phase before/after screenshot sequence was made. Existing baseline screenshots remain available in artifacts.

## Deployment source verification — 9 November 2026

Exported the Git index to ignored `artifacts/deploy-staging/` to validate the exact deployment source without saved reference pages or unused local resources. Typecheck, lint, all 58 tests and Vite production build pass. Verified all 43 configured public images, 7 local font CSS dependencies and the two configured MP3 files; no missing configured image paths. Unused I Do MP3, Marmelad font and historical asset manifest are absent from the resulting build. Public assets total 164,585,284 bytes; no individual file exceeds 21,691,132 bytes. Selected text files contain no detected private-key or common API-token patterns. No backend, tracking or dependencies added.
