export class ApiConfigurationError extends Error {
  constructor() {
    super('SkyVault is not configured to reach its service.')
    this.name = 'ApiConfigurationError'
  }
}

const value = import.meta.env.VITE_API_BASE_URL?.trim()
const recommendedStoragePlanId = import.meta.env.VITE_RECOMMENDED_STORAGE_PLAN_ID?.trim()

export const appConfig = {
  apiBaseUrl: value || null,
  isApiConfigured: Boolean(value),
  recommendedStoragePlanId: recommendedStoragePlanId || null,
} as const
