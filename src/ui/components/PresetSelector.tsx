import { PRESET_IDS, getPreset } from '../../domain/media/presets'
import type { MediaKind, PresetId } from '../../domain/media/types'

interface PresetSelectorProps {
  mediaKind: MediaKind
  selectedPreset: PresetId
  disabled?: boolean
  onSelectPreset: (preset: PresetId) => void
}

export function PresetSelector({
  mediaKind,
  selectedPreset,
  disabled = false,
  onSelectPreset,
}: PresetSelectorProps) {
  return (
    <section className="card">
      <h2>Quality settings</h2>
      {disabled ? <p className="muted">Select a file to enable preset selection.</p> : null}
      <div className="presetList">
        {PRESET_IDS.map((presetId) => {
          const preset = getPreset(mediaKind, presetId)
          return (
            <button
              key={preset.id}
              className={selectedPreset === preset.id ? 'preset active' : 'preset'}
              disabled={disabled}
              onClick={() => onSelectPreset(preset.id)}
              type="button"
            >
              <span className="presetRadio" aria-hidden="true">
                {selectedPreset === preset.id ? '●' : '○'}
              </span>
              <span className="presetText">
                <strong>{preset.label}</strong>
                <small>{preset.description}</small>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
