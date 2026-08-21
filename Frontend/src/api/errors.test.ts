import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
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

  it('recognizes the PascalCase global-exception contract and maps known auth failures', () => {
    const config = { headers: new axios.AxiosHeaders() } as InternalAxiosRequestConfig
    const response: AxiosResponse = {
      config,
      data: {
        StatusCode: 401,
        ExceptionType: 'UnauthorizedAccessException',
        Message: 'Please verify your email before logging in.',
        RequestId: 'request-1',
        TraceId: 'trace-1',
        Path: '/api/auth/login',
        TimestampUtc: new Date().toISOString(),
        Errors: null,
      },
      headers: {},
      status: 401,
      statusText: 'Unauthorized',
    }
    const normalized = normalizeApiError(
      new axios.AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, response),
    )

    expect(normalized).toMatchObject({
      status: 401,
      code: 'email_not_verified',
      traceId: 'trace-1',
    })
  })

  it('maps known storage failures without exposing raw exception copy', () => {
    const config = { headers: new axios.AxiosHeaders() } as InternalAxiosRequestConfig
    const response: AxiosResponse = {
      config,
      data: {
        statusCode: 400,
        exceptionType: 'InvalidOperationException',
        message:
          'The selected storage plan and your existing additional storage do not provide enough capacity for your current storage usage.',
        requestId: 'request-2',
        traceId: 'trace-2',
        path: '/api/subscriptions',
        timestampUtc: new Date().toISOString(),
        errors: null,
      },
      headers: {},
      status: 400,
      statusText: 'Bad Request',
    }

    const normalized = normalizeApiError(
      new axios.AxiosError('Bad Request', 'ERR_BAD_REQUEST', config, undefined, response),
    )

    expect(normalized).toMatchObject({
      status: 400,
      code: 'plan_allocation_too_small',
      message: 'Some details need your attention.',
    })
  })
})
