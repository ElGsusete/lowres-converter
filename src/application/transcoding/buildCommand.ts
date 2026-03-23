import type { TranscodeSettings } from '../../domain/media/types'
import { normalizeTranscodeSettings } from '../../domain/media/settings'

export function buildFfmpegArgs(inputName: string, outputName: string, settings: TranscodeSettings): string[] {
  const safeSettings = normalizeTranscodeSettings(settings)

  if (safeSettings.kind === 'audio') {
    return [
      '-i',
      inputName,
      '-b:a',
      `${safeSettings.audioBitrateKbps}k`,
      '-ar',
      String(safeSettings.audioSampleRateHz),
      '-ac',
      '1',
      outputName,
    ]
  }

  return [
    '-i',
    inputName,
    '-vf',
    `scale=-2:${safeSettings.resolutionHeight}`,
    '-r',
    String(safeSettings.fps),
    '-b:v',
    `${safeSettings.videoBitrateKbps}k`,
    '-b:a',
    `${safeSettings.audioBitrateKbps}k`,
    '-ar',
    String(safeSettings.audioSampleRateHz),
    outputName,
  ]
}
