export interface ApiErrorPayload {
  statusCode: number
  exceptionType: string
  message: string
  requestId: string
  traceId: string
  path: string
  timestampUtc: string
  errors: Record<string, string[]> | null
}

export type ApiFieldErrors = Record<string, string[]>
