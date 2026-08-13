import { beforeEach, describe, expect, it, vi } from 'vitest'

const hookMocks = vi.hoisted(() => ({
  useApiQuery: vi.fn<(options: unknown) => unknown>(),
}))

vi.mock('@/hooks/api', () => hookMocks)

import {
  usePendingPoliciesQuery,
  usePoliciesQuery,
  usePolicyDetailQuery,
} from '@/hooks/queries/policy/usePolicyQueries'

interface QueryOptions {
  endpoint: string
  args: unknown
  enabled: boolean
  queryKey: readonly unknown[]
}

describe('policy query hooks', () => {
  beforeEach(() => {
    hookMocks.useApiQuery.mockImplementation((options) => options)
  })

  it('allows the signed-in settings policy viewer to use the existing generated queries', () => {
    const listOptions = usePoliciesQuery(true) as unknown as QueryOptions
    const detailOptions = usePolicyDetailQuery('policy-id', true) as unknown as QueryOptions
    const pendingOptions = usePendingPoliciesQuery(true) as unknown as QueryOptions

    expect(listOptions).toMatchObject({
      endpoint: 'getPolicies',
      args: [],
      enabled: true,
      queryKey: ['onboarding', 'policies'],
    })
    expect(detailOptions).toMatchObject({
      endpoint: 'getPolicyDetail',
      args: ['policy-id'],
      enabled: true,
      queryKey: ['onboarding', 'policies', 'policy-id'],
    })
    expect(pendingOptions).toMatchObject({
      endpoint: 'getPendingPolicies',
      args: [],
      enabled: true,
      queryKey: ['policies', 'pending'],
    })
  })
})
