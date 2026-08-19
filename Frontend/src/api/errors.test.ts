import axios from 'axios'
import { describe, expect, it } from 'vitest'
import { ApiError, normalizeApiError, RequestCancelledError } from '@/api/errors'

describe('normalizeApiError', () => {
  it('keeps cancellation separate from application errors', () => {
    expect(normalizeApiError(new axios.CanceledError())).toBeInstanceOf(RequestCancelledError)
  })

  it('maps Axios timeouts to the timeout UX category', () => {
    const error = new axios.AxiosError('timeout', 'ECONNABORTED')
    const normalized = normalizeApiError(error)
    expect(normalized).toBeInstanceOf(ApiError)
    expect((normalized as ApiError).status).toBe(408)
  })
})
