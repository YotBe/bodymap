# PainMap

> Click where it hurts. Get the single best resistance-band exercise — evidence-based, with full instructions and a video demo.

PainMap is a desktop web application that helps office workers find targeted resistance-band exercises based on where they feel pain. Users click on an interactive body diagram, drill down from broad zone to specific sub-area, and receive one evidence-backed exercise with step-by-step instructions, dosage prescription, a video demonstration, and a citation to the peer-reviewed source behind the recommendation.

**Live demo:** [bodymap1.vercel.app](https://bodymap1.vercel.app/) · [bodymap-pied.vercel.app](https://bodymap-pied.vercel.app/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Data Model](#data-model)
- [Design System](#design-system)
- [Evidence Base](#evidence-base)
- [Safety & Disclaimer](#safety--disclaimer)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

PainMap is not a medical diagnostic tool. It is a self-guided educational triage tool for office workers experiencing common musculoskeletal complaints from prolonged sitting and computer use. Every exercise recommendation is sourced from peer-reviewed clinical literature (Cochrane reviews, RCTs, meta-analyses, and clinical guidelines).

**Design philosophy:** "Clinical Editorial" — restrained, evidence-forward, respectful of the user's intelligence. No wellness fluff, no gamification, no "journey" language.

**User flow:**
1. User lands on the app and sees the body map.
2. User dismisses the safety banner and clicks a broad zone (e.g., Neck).
3. On the first zone click of the session, a red-flag screener appears (4 yes/no questions).
4. The body map zooms into the selected zone, revealing sub-area hotspots.
5. User selects a sub-area (e.g., Upper Trapezius).
6. The right pane renders the recommended exercise with all clinical details.

---

## Features

- **Interactive SVG body map** with anterior/posterior views and animated zoom-to-zone drill-down
- **Evidence-based exercise library** covering neck, shoulders, back, hands & wrists, hips & glutes, knees, and foot & ankle
- **Full exercise detail cards** including target muscles, mechanism of action, step-by-step instructions, sets/reps/tempo, band tension recommendations, frequency, common mistakes, contraindications, beginner modifications, full citation, and embedded YouTube video demo
- **Red-flag triage screener** — prompts users with concerning symptoms to consult a clinician before exercising
- **Keyboard-navigable and screen-reader-friendly** — every hotspot is a real button with `aria-label`; selected state communicated via both color and a 1px ring
- **Respects `prefers-reduced-motion`** — disables zoom/pan animations for users with vestibular sensitivities
- **Deep-linkable state** via React Router — every exercise has a shareable URL

---

## Tech Stack

PainMap is a **client-only single-page app** deployed as static assets on Vercel. Exercise data ships as a typed JSON bundle, not behind an API.

- **React 18** + **Vite** + **TypeScript**
- **React Router v6** for deep-linkable routes
- **TanStack Query (React Query)** for in-memory caching of the static dataset
- Hand-rolled CSS using custom design tokens (no UI kit, no Tailwind utility soup)
- **ESLint** with `--max-warnings 0`; TypeScript strict mode
- **Vercel** for deployment, with security headers (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy) configured in `vercel.json`
- **GitHub Actions** runs lint + build on every PR

---

## Project Structure

```
painmap/
├── package.json                  # Forwards scripts to client/
├── README.md                     # ← You are here
└── client/                       # React + Vite frontend (the whole app)
    ├── package.json
    ├── index.html
    ├── public/
    │   ├── favicon.svg
    │   └── robots.txt
    └── src/
        ├── main.tsx              # ErrorBoundary wraps <App>
        ├── App.tsx
        ├── api/
        │   └── exercises.ts      # Reads exercises.json via TanStack Query
        ├── data/
        │   └── exercises.json    # The whole content library
        ├── components/
        │   ├── BodyMap/          # SVG body map + zoom + hotspots
        │   ├── ExerciseCard.tsx
        │   ├── ErrorBoundary.tsx
        │   ├── NotFoundPage.tsx
        │   ├── SafetyBanner.tsx
        │   ├── RedFlagModal.tsx
        │   └── …
        ├── routes/               # HomePage, ZonePage, ExercisePage
        ├── hooks/
        └── styles/
            └── index.css
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.0
- **npm** ≥ 10.0

### Installation

```bash
git clone https://github.com/YotBe/bodymap.git
cd bodymap/painmap
npm install
```

### Development

From the `painmap/` root:

```bash
npm run dev
```

Vite serves the app on `http://localhost:5173` with HMR.

### Production build

```bash
npm run build
```

Output lands in `painmap/client/dist/`. Vercel builds and serves this directory automatically per the `vercel.json` at the repo root.

### Linting

```bash
npm run lint
```

ESLint runs with `--max-warnings 0`; CI fails on any warning.

---

## Data Model

All content lives in `client/src/data/exercises.json` as a typed bundle imported at build time. The runtime type contracts (`RawZone`, `RawSubArea`, `RawExercise`) are in `client/src/api/exercises.ts`. There is no API or database — `useZones()` and friends just wrap the static import in TanStack Query for caching ergonomics.

Shape (one zone shown, abbreviated):

```jsonc
{
  "zones": [
    {
      "id": "neck",
      "name": "Neck",
      "view": "both",
      "displayOrder": 1,
      "subAreas": [
        {
          "id": "neck-upper-trapezius",
          "name": "Upper Trapezius",
          "description": "Top of shoulders, near the base of the neck",
          "svgPathId": "hotspot-upper-trap",
          "displayOrder": 1,
          "exercises": [
            {
              "id": "ex-band-shrug",
              "name": "Resistance-Band Shrug",
              "isPrimary": true,
              "targetMuscles": "Upper trapezius, levator scapulae",
              "mechanism": "...",
              "instructions": ["Stand on the middle of a long band...", "..."],
              "sets": 3,
              "reps": "10-12",
              "tempo": "2-1-2",
              "bandTension": "red",
              "bandTensionNote": "Start red, progress to green or blue...",
              "frequency": "3-5 days/week",
              "commonMistakes": ["..."],
              "contraindications": ["..."],
              "beginnerModification": "...",
              "evidenceShort": "Andersen LL, Pain 2011",
              "evidenceFull": "Andersen LL, Saervoll CA, et al. ...",
              "evidenceSummary": "Randomized controlled trial of 198 office workers...",
              "videoUrl": "https://www.youtube.com/watch?v=..."
            }
          ]
        }
      ]
    }
  ]
}
```

To add or edit content, edit that JSON file directly and rebuild. Every new exercise must carry `evidenceShort` + `evidenceFull` + `evidenceSummary` referencing peer-reviewed literature; PRs that don't will be rejected.

---

## Design System

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#F5F2EC` | Warm off-white background |
| `--surface` | `#FFFFFF` | Cards, panels |
| `--ink` | `#1A1A1A` | Primary text |
| `--ink-muted` | `#5C5751` | Secondary text |
| `--rule` | `#E4DFD6` | Hairlines, dividers |
| `--accent` | `#C8442C` | Pain indicator, selected zones, CTAs |
| `--accent-soft` | `#F0D9D2` | Hover states, contraindication boxes |
| `--evidence` | `#2E5C4A` | Citation pills |

**Typography:**
- **Display / headings:** Fraunces (serif)
- **Body / UI:** Inter Tight
- **Mono (citations):** JetBrains Mono

**Motion:** All transitions ease-out, 180–700ms. `prefers-reduced-motion: reduce` disables zoom/pan and reduces all transitions to 80ms cross-fade.

---

## Evidence Base

Every exercise is backed by peer-reviewed clinical literature. Key sources include:

- **Andersen LL et al.** *Pain* 2011;152(2):440–446 — RCT showing 2 min/day of resistance-band training reduces office-worker neck/shoulder pain
- **Andersen LL et al.** *Arthritis Rheum* 2008;59:84–91 — Specific strength training reduces upper-trap myalgia
- **Tyler TF et al.** *J Shoulder Elbow Surg* 2010;19(6):917–922 — Tyler Twist eccentric loading for tennis elbow (76% DASH improvement vs 13% control)
- **Tyler TF et al.** *Int J Sports Phys Ther* 2014;9(3):365–370 — Reverse Tyler Twist for golfer's elbow
- **Jull GA et al.** *Man Ther* 2009;14:696–701 — Deep cervical flexor training for chronic neck pain
- **Cools AM et al.** *Am J Sports Med* 2007;35(10):1744–1751 — Scapular muscle balance rehabilitation
- **Owen PJ et al.** *Br J Sports Med* 2020;54(21):1279–1287 — Network meta-analysis of exercise for low back pain
- **Ballestero-Pérez R et al.** *J Manipulative Physiol Ther* 2017;40(1):50–59 — Nerve gliding for carpal tunnel syndrome

A full citation appears within each exercise card in the app.

---

## Safety & Disclaimer

**PainMap is an educational tool, not a medical device.** It does not diagnose conditions, replace clinical evaluation, or provide individualized medical advice.

The app implements several safety patterns:

- A persistent safety banner on first visit
- A red-flag screener on the first zone selection (recent trauma, radiating numbness/tingling, fever or unexplained weight loss, night pain)
- Explicit contraindications on every exercise card, displayed in a high-contrast box
- A "See a clinician" link in the footer

**Users should consult a qualified healthcare provider before beginning any exercise program**, especially if they have a known medical condition, are pregnant, are recovering from surgery, or experience any red-flag symptoms.

---

## Roadmap

**V2 (current):** Full body — neck, shoulders, back, hands & wrists, hips & glutes, knees, foot & ankle

**V3 (ideas):**
- Alternative exercises per sub-area (1–2 fallbacks for users with equipment or injury constraints)
- User accounts with saved favorite exercises
- Progress tracking
- Multi-language support (starting with Hebrew, given the maintainer's location)
- Native mobile app

---

## Contributing

This is a personal project, but issues and pull requests are welcome.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit with conventional commit messages (`feat:`, `fix:`, `docs:`, etc.)
4. Push and open a pull request

When proposing new exercise content, please include the peer-reviewed source. Anecdotal or influencer-sourced content will not be accepted.

---

## License

MIT — see `LICENSE` file at the repository root.

---

## Acknowledgments

- **Lars Andersen and colleagues** at the National Research Centre for the Working Environment, Copenhagen, for the foundational RCT work on resistance-band training for office workers
- **Timothy Tyler** for the Tyler Twist and Reverse Tyler Twist protocols
- **The Physiopedia community** for clinical reference material

Built with the assistance of Claude (Anthropic).
