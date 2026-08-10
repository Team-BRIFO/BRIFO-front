import type { GenericAbortSignal } from 'axios'

import { AXIOS_INSTANCE } from '@/api/client/axiosInstance'
import { signupSession } from '@/api/client/signupSession'

export const SIGNUP_CSRF_QUERY_KEY = ['auth', 'signup', 'csrf'] as const
export const SIGNUP_SESSION_EXPIRED_MESSAGE = 'Signup session expired'

function readSignupCsrfToken(headers: Record<string, unknown>) {
  const value = headers['x-signup-csrf-token'] ?? headers['X-Signup-CSRF-Token']
  return typeof value === 'string' ? value : null
}

export async function ensureSignupCsrfToken(options?: { signal?: GenericAbortSignal }) {
  const response = await AXIOS_INSTANCE.get('/api/auth/signup/csrf', {
    validateStatus: () => true,
    signal: options?.signal,
  })

  if (response.status === 401) {
    throw new Error(SIGNUP_SESSION_EXPIRED_MESSAGE)
  }

  if (response.status < 200 || response.status >= 300) {
    throw new Error('Failed to refresh signup CSRF token')
  }

  const csrfToken = readSignupCsrfToken(response.headers as Record<string, unknown>)
  if (!csrfToken) {
    throw new Error('Missing signup CSRF token')
  }

  signupSession.setCsrfToken(csrfToken)
  return csrfToken
}
