export interface CompatibilityState {
  supported: boolean
  reasons: string[]
}

export function getCompatibilityState(): CompatibilityState {
  const reasons: string[] = []

  if (typeof window === 'undefined') {
    reasons.push('No browser environment found.')
  }
  if (typeof Worker === 'undefined') {
    reasons.push('Web Workers are not supported.')
  }
  if (typeof WebAssembly === 'undefined') {
    reasons.push('WebAssembly is not supported.')
  }
  if (typeof URL === 'undefined' || typeof URL.createObjectURL === 'undefined') {
    reasons.push('Blob URL API is not supported.')
  }

  return { supported: reasons.length === 0, reasons }
}
