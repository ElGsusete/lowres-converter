import type { TranscodeSettings } from './types'

const MIN_VIDEO_RESOLUTION_HEIGHT = 144
const MAX_VIDEO_RESOLUTION_HEIGHT = 720
const MIN_VIDEO_FPS = 8
const MAX_VIDEO_FPS = 30
const MIN_VIDEO_BITRATE_KBPS = 120
const MAX_VIDEO_BITRATE_KBPS = 1500
const MIN_AUDIO_BITRATE_KBPS = 16
const MAX_AUDIO_BITRATE_KBPS = 192
const MIN_AUDIO_SAMPLE_RATE_HZ = 8000
const MAX_AUDIO_SAMPLE_RATE_HZ = 44100

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min
  }
  return Math.min(max, Math.max(min, Math.round(value)))
}

export function normalizeTranscodeSettings(settings: TranscodeSettings): TranscodeSettings {
  if (settings.kind === 'audio') {
    return {
      ...settings,
      resolutionHeight: 0,
      fps: 0,
      videoBitrateKbps: 0,
      audioBitrateKbps: clamp(settings.audioBitrateKbps, MIN_AUDIO_BITRATE_KBPS, MAX_AUDIO_BITRATE_KBPS),
      audioSampleRateHz: clamp(settings.audioSampleRateHz, MIN_AUDIO_SAMPLE_RATE_HZ, MAX_AUDIO_SAMPLE_RATE_HZ),
    }
  }

  return {
    ...settings,
    resolutionHeight: clamp(
      settings.resolutionHeight,
      MIN_VIDEO_RESOLUTION_HEIGHT,
      MAX_VIDEO_RESOLUTION_HEIGHT,
    ),
    fps: clamp(settings.fps, MIN_VIDEO_FPS, MAX_VIDEO_FPS),
    videoBitrateKbps: clamp(settings.videoBitrateKbps, MIN_VIDEO_BITRATE_KBPS, MAX_VIDEO_BITRATE_KBPS),
    audioBitrateKbps: clamp(settings.audioBitrateKbps, MIN_AUDIO_BITRATE_KBPS, MAX_AUDIO_BITRATE_KBPS),
    audioSampleRateHz: clamp(settings.audioSampleRateHz, MIN_AUDIO_SAMPLE_RATE_HZ, MAX_AUDIO_SAMPLE_RATE_HZ),
  }
}
