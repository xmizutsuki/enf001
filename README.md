# ClinSpeak

ClinSpeak is a responsive Medical English learning app for healthcare professionals. It combines short gamified lessons with clinically contextual practice: vocabulary, reading, speaking, patient interview, physical-assessment language and nursing documentation.

## Current MVP

- Duolingo-inspired learning path with progressive lesson unlocking
- XP, streaks, lesson completion and local progress persistence
- Medical vocabulary and reading exercises
- Spaced-review flashcards
- Personal mistake notebook
- Speaking/shadowing lab using the browser Speech APIs when available
- Nursing progress-note exercise using history + physical-assessment findings
- Objective-documentation feedback and model answer
- Clinical Tutor offline fallback for SBAR, documentation, pain assessment and terminology
- Skills dashboard for vocabulary, reading, listening, speaking, writing and clinical English
- Mobile/desktop responsive interface
- Installable web-app manifest
- GitHub Pages deployment workflow

## Learning philosophy

The core progression is:

`Vocabulary → Patient → History → Physical Assessment → Communication → Documentation → Feedback`

The app is designed as a clinical-language practice environment rather than a generic English course with medical words added on top.

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

The MVP stores learner progress in `localStorage`. No application backend receives clinical notes or recorded audio. Browser speech recognition can depend on the browser/device implementation.

## Planned architecture

The UI is ready to evolve toward Supabase authentication/cloud progress, a larger lesson bank, adaptive review, server-side AI tutoring, specialty tracks, richer speech scoring and full patient simulations.

## Educational scope

ClinSpeak teaches language and documentation skills. It is not a diagnostic, treatment or clinical decision-support system and does not replace institutional policies, professional judgment, supervision or local scope-of-practice requirements.
