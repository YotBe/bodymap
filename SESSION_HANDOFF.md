# PainMap — session handoff

This file gets a new Claude Code session up to speed quickly. Read it once, then dive in.

## Project

**PainMap** is a React + Vite SPA: tap a body region → drill into a sub-area → land on a single resistance-band exercise card with mechanism, instructions, evidence citation, and a YouTube demo video. EN + HE (with RTL). Static site, no backend. Vercel-hosted at `bodymap1.vercel.app`. Target: pre-pitch demo for an Israeli healthcare investor.

## Stack

- React 18, TypeScript (strict), Vite 5
- react-router for routing, react-i18next for EN/HE, react-query for data
- All exercise data in `painmap/client/src/data/exercises.json`
- Hebrew overrides in `painmap/client/src/data/exercises.he.json`
- vite-plugin-pwa for installability, Plausible for analytics
- Vercel for hosting, GitHub for CI

## Repo layout

```
/                                  # repo root
├── vercel.json                    # CSP, security headers, build config
├── SESSION_HANDOFF.md             # this file
└── painmap/
    └── client/
        ├── package.json
        ├── tsconfig.json
        ├── vite.config.ts
        ├── index.html
        ├── public/                # favicon, og-image, robots, apple-touch-icon
        └── src/
            ├── main.tsx
            ├── App.tsx
            ├── i18n.ts
            ├── api/exercises.ts   # data hooks, Hebrew override merge, youtubeId() allowlist
            ├── components/
            │   ├── BodyMap/        # SVG body w/ hotspots
            │   ├── ExerciseCard.tsx
            │   ├── VideoEmbed.tsx  # YouTube iframe with thumbnail-first inline playback
            │   ├── PageShell.tsx   # routes + banner + state
            │   ├── SafetyBanner.tsx
            │   ├── TopHeader.tsx
            │   ├── SiteFooter.tsx
            │   ├── ErrorBoundary.tsx
            │   └── NotFoundPage.tsx
            ├── data/
            │   ├── exercises.json       # 7 zones × N sub-areas × M exercises (22 total)
            │   └── exercises.he.json    # Hebrew name/mechanism/instructions overrides + subarea names
            ├── hooks/
            │   ├── useIsMobile.ts
            │   ├── usePrefersReducedMotion.ts
            │   └── useLocalStorage.ts   # for banner-dismissed persistence
            ├── locales/{en,he}/common.json
            ├── routes/
            │   ├── HomePage.tsx
            │   ├── ZonePage.tsx
            │   ├── ExercisePage.tsx
            │   ├── AboutPage.tsx
            │   ├── LegalPage.tsx
            │   ├── EvidencePage.tsx
            │   └── ClinicianPage.tsx
            └── styles/index.css
```

## What's shipped (chronological, most recent at top)

| PR | Summary |
| --- | --- |
| **#16** | Videos: swap 18 of 22 to short single-exercise demos (TheraBand official + clinical channels) — replaces long-form Bob & Brad / AskDoctorJo content. Also promotes "Watch on YouTube" link to a visible outlined-button fallback under every player. |
| **#15** | Inline video playback: thumbnail → tap → iframe loads in place with `playsinline=1` + `autoplay=1`. "Watch on YouTube" link visible underneath as fallback. |
| **#14** | Hotfix: remove iframe `sandbox` attribute (it caused Error 153 on iOS Safari). YouTube embeds need too many sandbox tokens to be worth specifying — CSP `frame-src` already restricts the iframe origin. |
| **#13** | Audit follow-ups: i18next `escapeValue: true`, HSTS header, YouTube URL allowlist in `youtubeId()`, Hebrew sub-area translations for all 22 sub-areas, banner dismissal persisted in localStorage, `@media (max-width: 480px)` for nav overflow. |
| **#12** | Replaced 22 broken/placeholder exercise videos. Originally the band-shrug placeholder `yD7cTQtqP0k` was reused across 4 exercises; 8 had YouTube search-results URLs; 1 was Vimeo. Pre-PR-15 era. |
| **#11** (rolled into earlier work) | PWA installability + Plausible analytics. Manifest, service worker, OG image, apple-touch-icon. |
| **#10** | Hebrew + RTL infrastructure: i18n setup, `<html dir>` flip via `HtmlLangSync` in `App.tsx`, language toggle persists in `localStorage.painmap.lang`. |
| **#9** | Credibility pages: `/about`, `/legal`, `/evidence`, `/clinician-finder`. |
| **earlier** | Mobile single-pane navigation, viewBox-scaled hotspot labels, exercise card design. |

## Current `main` state (post-PR-16)

- 22 exercises in `exercises.json`, each with a `videoUrl` to a short single-exercise YouTube demo
- 6 videos from TheraBand official (highest embed confidence)
- 12 from clinical/PT channels (best-guess; not 100% verified-embeddable)
- 4 KEEPs (working without report of failure):
  - `ex-median-nerve-glide` → `noqq-QSG6w4` (Physiotutors carpal tunnel)
  - `ex-tyler-twist` → `DUfLc4n3ygg`
  - `ex-banded-tke` → `7xG3MeoLjC0`
  - `ex-plantar-fascia-stretch` → `pKx7swh47Uc` (DiGiovanni)
- Inline playback via thumbnail-first UX in `VideoEmbed.tsx`
- Visible outlined "Watch on YouTube ↗" button under every player as fallback
- Hebrew complete for: chrome, all 4 static pages, all 22 sub-area names, the 3 Neck demo-path exercises
- Hebrew incomplete for: non-Neck exercise content (mechanism, instructions, etc.) — flag with "translation-pending" note in `ExerciseCard.tsx` when no override exists

