interface ProgressPanelProps {
  ratio: number
  isProcessing: boolean
  currentPass: number
  totalPasses: number
}

export function ProgressPanel({ ratio, isProcessing, currentPass, totalPasses }: ProgressPanelProps) {
  const clampedRatio = Math.min(ratio, 1)
  const overallRatio = totalPasses > 1 ? (currentPass - 1 + clampedRatio) / totalPasses : clampedRatio
  const pct = Math.round(overallRatio * 100)
  const multiPass = totalPasses > 1

  return (
    <section className="card">
      <h2>Progress</h2>
      <div className="progressHeader" aria-live="polite">
        {isProcessing ? (
          <>
            <span>{multiPass ? `Pass ${currentPass}/${totalPasses}` : 'Processing'}</span>
            <span>{pct}%</span>
          </>
        ) : (
          <span>Idle</span>
        )}
      </div>
      <div className="progressTrack" aria-hidden="true">
        <div className="progressFill" style={{ width: `${pct}%` }} />
      </div>
      {multiPass && isProcessing ? (
        <div className="passDots" aria-hidden="true">
          {Array.from({ length: totalPasses }, (_, i) => (
            <span key={i} className={`passDot${i + 1 < currentPass ? ' done' : i + 1 === currentPass ? ' active' : ''}`} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
