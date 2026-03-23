import type { TranscodeSettings } from '../../domain/media/types'

export function buildFfmpegArgs(inputName: string, outputName: string, settings: TranscodeSettings): string[] {
  if (settings.kind === 'audio') {
    return [
      '-i',
      inputName,
      '-b:a',
      `${settings.audioBitrateKbps}k`,
      '-ar',
      String(settings.audioSampleRateHz),
      '-ac',
      '1',
      outputName,
    ]
  }

  return [
    '-i',
    inputName,
    '-vf',
    `scale=-2:${settings.resolutionHeight}`,
    '-r',
    String(settings.fps),
    '-b:v',
    `${settings.videoBitrateKbps}k`,
    '-b:a',
    `${settings.audioBitrateKbps}k`,
    '-ar',
    String(settings.audioSampleRateHz),
    outputName,
  ]
}
