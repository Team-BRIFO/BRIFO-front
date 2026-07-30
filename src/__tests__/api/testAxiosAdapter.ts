import {
  type AxiosAdapter,
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type RawAxiosHeaders,
  type RawAxiosResponseHeaders,
} from 'axios'
import { vi } from 'vitest'

interface AdapterReply {
  data: unknown
  status?: number
  headers?: RawAxiosResponseHeaders
}

type AdapterHandler = (config: InternalAxiosRequestConfig) => AdapterReply | Promise<AdapterReply>

export function createAxiosAdapter(handler: AdapterHandler) {
  return vi.fn<AxiosAdapter>(async (config) => {
    const reply = await handler(config)
    const status = reply.status ?? 200
    const response: AxiosResponse = {
      data: reply.data,
      status,
      statusText: String(status),
      headers: AxiosHeaders.from(reply.headers as unknown as RawAxiosHeaders),
      config,
      request: {},
    }
    const validateStatus = config.validateStatus ?? ((value: number) => value >= 200 && value < 300)

    if (validateStatus(status)) return response

    throw new AxiosError(
      `Request failed with status code ${status}`,
      status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
      config,
      {},
      response,
    )
  })
}
