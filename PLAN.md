# Wedding invitation — implementation status

## GitHub Pages deployment diagnosis — 9 November 2026

- [x] Diagnose user-supplied run 42570052228: Configure Pages returns GET Pages site 404 after build. Repository Pages must be enabled with GitHub Actions as the publishing source.
- [x] Upgrade checkout/setup-node to v5 and configure-pages to v6 (official Node 24 action runtimes), retain Node 22 for application commands, and pin both runners to Ubuntu 24.04 to avoid ubuntu-latest migration.
- [x] Document one-time Pages setup, private-repository plan eligibility and workflow retry. Do not introduce a privileged token or change repository visibility.
- [x] Typecheck, lint, all 58 tests and production build pass. Action runtime declarations verified against official action.yml files.
- [ ] Repository owner: select Settings → Pages → Source → GitHub Actions, then rerun and confirm the deployment. Repository settings and Actions logs cannot currently be read through an authenticated connection.

## Unused image cleanup — 9 November 2026

- [x] Audit all 54 public images against expanded wedding configuration (including responsive srcsets and original lightbox images), source, CSS, HTML and asset-generation scripts.
- [x] Remove 9 unreferenced `album/web/THA_*.jpg` images and 2 unreferenced original portrait files in `co-dau-chu-re/`: 50,592,931 bytes (50.59 MB). Keep configured images, responsive variants, original album zoom images, source images consumed by generation scripts and saved reference materials.
- [x] Update PHOTO_GUIDE.md to reflect removal of the original portrait files. Audit after cleanup: 43 public images, no unused images or missing configured image paths. Detailed inventory: ignored `artifacts/removed-images-audit.json`.
- [x] Typecheck, lint, all 58 tests and production build pass.

## Phone-specific story sizing — 9 November 2026

- [x] Keep Love Story body at 16px/400 on phones below 768px; use `clamp(17px, 2.2cqw, 19px)` on tablet/desktop. Retain line height 1.65, Be Vietnam Pro, paragraph spacing and the existing Cormorant title.
- [x] Chrome checks at 320/360/390/430px confirm 16px body text, weight 400 and no section/page horizontal overflow; 768/1440px confirm 17–19px sizing. Visually reviewed the 390px capture. QA: `artifacts/check-story-phone.mjs`, `artifacts/story-phone-audit.json`, `artifacts/story-phone-{320,390,430}.png` (ignored artifacts).
- [x] Typecheck, lint, all 58 tests and production build pass.

## Lighter, smaller story body — 9 November 2026

- [x] Set Love Story body to the existing local Be Vietnam Pro Regular 400 and reduce responsive font size from 18–23px to 16–19px (`clamp(16px, 4cqw, 19px)`). Preserve the heading, color, line height and paragraph spacing.
- [x] Typecheck, lint, all 58 tests and production build pass.

## Be Vietnam Pro story body — 9 November 2026

- [x] Change only `.magazine-story-copy` to the existing local Be Vietnam Pro font for readability. Preserve its size, weight 500, line height, color and spacing; keep the story heading unchanged. Latin and Vietnamese subsets at weight 500 are already bundled.
- [x] Typecheck, lint, all 58 tests and production build pass.

## Event card entrance and compact calendar underline — 9 November 2026

- [x] Wrap each complete reception/ceremony card in a once-only reveal, including its background, border and shadow. Add a dedicated `fadeInUpSmall` effect: opacity 0→1 and 20px upward travel over 750ms with zero delay. Use the existing invitation scroll observer and focus/reduced-motion behavior.
- [x] Synchronize inner content with the parent entrance: headings, location and actions fade/slide 6px over 450ms after 125ms. Date/time appear with the card. Preserve the approved map pulse endpoints/timing; begin the loop at 900ms, after the entrance, and pause on hover/focus/press. Keyboard focus immediately exposes the card and its contents. Reduced motion disables all these animations.
- [x] Make calendar links inline-flex, centered and sized to their icon/label; retain 48px target height. Use a pale olive underline with darker hover/focus styling. Both calendar destinations remain unchanged.
- [x] Typecheck, lint, 58 tests and production build pass. Chrome checks both sides and both cards at 320/390/768/1440px in normal/reduced motion: no horizontal overflow, centered compact links, correct animation durations/delay, bounded one-shot 20px travel, map pulse and keyboard visibility/pause. Visually reviewed the mobile card capture. QA: `artifacts/check-event-entrance.mjs`, `artifacts/event-entrance-audit.json`, `artifacts/event-entrance-normal-390.png`, `artifacts/event-entrance-reduced-390.png` (ignored artifacts).

## Album zoom panning and balanced toolbar — 9 November 2026

- [x] Diagnose desktop panning: touch pan/pinch already existed, while mouse/pen dragging had no handlers. Add pointer capture for mouse/pen at zoom >1, release on up/cancel/lost capture, show grab/grabbing cursors, and suppress the click after a drag to prevent accidental album closure. Retain touch gestures and double-click zoom-out.
- [x] While zoomed, four arrow keys pan by 60px; at normal zoom left/right retain image navigation. Next/previous buttons and thumbnails continue to select images and reset zoom. Show a configured visible hint. Bound movement using the fitted image size rather than empty margins of the stage, and clip transformed photos to the stage so controls remain accessible.
- [x] Group zoom and close in a common flex toolbar: identical 44px targets, 22px icons, 8px gap and shared responsive/safe-area offset. Reserve space above the photo for the toolbar.
- [x] Typecheck, lint, 58 unit tests and production build pass. Chrome at 320×568, 390×844, 1366×600 and 1440×900 verifies toolbar geometry, mouse pan without accidental closure, keyboard pan, navigation/reset and Escape. Touch pan checked at 390px. Visually reviewed mobile screenshot. QA: ignored `artifacts/check-pan.mjs`, `artifacts/album-pan-*.png`. Physical touch devices remain unverified.

## Full-width desktop hero with top crop — 9 November 2026

- [x] Replace the desktop two-column hero with the mobile composition: full-width portrait, white copy and shortcut over the lower gradient. Preserve the approved fonts and mobile/tablet layout below 1024px.
- [x] At 1024px and above, clip the top 8% of the natural 2:3 image using a 100:138 frame and bottom-aligned, proportionally scaled image. At 890px width the frame is 1228.19px tall versus the original 1335px, with 106.81px removed from the top and zero bottom crop. The hero intentionally remains taller than a desktop viewport.
- [x] Correct responsive image `sizes` for the restored full-width layout. Keep all original and derivative assets unchanged.
- [x] Typecheck, lint, all 57 tests and production build pass. Chrome verifies full width, exact top crop, zero bottom crop, contained white text overlay and no horizontal overflow at 320/390/768/1024/1366/1440px, including 1366×600 and 1440×900. Keyboard shortcut still focuses and scrolls to events. Visually reviewed mobile and full desktop hero captures. Diagnostics: `artifacts/check-hero-crop.mjs`, `artifacts/hero-crop-audit.json`; captures: `artifacts/hero-crop-390.png`, `artifacts/hero-crop-1440.png`. This supersedes the two-column hero from the earlier UI/UX phase below.

## UI/UX improvement implementation — 9 November 2026

- [x] Phase 1: separate reception/ceremony calendar links on each event card with the selected side's time and venue. Calendar titles use the event title; ceremony address/maps retain the agreed reception-side location. Show calendar weekdays/year and retain day 29. Remove the ambiguous duplicate calendar action. Add a keyboard-accessible hero shortcut that scrolls the invitation surface and respects reduced motion. Replace the unavailable RSVP prompt with a concise honest status; show gift availability as visible text when no accounts exist.
- [x] Phase 2: preserve the mobile portrait hero; use two columns at 1024px and above with the full portrait constrained by viewport height and cream-background copy. Create EXIF-oriented JPEG variants directly from originals (hero 480/960/1440/2700px; album previews 960/1920px), preserving originals. Use asset-based srcsets/sizes. Load the selected original only when zooming; preserve loading/error states and add a keyboard zoom button.
- [x] Phase 3: auto scrolling now requires the guest to start it. Retain interruption controls, map pulse/reduced-motion behavior and Cormorant story typography. Expose event date/time immediately; add visible album guidance and couple identity on the opening cover.
- [x] Typecheck, lint, 57 tests and production build pass. Chrome covers 320/390/768/1024/1366/1440px at DPR 1/2/3; no horizontal overflow, full desktop hero and visible shortcut. Both sides' calendar dates/locations, focus/scroll shortcut, calendar headings, unavailable states, responsive album, original zoom and Escape close pass. Audit and screenshots: ignored `artifacts/check-upgrade.mjs`, `artifacts/upgrade-audit.json`, `artifacts/upgrade-hero-*.png`.
- [ ] Physical-device review and a subjective side-by-side review of fine photo detail remain manual. Earlier baseline captures are retained in artifacts; new screenshots were captured after the combined implementation, not after each individual phase. No backend, tracking, deployment or new package dependency was added.

