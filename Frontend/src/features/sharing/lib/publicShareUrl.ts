export function extractShareToken(shareUrl: string) {
  try {
    const parsed = new URL(shareUrl, window.location.origin)
    const match = parsed.pathname.match(/\/api\/share\/([^/]+)\/?$/)
    return match ? decodeURIComponent(match[1]) : null
  } catch {
    return null
  }
}

export function publicShareUrl(shareUrl: string, frontendOrigin = window.location.origin) {
  const token = extractShareToken(shareUrl)
  if (!token) return null
  return `${frontendOrigin.replace(/\/$/, '')}/share/${encodeURIComponent(token)}`
}
