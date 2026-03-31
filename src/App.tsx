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

const PASS_OPTIONS = [1, 3, 5, 10, 20] as const

interface ActionBarProps {
  outputUrl: string | null
  outputName: string | null
  isProcessing: boolean
  canProcess: boolean
  passes: number
  onSetPasses: (n: number) => void
  onCancel: () => void
  onProcess: () => void
}

function ActionBar({ outputUrl, outputName, isProcessing, canProcess, passes, onSetPasses, onCancel, onProcess }: ActionBarProps) {
  return (
    <section className="actionBar" aria-label="Primary conversion actions">
      <div className="passesRow">
        <span className="passesLabel">Degradation passes:</span>
        {PASS_OPTIONS.map((n) => (
          <button
            key={n}
            type="button"
            className={`button secondary passBtn${passes === n ? ' active' : ''}`}
            disabled={isProcessing}
            onClick={() => { onSetPasses(n) }}
          >
            {n}×
          </button>
        ))}
      </div>
      <div className="actionRow">
        {outputUrl && outputName ? (
          <a className="button secondary" href={outputUrl} download={outputName}>
            Download
          </a>
        ) : (
          <button className="button secondary" disabled type="button">
            Download
          </button>
        )}
        <button className="button secondary" disabled={!isProcessing} onClick={onCancel} type="button">
          Cancel
        </button>
        <button className="button primary" disabled={!canProcess} onClick={onProcess} type="button">
          {isProcessing ? 'Processing...' : 'PROCESS FILE'}
        </button>
      </div>
    </section>
  )
}

function App() {
  const compatibility = getCompatibilityState()
  const { state, effectiveSettings, setFile, setPreset, updateCustomSettings, setPasses, startConversion, cancelConversion } =
    useConverter()
  const displayKind = state.mediaKind ?? 'video'
  const displaySettings = effectiveSettings ?? getPreset(displayKind, state.selectedPreset).settings
  const statusText = state.isProcessing
    ? 'Working...'
    : state.selectedFile
      ? `Loaded: ${state.selectedFile.name}`
      : 'Ready - no file loaded'
  const canProcess = Boolean(state.selectedFile) && !state.isProcessing && compatibility.supported

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
              <FileDropzone onFileSelected={setFile} selectedFileName={state.selectedFile?.name ?? null} />
              <PresetSelector
                mediaKind={displayKind}
                selectedPreset={state.selectedPreset}
                disabled={!state.selectedFile}
                onSelectPreset={setPreset}
              />
            </section>
            <AdvancedControls settings={displaySettings} disabled={!state.selectedFile} onChange={updateCustomSettings} />
            <ProgressPanel ratio={state.progress} isProcessing={state.isProcessing} currentPass={state.currentPass} totalPasses={state.passes} />
            <OutputPanel outputUrl={state.outputUrl} outputName={state.outputName} mediaKind={state.mediaKind} />
            <CompatibilityBanner compatibility={compatibility} />

            {state.error ? (
              <p className="errorText" role="alert">
                {state.error}
              </p>
            ) : null}
          </section>

          <ActionBar
            outputUrl={state.outputUrl}
            outputName={state.outputName}
            isProcessing={state.isProcessing}
            canProcess={canProcess}
            passes={state.passes}
            onSetPasses={setPasses}
            onCancel={cancelConversion}
            onProcess={() => void startConversion()}
          />

          <footer className="statusBar">
            <span>{statusText}</span>
          </footer>
        </section>
      </div>
    </main>
  )
}

export default App
