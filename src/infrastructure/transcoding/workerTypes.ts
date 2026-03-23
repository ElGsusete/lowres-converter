import type { TranscodeSettings } from '../../domain/media/types'

export interface TranscodeRequestMessage {
  type: 'TRANSCODE'
  payload: {
    fileBuffer: ArrayBuffer
    fileName: string
    settings: TranscodeSettings
  }
}

export interface CancelRequestMessage {
  type: 'CANCEL'
}

export type WorkerRequestMessage = TranscodeRequestMessage | CancelRequestMessage

export interface ProgressMessage {
  type: 'PROGRESS'
  payload: { ratio: number }
}

export interface SuccessMessage {
  type: 'SUCCESS'
  payload: { outputBuffer: ArrayBuffer; outputName: string; mimeType: string }
}

export interface ErrorMessage {
  type: 'ERROR'
  payload: { message: string }
}

export type WorkerResponseMessage = ProgressMessage | SuccessMessage | ErrorMessage
