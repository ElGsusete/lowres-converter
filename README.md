# LowRes Shitpost Converter

Browser-only media degradation app (audio/video) designed for privacy and low operational risk.

## Core principles

- Local processing only: media does not leave the browser.
- Security-first defaults: type/signature checks, file-size limits, timeout, cancellation.
- Modular architecture: `ui`, `application`, `domain`, `infrastructure`.
- Maintainable code: strict TypeScript, ESLint, Prettier, tests.

## Stack

- React + TypeScript + Vite
- FFmpeg.wasm in a dedicated Web Worker
- Zod for validation
- Vitest for tests

## Scripts

- `npm run dev` - run local development server
- `npm run build` - typecheck and production build
- `npm run typecheck` - TypeScript project checks
- `npm run lint` - ESLint checks
- `npm run test` - run unit tests with coverage
- `npm run format` - Prettier formatting check

## Local run

1. `npm install`
2. `npm run dev`
3. Open the local URL from Vite in your browser.

## CI/CD (GitHub Actions)

This repository includes a workflow at `.github/workflows/deploy.yml`:

- Runs on pushes to `main`, pull requests to `main`, and manual dispatch.
- Executes `lint`, `typecheck`, `test`, and `build`.
- Deploys `dist/` to GitHub Pages on non-PR runs.

### Enable deployment

1. Push the repository to GitHub.
2. In repo settings, enable **Pages** and set source to **GitHub Actions**.
3. Push to `main` to trigger the first deploy.

## Production hosting notes

- Vite `base` is set to `./` in `vite.config.ts` for static hosting compatibility.
- Security headers are defined in `public/_headers` (provider support may vary).
- HTTPS is required in production.

## Security notes

- Do not add third-party trackers/ad scripts.
- Keep `npm audit` clean.
- Use strict CSP and security headers in production hosting.
- See `SECURITY.md` for release checklist.
