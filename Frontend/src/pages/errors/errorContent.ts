export type ErrorStatus = 400 | 401 | 403 | 404 | 408 | 413 | 429 | 500 | 503 | 'offline' | 'generic'

export interface ErrorContent {
  eyebrow: string
  title: string
  description: string
  canRetry: boolean
}

export const errorContent: Record<ErrorStatus, ErrorContent> = {
  400: {
    eyebrow: 'Something needs attention',
    title: 'We need one detail cleaned up.',
    description: 'Check the information on this page and try once more.',
    canRetry: false,
  },
  401: {
    eyebrow: 'Sign in needed',
    title: 'Your vault is waiting for you.',
    description: 'Sign in again to keep your files private and within reach.',
    canRetry: false,
  },
  403: {
    eyebrow: 'Private area',
    title: "This part of SkyVault isn't yours to open.",
    description: 'You can head back to your own vault from here.',
    canRetry: false,
  },
  404: {
    eyebrow: 'Not found',
    title: "We couldn't find that part of your vault.",
    description: 'It may have moved, been restored somewhere else, or no longer exist.',
    canRetry: false,
  },
  408: {
    eyebrow: 'Taking too long',
    title: 'This is taking longer than expected.',
    description: 'Your files are safe. Try again when the connection settles.',
    canRetry: true,
  },
  413: {
    eyebrow: 'Too large',
    title: 'That file is too large for this request.',
    description: 'Choose a smaller item or return to your vault.',
    canRetry: false,
  },
  429: {
    eyebrow: 'A short pause',
    title: 'Your vault needs a moment.',
    description: 'Wait briefly, then try again.',
    canRetry: true,
  },
  500: {
    eyebrow: 'Something went wrong',
    title: 'Something went wrong on our side.',
    description: 'Your files are safe. Try again in a moment.',
    canRetry: true,
  },
  503: {
    eyebrow: 'Maintenance',
    title: "We're tuning the vault right now.",
    description: 'SkyVault should be back shortly.',
    canRetry: true,
  },
  offline: {
    eyebrow: 'Offline',
    title: "You're offline.",
    description: "We'll reconnect to your vault automatically.",
    canRetry: true,
  },
  generic: {
    eyebrow: 'Unexpected pause',
    title: "We couldn't keep this screen open.",
    description: 'Try again or head back to your vault.',
    canRetry: true,
  },
}
