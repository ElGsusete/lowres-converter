# Project Context

## Project summary

LowRes Shitpost Converter is a browser-only media degradation app (audio/video).
The app processes files locally in the user browser using FFmpeg.wasm + Web Worker.

## Product goals

- Convert uploaded audio/video into lower quality "meme/shitpost" output.
- Keep privacy-first behavior: no server-side media processing.
- Maintain secure defaults and simple UX for non-technical users.

## Core decisions

- Frontend-only processing for MVP.
- No backend for media conversion in current phase.
- Modular architecture is mandatory (no monolithic files).
- UI and user-facing text in English.

## Architecture

- `src/ui`: components, hooks, styles.
- `src/application`: app logic (validation, command building).
- `src/domain`: presets, limits, compatibility, types.
- `src/infrastructure`: FFmpeg worker client, worker runtime, telemetry.

## Tech stack

- React + TypeScript + Vite
- FFmpeg.wasm (`@ffmpeg/ffmpeg`, `@ffmpeg/util`)
- Zod for input validation
- Vitest for unit tests
- ESLint + Prettier for code quality

## Security baseline

- MIME + extension + file signature checks
- Max file size limit
- Single active conversion + cooldown
- Timeout and cancellation support
- Worker isolation for conversion
- Minimal telemetry without sensitive media content
- Security headers prepared via `public/_headers`

## UX baseline

- File dropzone + upload
- Preset cards (Potato, VHS, Auto-safe)
- Advanced controls with plain-language helper text
- Progress panel (`aria-live`)
- Output panel + download action
- Sticky bottom action bar (Process/Cancel)

## Deployment and CI/CD

- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Pipeline includes lint, typecheck, test, build
- Deploy target: GitHub Pages (on `main`)
- Vite uses `base: './'` for static hosting compatibility

## Relevant docs

- `README.md`
- `SECURITY.md`
- `docs/stitch-design-notes.md`

## Current status

- MVP implemented and builds successfully.
- Quality checks passing: lint, typecheck, test, build.
- Playwright validation done and design iterated with Stitch.

## Open improvements (next iterations)

- End-to-end test with valid media fixture (full conversion flow)
- More user-friendly "simple mode" sliders (Low/Medium/High)
- Better output preview behavior per media type
- Broader test coverage for validation paths and hooks

## How to keep this file useful

Update this file when any of these change:

- architecture decisions
- security policy
- deployment workflow
- core UX flow
- non-trivial technical trade-offs
