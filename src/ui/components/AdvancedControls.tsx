import type { TranscodeSettings } from '../../domain/media/types'

interface AdvancedControlsProps {
  settings: TranscodeSettings
  disabled?: boolean
  onChange: (settings: TranscodeSettings) => void
}

export function AdvancedControls({ settings, disabled = false, onChange }: AdvancedControlsProps) {
  return (
    <section className="card">
      <h2>Advanced controls</h2>
      {disabled ? <p className="muted">Upload a file to unlock advanced controls.</p> : null}
      <div className="controls">
        {settings.kind === 'video' ? (
          <>
            <label>
              Image quality (resolution)
              <small>Lower values = smaller file size and a more pixelated look.</small>
              <input
                disabled={disabled}
                type="number"
                min={144}
                max={720}
                value={settings.resolutionHeight}
                onChange={(event) =>
                  onChange({ ...settings, resolutionHeight: Number(event.currentTarget.value) })
                }
              />
            </label>
            <label>
              Video smoothness (FPS)
              <small>Lower values = choppier motion for a meme/vintage style.</small>
              <input
                disabled={disabled}
                type="number"
                min={8}
                max={30}
                value={settings.fps}
                onChange={(event) => onChange({ ...settings, fps: Number(event.currentTarget.value) })}
              />
            </label>
            <label>
              Video size and sharpness
              <small>Controls how large the video file is and how clear it looks.</small>
              <input
                disabled={disabled}
                type="number"
                min={120}
                max={1500}
                value={settings.videoBitrateKbps}
                onChange={(event) =>
                  onChange({ ...settings, videoBitrateKbps: Number(event.currentTarget.value) })
                }
              />
            </label>
          </>
        ) : null}

        <label>
          Audio quality
          <small>Lower values = more compressed sound with less detail.</small>
          <input
            disabled={disabled}
            type="number"
            min={16}
            max={192}
            value={settings.audioBitrateKbps}
            onChange={(event) =>
              onChange({ ...settings, audioBitrateKbps: Number(event.currentTarget.value) })
            }
          />
        </label>
        <label>
          Voice and sound clarity
          <small>Lower values = more retro, phone-like audio.</small>
          <input
            disabled={disabled}
            type="number"
            min={8000}
            max={44100}
            value={settings.audioSampleRateHz}
            onChange={(event) =>
              onChange({ ...settings, audioSampleRateHz: Number(event.currentTarget.value) })
            }
          />
        </label>
      </div>
    </section>
  )
}
