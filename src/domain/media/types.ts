export type MediaKind = 'audio' | 'video'

export type PresetId = 'potato' | 'vhs' | 'autoSafe'

export interface TranscodeSettings {
  kind: MediaKind
  resolutionHeight: number
  fps: number
  videoBitrateKbps: number
  audioBitrateKbps: number
  audioSampleRateHz: number
  audioVolumePercent: number
  videoNoise: number
  outputExtension: 'mp4' | 'webm' | 'mp3' | 'wav'
}

export interface PresetDefinition {
  id: PresetId
  label: string
  description: string
  settings: TranscodeSettings
}

export interface ValidationResult {
  ok: boolean
  reason?: string
  kind?: MediaKind
}

export interface ConversionMetrics {
  startedAt: number
  endedAt: number
  durationMs: number
}
