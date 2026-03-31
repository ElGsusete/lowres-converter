# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + Vite production build
npm run typecheck    # TypeScript type check only
npm run lint         # ESLint (zero warnings allowed)
npm run test         # Vitest unit tests with coverage
npm run format       # Prettier format check (read-only)
npm run preview      # Serve production build locally
```

To run a single test file: `npx vitest run src/path/to/file.test.ts`

## Architecture

The project follows Clean Architecture with four layers:

- **`src/domain/media/`** — Core business rules with no external dependencies: types, preset definitions (Potato/VHS/Auto-safe), settings clamping (`audioVolumePercent` 10–400%, `videoNoise` 0–80), file size/duration limits, and browser capability detection.
- **`src/application/`** — Use cases: FFmpeg command building (`buildCommand.ts`) and multi-layer file validation (MIME, extension, magic-bytes signature).
- **`src/infrastructure/`** — External integrations: `ffmpegWorkerClient.ts` (main-thread side) and `transcode.worker.ts` (Web Worker running FFmpeg.wasm). Communication uses typed messages defined in `workerTypes.ts`.
- **`src/ui/`** — React components and the `useConverter` hook, which owns all conversion lifecycle state.

### Conversion flow

1. User selects a file → `fileValidation.ts` validates it → `useConverter` stores it.
2. User picks a preset or adjusts sliders → `presets.ts` + `settings.ts` compute clamped settings.
3. "PROCESS FILE" → `useConverter` calls `FfmpegWorkerClient`, which serializes the file to `ArrayBuffer` and sends a `TRANSCODE` message to the worker.
4. Worker loads FFmpeg.wasm, builds args via `buildCommand.ts`, executes, and streams progress back.
5. Output `Uint8Array` is transferred (zero-copy) back to main thread → Blob URL created → user downloads.

FFmpeg runs entirely in-browser via WebAssembly; no file ever leaves the device.

## Key constraints

- **ESLint**: max file length 220 lines, max cyclomatic complexity 12, zero warnings.
- **TypeScript**: strict mode, no unused vars/params, `noUncheckedSideEffectImports`.
- **Limits** (`domain/media/limits.ts`): 250 MB max file, 180 s max duration, 2-minute worker timeout, 2.5 s cooldown between conversions.
- **Multi-pass degradation**: users pick 1/3/5/10/20× passes from the action bar; each pass re-encodes the previous output. Audio multi-pass routes through WAV intermediates to avoid stacking lossy codecs. State tracked in `useConverter` via `remainingPassesRef` / `totalPassesRef`.
- **`TranscodeSettings`** fields: `audioVolumePercent` (volume, can exceed 100% for clipping distortion), `videoNoise` (FFmpeg `noise` filter, static grain), `outputExtension` now includes `'wav'`.
- CI runs lint → typecheck → test → build before deploying to GitHub Pages.
