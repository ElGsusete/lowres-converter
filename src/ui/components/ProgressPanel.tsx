interface ProgressPanelProps {
  ratio: number
  isProcessing: boolean
}

export function ProgressPanel({ ratio, isProcessing }: ProgressPanelProps) {
  return (
    <section className="card">
      <h2>Progress</h2>
      <p aria-live="polite">{isProcessing ? `Processing: ${Math.round(ratio * 100)}%` : 'Idle'}</p>
      <div className="progressTrack" aria-hidden="true">
        <div className="progressFill" style={{ width: `${Math.round(ratio * 100)}%` }} />
      </div>
    </section>
  )
}
