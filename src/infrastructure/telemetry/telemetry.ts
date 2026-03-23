interface TelemetryEvent {
  name: string
  timestamp: number
  payload?: Record<string, number | string | boolean>
}

const telemetryEnabled = false

export function recordTelemetry(event: TelemetryEvent): void {
  if (!telemetryEnabled) {
    return
  }
  // Intentionally local-only and minimal to avoid sensitive data collection.
  console.info('[telemetry]', event.name, event.timestamp, event.payload)
}
