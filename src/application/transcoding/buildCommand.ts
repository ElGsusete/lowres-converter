import type { TranscodeSettings } from '../../domain/media/types'
import { normalizeTranscodeSettings } from '../../domain/media/settings'

export function buildFfmpegArgs(inputName: string, outputName: string, settings: TranscodeSettings): string[] {
  const s = normalizeTranscodeSettings(settings)
  const volumeFilter = `volume=${(s.audioVolumePercent / 100).toFixed(2)}`

  if (s.kind === 'audio') {
    const args = ['-i', inputName, '-af', volumeFilter]
    if (s.outputExtension !== 'wav') {
      args.push('-b:a', `${s.audioBitrateKbps}k`)
    }
    args.push('-ar', String(s.audioSampleRateHz), '-ac', '1', outputName)
    return args
  }

  const videoFilters = [`scale=-2:${s.resolutionHeight}`]
  if (s.videoNoise > 0) {
    videoFilters.push(`noise=alls=${s.videoNoise}:allf=t+u`)
  }

  return [
    '-i', inputName,
    '-vf', videoFilters.join(','),
    '-r', String(s.fps),
    '-b:v', `${s.videoBitrateKbps}k`,
    '-af', volumeFilter,
    '-b:a', `${s.audioBitrateKbps}k`,
    '-ar', String(s.audioSampleRateHz),
    outputName,
  ]
}
