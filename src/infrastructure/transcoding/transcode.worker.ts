/// <reference lib="webworker" />
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { buildFfmpegArgs } from '../../application/transcoding/buildCommand'
import type { WorkerRequestMessage, WorkerResponseMessage } from './workerTypes'

const ffmpeg = new FFmpeg()
let abortRequested = false

const worker = self as unknown as Worker

async function ensureLoaded(): Promise<void> {
  if (!ffmpeg.loaded) {
    await ffmpeg.load()
  }
}

worker.onmessage = async (event: MessageEvent<WorkerRequestMessage>) => {
  if (event.data.type === 'CANCEL') {
    abortRequested = true
    return
  }

  try {
    abortRequested = false
    await ensureLoaded()

    const { fileBuffer, fileName, settings } = event.data.payload
    const inputName = `input-${Date.now()}-${fileName}`
    const outputName = `output-${Date.now()}.${settings.outputExtension}`
    const args = buildFfmpegArgs(inputName, outputName, settings)

    ffmpeg.on('progress', ({ progress }) => {
      const message: WorkerResponseMessage = { type: 'PROGRESS', payload: { ratio: progress } }
      worker.postMessage(message)
      if (abortRequested) {
        throw new Error('Conversion canceled by user.')
      }
    })

    await ffmpeg.writeFile(inputName, await fetchFile(new Blob([fileBuffer])))
    await ffmpeg.exec(args)

    const outputFile = await ffmpeg.readFile(outputName)
    if (!(outputFile instanceof Uint8Array)) {
      throw new Error('Unexpected output from FFmpeg.')
    }
    const outputBuffer = outputFile.slice().buffer

    await ffmpeg.deleteFile(inputName)
    await ffmpeg.deleteFile(outputName)

    const mimeType = settings.kind === 'audio' ? 'audio/mpeg' : 'video/mp4'
    const success: WorkerResponseMessage = {
      type: 'SUCCESS',
      payload: { outputBuffer, outputName, mimeType },
    }
    worker.postMessage(success, [outputBuffer])
  } catch (error) {
    const message: WorkerResponseMessage = {
      type: 'ERROR',
      payload: { message: error instanceof Error ? error.message : 'Unexpected transcoding error.' },
    }
    worker.postMessage(message)
  }
}
