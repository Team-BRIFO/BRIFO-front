import { beforeEach, describe, expect, it, vi } from 'vitest'

const { get } = vi.hoisted(() => ({ get: vi.fn() }))

vi.mock('@/api/client/axiosInstance', () => ({
  AXIOS_INSTANCE: { get },
}))

import { ensureSignupCsrfToken } from '@/api/client/signupAuth'
import { signupSession } from '@/api/client/signupSession'

describe('ensureSignupCsrfToken', () => {
  beforeEach(() => {
    get.mockReset()
    signupSession.clear()
  })

  it('returns the issued token so the React Query bootstrap resolves with data', async () => {
    get.mockResolvedValue({
      status: 200,
      headers: { 'x-signup-csrf-token': 'issued-csrf-token' },
    })

    await expect(ensureSignupCsrfToken()).resolves.toBe('issued-csrf-token')
    expect(signupSession.getCsrfToken()).toBe('issued-csrf-token')
  })
})
