import type { ZodType } from 'zod'

import { normalizeApiError } from '@/api/client/ApiError'

interface ExecuteApiRequestOptions<T> {
  endpoint: string
  request: () => Promise<unknown>
  responseSchema: ZodType<T>
  signal?: AbortSignal
}

export async function executeApiRequest<T>({
  endpoint,
  request,
  responseSchema,
  signal,
}: ExecuteApiRequestOptions<T>): Promise<T> {
  try {
    return responseSchema.parse(await request())
  } catch (cause) {
    throw normalizeApiError({
      endpoint,
      cause,
      signal,
    })
  }
}
