import { CompatibilityBanner } from './ui/components/CompatibilityBanner'
import { FileDropzone } from './ui/components/FileDropzone'
import { PresetSelector } from './ui/components/PresetSelector'
import { AdvancedControls } from './ui/components/AdvancedControls'
import { ProgressPanel } from './ui/components/ProgressPanel'
import { OutputPanel } from './ui/components/OutputPanel'
import { getCompatibilityState } from './domain/media/fallback'
import { getPreset } from './domain/media/presets'
import { useConverter } from './ui/hooks/useConverter'
import './ui/styles/app.css'

function App() {
  const compatibility = getCompatibilityState()
  const { state, effectiveSettings, setFile, setPreset, updateCustomSettings, startConversion, cancelConversion } =
    useConverter()
  const displayKind = state.mediaKind ?? 'video'
  const displaySettings = effectiveSettings ?? getPreset(displayKind, state.selectedPreset).settings

  return (
    <main className="layout">
      <header className="header">
        <h1>LowRes Shitpost Converter</h1>
        <CompatibilityBanner compatibility={compatibility} />
      </header>

      <FileDropzone onFileSelected={setFile} />
      <PresetSelector
        mediaKind={displayKind}
        selectedPreset={state.selectedPreset}
        disabled={!state.selectedFile}
        onSelectPreset={setPreset}
      />
      <AdvancedControls settings={displaySettings} disabled={!state.selectedFile} onChange={updateCustomSettings} />
      <ProgressPanel ratio={state.progress} isProcessing={state.isProcessing} />
      <OutputPanel outputUrl={state.outputUrl} outputName={state.outputName} mediaKind={state.mediaKind} />

      {state.error ? (
        <p className="errorText" role="alert">
          {state.error}
        </p>
      ) : null}

      <section className="actionBar" aria-label="Primary conversion actions">
        <div className="actionRow">
        <button className="button secondary" disabled={!state.isProcessing} onClick={cancelConversion} type="button">
          Cancel
        </button>
        <button
          className="button primary"
          disabled={!state.selectedFile || state.isProcessing || !compatibility.supported}
          onClick={() => void startConversion()}
          type="button"
        >
          {state.isProcessing ? 'Processing...' : 'Process file'}
        </button>
        </div>
      </section>
    </main>
  )
}

export default App
