import { describe, expect, it } from 'vitest'
import { computeAutoSafeSettings, getPreset } from './presets'

describe('presets', () => {
  it('returns potato preset for video', () => {
    const preset = getPreset('video', 'potato')
    expect(preset.settings.resolutionHeight).toBe(240)
    expect(preset.settings.fps).toBe(12)
  })

  it('auto-safe downgrades heavy files', () => {
    const settings = computeAutoSafeSettings('video', 150 * 1024 * 1024, 120)
    expect(settings.resolutionHeight).toBe(240)
  })
})
