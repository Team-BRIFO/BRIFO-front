import { beforeEach, describe, expect, it, vi } from 'vitest'

const hookMocks = vi.hoisted(() => ({
  clear: vi.fn(),
  invalidateQueries: vi.fn(),
  useApiMutation: vi.fn<(options: unknown) => unknown>(),
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQueryClient: () => ({
    clear: hookMocks.clear,
    invalidateQueries: hookMocks.invalidateQueries,
  }),
}))

vi.mock('@/hooks/api', () => ({
  useApiMutation: hookMocks.useApiMutation,
}))

import { useDeleteMyAccountMutation } from '@/pages/MyPage/hooks/useDeleteMyAccountMutation'
import { useUpdateMyProfileMutation } from '@/pages/MyPage/hooks/useUpdateMyProfileMutation'

interface MutationOptions {
  endpoint: string
  response?: string
  getArgs: (variables?: unknown) => unknown
  onSuccess?: () => unknown
}

describe('My mutation hook effects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hookMocks.useApiMutation.mockImplementation((options) => options)
  })

  it('invalidates only the shared profile key after profile update', async () => {
    const options = useUpdateMyProfileMutation() as unknown as MutationOptions

    expect(options.endpoint).toBe('updateUserProfile')
    expect(options).not.toHaveProperty('response')
    expect(
      options.getArgs({
        nickname: '  브리포  ',
        companyName: '  브리포 투자사  ',
        interestStocks: [{ id: '51f6a481-3a4f-4f74-b5b7-2f7f6a0d8c31', name: '삼성전자' }],
      }),
    ).toEqual([
      {
        nickname: '브리포',
        companyName: '브리포 투자사',
        stockIds: ['51f6a481-3a4f-4f74-b5b7-2f7f6a0d8c31'],
      },
    ])

    await options.onSuccess?.()

    expect(hookMocks.invalidateQueries).toHaveBeenCalledOnce()
    expect(hookMocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['user', 'profile'] })
    expect(hookMocks.clear).not.toHaveBeenCalled()
  })

  it('clears the query cache after account deletion', async () => {
    const options = useDeleteMyAccountMutation() as unknown as MutationOptions

    expect(options.endpoint).toBe('deleteUser')
    expect(options).not.toHaveProperty('response')
    expect(options.getArgs()).toEqual([])

    await options.onSuccess?.()

    expect(hookMocks.clear).toHaveBeenCalledOnce()
    expect(hookMocks.invalidateQueries).not.toHaveBeenCalled()
  })
})
