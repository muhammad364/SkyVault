import axios from 'axios'
import { appConfig } from '@/app/config'
import { attachApiInterceptors } from '@/api/interceptors'

export const apiClient = axios.create({
  baseURL: appConfig.apiBaseUrl ?? undefined,
  timeout: 15_000,
  headers: { Accept: 'application/json' },
})

attachApiInterceptors(apiClient)
