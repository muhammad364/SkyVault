export type PreviewKind = 'image' | 'pdf' | 'text' | 'audio' | 'video' | 'unsupported'

const safeRasterTypes = new Set([
  'image/avif',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
])

export function previewKind(type: string): PreviewKind {
  if (safeRasterTypes.has(type)) return 'image'
  if (type === 'application/pdf') return 'pdf'
  if (type === 'text/plain') return 'text'
  if (type.startsWith('audio/')) return 'audio'
  if (type.startsWith('video/')) return 'video'
  return 'unsupported'
}