Recreate responsive derivatives on Windows with `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/create-responsive-photos.ps1`.

Final interaction checks pass: normal-motion opening leaves scrolling idle; the control starts scrolling and keyboard input stops it. Under an emulated 250 KB/s connection with 100ms latency and cache disabled, the prior 1376px hero transferred 1,308,502 bytes in 5.43s; the new 1440px derivative transferred 199,453 bytes in 0.94s (84.8% fewer image bytes). This compares individual image transfers, not total page load time. See `artifacts/upgrade-network.json`.

## Smaller hero preview and UI/UX implementation proposal — 9 November 2026

- [x] Identify the supplied `dau-thiep/o-giua-2.jpg` (1376 × 2064px, 1,308,502 bytes) and switch the active hero through `asset()` with its content hash. Update intrinsic dimensions; preserve original image and current layout. Image bytes decrease 93.6% versus the prior 20,477,903-byte source.
- [x] Chrome at 390px/DPR 3 and 1440px/DPR 1 confirms adequate source resolution, successful decoding and no horizontal overflow. Desktop DPR 2 needs 1780px for the current 890px display width, exceeding the 1376px source. Visually compare matching face/detail crops against the original: new image is softer at DPR 2, with no obvious blocky pixelation at normal review size. Physical device rendering remains unverified. Diagnostics: `artifacts/check-small-hero.mjs`, `artifacts/small-hero-audit.json`; captures: `artifacts/small-hero-390-dpr3.png`, `artifacts/hero-detail-new-dpr2.png`, `artifacts/hero-detail-original-dpr2.png`.
- [x] Record phased proposals and acceptance criteria in UI_UX_IMPROVEMENT_PLAN.md, covering calendar event clarity, unavailable RSVP/gifts, shortcuts, desktop hero, responsive photos, album loading, motion, visible album guidance, opening identity and typography. Those proposals remain unimplemented.
- [x] Typecheck, lint, all 56 tests and production build pass. Preview updated on port 5173.

## Olive Romance directions pulse and stronger family labels — 9 November 2026

- [x] Inspect the saved Olive Romance HTML and its `c0767dd818d8e500.css`: directions use `animation-pulse`, 1s/ease-in-out/infinite, scale 1 → 1.05 → 1 and opacity 1 → 0.8 → 1. Reproduce these loop endpoints/timing in `map-olive-pulse`, replacing horizontal shake. Keep the current entrance and begin looping after its 2s total; preserve hover/focus/press pause and reduced-motion handling. Record source details in ANIMATION_REFERENCE.md.
- [x] Increase family headings to 17–20px with Lora Regular and synthesized bold 700, replacing the thin inherited heading face. Increase both side-selector labels to 16–18px/700. Preserve family content, selection behavior and selected-state colors.
- [x] Typecheck, lint, all 56 tests and production build pass. Chrome at 320/390/768/1440px confirms larger bold headings/buttons fit, no horizontal overflow, text-only directions and reduced-motion support. Normal-motion trace verifies source-matched scale/opacity bounds, repeated cycles, no horizontal shake, 1s/ease-in-out timing, entrance delay, focus pause and visible outline. Mobile capture visually reviewed. Diagnostics: `artifacts/check-olive-pulse.mjs`, `artifacts/olive-pulse-audit.json`; capture: `artifacts/olive-pulse-labels-390.png`. Preview updated on port 5173.

## Event background cards and looping directions shake — 9 November 2026

- [x] Implement two separate ivory (`#fffaf3`) event cards with pale olive borders, 18px corners and subtle shadows. Keep centered 560px maximum width with responsive outer/inner spacing. Remove extra date-row side margins inside the narrower cards so month/day/year remain readable on phones.
- [x] Replace the one-shot bounce with a continuous gentle horizontal shake, ±2px over 2.4s. Begin after the configured entrance's current 0.5s delay plus 1.5s duration. Pause while hovered, keyboard-focused or pressed; resume afterward. Reduced-motion disables animation. Directions remain text-only with unchanged map links.
- [x] Typecheck, lint, all 56 tests and production build pass. Chrome at 320/390/768/1440px for both wedding sides verifies two styled cards, contained text/date rows/buttons, no horizontal overflow and reduced-motion handling. Normal-motion trace verifies a 2s initial delay, bounded horizontal movement, continued looping, keyboard focus pause/outline and resume. Mobile card screenshot visually reviewed. Diagnostics: `artifacts/check-event-cards.mjs`, `artifacts/event-cards-audit.json`; capture: `artifacts/event-cards-390.png`. Preview updated on port 5173.

## Directions button simplification and event-card assessment — 9 November 2026

- [x] Assess two separate subtle ivory event cards with pale olive borders, soft corners/shadows as a way to distinguish reception and ceremony dates. Keep cards as a proposal pending the user's decision; no card background applied in this change.
- [x] Remove both icons from event directions links; center the configured text with balanced padding. Keep original links, 52px minimum height and keyboard focus styles. Add one 1.6s gentle bounce after the entrance reveal, capped at 3px, then settle. Hover/focus/press cancel the nudge; reduced-motion disables it.
- [x] Typecheck, lint, all 56 tests and production build pass. Chrome at 320/390/1440px verifies text-only links, correct destination, target size, no horizontal overflow and no reduced-motion animation. Normal-motion trace confirms bounded movement and no loop; keyboard focus remains visible and cancels movement. Mobile screenshot visually reviewed. Diagnostics: `artifacts/check-text-directions.mjs`, `artifacts/text-directions-motion.json`; capture: `artifacts/text-directions-390.png`. Preview on port 5173.

## Swap portrait name positions — 9 November 2026

- [x] Swap the two role/name pairs around the shared couple portrait: `Chú rể / Tuấn Vũ` above right, `Cô dâu / Tuyết Mai` below left, matching their positions in the photo. Preserve image, typography, spacing and animation.
- [x] Typecheck, lint, all 56 tests and production build pass.

## Restore story font and enlarge hero copy — 9 November 2026

- [x] Restore story body to Cormorant Garamond at its existing 500 weight, size, color and spacing. Remove the trial Marmelad declaration and update asset provenance to mark the trial reverted.
- [x] Increase the full hero text group by approximately 20%: names use `clamp(38px, 12.8cqw, 64px)` (previous cap 53px); eyebrow/date use `clamp(18px, 5.6cqw, 28px)` (previous cap 23px). Preserve existing typefaces, white color, image, positioning and configured ceremony date.
- [x] Typecheck, lint, all 56 tests and production build pass. Chrome at 320/390/768/1440px verifies increased responsive type sizes, copy contained within the hero, no text overlap or horizontal overflow, unchanged `29.11.2026` date and restored story family/weight. Actual story glyphs render with local Cormorant. Visually reviewed mobile and desktop captures. Diagnostics: `artifacts/check-hero-type.mjs`, `artifacts/hero-type-audit.json`; screenshots: `artifacts/hero-type-320.png`, `artifacts/hero-type-390.png`, `artifacts/hero-type-1440.png`. Preview updated on port 5173.

## Trial Marmelad story body — 9 November 2026

- [x] Change only `.magazine-story-copy` from Cormorant Garamond to Marmelad Regular, retaining existing size, weight, color and spacing. Keep story heading and all other text styles unchanged. Download the reference font to `public/crimson/fonts/marmelad-regular.woff2`, declare it in the local stylesheet and record provenance in ASSET_CREDITS.md.
- [x] Easy rollback: restore `.magazine-story-copy` font-family to `"Cormorant Garamond", Georgia, serif` in `src/magazine.css`. Existing Cormorant font files/imports are retained.
- [x] Typecheck, lint, all 56 tests and production build pass. Chrome at 320/390/1440px confirms only story body uses the new family, existing size/weight/color are retained and no horizontal overflow. Actual rendered Vietnamese glyphs use the local Marmelad font, with no fallback; heading remains Cormorant Garamond. Mobile screenshot visually reviewed. Diagnostics: `artifacts/check-story-font.mjs`, `artifacts/story-marmelad-audit.json`; captures: `artifacts/story-marmelad-390.png`, `artifacts/story-marmelad-1440.png`. Preview updated on port 5173.

