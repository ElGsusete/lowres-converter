# LowRes Shitpost Converter

## LIVE APP

# **USE IT HERE: [https://elgsusete.github.io/lowres-converter/](https://elgsusete.github.io/lowres-converter/)**

Browser-based audio/video quality degrader focused on privacy, safety, and reproducible output.

## What it does

- Converts audio and video directly in your browser.
- Lets you reduce resolution, frame rate, bitrate, and sample rate.
- Applies low-fi presets (`Potato`, `VHS`, `Auto-safe`) or custom controls.
- Exports compressed output without uploading your files to a server.

## Core principles

- Local-only processing: media never leaves your device.
- Secure defaults: type/signature checks, file-size limits, timeout, and cancellation.
- Modular architecture: `ui`, `application`, `domain`, `infrastructure`.
- Maintainable code: strict TypeScript, ESLint, Prettier, and tests.

## Tech stack

- React + TypeScript + Vite
- FFmpeg.wasm in a dedicated Web Worker
- Zod for validation
- Vitest for tests

## Scripts

- `npm run dev` - start local development server
- `npm run build` - run typecheck and production build
- `npm run typecheck` - run TypeScript checks
- `npm run lint` - run ESLint
- `npm run test` - run unit tests with coverage
- `npm run format` - run Prettier formatting check

## Run locally

1. `npm install`
2. `npm run dev`
3. Open the local Vite URL in your browser.

## CI/CD (GitHub Actions)

The workflow at `.github/workflows/deploy.yml`:

- Runs on pushes to `main`, pull requests to `main`, and manual dispatch.
- Executes `lint`, `typecheck`, `test`, and `build`.
- Uploads `dist/` and deploys to GitHub Pages on non-PR runs.

### Enable GitHub Pages deployment

1. Push this repository to GitHub.
2. Go to **Settings -> Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` to trigger deployment.

## Production notes

- Vite `base` is `./` in `vite.config.ts` for static hosting compatibility.
- Security headers are defined in `public/_headers` (provider support may vary).
- HTTPS is required in production.

## Security notes

- Do not add third-party trackers or ad scripts.
- Keep dependencies and `npm audit` clean.
- Use strict CSP and security headers in production hosting.
- See `SECURITY.md` for release checklist details.
