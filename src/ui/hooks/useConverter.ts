import { useEffect, useMemo, useRef, useState } from 'react'
import { computeAutoSafeSettings, getPreset } from '../../domain/media/presets'
import type { MediaKind, PresetId, TranscodeSettings } from '../../domain/media/types'
import { validateInputFile } from '../../application/validation/fileValidation'
import { FfmpegWorkerClient } from '../../infrastructure/transcoding/ffmpegWorkerClient'
import { MEDIA_LIMITS } from '../../domain/media/limits'
import { recordTelemetry } from '../../infrastructure/telemetry/telemetry'
import { normalizeTranscodeSettings } from '../../domain/media/settings'

interface ConverterState {
  selectedFile: File | null
  selectedPreset: PresetId
  customSettings: TranscodeSettings | null
  error: string | null
  progress: number
  outputUrl: string | null
  outputName: string | null
  isProcessing: boolean
  mediaKind: MediaKind | null
}

const initialState: ConverterState = {
  selectedFile: null,
  selectedPreset: 'autoSafe',
  customSettings: null,
  error: null,
  progress: 0,
  outputUrl: null,
  outputName: null,
  isProcessing: false,
  mediaKind: null,
}

export function useConverter() {
  const [state, setState] = useState<ConverterState>(initialState)
  const lastRunRef = useRef<number>(0)
  const clientRef = useRef<FfmpegWorkerClient | null>(null)

  useEffect(() => {
    clientRef.current = new FfmpegWorkerClient({
      onProgress: (ratio) => setState((prev) => ({ ...prev, progress: ratio })),
      onSuccess: (output, outputName) => {
        const outputUrl = URL.createObjectURL(output)
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          outputUrl,
          outputName,
          progress: 1,
        }))
        recordTelemetry({ name: 'conversion_success', timestamp: Date.now() })
      },
      onError: (message) => {
        setState((prev) => ({ ...prev, isProcessing: false, error: message }))
        recordTelemetry({ name: 'conversion_error', timestamp: Date.now(), payload: { message } })
      },
    })

    return () => {
      clientRef.current?.destroy()
    }
  }, [])

  const effectiveSettings = useMemo(() => {
    if (!state.mediaKind) {
      return null
    }
    if (state.customSettings) {
      return state.customSettings
    }
    if (state.selectedPreset === 'autoSafe' && state.selectedFile) {
      return computeAutoSafeSettings(state.mediaKind, state.selectedFile.size)
    }
    return getPreset(state.mediaKind, state.selectedPreset).settings
  }, [state.customSettings, state.mediaKind, state.selectedFile, state.selectedPreset])

  async function setFile(file: File): Promise<void> {
    const validation = await validateInputFile(file)
    if (!validation.ok || !validation.kind) {
      setState((prev) => ({ ...prev, error: validation.reason ?? 'Invalid media file.' }))
      return
    }
    setState((prev) => ({
      ...prev,
      selectedFile: file,
      mediaKind: validation.kind ?? null,
      error: null,
      outputUrl: null,
      outputName: null,
    }))
  }

  function setPreset(preset: PresetId): void {
    setState((prev) => ({ ...prev, selectedPreset: preset, customSettings: null }))
  }

  function updateCustomSettings(settings: TranscodeSettings): void {
    setState((prev) => ({ ...prev, customSettings: normalizeTranscodeSettings(settings) }))
  }

  async function startConversion(): Promise<void> {
    const now = Date.now()
    if (now - lastRunRef.current < MEDIA_LIMITS.cooldownMs) {
      setState((prev) => ({ ...prev, error: 'Please wait a moment before converting again.' }))
      return
    }
    lastRunRef.current = now

    if (!state.selectedFile || !effectiveSettings) {
      setState((prev) => ({ ...prev, error: 'Select a valid file first.' }))
      return
    }

    setState((prev) => ({ ...prev, isProcessing: true, error: null, progress: 0 }))
    recordTelemetry({ name: 'conversion_started', timestamp: now })
    await clientRef.current?.transcode(state.selectedFile, effectiveSettings)
  }

  function cancelConversion(): void {
    clientRef.current?.cancel()
    setState((prev) => ({ ...prev, isProcessing: false, error: 'Conversion canceled.' }))
  }

  return {
    state,
    effectiveSettings,
    setFile,
    setPreset,
    updateCustomSettings,
    startConversion,
    cancelConversion,
  }
}
