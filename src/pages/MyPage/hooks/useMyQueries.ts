import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { AP_TRANSACTION_PAGE_SIZE, getApTransactions } from '@/api/ap'
import { getBadges, getMyBadgeDetail } from '@/api/badge'
import { getMyTerms } from '@/api/generated/endpoints/term-controller/term-controller'
import { ApiResponseGetMyTermsResponse } from '@/api/generated/schemas/term-controller'
import { MY_TERMS_PAGE_SIZE } from '@/api/myTerms'
import { useApiInfiniteQuery } from '@/hooks/api'
import {
  mapApTransactionPage,
  mapBadge,
  mapBadgeDetail,
  mapMyGlossaryPage,
} from '@/mappers/myMapper'
import { myQueryKeys } from '@/pages/MyPage/hooks/myQueryKeys'
import type { MyGlossaryPage } from '@/types/domain/glossary'

export function useMyApTransactionsQuery(size: number = AP_TRANSACTION_PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: myQueryKeys.ap(size),
    staleTime: 0,
    queryFn: async ({ pageParam }) =>
      mapApTransactionPage(await getApTransactions(pageParam, size)),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
  })
}

export function useMyBadgesQuery() {
  return useQuery({
    queryKey: myQueryKeys.badges(),
    staleTime: 0,
    queryFn: async () => (await getBadges()).map(mapBadge),
  })
}

export function useMyBadgeDetailQuery(id: string | null) {
  return useQuery({
    queryKey: myQueryKeys.badge(id ?? ''),
    staleTime: 0,
    queryFn: async () => mapBadgeDetail(await getMyBadgeDetail(id!)),
    enabled: Boolean(id),
  })
}

export function useMyLearnedTermsQuery(size: number = MY_TERMS_PAGE_SIZE) {
  return useApiInfiniteQuery<typeof getMyTerms, string | null, 'requiredResult', MyGlossaryPage>({
    queryKey: myQueryKeys.terms(size),
    operation: getMyTerms,
    endpoint: 'getMyTerms',
    responseSchema: ApiResponseGetMyTermsResponse,
    response: 'requiredResult',
    getArgs: ({ pageParam }) => [{ request: { cursor: pageParam ?? undefined, size } }] as const,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map: (result) => mapMyGlossaryPage(result as any), // Type cast due to Orval mismatch with mapper
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    staleTime: 0,
  })
}
