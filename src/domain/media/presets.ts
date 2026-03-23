import type { MediaKind, PresetDefinition, PresetId, TranscodeSettings } from './types'

const defaultSettingsByKind: Record<MediaKind, TranscodeSettings> = {
  video: {
    kind: 'video',
    resolutionHeight: 360,
    fps: 20,
    videoBitrateKbps: 450,
    audioBitrateKbps: 48,
    audioSampleRateHz: 22050,
    outputExtension: 'mp4',
  },
  audio: {
    kind: 'audio',
    resolutionHeight: 0,
    fps: 0,
    videoBitrateKbps: 0,
    audioBitrateKbps: 32,
    audioSampleRateHz: 16000,
    outputExtension: 'mp3',
  },
}

export const PRESET_IDS: PresetId[] = ['potato', 'vhs', 'autoSafe']

export function getPreset(kind: MediaKind, presetId: PresetId): PresetDefinition {
  if (presetId === 'potato') {
    return {
      id: 'potato',
      label: 'Potato',
      description: 'Ultra low quality for meme output.',
      settings: {
        ...defaultSettingsByKind[kind],
        resolutionHeight: kind === 'video' ? 240 : 0,
        fps: kind === 'video' ? 12 : 0,
        videoBitrateKbps: kind === 'video' ? 280 : 0,
        audioBitrateKbps: 24,
        audioSampleRateHz: 12000,
      },
    }
  }

  if (presetId === 'vhs') {
    return {
      id: 'vhs',
      label: 'VHS',
      description: 'Soft low-fi look with less aggressive compression.',
      settings: {
        ...defaultSettingsByKind[kind],
        resolutionHeight: kind === 'video' ? 480 : 0,
        fps: kind === 'video' ? 24 : 0,
        videoBitrateKbps: kind === 'video' ? 720 : 0,
        audioBitrateKbps: 64,
        audioSampleRateHz: 22050,
      },
    }
  }

  return {
    id: 'autoSafe',
    label: 'Auto-safe',
    description: 'Adaptive preset that avoids browser overload.',
    settings: {
      ...defaultSettingsByKind[kind],
    },
  }
}

export function computeAutoSafeSettings(
  kind: MediaKind,
  fileSizeBytes: number,
  estimatedDurationSeconds = 60,
): TranscodeSettings {
  const heavyFile = fileSizeBytes > 80 * 1024 * 1024 || estimatedDurationSeconds > 90
  if (!heavyFile) {
    return getPreset(kind, 'vhs').settings
  }

  return getPreset(kind, 'potato').settings
}
