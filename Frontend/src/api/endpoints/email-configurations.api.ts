import { apiClient } from '@/api/client'
import type {
  CreateEmailConfigurationRequest,
  EmailConfigurationResponse,
  UpdateEmailConfigurationRequest,
} from '@/models/emailConfiguration/EmailConfiguration'

const BASE = '/api/admin/email-configurations'

export const emailConfigurationsApi = {
  getAll: (signal?: AbortSignal) =>
    apiClient.get<EmailConfigurationResponse[]>(BASE, { signal }).then((response) => response.data),
  getById: (emailConfigurationId: string, signal?: AbortSignal) =>
    apiClient
      .get<EmailConfigurationResponse>(`${BASE}/${emailConfigurationId}`, { signal })
      .then((response) => response.data),
  create: (request: CreateEmailConfigurationRequest, signal?: AbortSignal) =>
    apiClient
      .post<EmailConfigurationResponse>(BASE, request, { signal, timeout: 0 })
      .then((response) => response.data),
  update: (
    emailConfigurationId: string,
    request: UpdateEmailConfigurationRequest,
    signal?: AbortSignal,
  ) =>
    apiClient
      .put<EmailConfigurationResponse>(`${BASE}/${emailConfigurationId}`, request, {
        signal,
        timeout: 0,
      })
      .then((response) => response.data),
  activate: (emailConfigurationId: string, signal?: AbortSignal) =>
    apiClient
      .patch<EmailConfigurationResponse>(`${BASE}/${emailConfigurationId}/activate`, undefined, {
        signal,
        timeout: 0,
      })
      .then((response) => response.data),
  deactivate: (emailConfigurationId: string, signal?: AbortSignal) =>
    apiClient
      .patch<EmailConfigurationResponse>(`${BASE}/${emailConfigurationId}/deactivate`, undefined, {
        signal,
        timeout: 0,
      })
      .then((response) => response.data),
  remove: (emailConfigurationId: string, signal?: AbortSignal) =>
    apiClient.delete(`${BASE}/${emailConfigurationId}`, { signal, timeout: 0 }),
}
