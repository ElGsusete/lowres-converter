import type { TranscodeSettings } from '../../domain/media/types'

interface AdvancedControlsProps {
  settings: TranscodeSettings
  disabled?: boolean
  onChange: (settings: TranscodeSettings) => void
}

interface NumericSliderControlProps {
  label: string
  helpText: string
  disabled: boolean
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
}

function NumericSliderControl({
  label,
  helpText,
  disabled,
  min,
  max,
  step = 1,
  value,
  onChange,
}: NumericSliderControlProps) {
  return (
    <label className="controlField">
      {label}
      <small>{helpText}</small>
      <div className="sliderRow">
        <input
          className="sliderInput"
          disabled={disabled}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.currentTarget.value))}
        />
        <input
          className="numberInput"
          disabled={disabled}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.currentTarget.value))}
        />
      </div>
    </label>
  )
}

export function AdvancedControls({ settings, disabled = false, onChange }: AdvancedControlsProps) {
  return (
    <section className="card">
      <h2>Advanced controls</h2>
      {disabled ? <p className="muted">Upload a file to unlock advanced controls.</p> : null}
      <div className="controls">
        {settings.kind === 'video' ? (
          <>
            <NumericSliderControl
              label="Image quality (resolution)"
              helpText="Lower values = smaller file size and a more pixelated look."
              disabled={disabled}
              min={144}
              max={720}
              value={settings.resolutionHeight}
              onChange={(resolutionHeight) => onChange({ ...settings, resolutionHeight })}
            />
            <NumericSliderControl
              label="Video smoothness (FPS)"
              helpText="Lower values = choppier motion for a meme/vintage style."
              disabled={disabled}
              min={8}
              max={30}
              value={settings.fps}
              onChange={(fps) => onChange({ ...settings, fps })}
            />
            <NumericSliderControl
              label="Video size and sharpness"
              helpText="Controls how large the video file is and how clear it looks."
              disabled={disabled}
              min={120}
              max={1500}
              value={settings.videoBitrateKbps}
              onChange={(videoBitrateKbps) => onChange({ ...settings, videoBitrateKbps })}
            />
          </>
        ) : null}

        <NumericSliderControl
          label="Audio quality"
          helpText="Lower values = more compressed sound with less detail."
          disabled={disabled}
          min={16}
          max={192}
          value={settings.audioBitrateKbps}
          onChange={(audioBitrateKbps) => onChange({ ...settings, audioBitrateKbps })}
        />
        <NumericSliderControl
          label="Voice and sound clarity"
          helpText="Lower values = more retro, phone-like audio."
          disabled={disabled}
          min={8000}
          max={44100}
          step={50}
          value={settings.audioSampleRateHz}
          onChange={(audioSampleRateHz) => onChange({ ...settings, audioSampleRateHz })}
        />
        <NumericSliderControl
          label="Audio volume (%)"
          helpText="Above 100% the audio clips and distorts."
          disabled={disabled}
          min={10}
          max={400}
          value={settings.audioVolumePercent}
          onChange={(audioVolumePercent) => onChange({ ...settings, audioVolumePercent })}
        />
        {settings.kind === 'video' ? (
          <NumericSliderControl
            label="Video noise"
            helpText="Adds static grain. Higher values = more visual corruption."
            disabled={disabled}
            min={0}
            max={80}
            value={settings.videoNoise}
            onChange={(videoNoise) => onChange({ ...settings, videoNoise })}
          />
        ) : null}
      </div>
    </section>
  )
}
