export const MEDIA_LIMITS = {
  maxFileSizeBytes: 250 * 1024 * 1024,
  maxDurationSeconds: 180,
  maxConcurrentJobs: 1,
  cooldownMs: 2500,
  timeoutMs: 2 * 60 * 1000,
} as const
