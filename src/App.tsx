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
    <main className="desktop">
      <div className="aquaPanel">
        <section className="window95" aria-label="LowRes converter window">
          <header className="windowBar">
            <span className="windowTitle">LowRes Shitpost Converter</span>
            <span className="windowButtons" aria-hidden="true">
              <i className="winBtn">_</i>
              <i className="winBtn">□</i>
              <i className="winBtn">✕</i>
            </span>
          </header>

          <nav className="menuBar" aria-label="Window menu">
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Help</span>
          </nav>

          <section className="layout">
            <section className="topRow">
              <FileDropzone onFileSelected={setFile} />
              <PresetSelector
                mediaKind={displayKind}
                selectedPreset={state.selectedPreset}
                disabled={!state.selectedFile}
                onSelectPreset={setPreset}
              />
            </section>
            <AdvancedControls settings={displaySettings} disabled={!state.selectedFile} onChange={updateCustomSettings} />
            <ProgressPanel ratio={state.progress} isProcessing={state.isProcessing} />
            <OutputPanel outputUrl={state.outputUrl} outputName={state.outputName} mediaKind={state.mediaKind} />
            <CompatibilityBanner compatibility={compatibility} />

            {state.error ? (
              <p className="errorText" role="alert">
                {state.error}
              </p>
            ) : null}
          </section>

          <section className="actionBar" aria-label="Primary conversion actions">
            <div className="actionRow">
              {state.outputUrl && state.outputName ? (
                <a className="button secondary" href={state.outputUrl} download={state.outputName}>
                  Download
                </a>
              ) : (
                <button className="button secondary" disabled type="button">
                  Download
                </button>
              )}
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

          <footer className="statusBar">
            <span>{state.isProcessing ? 'Working...' : 'Ready'}</span>
          </footer>
        </section>
      </div>
    </main>
  )
}

export default App
