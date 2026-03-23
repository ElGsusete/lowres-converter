import { z } from 'zod'
import { MEDIA_LIMITS } from '../../domain/media/limits'
import type { MediaKind, ValidationResult } from '../../domain/media/types'

const acceptedMimeTypes = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'audio/mpeg',
  'audio/wav',
  'audio/webm',
  'audio/mp4',
])

const acceptedExtensions = ['.mp4', '.webm', '.mov', '.mp3', '.wav', '.m4a']

const fileSchema = z.object({
  size: z.number().positive().max(MEDIA_LIMITS.maxFileSizeBytes),
  type: z.string().min(1),
  name: z.string().min(3),
})

export async function validateInputFile(file: File): Promise<ValidationResult> {
  const parsed = fileSchema.safeParse(file)
  if (!parsed.success) {
    return {
      ok: false,
      reason: `Invalid file input or size exceeded (${MEDIA_LIMITS.maxFileSizeBytes / (1024 * 1024)}MB).`,
    }
  }

  if (!acceptedMimeTypes.has(file.type)) {
    return { ok: false, reason: 'Unsupported MIME type.' }
  }

  const lowerName = file.name.toLowerCase()
  const hasValidExtension = acceptedExtensions.some((extension) => lowerName.endsWith(extension))
  if (!hasValidExtension) {
    return { ok: false, reason: 'Unsupported file extension.' }
  }

  const kind = inferMediaKind(file.type)
  const signatureLooksValid = await matchesKnownHeader(file, kind)
  if (!signatureLooksValid) {
    return { ok: false, reason: 'File signature does not match expected media header.' }
  }

  return { ok: true, kind }
}

function inferMediaKind(mime: string): MediaKind {
  return mime.startsWith('video/') ? 'video' : 'audio'
}

async function matchesKnownHeader(file: File, kind: MediaKind): Promise<boolean> {
  const buffer = await file.slice(0, 16).arrayBuffer()
  const bytes = new Uint8Array(buffer)
  const ascii = String.fromCharCode(...bytes)

  if (kind === 'video') {
    return ascii.includes('ftyp') || ascii.startsWith('\x1A\x45\xDF\xA3')
  }

  const wavHeader = ascii.startsWith('RIFF') && ascii.includes('WAVE')
  const mp3Header = bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0
  const id3Header = ascii.startsWith('ID3')
  return wavHeader || mp3Header || id3Header || ascii.includes('ftyp')
}
