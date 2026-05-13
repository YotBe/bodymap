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
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
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

### Frontend
- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS 3.4** (custom design tokens — no UI kit)
- **Framer Motion** for view-box animation and panel transitions
- **React Router v6** for deep-linkable routes
- **TanStack Query (React Query)** for server-state caching
- **Axios** for HTTP

### Backend
- **Node.js 20** + **Express** + **TypeScript**
- **SQLite** via `better-sqlite3` (file-based, zero-config)
- **Zod** for runtime validation of route params

### Tooling
- **ESLint + Prettier**
- **Concurrently** to run client and server with a single command
- **Vercel** for deployment

---

## Project Structure

```
painmap/
├── package.json              # Root: workspace scripts (concurrently)
├── README.md                 # ← You are here
├── client/                   # React + Vite frontend
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── api/
│       │   └── exercises.ts
│       ├── components/
│       │   ├── BodyMap/
│       │   │   ├── BodyMap.tsx
│       │   │   ├── AnteriorView.tsx
│       │   │   ├── PosteriorView.tsx
│       │   │   └── zones.ts
│       │   ├── ExerciseCard.tsx
│       │   ├── EvidencePill.tsx
│       │   ├── BandTensionChip.tsx
│       │   ├── PrescriptionBlock.tsx
│       │   ├── VideoEmbed.tsx
│       │   ├── SafetyBanner.tsx
│       │   ├── RedFlagModal.tsx
│       │   ├── ZoneBreadcrumb.tsx
│       │   ├── ViewToggle.tsx
│       │   └── EmptyState.tsx
│       ├── hooks/
│       │   ├── useExercise.ts
│       │   └── usePainSelection.ts
│       ├── styles/
│       │   └── index.css
│       └── types.ts
└── server/                   # Express + SQLite backend
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts
        ├── db/
        │   ├── schema.sql
        │   └── seed.ts
        ├── routes/
        │   ├── zones.ts
        │   └── exercises.ts
        ├── data/
        │   └── exercises.json
        └── types.ts
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

This launches:
- **Backend** on `http://localhost:3001`
- **Frontend** on `http://localhost:5173`

The SQLite database (`painmap.db`) is created and seeded automatically on first server start.

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Backend port |
| `CLIENT_ORIGIN` | `http://localhost:5173` | CORS allow-list |
| `DB_PATH` | `./painmap.db` | SQLite database file location |

---

## API Reference

Base URL: `http://localhost:3001/api`

All responses are JSON. Errors return `{ "error": string }` with the appropriate HTTP status code.

### `GET /api/health`
Health check.

**Response:**
```json
{ "status": "ok" }
```

### `GET /api/zones`
Returns all zones with their sub-areas nested.

**Response:**
```json
[
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
        "displayOrder": 1
      }
    ]
  }
]
```

### `GET /api/zones/:zoneId`
Returns a single zone with sub-areas. **404** if not found.

### `GET /api/sub-areas/:subAreaId/exercises`
Returns all exercises for a sub-area (primary first, then alternatives).

### `GET /api/exercises/:exerciseId`
Returns full detail for a single exercise.

**Response:**
```json
{
  "id": "ex-band-shrug",
  "subAreaId": "neck-upper-trapezius",
  "name": "Resistance-Band Shrug",
  "isPrimary": true,
  "targetMuscles": "Upper trapezius, levator scapulae",
  "mechanism": "Strengthens the upper trapezius...",
  "instructions": ["Stand on the middle of a long band...", "..."],
  "sets": 3,
  "reps": "10-12",
  "tempo": "2-1-2",
  "bandTension": "red",
  "bandTensionNote": "Start red, progress to green or blue...",
  "frequency": "3-5 days/week",
  "commonMistakes": ["Rolling shoulders...", "..."],
  "contraindications": ["Acute cervical radiculopathy...", "..."],
  "beginnerModification": "Bodyweight shrugs (no band)...",
  "evidenceShort": "Andersen LL, Pain 2011",
  "evidenceFull": "Andersen LL, Saervoll CA, Mortensen OS, et al. ...",
  "evidenceSummary": "Randomized controlled trial of 198 office workers...",
  "videoUrl": "https://www.youtube.com/watch?v=..."
}
```

---

## Database Schema

SQLite, three tables. Bootstrapped on server start from `server/src/data/exercises.json` if the database file does not exist.

```sql
CREATE TABLE zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  view TEXT NOT NULL,            -- 'anterior' | 'posterior' | 'both'
  display_order INTEGER NOT NULL
);

CREATE TABLE sub_areas (
  id TEXT PRIMARY KEY,
  zone_id TEXT NOT NULL REFERENCES zones(id),
  name TEXT NOT NULL,
  description TEXT,
  svg_path_id TEXT,
  display_order INTEGER NOT NULL
);

CREATE TABLE exercises (
  id TEXT PRIMARY KEY,
  sub_area_id TEXT NOT NULL REFERENCES sub_areas(id),
  name TEXT NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 1,
  target_muscles TEXT NOT NULL,
  mechanism TEXT NOT NULL,
  instructions TEXT NOT NULL,         -- JSON-stringified array
  sets INTEGER NOT NULL,
  reps TEXT NOT NULL,
  tempo TEXT,
  band_tension TEXT NOT NULL,         -- 'yellow' | 'red' | 'green' | 'blue' | 'black'
  band_tension_note TEXT,
  frequency TEXT NOT NULL,
  common_mistakes TEXT NOT NULL,      -- JSON-stringified array
  contraindications TEXT NOT NULL,    -- JSON-stringified array
  beginner_modification TEXT,
  evidence_short TEXT NOT NULL,
  evidence_full TEXT NOT NULL,
  evidence_summary TEXT NOT NULL,
  video_url TEXT NOT NULL
);
```

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
