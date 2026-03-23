interface OutputPanelProps {
  outputUrl: string | null
  outputName: string | null
  mediaKind: 'audio' | 'video' | null
}

export function OutputPanel({ outputUrl, outputName, mediaKind }: OutputPanelProps) {
  if (!outputUrl || !outputName) {
    return (
      <section className="card">
        <h2>Output</h2>
        <p>No generated media yet.</p>
      </section>
    )
  }

  return (
    <section className="card">
      <h2>Output</h2>
      {mediaKind === 'video' ? <video controls src={outputUrl} /> : <audio controls src={outputUrl} />}
      <a className="button secondary" href={outputUrl} download={outputName}>
        Download result
      </a>
    </section>
  )
}
