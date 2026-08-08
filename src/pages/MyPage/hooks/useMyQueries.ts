import { ApTransactionsResponseSchema } from '@/api/contracts/ap'
import { MyTermsResponseSchema } from '@/api/contracts/terms'
import { getApTransactions } from '@/api/generated/endpoints/ap-controller/ap-controller'
import {
  getBadges,
  getOwnedBadge,
} from '@/api/generated/endpoints/badge-controller/badge-controller'
import { getMyTerms } from '@/api/generated/endpoints/term-controller/term-controller'
import { type GetApTransactionsParams } from '@/api/generated/schemas/ap-controller'
import {
  ApiResponseGetBadgesResponse,
  ApiResponseGetOwnedBadgeResponse,
} from '@/api/generated/schemas/badge-controller'
import { type GetMyTermsParams } from '@/api/generated/schemas/term-controller'
import { useApiInfiniteQuery, useApiQuery } from '@/hooks/api'
import {
  mapApTransactionPage,
  mapBadge,
  mapBadgeDetail,
  mapMyGlossaryPage,
} from '@/mappers/myMapper'
import { myQueryKeys } from '@/pages/MyPage/hooks/myQueryKeys'

const AP_TRANSACTION_PAGE_SIZE = 20
const MY_TERMS_PAGE_SIZE = 20

function getNextPageCursor(
  lastPage: { hasNext: boolean; nextCursor: string | null },
  endpoint: string,
) {
  if (!lastPage.hasNext) return undefined
  if (lastPage.nextCursor) return lastPage.nextCursor

  console.warn(`[${endpoint}] hasNext is true but nextCursor is missing; stopping pagination.`)
  return undefined
}

export function useMyApTransactionsQuery(size: number = AP_TRANSACTION_PAGE_SIZE) {
  return useApiInfiniteQuery({
    queryKey: myQueryKeys.ap(size),
    operation: getApTransactions,
    endpoint: 'getApTransactions',
    responseSchema: ApTransactionsResponseSchema,
    response: 'requiredResult',
    getArgs: ({ pageParam }): [GetApTransactionsParams] => [
      { request: { cursor: pageParam ?? undefined, size } },
    ],
    map: mapApTransactionPage,
    staleTime: 0,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => getNextPageCursor(lastPage, 'getApTransactions'),
  })
}

export function useMyBadgesQuery() {
  return useApiQuery({
    queryKey: myQueryKeys.badges(),
    operation: getBadges,
    endpoint: 'getBadges',
    args: [],
    responseSchema: ApiResponseGetBadgesResponse,
    response: 'requiredResult',
    map: (result) => result.items.map(mapBadge),
    staleTime: 0,
  })
}

export function useMyBadgeDetailQuery(id: string | null) {
  return useApiQuery({
    queryKey: myQueryKeys.badge(id ?? ''),
    operation: getOwnedBadge,
    endpoint: 'getOwnedBadge',
    args: [id ?? ''],
    responseSchema: ApiResponseGetOwnedBadgeResponse,
    response: 'requiredResult',
    map: mapBadgeDetail,
    staleTime: 0,
    enabled: Boolean(id),
  })
}

export function useMyLearnedTermsQuery(size: number = MY_TERMS_PAGE_SIZE) {
  return useApiInfiniteQuery({
    queryKey: myQueryKeys.terms(size),
    operation: getMyTerms,
    endpoint: 'getMyTerms',
    responseSchema: MyTermsResponseSchema,
    response: 'requiredResult',
    getArgs: ({ pageParam }): [GetMyTermsParams] => [
      { request: { cursor: pageParam ?? undefined, size } },
    ],
    map: mapMyGlossaryPage,
    staleTime: 0,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => getNextPageCursor(lastPage, 'getMyTerms'),
  })
}