## Hero wedding date — 9 November 2026

- [x] Read the date below the couple's names from the selected side's ceremony rather than reception. Both sides now display `29.11.2026`; reception dates remain `28.11.2026`.
- [x] Typecheck, lint, all 56 tests and production build pass.

## Larger desktop album — 9 November 2026

- [x] Add a desktop breakpoint at 1024px: stage width uses the card width minus 80px, capped at 800px. Stage height adapts to viewport height minus 180px, bounded at 340–640px. At 1440 × 900, the main photo grows from about 319 × 478px to 392 × 589px (23% larger).
- [x] Preserve phone/tablet dimensions and the existing coverflow composition, controls, music and detail-view behavior. Short desktop viewports reduce image height to keep the album and its controls visible.
- [x] Typecheck, lint, all 56 tests and production build pass. Chrome checks 320/390/768/1024/1366/1440/1920 widths, including a 600px-tall desktop, confirm unchanged mobile/tablet sizing, desktop expansion, three visible cards, unclipped desktop neighbors, 44px visible arrow controls and no horizontal overflow. Next/previous, detail opening, Escape/focus restoration and normal/reduced-motion navigation pass. Visually reviewed desktop 1440 × 900 and 1366 × 600 captures. Diagnostics: `artifacts/check-desktop-album.mjs`, `artifacts/desktop-album-sizes.json`; screenshots: `artifacts/desktop-album-1440x900.png`, `artifacts/desktop-album-1366x600.png`, `artifacts/desktop-album-390x844.png`. Preview updated on port 5173.

## Readability review adjustments — 9 November 2026

- [x] Darken the olive text accent from `#77764f` to `#5c5b3c` (contrast against paper rises from 4.23:1 to 6.30:1). Keep the existing main ink and decorative typefaces.
- [x] Increase story copy to 18–23px with the bundled Cormorant Garamond 500 weight. Set key small text to at least 14px: family names/headings, invitation text, event details, map buttons, calendar cells/link, RSVP notes, gift button, countdown labels and footer copy.
- [x] Set footer paragraph line-height explicitly to 1.5 so the enlarged thank-you copy fits the uncropped photo even at 320px.
- [x] Typecheck, lint, all 56 tests and production build pass. Chrome at 320/390/768/1440px verifies darker accent, story sizing/weight, minimum small-text sizes, no horizontal overflow, matching ceremony/reception addresses and footer copy contained within the photo. Visually reviewed story/invitation at 390px and footer at 320px. Diagnostics: `artifacts/check-readability.mjs`, `artifacts/readability-audit.json`; review captures: `artifacts/readability-story-390.png`, `artifacts/readability-invitation-390.png`, `artifacts/readability-events-390.png`, `artifacts/readability-footer-320.png`. Live preview on port 5173.

## Match ceremony and reception addresses — 9 November 2026

- [x] Render the ceremony address and directions link from the selected side's reception configuration, replacing the generic family address and broad map search. Lễ vu quy now matches Bữa tiệc chung vui at `Xóm 1 Vật Phụ, Ba Vì, Hà Nội`; shared rendering also keeps the groom-side ceremony matched to its reception. Dates and ceremony titles remain configured separately.
- [x] Inspect active styles/font imports: Lora Regular, Luxurious Script, Cormorant Garamond, Alisheia, UTM Edwardian, VIP Brisca and Be Vietnam Pro. Ergisa and HoaTay1 are declared for the older layout.
- [x] Typecheck, lint, all 56 tests and production build pass.

## Album detail music and image quality audit — 9 November 2026

- [x] Opening the active album photo now requests Sugar inside the click/keyboard gesture, using the existing crossfade session. Keep the album visible to music while detail is open. On every close path, check current card geometry: keep Sugar if the album remains visible, otherwise return to background. Preserve manual music stops, playback positions, blocked/error handling and navigation behavior.
- [x] Audit originals versus served assets: album and portraits were downsampled from 5504 × 8256px to 1333 × 2000px, JPEG quality 88. Hero already uses its original; footer uses the supplied 1667 × 1250px file. Keep the requested portrait edge mask. Record findings in PHOTO_GUIDE.md.
- [x] Add `galleryImages.fullSrc` using the local original album files for detail viewing; cards/thumbnails retain lightweight `src`. Original photos load only when selected, with loading and error states. Document the 18–22 MB per-photo loading tradeoff in README.md and PHOTO_GUIDE.md.
- [x] Typecheck, lint, all 56 tests and build pass. Chrome at 390/1440px and DPR 3, reduced/normal motion verifies opening detail with Enter starts Sugar without navigation, full 5504 × 8256px decode, original photos are not requested before detail, loading clears, repeated navigation preserves music time, close restores controls/focus, visible-album close retains Sugar, scroll exit returns to background, detail retains Sugar over an offscreen underlying stage, Escape rechecks visibility and manual stop persists across detail open/close/exit. Diagnostics: `artifacts/check-album-detail.mjs`, `artifacts/album-detail-image-audit.json`. Preview on port 5173.

## Opening music fade and portrait edge blending — 8 November 2026

- [x] Start background playback in the opening button gesture and ease volume from silence to the configured 0.28 over `musicSettings.openingFadeInMs` (2500ms). Door completion is idempotent and preserves playback position/gain. Keep blocked-playback errors and manual stop behavior.
- [x] Blend the couple portrait's top 16% and bottom 20% into the paper with a static CSS alpha mask, including the WebKit property. Preserve natural image dimensions, clear center detail and accessible alt text.
- [x] Typecheck, lint, all 56 tests and production build pass. Four new deterministic tests cover the opening ramp, repeated completion, delayed readiness, manual stop and blocked-playback retry. Chrome at 390/1440px (reduced/normal motion) confirms silence before opening, immediate playback during opening, monotonic gain to 0.28, portrait masks, natural aspect ratio and no horizontal overflow. Mobile screenshot visually reviewed. Diagnostics: `artifacts/check-opening-fade.mjs`; captures: `artifacts/couple-edge-fade-390.png`, `artifacts/couple-edge-fade-1440.png`. Preview available on port 5173.

## Hide outer navigation during album preview — 7 November 2026

- [x] Render the gallery previous/next buttons only while the fullscreen viewer is closed. Keep the fullscreen viewer's own buttons and restore the outer controls on close.
- [x] Typecheck, lint, all 52 tests and build pass. Chrome at 390/1440px verifies outer arrows are absent during fullscreen preview, fullscreen navigation still works, and both outer arrows return after closing via X or Escape with focus restored to the active photo. Diagnostics: `artifacts/check-viewer-outer-arrows.mjs`. Preview updated on port 5173.

## Uncropped thank-you photo — 7 November 2026

- [x] Let the footer JPEG determine its natural height at full width (1667:1250), removing the fixed minimum-height/cover crop. Position the thank-you copy over the bottom with compact padding, retaining the gradient and clipped entrance animation.
- [x] Typecheck, lint, all 52 tests and production build pass. Chrome at 320/390/768/1440px confirms rendered ratio equals source ratio, footer height follows the image, copy stays inside the image and no horizontal overflow. Review capture `artifacts/uncropped-footer-390.png`; diagnostics: `artifacts/check-uncropped-footer.mjs`. Live preview updated on port 5173.

## Updated thank-you photo — 7 November 2026

- [x] Point the footer to the supplied `cuoi-thiep/loi-cam-on.jpg` through `asset()` with a content-hash cache version; update intrinsic dimensions to 1667 × 1250 and PHOTO_GUIDE.md. Preserve the existing footer framing and text.
- [x] Typecheck, lint, all 52 tests and production build pass. The new JPEG decodes successfully; preview on port 5173 serves the versioned configuration and exact replacement image bytes, matching the production copy.

## Smooth album music crossfade — 7 November 2026

- [x] Crossfade to Sugar over 1200ms and to background over 1500ms, configured in wedding.ts. Keep the outgoing song audible until incoming playback is ready, ease both gains and pause outgoing audio only at zero volume.
- [x] Reverse interrupted fades from current gains, ignore repeated album buttons, preserve playback positions and cancel transitions immediately on manual stop/unmount. Restore the retained song with an honest error when incoming media fails.
- [x] Typecheck, lint, all 52 tests and production build pass. Twelve new deterministic fade tests cover midpoint/end gains, 1200/1500ms duration, readiness, reversals, repeated clicks, immediate manual stop, load errors/blocked return, stale promises and timer cleanup. Real Chrome checks at 390/1440px with reduced/normal motion verify overlapping bounded gain ramps, outgoing pause at zero, progress preservation, reversals without jumps, slow incoming playback retaining full background, blocked Sugar retaining background and manual stop cancelling all later sound. Traces/scripts: `artifacts/check-music-crossfade.mjs`, `artifacts/crossfade-390.json`, `artifacts/crossfade-1440.json`. README updated; live preview on port 5173. Physical iPhone/Safari fade behavior remains unverified.

