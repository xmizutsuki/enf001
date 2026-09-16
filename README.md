# ClinSpeak

ClinSpeak is a local-first Medical English learning app for healthcare professionals. It combines Duolingo-style progression with clinically contextual practice: vocabulary, reading, speaking, patient interview, physical-assessment language, SBAR, handoff and nursing documentation.

## Curriculum v2.0

The current curriculum contains:

- **A1 → C1 progression**
- **25 units**
- **100 lessons**
- **292 local exercise items** used to build lesson-specific practice sets
- **104 medical terms** for spaced repetition
- **8 nursing-documentation cases** with case-specific scoring rubrics
- speaking/shadowing phrases from basic patient interaction through advanced escalation and patient education
- specialty content for respiratory, cardiovascular, neurological, GI/GU, PACU/perioperative, wound care, ICU, emergency and mental-health communication

### A1 — Clinical Foundations

Essential healthcare vocabulary, anatomy, common symptoms, vital signs, patient introductions, daily care, mobility and basic safety language.

### A2 — Everyday Nursing English

Pain/OPQRST, health history, medications and routes, routine nursing care, subjective vs objective findings and basic clinical documentation.

### B1 — Clinical Assessment

Respiratory, cardiovascular, neurological and GI/GU assessment; focused interview language; system-based charting; SBAR and basic handoff.

### B2 — Acute & Specialty Communication

Shift handoff, care coordination, deterioration language, escalation, PACU/perioperative communication, wound documentation, ICU, emergency and mental-health English.

### C1 — Advanced Clinical Communication

Complex nursing documentation, trends and reassessment, intervention/response language, leadership and conflict communication, teach-back, health literacy, uncertainty language and integrated capstone simulations.

## Learning philosophy

The core progression is:

`Vocabulary → Patient → History → Physical Assessment → Communication → Documentation → Feedback`

The app is designed as a clinical-language practice environment rather than a generic English course with medical words added on top.

## Current features

- Duolingo-inspired learning path with progressive lesson unlocking
- XP, streaks and skill scores
- lesson-specific exercise selection instead of one repeated bank
- spaced-repetition review scheduling
- personal mistake notebook
- speaking/shadowing lab using browser Speech APIs when available
- nursing progress-note exercises using history + physical-assessment findings
- case-specific objective-documentation feedback and model answers
- offline Clinical Tutor fallback for SBAR, handoff, documentation, pain assessment, wounds and patient education
- local profile settings with no account required
- JSON export/import backup for moving or protecting progress
- PWA-style offline service worker
- mobile/desktop responsive interface
- GitHub Pages deployment workflow

## Local-first architecture

ClinSpeak does not require login, Supabase or another learner database.

### Learning content

The complete curriculum is versioned with the app in:

`src/data/content.js`

The module contains the CEFR learning path, medical terminology, lesson metadata, exercise generators, curated clinical questions, speaking prompts, tutor knowledge and nursing-writing cases. New app builds can add learning content without deleting local learner progress.

### Learner progress

Progress is stored in browser **IndexedDB** (`clinspeak-local`). This includes XP, streak, completed lessons, skill scores, note history, mistakes and spaced-repetition scheduling.

Progress from the original ClinSpeak lesson IDs is migrated into the expanded curriculum when possible.

### Preferences

Small profile preferences such as display name, profession, English level and daily XP goal are stored in `localStorage` under `clinspeak-preferences-v1`.

### Backup and restore

The Profile screen can export a `clinspeak-backup-YYYY-MM-DD.json` file and import it later. The backup includes progress, SRS scheduling, scores and local profile preferences.

### Offline support

`public/sw.js` provides same-origin runtime caching plus an application-shell fallback. After assets have been loaded, most static learning functionality can continue without a ClinSpeak backend connection.

Speech-recognition behavior depends on the browser/device implementation and may use services provided by the browser vendor.

## Run locally

Requirements: Node.js 22+

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Deployment

Every push to `main` runs `.github/workflows/deploy-pages.yml`, builds the Vite app and deploys the `dist` directory to GitHub Pages. The Vite base path is configured for this repository (`/enf001/`).

## Data and privacy

No ClinSpeak account is required and the current app has no application backend for learner progress. Progress remains on the browser/device unless the learner explicitly exports a backup file.

No ClinSpeak backend receives nursing-note practice text or recorded audio. Clearing site/browser data can remove local progress, so users who want portability should periodically export a backup.

## Future optional cloud mode

A future version can add optional account-based sync without replacing local mode:

- **Guest/local mode:** IndexedDB + local backup, no login
- **Account mode:** optional cross-device cloud synchronization

The learning content itself can continue to ship with the app rather than being stored in Supabase.

## Educational scope

ClinSpeak teaches language and documentation skills. It is not a diagnostic, treatment or clinical decision-support system and does not replace institutional policies, professional judgment, supervision or local scope-of-practice requirements.
