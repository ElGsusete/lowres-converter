import { describe, expect, it } from 'vitest'
import { buildFfmpegArgs } from './buildCommand'

describe('buildFfmpegArgs', () => {
  it('creates video args', () => {
    const args = buildFfmpegArgs('in.mp4', 'out.mp4', {
      kind: 'video',
      resolutionHeight: 240,
      fps: 12,
      videoBitrateKbps: 280,
      audioBitrateKbps: 24,
      audioSampleRateHz: 12000,
      audioVolumePercent: 100,
      videoNoise: 0,
      outputExtension: 'mp4',
    })
    expect(args).toContain('-vf')
    expect(args).toContain('scale=-2:240')
  })

  it('creates audio args', () => {
    const args = buildFfmpegArgs('in.wav', 'out.mp3', {
      kind: 'audio',
      resolutionHeight: 0,
      fps: 0,
      videoBitrateKbps: 0,
      audioBitrateKbps: 32,
      audioSampleRateHz: 16000,
      audioVolumePercent: 100,
      videoNoise: 0,
      outputExtension: 'mp3',
    })
    expect(args).toContain('-ac')
    expect(args).toContain('1')
  })

  it('clamps unsafe numeric values to safe ranges', () => {
    const args = buildFfmpegArgs('in.mp4', 'out.mp4', {
      kind: 'video',
      resolutionHeight: 20,
      fps: 1,
      videoBitrateKbps: 0,
      audioBitrateKbps: 1,
      audioSampleRateHz: 100,
      audioVolumePercent: 100,
      videoNoise: 0,
      outputExtension: 'mp4',
    })

    expect(args).toContain('scale=-2:144')
    expect(args).toContain('8')
    expect(args).toContain('120k')
    expect(args).toContain('16k')
    expect(args).toContain('8000')
  })
})