## Sugar music during album interaction — 7 November 2026

- [x] Add local `sugar.mp3` configuration and a two-track music session that preserves background/Sugar positions, plays only one track, respects manual music stops and handles blocked/failed playback without claiming success.
- [x] Start Sugar only from previous/next button activation in the visible gallery or its fullscreen viewer. Observe the actual photo stage inside the invitation scroller; return to background on exit only while playback is still requested and active/pending. Re-entering alone does not restart Sugar. Repeated buttons do not restart the song.
- [x] Typecheck, lint, all 40 tests and production build pass. Fourteen music-session tests cover preserved positions, repeated clicks, manual stops, disabled autoplay, blocked playback, failed Sugar/fallback, external interruption, runtime errors, rapid exit/pending promises and disposal. Real Chrome media checks at 390/1440px (reduced/normal motion) confirm entry alone stays on background, arrow keys alone do not arm Sugar, previous/next buttons switch tracks, rapid clicks preserve progress, fullscreen buttons work, exit resumes background at its saved time, reentry requires another navigation, manual stop persists and rapid scroll never leaves two tracks playing. Preview and built MP3 bytes match originals. Diagnostics: `artifacts/check-album-music.mjs`, `artifacts/album-music-result.json`. README updated; preview on port 5173.

## Manual album controls — 7 November 2026

- [x] Remove autoplay timers/visibility observers, bottom dots and play/pause controls. Keep previous/next buttons always visible with opaque cream backgrounds and accessible focus styles. Prevent side-card clicks and gallery swipes from changing the active photo; preserve keyboard equivalents and center-photo fullscreen viewing.
- [x] Update configured instructions and PHOTO_GUIDE.md; keep an accessible current-photo announcement without a visual bottom indicator.
- [x] Typecheck, lint, all 26 tests and build pass. Chrome checks at 320/390/768/1440px confirm both 44px arrows remain fully visible, removed controls are absent and no horizontal overflow. No advancement during 9.5s idle, side-card clicks, gallery touch events or 4.5s after viewer close; six-photo previous/next wrapping, keyboard arrows, fullscreen thumbnails and reduced-motion navigation pass. Visually reviewed mobile arrows. Check: `artifacts/check-manual-album.mjs`; capture: `artifacts/manual-album-390.png`. Preview updated on port 5173.

## Six-photo album refresh — 7 November 2026

- [x] Use the supplied `anh_1.jpg` through `anh_6.jpg` in numeric order; preserve originals and generate EXIF-oriented 2000px / quality 88 JPEG copies in `album/web/`.
- [x] Balance the six-photo coverflow with one center card and one softly angled neighbor per side; fully hide distant cards and keep circular navigation. Space six selection dots evenly with larger targets and preserve pause, keyboard, swipe and reduced motion.
- [x] Update PHOTO_GUIDE.md. Typecheck, lint, all 26 tests and build pass. Chrome checks at 320/390/768/1440px verify six images/dots, three visible cards at every selection, no horizontal overflow and static reduced motion. Circular previous/next, keyboard arrows, all six fullscreen thumbnails, autoplay and Pause pass. Visually reviewed mobile capture; diagnostics: `artifacts/check-six-album.mjs`, `artifacts/six-album-390.png`, `artifacts/six-album-1440.png`. Preview updated on port 5173.

## Refresh supplied bride / center photo — 7 November 2026

- [x] Regenerate the optimized `co-dau.jpg` from the latest supplied original (1333 × 2000px, 294235 bytes); preserve EXIF orientation and original file. Version both configured references with the image content hash so Vite refresh loads the new photo without stale browser cache.
- [x] Typecheck, lint, all 25 tests and production build pass. Preview on port 5173 returns the new versioned image and configuration; served bytes match the regenerated source and production copy.

## Beige-white opening background — 7 November 2026

