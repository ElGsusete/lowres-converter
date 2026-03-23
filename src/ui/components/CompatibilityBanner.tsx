import type { CompatibilityState } from '../../domain/media/fallback'

interface CompatibilityBannerProps {
  compatibility: CompatibilityState
}

export function CompatibilityBanner({ compatibility }: CompatibilityBannerProps) {
  if (compatibility.supported) {
    return <p className="badge">Processed locally in your browser.</p>
  }

  return (
    <div className="warning" role="alert">
      <strong>Compatibility warning</strong>
      <ul>
        {compatibility.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      <p>Try a modern Chromium, Firefox, or Safari version.</p>
    </div>
  )
}
