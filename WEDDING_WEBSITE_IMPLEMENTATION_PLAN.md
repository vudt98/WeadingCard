# Wedding Invitation Website — Implementation Plan

> **Goal:** Build an elegant, animated, personalized wedding invitation website with Codex, deploy it as a static site to GitHub Pages, and optionally connect external services for RSVP and guestbook submissions.
>
> **Reference:** https://chinhloan.chinchin.top/  
> **Important:** The reference site's exact visual design and behavior have not been verified. Codex should inspect it with an available browser before attempting a close visual match. Do not copy third-party copyrighted photos or assets.

## 1. Project scope and delivery strategy

**Phase 1 (MVP):** Mobile-first wedding invitation, animated envelope, hero, countdown, event details, directions, photo gallery, guest personalization, bride/groom-side configuration, manual music controls, responsive design, static GitHub Pages deployment.

**Phase 2 (optional):** Real RSVP, guestbook, invitation management, and admin workflow via a third-party backend. GitHub Pages cannot host a server or store submissions itself.

**Success criteria:** A working HTTPS URL at `https://<username>.github.io/<repo>/`, passing production build, working on mobile and desktop, handling Vietnamese guest names and both wedding sides, with no broken assets or misleading fake submissions.

## 2. Technical architecture

| Layer | Choice | Reason |
|---|---|---|
| UI | React + TypeScript + Vite | Lightweight static deployment |
| Styling | Tailwind CSS | Responsive, consistent design tokens |
| Motion | Motion for React | Envelope, reveal, subtle parallax |
| Icons | Lucide React | Consistent iconography |
| Content | Typed config files | Change wedding details without editing UI |
| Hosting | GitHub Pages | Free static hosting and HTTPS |
| CI/CD | GitHub Actions | Build and publish on push |
| Optional data | Supabase/Firebase or form service | Real submissions; never expose secret keys |

Use semantic HTML, keyboard-accessible interactions, image lazy-loading, and `prefers-reduced-motion`. Keep URLs and assets compatible with a GitHub Pages repository subpath.

## 3. Repository layout

```text
wedding-invitation/
├── .github/workflows/deploy.yml
├── public/
│   ├── images/{couple,gallery,decorations}/
│   ├── audio/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── EnvelopeIntro.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Countdown.tsx
│   │   ├── EventDetails.tsx
│   │   ├── PhotoGallery.tsx
│   │   ├── MusicPlayer.tsx
│   │   ├── RSVPForm.tsx
│   │   └── Guestbook.tsx
│   ├── config/{wedding.ts,theme.ts}
│   ├── hooks/
│   ├── utils/invitation.ts
│   ├── App.tsx
│   └── main.tsx
├── AGENTS.md
├── PLAN.md
├── vite.config.ts
├── package.json
└── README.md
```

## 4. Codex workflow rules

1. Work on **one phase per task/PR**. First inspect the repository and relevant documentation.
2. Maintain `PLAN.md` with phase checkboxes, acceptance criteria, and open decisions.
3. Before implementing a phase, briefly describe intended changes and identify missing assets/data.
4. After each phase, run available lint, typecheck, tests, and production build; report actual results rather than claiming unexecuted checks.
5. If browser automation is available, inspect screenshots at 360px, 390px, 430px, tablet, and desktop widths.
6. Do not silently introduce a backend, paid service, external tracking, or copyrighted assets.
7. Do not commit secrets or `.env` credentials. Use environment variables only for public client configuration; secure privileged operations on a server/service.
8. Prefer maintainable reusable components over a single giant page component.

## 5. Phase-by-phase execution plan

### Phase 1 — Project setup (estimate: 0.5 day)

**Tasks**
- Create Vite React TypeScript project.
- Install Tailwind CSS using current compatible Vite integration, Motion for React, and Lucide React.
- Add scripts for `dev`, `build`, `lint`, `typecheck`, and tests if configured.
- Define theme tokens (ivory, champagne, sage green), font stack with Vietnamese glyph coverage, spacing, breakpoints.
- Create folders, `AGENTS.md`, `PLAN.md`, `.gitignore`, and `README.md`.
- Configure deployment base path via Vite `base`.

**Acceptance:** `npm install`, `npm run dev`, `npm run typecheck`, and `npm run build` succeed; basic app renders.

### Phase 2 — UI foundation (estimate: 1–2 days)