- [x] Match the opening doors to the invitation paper (#f7f3ed), soften the linen texture with a configured cream overlay and reduce door shadows. Use an olive button with off-white text and a dark keyboard focus outline.
- [x] Typecheck, lint, all 25 tests and production build pass. Chrome verifies cream background/overlay, olive button and off-white text; visually review `artifacts/beige-opening-390.png`. Normal and reduced-motion click opening pass. CDP keyboard activation did not trigger the button in this run; keyboard handlers are unchanged.

## Center couple photo replacement — 7 November 2026

- [x] Set `magazine.coupleImage` to the optimized local `co-dau-chu-re/web/co-dau.jpg`, derived from the supplied `co-dau.jpg`; update PHOTO_GUIDE.md. Preserve the shared portrait layout.
- [x] Typecheck, lint, all 25 tests and production build pass. HTTP checks verify the running preview config points to `co-dau.jpg` and the served JPEG matches the source and production copy.

## Shared couple portrait composition — 7 November 2026

- [x] Replace the active two-portrait layout with one centered, uncropped couple photo (`THA_1917.jpg`), bride label/name above right and groom label/name below left on the cream background.
- [x] Keep the image path and a gentle shared fade-up in wedding config. Use existing names/roles, olive typography, fluid spacing, natural name wrapping, meaningful image alt text and reduced-motion support. Update PHOTO_GUIDE.md.
- [x] Typecheck, lint, all 25 tests and production build pass. Chrome checks at 320/390/768/1440px verify one loaded, centered, uncropped image; bride above/right and groom below/left; no section overflow; static reduced-motion rendering and visible normal fade-up. Check script: `artifacts/check-shared-couple.mjs`; screenshots: `artifacts/shared-couple-390.png` and `artifacts/shared-couple-1440.png`. Preview on port 5173 reflects the new composition.

## Olive opening cover — 7 November 2026

- [x] Match door background to the invitation olive accent (#77764f) and use cream (#f7f3ed) / warm ink (#524a3f) for the opening button. Keep editable colors in wedding config, the local linen texture and existing opening interaction.
- [x] Typecheck, lint, all 25 tests and production build pass. HTTP checks confirm preview serves updated colors, CSS and component. Only color values/bindings changed; opening handlers and motion settings remain unchanged. Browser rendering check was unavailable (headless Chrome debug endpoint did not start).

## Refreshed bride portrait — 6 November 2026

- [x] Regenerate `co-dau-chu-re/web/co-dau.jpg` from the replacement `co-dau-chu-re/co-dau.jpg`, preserving the original and using the existing EXIF orientation, 2000px maximum edge and JPEG quality 88 settings.
- [x] Typecheck, lint, all 25 tests and build pass. Updated portrait is 1333 × 2000px / 358161 bytes; preview on port 5173 serves the exact new bytes and production copy matches.

## Updated bride and groom portraits — 6 November 2026

- [x] Replace both story portrait paths with the newly supplied `chu-re.jpg` and `co-dau.jpg`, preserving groom/bride ordering and the existing portrait presentation.
- [x] Preserve originals and create EXIF-oriented 2000px JPEG copies at quality 88 in `co-dau-chu-re/web/`; configure local paths through `asset()` and update PHOTO_GUIDE.md.
- [x] Typecheck, lint, all 25 tests and production build pass. Both optimized portraits decode at 1333 × 2000px (487 KB total); preview HTTP checks on port 5173 return matching JPEG bytes and production copies match.

## New album and background music — 6 November 2026

- [x] Replace the background track with the supplied local `audio/background_music.mp3` through `asset()`.
- [x] Replace all nine configured album entries with the supplied `THA_*.jpg` photos in filename order, including fullscreen viewing; update alt text for personal photos.
- [x] Preserve original files and create EXIF-oriented JPEG web copies with a 2000px maximum edge and quality 88 in `album/web/` (2.35 MB total); update PHOTO_GUIDE.md.
- [x] Typecheck, lint, all 25 tests and production build pass. All nine web photos decode successfully; HTTP checks on port 5173 serve the exact configured photo/music bytes and production copies match the source assets.

## Stable footer during first fast scroll — 6 November 2026

- [x] Clip overflow on `.magazine-footer` so its text entrance cannot extend the invitation scroll area. Keep the original image sizing and fadeInUp animation.
- [x] Reproduce fast smooth scrolling followed by another scroll to the bottom during the first entrance. Production Chrome checks at 390/1440px confirm a constant scroll limit and 0px footer image movement after reaching the bottom, with text animation still active. Before the fix the mobile scroll limit temporarily grew by 110px.
- [x] Typecheck, lint, all 25 tests and build pass. Update preview on port 4173. Diagnostics/checks: `artifacts/check-footer-fixed.mjs`, `artifacts/check-footer-fixed-desktop.mjs` and recorded JSON traces.

## C141 couple portrait flip entrance — 6 November 2026

- [x] Inspect saved portrait nodes `qxSrNuncE-` and `g13GYY9f0U`: both use `flip-in`, 1.5s duration, 0.5s delay, ease, no repeat. Verify the initial transform `perspective(400px) rotateY(90deg)` and final `none` in the supplied `1017-9d0a7ebd29f36b0a.js` resource.
- [x] Replace the two sideways portrait entrances with matching fade/3D flip keyframes. Keep settings in wedding config and preserve existing viewport trigger, once-only playback and reduced-motion/focus behavior.
- [x] Typecheck, lint, all 25 tests and build pass. Chrome verifies both portraits wait offscreen, match reference endpoints/timing, rotate and fade at midpoint, finish flat, do not replay on return and remain static/visible under reduced motion. Review the midpoint screenshot; check script: `artifacts/check-portrait-flip.mjs`. Preview restarted on port 4173.

## Full hero photo framing — 6 November 2026

- [x] Let the first photo set the hero height from its natural 2:3 ratio instead of filling a capped-height crop. Update intrinsic image dimensions to 5504 × 8256 and keep the names/date overlaid at the bottom.
- [x] Typecheck, lint, all 25 tests and production build pass. Chrome checks at 320/390/768/1440px verify the rendered ratio matches the source, no photo cropping/horizontal overflow, and the copy stays inside the hero. Review mobile/desktop screenshots (`artifacts/check-hero-framing.mjs`). Preview restarted on port 4173.

## Updated center hero photo — 6 November 2026

- [x] Point both configured center/hero image paths to the user's replacement `o-giua.jpg` (the previous `.webp` file is no longer present).
- [x] Run typecheck, lint, all 25 tests and production build; restart preview on port 4173 and verify the new image is served as JPEG.

## C141 event and calendar reference alignment — 6 November 2026

- [x] Download the exact calendar frame and swan divider referenced by `wedding-local-temp.html` into `public/images/magazine/`; configure both through `asset()` and record their sources in ASSET_CREDITS.md.
- [x] Restore Lora bold event/venue headings, uppercase time introduction, ruled month/year labels around the large Alisheia date, proportional columns and italic lunar dates when configured. Preserve current event data, the enhanced directions buttons and the selected original heart image.
- [x] Put the calendar on the original decorative olive frame with a white month title and 86% grid width. Hide weekday headings visually while retaining accessible column headers and month/year caption. Keep Add to calendar below the frame and allow frame height to accommodate actual month rows.
- [x] Typecheck, lint, all 25 tests and production build pass. Chrome checks pass at 320/390/768/1440px on both invitation sides for fonts, bold headings, borders, loaded local artwork, grid width, selected-date label, map links, reduced motion and no horizontal overflow. Visually review event/calendar screenshots. Browser check: `artifacts/check-reference-update.mjs`.
- [x] Restart preview at `http://127.0.0.1:4173/`.

## Album viewport playback — 6 November 2026

- [x] Observe the actual coverflow stage with no offscreen margin. Run while visible and invitation-ready; suspend when offscreen, tab hidden or fullscreen viewer open.
- [x] Remove hover/focus pauses and interaction cooldown. Keep explicit Pause persistent through scrolling, focus and viewer close; Play resumes without focus blocking. Maintain the 4200ms interval and follow keyboard focus when the active photo advances.
- [x] Respect reduced motion: no automatic start, explicit Play available with card transitions disabled. Keep automatic counter updates silent to screen readers.
- [x] Typecheck, lint, all 25 tests and production build pass. Real Chrome integration verifies viewport entry/exit, actual photo advancement with hover/focus, persistent Pause, Play while focused, manual navigation, viewer open/close and reduced-motion behavior (`artifacts/check-album-visibility.mjs`). Preview restarted at `http://127.0.0.1:4173/`.

## Original calendar heart artwork — 6 November 2026

- [x] Replace the new Lucide calendar heart with the existing `public/crimson/heart-calendar.png` background from wedding config. Keep the white date number and accessible label.
- [x] Resolve the asset-helper path against the document base before using it in a CSS variable, so the production stylesheet does not resolve the image under `/assets/`.
- [x] Typecheck, lint, all 25 tests and build pass. Verify both sides at 320/390/768/1440px and visually review the original artwork; restart preview on port 4173.

## Directions button and calendar highlight — 6 November 2026

- [x] Restyle both Magazine directions links with olive gradient, rounded shape, inset pin, arrow, subtle shadow and hover feedback. Preserve configured map destinations and keyboard focus; disable movement for reduced motion.
- [x] Render a local Lucide heart behind the selected calendar date, with burgundy fill and white number. Preserve accessible date labels and the legacy Crimson artwork option.
- [x] Typecheck, lint, all 25 tests and production build pass. Restart preview at `http://127.0.0.1:4173/`.
- [x] Verify 320/390/768/1440px widths on both invitation sides: no horizontal overflow, visible heart, valid map destinations, 52px button height and reduced-motion transitions disabled. Visually review button/calendar screenshots in `artifacts/ui-polish-*.png`.

## Responsive widths and album playback recovery — 5 November 2026

- [x] Apply Mai Lan width limits: outer invitation 480px below 768px, 900px from 768px; album up to 432 × 340px / 600 × 520px. Calendar inner width 296px / 352px.
- [x] Cap proportional typography/spacing at the original 500px design size. Center text/event/RSVP blocks within 560px, portraits within 680px, countdown within 500px and retain wider hero/footer imagery.
- [x] Slow card advance from 1400ms to 4200ms, preserving the 1100ms transition. On closing the viewer clear transient cooldown/hover/focus blockers; resume after a fresh full interval unless explicitly paused. Preserve reduced-motion, visibility, viewport and keyboard safeguards.
- [x] Run 21 isolated component-handler checks including restored-focus/hover resumption and persistent Pause through viewer close. Typecheck, lint, all 25 tests and build pass; preview available.
- [ ] Direct responsive rendering/real-device touch/focus checks remain unavailable because Computer Use browser/native hosts are disconnected.

## Mai Lan 3D card album — 5 November 2026

- [x] Replace the inline collage with a source-style 3D card carousel, preserving local photo order and fullscreen lightbox. Match perspective 1000px, relative offsets 60%/150px/45deg, scale/opacity layering, 1100ms easing and natural image ratios clamped to 0.5–1.2.
- [x] Match 1400ms automatic advance and 6000ms interaction cooldown. Suspend near-offscreen/background/inert states, hover, keyboard focus, open viewer and reduced motion; add an explicit pause/resume control.
- [x] Support horizontal swipe, side-card selection, center-card lightbox opening, arrows, Home/End and active-card keyboard focus. Prevent post-swipe clicks and ignore cancelled/vertical gestures. Keep nine photos, music, cover and seal unchanged.
- [x] Add four geometry boundary tests and run 19 isolated component-handler checks. Required checks: typecheck, lint, 25 tests and build; see QA.md.
- [ ] Direct visual/mobile touch/focus verification remains unavailable because Computer Use browser/native hosts are disconnected. Preview remains running for user evaluation.

## Mai Lan lightbox trial implementation — 5 November 2026

- [x] User authorized trial implementation before remaining browser/device audit. Replace only the album lightbox with a full-viewport Mai Lan-style viewer: black backdrop, corner close/counter, contained rounded photo, arrows and scrollable active thumbnails.
- [x] Keep current local photos and album layout, opening/seal, soundtrack and existing modal focus/inert/scroll-lock mechanism. All viewer copy is configured in `wedding.photoViewer`.
- [x] Add looped arrows/keyboard navigation, thumbnail centering, >50px horizontal swipes, double tap/click 2.5x zoom, 1–4x pinch, bounded touch pan and reset on image/viewport changes.
- [x] Guard diagonal/cancelled gestures and pinch-to-one-finger transitions; suppress post-gesture backdrop clicks; respect reduced motion and provide image-load feedback.
- [x] Run 15 isolated handler integration checks against the new TypeScript component and mathematical boundary tests. Typecheck/lint/tests/build verification recorded in QA.
- [ ] Direct browser screenshots, real touch gestures and focus/overlay checks: Computer Use browser/native hosts remain unavailable. Preview is available for the user's evaluation; no visual/device verification is claimed.

## Mai Lan lightbox interaction audit — 5 November 2026

- [x] Inspect saved HTML/resources and retrieve missing public lightbox source. Identify module 34262 and compare its markup to the saved viewer.
- [x] Run 27 isolated source-handler checks for navigation, wraparound, thumbnails, swipe thresholds, double tap, pinch, pan, zoom reset and empty albums. Record scope and limitations in `SLIDESHOW_AUDIT.md`.
- [ ] Complete real browser/device checks for touch gestures, native dialog close/Escape, keyboard focus, rendering and reduced motion. Browser/native Computer Use hosts are currently unavailable; handler checks do not substitute for these checks.
- [ ] Integrate the viewer only after the requested pre-implementation interaction review is complete. No application changes made during this audit.

## C141 magazine invitation — 5 November 2026

- [x] Replace the active invitation body with the C141 composition: full photo hero, story, staggered portraits, guest invitation, unboxed reception/ceremony, cream calendar, album, RSVP, gifts, countdown and photo closing.
- [x] Preserve current configured names, family/event data, local wedding photos, album and I Do soundtrack. Add magazine copy and local hero asset mapping in `src/config/wedding.ts`.
- [x] Preserve the existing split-door opening, seal, texture, timing, audio lifecycle and card auto-scroll. Preserve side/guest URL behavior, calendar exports, keyboard album navigation and truthful RSVP/gift availability.
- [x] Use existing local fonts where the C141-specific font binaries are absent. No new remote assets, tracking, backend or dependencies.
- [x] Typecheck, lint, 16 tests and production build pass. Browser QA at 320/390/768/1440px verifies local assets, no horizontal overflow, keyboard opening, guest/side changes, gallery arrows/Escape/focus restoration and reduced motion. Review mobile screenshots of hero, portraits, event details and ending; normal animation and delayed auto-scroll checked separately. See `QA.md`.

## C141 resource feasibility audit — 5 November 2026

- [x] Inspect `wedding-local-temp.html`, `website-resources.json` and `wedding-resources.json` without executing source scripts.
- [x] Decode the embedded Flight/Base64/LZUTF8 design data and verify 59 elements plus the root container, original geometry and transition settings.
- [x] Inventory both resource archives and identify missing photos, opening artwork, binary fonts and audio. Record findings and reconstruction steps in `RESOURCE_AUDIT.md`.
- [x] Documentation only; current invitation and wedding content remain unchanged. No functional checks required.

## Album replacement path fix — 21 October 2026

- [x] Fix the third album entry to reference the user's `anh-03.jpg`; the previous configured `anh-03.webp` no longer exists.
- [x] Isolate date/venue utility test fixtures from user-editable wedding information after current content edits exposed two sample-data assumptions.
- [x] Verified all 16 configured wedding image paths exist and replacement JPEG has the correct file signature. Typecheck, lint, all 16 tests and production build pass.

## Independent countdown and calendar dates — 21 October 2026

- [x] Add side-specific `countdown` and `calendar` date/time resources in `wedding-content.json`, initially preserving the existing reception dates.
- [x] Connect the countdown target and calendar highlighted day/month to their respective resources. Google Calendar export uses the configured calendar date, retaining the selected reception's venue and three-hour duration.
- [x] Document keys and distinguish these dates from the hero/reception dates. Preserve the user's current names, family details and ceremony edits.
- [x] Typecheck, lint, all 16 tests and production build pass. Render integration check uses independent dates for both sides and verifies future/past countdowns, leap-day/year-boundary calendar selection in Vietnam time and matching Google Calendar exports without modifying source data.

## Editable wedding content resource — 21 October 2026

- [x] Extract wedding information/copy to `src/config/wedding-content.json` and load it through `src/config/wedding.ts`, preserving existing component imports, local asset paths and presentation settings.
- [x] Connect important hardcoded labels (countdown units, map/calendar links, default guest, skip link and optional section headings) to the resource. Gift QR paths are resolved through `asset()`.
- [x] Document JSON editing, dev updates/build requirements, hidden sections and the separate static HTML metadata.
- [x] Typecheck, lint, all 16 tests and production build pass. Integration check overrides JSON in memory and confirms updated names, venues, RSVP, thanks and guest fallback reach both rendered invitations; verifies calendar description and local gift QR paths. Source sample data remains unchanged.

## Wedding copy document — 21 October 2026

- [x] Add `NOI_DUNG_THIEP.md` with current couple/family details, ceremony/reception dates and venues, invitation copy, story, album, RSVP, gifts and closing thanks.
- [x] Identify hidden/unused content and explain that website content remains sourced from `src/config/wedding.ts`; document edits do not automatically update the preview.
- [x] Cross-check the document against configuration and rendered component usage. Documentation only; no runtime changes.

## I Do soundtrack and independent music control — 21 October 2026

- [x] Point wedding.music at the user-provided local audio/i-do.mp3 via asset(). Keep post-door playback, looping, volume and truthful media state.
- [x] Exempt pointer, touch, focus and Enter/Space on the music button from auto-scroll interruption, including pending startup. Let Tab's destination focus decide interruption; keep manual wheel/scroll keys and other controls interruptible.
- [x] Development and production verify MP3 decoding/playback, pointer toggles during pending startup, pointer/touch/Enter/Space toggles during scrolling, Tab between playback controls, and continued scroll movement throughout. Manual wheel/scroll keys and other controls still interrupt. Full browser suite, typecheck, lint, all 16 tests and build pass; README, credits and QA updated.

## Apply original independent animation mechanism — 21 October 2026

- [x] Replace door-start/finish animation gates with a shared layout-ready gate: wait at least 1s and for fonts, bounded by 2.5s, independently of opening. All stationary entrance wrappers observe first viewport entry once ready.
- [x] Remove the separate hero/countdown click scope. Preserve source keyframes/timings, static triptych, reduced motion and keyboard access. Door completion still controls audio, scroll unlocking and the 2s automatic-scroll delay.
- [x] Development and production verify early opening waits for the independent 1s layout gate, delayed opening finds all eight in-view top effects complete behind the cover, and cover removal never replays them. Full browser suite passes off-screen manual/auto-scroll entrances, 50 source placements, eight keyframes, stationary opening at 320/390/768/1440px, source geometry, keyboard, reduced motion and music. Auto-scroll starts 2031ms after completed doors at 60px/s. Typecheck, lint, all 16 tests and build pass; reference/QA/README updated.

## Audit original top/door timing — 21 October 2026

- [x] Trace the original Frame loading gate, IntersectionObserver and door click/completion paths. Confirm that top animation has no shared door-start/finish trigger.
- [x] Verify against the original public demo with a delayed click: all four hero text animations finish while the cover remains closed; opening the door does not restart them. Record the native-browser trace and correct ANIMATION_REFERENCE.md.
- [x] Review only: application behavior remains the explicitly synchronized implementation from the previous change; no functional edits/checks are needed for this audit.

## Synchronize opening entrances with doors — 21 October 2026

- [x] Start the hero/countdown entrance scope from the open-button gesture, alongside the doors. Keep the triptych static and preserve source durations/delays.
- [x] Keep later content gated until completed opening; music and the 2s automatic-scroll delay still use door completion. Stable callbacks and a persistent opening scope prevent entrance replay when the cover disappears.
- [x] Development and production checks verify all eight top effects animate while doors move, hero text completes at 1.5s before the 2.5s doors, and animation startTime values remain unchanged on cover removal. Full suite passes for lower scroll entrances, stable geometry at 320/390/768/1440px, 50 source placements, reduced motion, music and the 2s post-door scroll delay (2047ms measured). Reviewed mid-opening screenshot; typecheck, lint, 16 tests and build pass.

## Restore opening reference entrances — 21 October 2026

- [x] Apply the latest request, superseding the earlier static-opening exception: restore four hero text entrances and independent countdown photo, tint, quote and timer effects with source timings. Keep the triptych static.
- [x] Keep observation gated until completed doors and reuse card-local, once-on-entry triggers. Preserve layout with stationary wrappers and existing proportional geometry.
- [x] Full browser suite verifies waiting/intermediate/completed states for all eight restored entrances after doors, 50 source timing/effect placements, 8 keyframes and unchanged geometry at mobile/desktop sizes. Auto-scroll (2044ms measured), reduced motion, keyboard, ending and music pass. Production opening/music checks also pass; typecheck, lint, 16 tests and build pass.
- [x] Recover original music PNG from the full `assets/mp3/icons/music-4.png` path and serve it locally through wedding config; correct the earlier incomplete-path/404 attribution and verify native playback plus icon decoding.

## Reference ending and music — 21 October 2026

- [x] Inspect saved ending coordinates, footer black gradient, text, RSVP/gift layout and original top-right 30px music control with a 5s disc rotation.
- [x] Rebuild the ending with proportional spacing, gift pill and final photo/thanks; hide optional guestbook/details/tools via wedding config. Keep unavailable RSVP/gifts honest and preserve configured content/assets.
- [x] Prepare muted audio from the open gesture, then restart/unmute only after completed doors; retain accessible manual toggle, real playback state, blocked/error feedback and reduced-motion icon behavior.
- [x] Full browser suite and production ending/music checks pass: seven ending placements plus album gap within 1px at 515/390/320px, actual audible playback only after completed doors, keyboard pause/resume, blocked-autoplay recovery, 30px top-right disc/44px target, reduced motion, unchanged auto-scroll and reference effects. Reviewed footer/music screenshots. Typecheck, lint, all 16 tests and build pass. The original music PNG is now recovered locally; see the later correction above and ASSET_CREDITS.md.

## Auto-scroll on reopening — 21 October 2026

- [x] Reproduce the failure with the previous `wedding:auto-scroll-started:v1` session flag: doors open but scrolling never starts on subsequent loads in the same tab.
- [x] Remove session-based suppression. Configure `autoStartAfterOpen` so every new page opening waits 2000ms after completed doors, retaining manual cancellation and reduced motion.
- [x] Full Chrome suite passes with stale storage: delayed start measured at 2048ms and 61px/s, same-tab reopen, manual pending/playback cancellation, idle controls, keyboard/reduced motion, reference effects/geometry and no runtime errors. Production delayed start and completion fallback pass. Typecheck, lint, all 16 tests and build pass.

## Album hover — 21 October 2026

- [x] Remove the visible photo count, expand icon and hover overlay styling from album thumbnails. Retain image click/keyboard opening and accessible labels.
- [x] Remove the legacy photo hover scale and its transform transition to match the demo. Keep scroll-triggered entrances, keyboard focus indicators and click-to-open album behavior.
- [x] Verify in Chrome that real hover keeps the exact photo dimensions and no image transform, keyboard focus remains visible without zoom, Enter opens the album and Escape restores focus. Typecheck, lint, all 16 tests and production build pass.

## Card-contained scrolling — 21 October 2026

- [x] Move scrolling from the document into a centered 500px card with a viewport-height scroller, a stable thin scrollbar at its right edge and floating controls positioned within the card.
- [x] Point entrance observers, auto-scroll coordinates, restored-position reset and modal scroll locks at the same card surface. Portal album/gift dialogs outside the scrolling content to preserve full-screen overlays and keyboard focus.
- [x] Start the first-session automatic scroll 2000ms after the doors complete; manual input during the delay cancels the pending start. Record first-open state only when scrolling actually starts. Keep reduced motion, user interruption, idle control hiding and bottom completion.
- [x] Complete browser regression and production checks: fixed opening geometry at 320/390/768/1440px, card-local scrollbar/controls, portal album lock/focus, outside-card wheel isolation, delayed auto-start (2049ms measured, 61px/s), pending-start cancellation, keyboard/reduced motion and transition-event fallback. Reference comparisons pass for 8 keyframes, 42 placements and 31 geometry targets at 515/390/320px. Reviewed desktop scrollbar and mobile opening screenshots; typecheck, lint, all 16 tests and production build pass.

## Opening viewport stability — 20 October 2026

- [x] Reproduce the jump: unlocking body overflow after opening reduces a 390px content viewport to 375px and moves/resizes the proportional hero photos.
- [x] Reserve a stable root scrollbar gutter during scroll lock/unlock. Apply modal scroll lock/focus before paint and prevent document scrolling during initial/restored/main-content focus.
- [x] Frame samples show 0px content movement/resize through opening at 320/390/768/1440px and reduced-motion 390px. Guard against restoring focus inside the departing cover (Strict Mode) so auto-start is not interrupted. Gallery lock/unlock, focus, 2s auto-start, all browser regressions, typecheck, lint, 16 tests and build pass.

## Static opening/countdown and auto-scroll start — 20 October 2026

- [x] Keep countdown photo, quote, backdrop and timer visible under the doors without entrance effects, extending the confirmed static opening area.
- [x] Match measured 500px opening geometry: middle photo 163×279 against side photos 151×233, proportional title/date spacing and countdown photo/overlay offsets.
- [x] Verify source auto-scroll call passes initialDelay 2000ms and speed 0.06px/ms; use 2000ms after door completion and resync accumulated position on browser/anchor adjustments. Retain first-tab-session behavior and accessibility interruptions.
- [x] Browser checks pass for static opening/countdown before and after doors, live timer updates, 31 measured positions/sizes at 515/390/320px, 2s auto-start without an initial jump, 60px/s movement, browser-position resync and existing pause/resume/accessibility behavior. Reviewed opening screenshots; typecheck, lint, all 16 tests and build pass.

## Static hero and reference story/album layout — 20 October 2026

- [x] User confirms the hero should be visible under the doors and have no entrance after opening. Keep later scroll-triggered effects.
- [x] Reconstruct story photo/copy offsets, portrait captions and staggered bride row from saved 500px coordinates; keep content configurable and text in normal flow.
- [x] Rebuild album as its measured mosaic: white Album title over the opening landscape, centered script in the following gutter, unequal portrait tiles and paired final rows. Continue additional configured photos in paired rows; retain keyboard lightbox.
- [x] Browser geometry checks match 20 story/album placements within 1px of the saved 500px coordinates at 515/390/320px viewports. Reviewed story/mosaic screenshots; fixed narrow desktop-scrollbar overflow. Static hero, 46 remaining entrance mappings, keyframes, auto-scroll, keyboard lightbox and reduced motion pass. Typecheck, lint, all 16 tests and build pass.

## Original animation parity — 20 October 2026

- [x] Retrieve public original CSS/runtime using the saved page's matching resource hashes. Verify percentage-based fades (100% of each node), zoom opacity reaching 1 at 50%, continuous pulse opacity 0.8 at midpoint, `ease`, threshold 0.1 and bottom root margin -50px.
- [x] Replace the earlier 40px Motion approximations with scoped native CSS keyframes matching the reference's interpolation; preserve post-opening observation, keyboard visibility and reduced motion.
- [x] Split family labels/parents and story paragraphs/roles/names into original independent entrances; correct groom-copy direction; add separate background fades for countdown, calendar and footer and restore one-time map-button pulse plus continuous pulse.
- [x] Browser comparison passes for all 8 effects at 6 timestamps each (opacity and transform matrices) and 50 placements against saved DOM effect/duration/delay values. Auto/manual scroll, keyboard, reduced motion, Sunday calendar, idle controls and responsive checks pass. Reviewed story/calendar layouts; typecheck, lint, all 16 tests and build pass.

Original resources are inspected only in ignored `artifacts/reference-animation/`; no vendor runtime or tracking is imported. This verified work supersedes the earlier reconstructed keyframe/trigger notes below.

## Opening-button text — 20 October 2026

- [x] Increase the “Mở thiệp” label to 700 weight and enable scoped weight synthesis for its local regular font, preserving the existing font and opening behavior.

## Scroll control visibility and Sunday color — 20 October 2026

- [x] Hide the scroll control during manual/automatic scrolling; show after 800ms without scroll events. Keep keyboard focus visible and allow Tab/Escape/manual input to stop auto-scroll. Configure idle delay in wedding.ts.
- [x] Apply the template calendar theme yellow `#ffc300` to the Sunday heading and all Sunday dates, including a selected wedding date; preserve the calendar-heart marker and other weekday colors.
- [x] Typecheck, lint, all 16 tests and build pass. Browser checks confirm control hiding for manual/automatic scrolling, reappearance on idle, visible keyboard focus, golden Sunday headings/dates on both sides, preserved weekday colors/heart and no overflow at 320/390/768/1440px. Reviewed calendar screenshot.

## Scroll-triggered entrance correction — 20 October 2026

- [x] Re-check the saved template's per-node entrance durations/delays/one-time flags; companion JS remains absent. Reproduce premature consumption by scrolling a date heading into view behind the closed cover, returning to the top and opening: the previous implementation animated off-screen text.
- [x] Observe stationary layout wrappers only after opening. Trigger each element once when at least 15% is inside the viewport with a 64px bottom inset; retain configured delays/directions, immediate focus visibility and reduced-motion behavior. Threshold/inset are configurable in wedding.ts.
- [x] Regression failed before the fix and passes after it. Browser sampling confirms family/event text stays hidden until entry, shows intermediate opacity during real auto-scroll, completes, and leaves later text waiting through pause/resume. Manual entry, keyboard, reduced motion, local images and responsive checks pass. Typecheck, lint, all 16 tests and build pass; reviewed story/album layouts.

## Typography and automatic scrolling — 20 October 2026

- [x] Compare saved template text styles: bold invitation/family/event/venue headings, 33px story names, 74px album heading/shadow and 70px album script. Enable weight synthesis for local regular font files and restore responsive template sizing.
- [x] Add accessible top-left play/pause control; auto-start once per tab session after first opening and hero reveal. Configure speed, delay and text in `src/config/wedding.ts` (60px/s approximates the template's saved `speed: 0.06`; the source runtime is absent).
- [x] Use time-based animation frames with fractional positions; stop at the bottom, on user wheel/touch/pointer/scroll keys/control focus, dialogs or hidden tab. Reduced motion skips auto-start and provides an instant manual jump.
- [x] Typecheck, lint (zero warnings), all 16 unit tests and production build pass. Browser checks pass for delayed first-open start at ~60px/s, same-tab reload, Play/Pause with keyboard, wheel/touch/pointer/focus/scroll-key/visibility interruptions, bottom completion, reduced-motion instant jump, bold emphasis and 320/390/768/1440px overflow. Reviewed family/event screenshots.

## Reference animations — 20 October 2026

- [x] Inspect `preview_Elegance .html`: directional fade entrances, zoom, static hero photos, repeating map-button pulse and existing 2.5s door opening. Most entrances use 1.5s duration, 0.5s delay and one iteration; hero text uses zero delay.
- [x] Apply effects by placement: hero text, families, date-card details, story photos/copy, individual album images, calendar, RSVP and footer. Keep timings and album effect order in `src/config/wedding.ts`.
- [x] Gate entrance playback until the cover opens, reveal focused controls immediately, clip horizontal overflow and disable transforms/pulse under reduced motion.
- [x] Typecheck, lint, all 13 tests and build pass. Headless Chrome checks pass for cover/hero sequencing, all six entrances, pulse, per-image album effects, keyboard/focus behavior, 320/390/768/1440px overflow, reduced motion and every local image decoding. Reviewed hero/story/album screenshots. Reusable check: `scripts/check-animations.mjs`.

The HTML references a companion `_files` folder that is no longer present. Timing/direction are explicit in its saved DOM; fade distances (40px), zoom scale (0.3) and pulse amplitude (1.05) are reconstructed locally rather than verified source keyframes. No external runtime, tracking, sample messages, auto-scroll or backend are imported.

## Resource cleanup — 20 October 2026

- [x] Remove unused Botanical/HeroSection/EventDetails/CeremonyDetails components, unused theme config, four old sample photos and unused dragon/phoenix/double-happiness SVGs.
- [x] Remove obsolete decoration branches and photo config; retain the swallow used by the schedule, all seven active fonts, opening assets and configured wedding photos.
- [x] Remove the saved HTML reference and companion directory, temporary QA artifacts, stale build output/cache and empty old photo directory. Keep source attribution and historical project documents.
- [x] Refresh README and photo instructions for the active Crimson layout.
- [x] Typecheck, lint, all 13 tests and production build pass. Verified relative module imports, configured static assets, every source-manifest file and all font URLs. Build output was regenerated cleanly.

Earlier entries below record past implementation and QA. Their reference HTML and temporary `artifacts/` captures were removed during cleanup; they are not current project dependencies.

## Photo folders — 20 October 2026

- [x] Organize the 16 active sample photos under `public/images/anh-cuoi/` by placement: `dau-thiep`, `dem-nguoc`, `co-dau-chu-re`, `album`, `cuoi-thiep`.
- [x] Use descriptive filenames and explicit configured ordering in `src/config/wedding.ts`; preserve existing image order and the `asset()` helper.
- [x] Update source manifest paths and add Vietnamese replacement/configuration instructions in `PHOTO_GUIDE.md`.
- [x] Typecheck, lint, all 13 tests and production build pass; verified all 16 relocated photos against the updated source manifest.

## Saved Crimson Elegance resources — 20 October 2026

This direction supersedes the Long Phụng content styling below. The supplied saved HTML and `_files` directory provide the design reference; keep current configured couple/event data rather than importing the sample identities.

- [x] Inspect the saved rendered DOM: 67 nodes on a 500px feed, white background, burgundy `#7d1f2a`, triptych, photo countdown, 20px radius event cards, calendar, story and album.
- [x] Reuse/adapt the supplied font CSS declarations and visual CSS values in scoped responsive `src/crimson.css`; avoid source runtime and global editor/UI CSS.
- [x] Import all 16 referenced photo backgrounds and 7 font files, plus the saved heart-calendar artwork, into `public/crimson/`. Local source inventory: `public/crimson/asset-sources.json`.
- [x] Compose the reference-style content in React, with wedding text and asset paths in `src/config/wedding.ts` and `asset()` paths. Preserve side selection, countdown/calendar, gallery lightbox, personalized guest links, optional gifts, manual music and the verified two-door opening.
- [x] RSVP and guestbook remain explicitly unavailable. Keep dress code/schedule in an expandable section. No backend, tracking, autoplay or source demo messages imported.
- [x] Typecheck, lint, 13 tests and production build pass. Chrome headless passed at 320/390/430/768/1440px; reviewed hero/event/story/album/RSVP screenshots. Checked normal animated opening, reduced motion, focus, local assets/fonts, side/calendar updates, keyboard lightbox, guest link generator and no fake RSVP.
- [x] Production `/wedding/` build passed with local image/font/CSS requests and generated invitation links preserving the subpath. No external requests or failed resources during QA. Fixed the compact floating music button so it does not cover the footer link generator and its icon contrasts with the background.

Reference photos remain illustrative; source/license records are in ASSET_CREDITS.md. Supplied site files are reference material, not application runtime dependencies.

## Seal and split-door opening — 20 October 2026

- [x] Inspect public configuration and the linked door-effect module of the Crimson Elegance preview supplied by the user.
- [x] Download the original `seal-10.png` and `dark-linen.png` into `public/images/opening/`, configure local paths through `asset()` and record sources in ASSET_CREDITS.md.
- [x] Match the minimal cover: two red textured panels, centered 110px image seal and pill button 40px above the safe-area bottom. Both panels slide immediately for 2.5s with ease-in-out; seal follows the right panel and scales to 95%; button fades over 0.4s. No decorative frame or visible names/date on this cover.
- [x] Preserve personalized invitation details in the accessible dialog description and main content; retain focus trapping, background inertness, main-content focus and instant reduced-motion opening. Add completion fallback if transitionend is suppressed.
- [x] Run typecheck, lint, all 13 unit tests and production build.
- [x] Chrome headless checks at 320×568, 390×844, 667×375 and 1440×1000: centered 110px original seal, local images, 2.5s CSS transition, seal moving with right panel without fading, button fading, keyboard, focus restoration, no overflow/page errors/external requests. Reduced-motion Space and suppressed-transition completion passed.
- [ ] Direct side-by-side reference animation capture remains unavailable. Original artwork and motion parameters are now verified from the supplied HTML and linked module. VIP Brisca is not supplied; use existing local Cormorant Garamond for the button.

QA scripts and screenshots are in ignored `artifacts/`. No backend, tracking or dependencies added.

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

## Deployment source package — 9 November 2026

- [x] Fetch `origin` and verify local `main` matches `origin/main` before preparing the deployment commit.
- [x] Select application source, tests, build configuration, GitHub Pages workflow, configured local images/fonts/audio and the responsive-image generation script. Exclude saved template HTML/directories, temporary resource manifests, local audit scripts, generated output, unused I Do audio and unused Marmelad font using `.gitignore`.
- [x] Validate the selected Git index in `artifacts/deploy-staging/`: typecheck, lint, all 58 tests and production build pass. All 43 public images and 7 local stylesheet fonts are present; both configured audio files are present; excluded assets are absent from the build. No credential patterns found in selected text files. Public assets total 164.59 MB; largest file 21.69 MB.
- Delivery target: commit this reviewed source package and push to `origin/main`; confirm the remote commit matches local HEAD. Git history records the resulting commit.
