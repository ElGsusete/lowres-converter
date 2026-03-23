# Security Checklist

## Application controls

- Validate MIME type, extension, and file signature.
- Enforce maximum file size and one active conversion per session.
- Run FFmpeg in a Web Worker.
- Support cancellation and timeout for long jobs.
- Remove temporary in-memory artifacts after conversion.

## Dependency controls

- Keep lockfile committed.
- Run `npm audit` before release.
- Avoid unnecessary third-party packages.

## Deployment controls

- Enforce HTTPS.
- Configure strict CSP and related headers.
- Disable server-side file upload endpoints for this app model.
- Keep logs free of file names or media content.
