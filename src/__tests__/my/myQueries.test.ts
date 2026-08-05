import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ApTransactionPage } from '@/types/domain/ap'
import type { MyGlossaryPage } from '@/types/domain/glossary'

const apiHookMocks = vi.hoisted(() => ({
  useApiInfiniteQuery: vi.fn<(options: unknown) => unknown>(),
  useApiQuery: vi.fn<(options: unknown) => unknown>(),
}))

vi.mock('@/hooks/api', () => apiHookMocks)

import {
  useMyApTransactionsQuery,
  useMyBadgeDetailQuery,
  useMyLearnedTermsQuery,
} from '@/pages/MyPage/hooks/useMyQueries'

interface InfiniteOptions<TPage> {
  endpoint: string
  response: string
  getArgs: (context: { pageParam: string | null }) => unknown
  getNextPageParam: (lastPage: TPage) => string | undefined
}

interface QueryOptions {
  endpoint: string
  response: string
  enabled: boolean
}

describe('My query hook options', () => {
  beforeEach(() => {
    apiHookMocks.useApiInfiniteQuery.mockImplementation((options) => options)
    apiHookMocks.useApiQuery.mockImplementation((options) => options)
  })

  it('passes the generated AP cursor request wrapper and stops without a cursor', () => {
    const options = useMyApTransactionsQuery(15) as unknown as InfiniteOptions<ApTransactionPage>
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    expect(options.endpoint).toBe('getApTransactions')
    expect(options.response).toBe('requiredResult')
    expect(options.getArgs({ pageParam: null })).toEqual([
      { request: { cursor: undefined, size: 15 } },
    ])
    expect(options.getArgs({ pageParam: '1bcbac27-b08b-452e-a88a-3b7a41c1fe54' })).toEqual([
      {
        request: {
          cursor: '1bcbac27-b08b-452e-a88a-3b7a41c1fe54',
          size: 15,
        },
      },
    ])
    expect(
      options.getNextPageParam({
        summary: { balance: 0, earned: 0, lost: 0 },
        items: [],
        nextCursor: null,
        hasNext: true,
      }),
    ).toBeUndefined()
    expect(warn).toHaveBeenCalledWith(
      '[getApTransactions] hasNext is true but nextCursor is missing; stopping pagination.',
    )
    warn.mockRestore()
  })

  it('passes the generated learned-term cursor wrapper and uses a present cursor', () => {
    const options = useMyLearnedTermsQuery(10) as unknown as InfiniteOptions<MyGlossaryPage>
    const nextCursor = '62ef76f1-8d61-49f4-8d1d-75b123c68e1a'

    expect(options.endpoint).toBe('getMyTerms')
    expect(options.response).toBe('requiredResult')
    expect(options.getArgs({ pageParam: nextCursor })).toEqual([
      { request: { cursor: nextCursor, size: 10 } },
    ])
    expect(
      options.getNextPageParam({
        learnedTermCount: 0,
        entries: [],
        nextCursor,
        hasNext: true,
      }),
    ).toBe(nextCursor)
  })

  it('warns and stops learned-term pagination when the next cursor is missing', () => {
    const options = useMyLearnedTermsQuery(10) as unknown as InfiniteOptions<MyGlossaryPage>
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    expect(
      options.getNextPageParam({
        learnedTermCount: 0,
        entries: [],
        nextCursor: null,
        hasNext: true,
      }),
    ).toBeUndefined()
    expect(warn).toHaveBeenCalledWith(
      '[getMyTerms] hasNext is true but nextCursor is missing; stopping pagination.',
    )
    warn.mockRestore()
  })

  it('disables the owned-badge query when badgeId is missing', () => {
    const options = useMyBadgeDetailQuery(null) as unknown as QueryOptions

    expect(options).toMatchObject({
      endpoint: 'getOwnedBadge',
      response: 'requiredResult',
      enabled: false,
    })
  })
})
