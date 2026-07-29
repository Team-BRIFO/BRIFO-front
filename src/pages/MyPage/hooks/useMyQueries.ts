import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { AP_TRANSACTION_PAGE_SIZE, getApTransactions } from '@/api/ap'
import { getBadges, getMyBadgeDetail } from '@/api/badge'
import { getMyLearnedTerms, MY_TERMS_PAGE_SIZE } from '@/api/myTerms'
import {
  mapApTransactionPage,
  mapBadge,
  mapBadgeDetail,
  mapMyGlossaryPage,
} from '@/mappers/myMapper'
import { myQueryKeys } from '@/pages/MyPage/hooks/myQueryKeys'

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
  return useInfiniteQuery({
    queryKey: myQueryKeys.terms(size),
    staleTime: 0,
    queryFn: async ({ pageParam }) => mapMyGlossaryPage(await getMyLearnedTerms(pageParam, size)),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
  })
}
