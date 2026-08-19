export class ApiConfigurationError extends Error {
  constructor() {
    super('SkyVault is not configured to reach its service.')
    this.name = 'ApiConfigurationError'
  }
}

const value = import.meta.env.VITE_API_BASE_URL?.trim()

export const appConfig = {
  apiBaseUrl: value || null,
  isApiConfigured: Boolean(value),
} as const
