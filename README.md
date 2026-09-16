# ClinSpeak

ClinSpeak is a responsive Medical English learning app for healthcare professionals. It combines short gamified lessons with clinically contextual practice: vocabulary, reading, speaking, patient interview, physical-assessment language and nursing documentation.

## Current MVP

- Duolingo-inspired learning path with progressive lesson unlocking
- XP, streaks, lesson completion and local progress persistence
- Medical vocabulary and reading exercises
- Local spaced-repetition review scheduling
- Personal mistake notebook
- Speaking/shadowing lab using the browser Speech APIs when available
- Nursing progress-note exercise using history + physical-assessment findings
- Objective-documentation feedback and model answer
- Clinical Tutor offline fallback for SBAR, documentation, pain assessment and terminology
- Skills dashboard for vocabulary, reading, listening, speaking, writing and clinical English
- Local profile settings with no account required
- JSON export/import backup for moving or protecting progress
- PWA-style offline service worker
- Mobile/desktop responsive interface
- GitHub Pages deployment workflow

## Learning philosophy

The core progression is:

`Vocabulary → Patient → History → Physical Assessment → Communication → Documentation → Feedback`

The app is designed as a clinical-language practice environment rather than a generic English course with medical words added on top.

## Local-first architecture

ClinSpeak intentionally does not require login, Supabase, or another learner database for the current version.

### Learning content

All lessons, questions, speaking phrases, review vocabulary and cases are versioned inside the repository in:

`src/data/content.json`

Publishing a new app build can add or update learning content without deleting the learner's local progress.

### Learner progress

Progress is stored in browser **IndexedDB** (`clinspeak-local`). This includes XP, streak, completed lessons, skill scores, note history, mistakes and spaced-repetition scheduling.

The app automatically migrates progress from the older `clinspeak-progress-v1` localStorage format into IndexedDB on first launch after this update.

### Preferences

Small profile preferences such as display name, profession, English level and daily XP goal are stored in `localStorage` under `clinspeak-preferences-v1`.

### Backup and restore

The Profile screen can export a `clinspeak-backup-YYYY-MM-DD.json` file and import it later. The backup includes progress, SRS scheduling, scores and local profile preferences.

### Offline support

`public/sw.js` provides same-origin runtime caching plus an application-shell fallback. After assets have been loaded, the app can continue to provide most static learning functionality without a ClinSpeak backend connection.

Speech-recognition behavior still depends on the browser/device implementation and may require network access from that provider.

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

If GitHub Pages has never been used for this repository, open **Settings → Pages → Build and deployment** and select **GitHub Actions** as the source once.

## Data and privacy

No ClinSpeak account is required and the current app has no application backend for learner progress. Progress remains on the browser/device unless the learner explicitly exports a backup file.

No application backend receives nursing-note practice text or recorded audio. Browser speech recognition can depend on the browser/device provider and its own processing model.

Clearing site/browser data can remove local progress, so users who want portability should periodically export a backup.

## Future optional cloud mode

A future version can add optional account-based sync without replacing local mode:

- **Guest/local mode:** IndexedDB + local backup, no login
- **Account mode:** optional cross-device cloud synchronization

The learning content itself can continue to ship with the app instead of being stored in Supabase.

## Educational scope

ClinSpeak teaches language and documentation skills. It is not a diagnostic, treatment or clinical decision-support system and does not replace institutional policies, professional judgment, supervision or local scope-of-practice requirements.