**Tasks**
- Inspect reference website with browser if possible; document screenshots, colors, typography, page sections, interactions.
- Design mobile-first layout: envelope intro, hero, couple introduction, event date/time, countdown, locations, gallery, footer.
- Use replaceable placeholder assets until real wedding photos and copy are provided.
- Add map directions using external Google Maps links (no embedded API key required).
- Make content data-driven via `src/config/wedding.ts`.
- Check long Vietnamese strings and text overflow.

**Acceptance:** Complete scrollable UI; usable at 360/390/430px and desktop; no horizontal overflow; accessible controls.

### Phase 3 — Motion and polish (estimate: 1–2 days)

**Tasks**
- Implement opening envelope (click/tap/keyboard) and transition to content.
- Add scroll reveal, gentle parallax, gallery transitions, and subtle decorative effects.
- Add music toggle; do not attempt autoplay before user gesture.
- Honor reduced-motion preferences; avoid heavy continuous effects on low-end mobile devices.
- Profile layout shifts and performance.

**Acceptance:** Smooth mobile interaction; animations do not block reading; reduced-motion fallback works; no unintended autoplay.

### Phase 4 — Personalization (estimate: 0.5–1 day)

**Tasks**
- Parse `guest` and `ben` query parameters with `URLSearchParams`.
- Accept `ben=nhatrai` or `ben=nhagai`; default safely for invalid values.
- Show guest greeting using React text interpolation (never raw HTML).
- Keep bride/groom-side event details in typed configuration.
- Implement a small link generator using `URL` and `URLSearchParams`.
- Bound and normalize guest-name length; provide sensible fallback such as `Quý khách`.
- Ignore `fbclid` and other irrelevant tracking parameters.

**Example:** `https://<username>.github.io/<repo>/?guest=B%E1%BA%A1n%20Long&ben=nhatrai`

**Acceptance:** Vietnamese diacritics render correctly; both sides display correct event information; invalid/missing parameters do not crash.

### Phase 5 — Optional interactive features (estimate: 1–2 days)

**Tasks**
- Design RSVP and guestbook forms with input validation and visible error/loading/success states.
- Choose an external backend or form provider only after approval.
- For Supabase, use appropriate row-level security, server-side protections or a controlled submission endpoint, and anti-spam measures; a public anonymous insert policy alone needs careful abuse review.
- Never expose service-role keys in frontend code.
- Implement persistence and verify real end-to-end submissions.
- If backend is not configured, clearly mark forms as demo/disabled; never show fake success.
- Add optional QR, share link, and invitation generator.

**Acceptance:** Real submissions persist and can be reviewed securely, or the UI clearly indicates it is a non-functional demo.

### Phase 6 — QA and optimization (estimate: 1 day)

**Tasks**
- Test Android Chrome, iOS Safari where available, and desktop browsers.
- Test envelope opening, music toggle, countdown timezone, maps, gallery, guest query, side query, and refresh.
- Optimize hero images (WebP/AVIF where appropriate), dimensions, lazy loading, and preload only essential assets.
- Validate keyboard navigation, alt text, focus indicators, contrast, reduced motion.
- Check browser console, network requests, 404s, and Lighthouse metrics.
- Ensure build and all configured checks pass.

**Acceptance:** No critical console errors, no broken images, no page overflow, correct personalized URLs, and no broken refresh navigation.

### Phase 7 — GitHub Pages deployment (estimate: 0.5 day)

**Tasks**
1. Create a public GitHub repository (for example `wedding`).
2. For `https://<username>.github.io/wedding/`, set `base: '/wedding/'` in `vite.config.ts`.
3. For a user-site repository named `<username>.github.io`, set `base: '/'`.
4. Create `.github/workflows/deploy.yml` with checkout, Node setup, `npm ci`, validation, build, `actions/upload-pages-artifact`, and `actions/deploy-pages`.
5. Set GitHub repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
6. Push to the main branch; check workflow logs and published URL.
7. Verify CSS/JS/photo/audio asset URLs and query-string behavior in production.
8. Optionally configure a custom domain and HTTPS.

**Acceptance:** Every push to `main` produces a successful deployment; production site opens over HTTPS and all assets load.

## 6. GitHub Pages configuration examples

`vite.config.ts` for a project repository named `wedding`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/wedding/',
});
```

Use Vite's `import.meta.env.BASE_URL` for public asset paths when necessary, rather than hardcoding root `/images/...` URLs that break under `/wedding/`.

Example workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy wedding website
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Keep `package-lock.json` committed for `npm ci`. Pin action versions to immutable SHAs if required by the project's security policy.

## 7. Sample wedding data model

```ts
export type WeddingSide = 'nhatrai' | 'nhagai';

