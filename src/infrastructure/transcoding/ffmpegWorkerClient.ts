import { MEDIA_LIMITS } from '../../domain/media/limits'
import type { TranscodeSettings } from '../../domain/media/types'
import type { WorkerResponseMessage } from './workerTypes'

export interface TranscodeClientCallbacks {
  onProgress: (ratio: number) => void
  onSuccess: (output: Blob, outputName: string) => void
  onError: (message: string) => void
}

export class FfmpegWorkerClient {
  private readonly callbacks: TranscodeClientCallbacks
  private worker: Worker
  private timeoutId: number | null = null

  constructor(callbacks: TranscodeClientCallbacks) {
    this.callbacks = callbacks
    this.worker = new Worker(new URL('./transcode.worker.ts', import.meta.url), { type: 'module' })
    this.worker.onmessage = (event: MessageEvent<WorkerResponseMessage>) => {
      this.handleMessage(event.data)
    }
  }

  async transcode(file: File, settings: TranscodeSettings): Promise<void> {
    const fileBuffer = await file.arrayBuffer()
    this.timeoutId = window.setTimeout(() => {
      this.callbacks.onError('The conversion exceeded timeout and was canceled.')
      this.cancel()
    }, MEDIA_LIMITS.timeoutMs)

    this.worker.postMessage({
      type: 'TRANSCODE',
      payload: {
        fileBuffer,
        fileName: file.name.replace(/\s+/g, '-'),
        settings,
      },
    })
  }

  cancel(): void {
    this.worker.postMessage({ type: 'CANCEL' })
    this.resetTimeout()
  }

  destroy(): void {
    this.cancel()
    this.worker.terminate()
  }

  private handleMessage(message: WorkerResponseMessage): void {
    if (message.type === 'PROGRESS') {
      this.callbacks.onProgress(message.payload.ratio)
      return
    }

    this.resetTimeout()
    if (message.type === 'SUCCESS') {
      const blob = new Blob([message.payload.outputBuffer], { type: message.payload.mimeType })
      this.callbacks.onSuccess(blob, message.payload.outputName)
      return
    }

    this.callbacks.onError(message.payload.message)
  }

  private resetTimeout(): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
}