## Hard-earned lessons (read before guessing)

1. **AskDoctorJo disables embedding on her entire channel.** Any AskDoctorJo video → Error 153 in the iframe. Avoid completely. (Confirmed by user real-device tests across 2 PRs.)
2. **Bob & Brad makes long-form multi-topic videos.** They embed fine (mostly), but user explicitly rejected this format: "I want all videos to be showing only the exercise that they appear on, short video for each exercise."
3. **TheraBand official YouTube is the gold standard for short single-exercise band demos.** Their business is band products; their videos are 30-90s purpose-built demos; embedding is wide-open.
4. **iframe `sandbox` attribute breaks YouTube on iOS Safari.** Don't add it back without testing with the full known-good token set: `allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation allow-forms allow-orientation-lock allow-pointer-lock`. Even then, CSP frame-src restriction already covers most of what sandbox would.
5. **YouTube oEmbed and direct page fetches return 403 from the Claude sandbox.** You can't programmatically verify embed-permission or fetch video metadata. Channel reputation is the best heuristic.
6. **YouTube Shorts (`/shorts/<id>`) embed as vertical** inside our 16:9 container. Always use `watch?v=<id>` URLs.
7. **iOS in-app browsers** (Claude app, Twitter, etc.) sometimes fail to embed videos that work in real Safari. If the user is testing inside an in-app browser, that's a data-point but not always a content problem.
8. **Inline playback requires `?playsinline=1`** in the iframe URL or iOS forces fullscreen. Autoplay works if it follows a user gesture (`?autoplay=1`).

## VideoEmbed component behaviour

`painmap/client/src/components/VideoEmbed.tsx` — current behaviour:

- Default state: shows YouTube thumbnail (`https://i.ytimg.com/vi/<id>/hqdefault.jpg`) with a red YouTube-style play button overlay + "Play video" label
- After tap: replaces thumbnail with iframe (`youtube-nocookie.com/embed/<id>?rel=0&modestbranding=1&playsinline=1&autoplay=1`)
- Always visible underneath both states: outlined button-styled "Watch on YouTube ↗" link (the `.video-fallback` CSS rule)
- If thumbnail image fails to load: still shows the play button on a black background
- If `videoId` is empty: shows "Video unavailable" card (no broken state)

CSP allows `i.ytimg.com` and `img.youtube.com` for `img-src`, and `youtube-nocookie.com` + `youtube.com` for `frame-src`. See `vercel.json`.

## Hebrew override mechanism

`painmap/client/src/api/exercises.ts` exports `useExercise(id)` which:

1. Reads the English exercise from `exercises.json`
2. If `i18n.language` starts with `he`, calls `applyHeExercise(ex)` which merges in fields from `exercises.he.json` (`name`, `mechanism`, `instructions`, `commonMistakes`, `contraindications`, `beginnerModification`, `evidence.summary`, `subArea.name`, `subArea.description`)
3. `hasHebrewOverride(id)` returns true only when there's an entry in the `exercises` map of `exercises.he.json`

To translate a new exercise: add an entry to `exercises.he.json.exercises[<id>]`. `ExerciseCard.tsx` will hide the "translation-pending" note automatically.

Citations (`evidence.full`) intentionally stay English — they're scientific papers.

## Conventions

- **Branches**: `claude/<topic>-pr<N>` (e.g. `claude/video-fallback-pr16`). PR auto-numbered by GitHub.
- **Commits**: short imperative subject (50-60 chars), blank line, body explaining *why*. Trailer: `https://claude.ai/code/session_...` (auto-injected). Use HEREDOCs to preserve formatting.
- **PRs**: open as **draft**, include Summary + Test plan with checkboxes, list specific files changed. Real-device verification ALWAYS on Vercel preview before merging.
- **Verification cadence**: `npm run lint && npm run build` locally must be clean. CI runs `Lint + build (client)`. Vercel auto-deploys a preview per PR — that's where real-device testing happens.
- **Don't merge to main** without explicit user instruction.

## Known open items (pre-pitch checklist)

These came out of the audit in PR #13 / earlier and are not yet shipped:

- [ ] **`ErrorBoundary` fallback copy is English-only** — `painmap/client/src/components/ErrorBoundary.tsx:37`. Low priority (post-crash only).
- [ ] **Hotspot SVG `:focus-visible` indicator is suppressed** — keyboard users on the body map lose focus ring. `painmap/client/src/styles/index.css`. Polish.
- [ ] **Hebrew exercise translations** beyond the 3 Neck demo-path exercises — flag with "translation-pending" note. User should have a native PT review before pitch.
- [ ] **Real-device verification** of the 12 clinical-channel videos shipped in PR #16. Some may still throw Error 153; each is a 30-second JSON swap.

## Useful commands (run from `painmap/client/`)

```bash
npm run dev              # local dev server
npm run lint             # eslint --max-warnings 0
npm run build            # tsc --noEmit && vite build
npm audit --omit=dev     # dependency check (currently 0 vulns)
```

## How to onboard a new Claude Code session

1. Open the repo in Claude Code.
2. In your first prompt: `Read SESSION_HANDOFF.md for context, then [your task].`
3. Or import it into a project-level CLAUDE.md so it auto-loads each session:
   ```markdown
   # CLAUDE.md
   @SESSION_HANDOFF.md
   ```

The agent can also reference `/root/.claude/plans/check-everything-working-and-silly-tome.md` for the rolling pre-pitch readiness plan, but that file is much longer — only read it when needed.