export interface WeddingEvent {
  title: string;
  dateTimeISO: string; // timezone-aware, e.g. 2027-01-10T17:00:00+07:00
  venueName: string;
  address: string;
  mapsUrl: string;
}

export interface WeddingConfig {
  brideName: string;
  groomName: string;
  heroImage: string;
  galleryImages: string[];
  events: Record<WeddingSide, WeddingEvent>;
}
```

## 8. Acceptance checklist

- [ ] Project initializes and builds successfully.
- [ ] Mobile widths 360, 390, 430px have no horizontal overflow.
- [ ] Desktop layout looks intentional, not stretched mobile UI.
- [ ] Envelope works with mouse, touch, and keyboard.
- [ ] Reduced-motion setting is respected.
- [ ] Music starts only after explicit user interaction.
- [ ] `guest` renders Vietnamese safely.
- [ ] `ben=nhatrai` and `ben=nhagai` select correct data.
- [ ] Missing or invalid query parameters use safe fallbacks.
- [ ] Countdown uses correct wedding timezone.
- [ ] Gallery images load efficiently.
- [ ] Google Maps links open correctly.
- [ ] RSVP is real or explicitly disabled/demo.
- [ ] No secret keys or sensitive guest list are committed.
- [ ] GitHub Actions deployment succeeds.
- [ ] Production assets work under repository base path.
- [ ] Refreshing and sharing personalized links work.

## 9. Master prompt for Codex

```text
You are a senior frontend engineer and UI motion designer.

Build a premium, mobile-first wedding invitation website inspired by:
https://chinhloan.chinchin.top/

Read WEDDING_WEBSITE_IMPLEMENTATION_PLAN.md first and follow its phases.
Inspect the reference using browser tools if available. Record the actual
layout, typography, colors, sections, and interactions. If inaccessible,
state this limitation and follow the documented elegant-romantic fallback.
Do not copy proprietary assets.

STACK: React, TypeScript, Vite, Tailwind CSS, Motion for React,
Lucide React, GitHub Pages, GitHub Actions.

FIRST TASK ONLY:
1. Inspect repository and available tools.
2. Create or update PLAN.md with checkboxes and acceptance criteria.
3. Implement Phase 1: project setup and architecture.
4. Prepare typed wedding configuration and theme tokens.
5. Run install, typecheck, lint, and build where available.
6. Report changed files, actual validation results, and blockers.
7. Stop before Phase 2 and request review.

LATER PHASES:
Implement one phase at a time as described in the plan. For UI phases,
inspect mobile and desktop screenshots if browser automation is available.
Prioritize design fidelity, performance, accessibility, maintainability,
Vietnamese language support, and correct GitHub Pages subpath deployment.
Never fake successful form submissions. Do not add a backend without approval.
```

## 10. Codex phase prompts

Use these after reviewing each previous phase:

- **Phase 2:** `Implement Phase 2 from WEDDING_WEBSITE_IMPLEMENTATION_PLAN.md. Inspect reference if possible, create polished responsive wedding sections, capture screenshots if available, run checks, then stop and report.`
- **Phase 3:** `Implement Phase 3 animation and music controls. Prioritize smooth mobile performance and reduced-motion accessibility. Run checks and report.`
- **Phase 4:** `Implement Phase 4 URL personalization for guest and ben, side-specific configuration, validation, and link generator. Add tests for Vietnamese names and invalid parameters.`
- **Phase 5:** `Design Phase 5 interactive UI, but do not connect external services until I approve the provider and security model. Clearly distinguish demo from real submission.`
- **Phase 6:** `Perform Phase 6 QA, responsive screenshots, accessibility and performance review, bug fixes, and production build verification.`
- **Phase 7:** `Implement Phase 7 GitHub Pages deployment for repository <repo>. Verify Vite base, assets, Actions workflow, and deployed query-string URLs.`

## 11. Decisions and assets to provide

Before visual implementation, prepare: couple names, wedding date/time, groom-side and bride-side venues, Google Maps links, 1 hero photo, gallery photos, desired music file with appropriate rights, color/font preferences, and optional invitation wording. Before deployment, specify GitHub username and repository name. Before Phase 5, decide whether RSVP/guestbook need real persistence and which external service is acceptable.

## 12. Practical notes

- Estimated development effort: **5.5–9 working days** for the complete staged plan; complexity and asset readiness can change this substantially.
- A simple static MVP can be completed without any backend.
- Query parameters personalize the invitation but do not provide authentication or confidentiality.
- GitHub Pages is static hosting; it is not a general-purpose self-hosted application server.
- Avoid putting private invitee lists, credentials, or bank details in public source control unless publication is intentional.
