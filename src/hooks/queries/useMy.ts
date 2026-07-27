import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { AP_TRANSACTION_PAGE_SIZE, getApTransactions } from '@/api/ap'
import { getBadges, getMyBadgeDetail } from '@/api/badge'
import { getMyLearnedTerms, MY_TERMS_PAGE_SIZE } from '@/api/myTerms'
import { deleteMyAccount, getMyUser, updateMyProfile } from '@/api/user'
import type { UpdateMyProfileRequest } from '@/types/api/user'

export const MY_QUERY_KEYS = {
  all: ['my'] as const,
  user: () => [...MY_QUERY_KEYS.all, 'user'] as const,
  ap: () => [...MY_QUERY_KEYS.all, 'ap'] as const,
  badges: () => [...MY_QUERY_KEYS.all, 'badges'] as const,
  badge: (id: string) => [...MY_QUERY_KEYS.badges(), id] as const,
  terms: () => [...MY_QUERY_KEYS.all, 'terms'] as const,
}
export const useMyUser = () => useQuery({ queryKey: MY_QUERY_KEYS.user(), queryFn: getMyUser })
export const useMyApTransactions = () =>
  useInfiniteQuery({
    queryKey: MY_QUERY_KEYS.ap(),
    queryFn: ({ pageParam }) =>
      getApTransactions(pageParam as string | null, AP_TRANSACTION_PAGE_SIZE),
    initialPageParam: null as string | null,
    getNextPageParam: (last) =>
      last.page.hasNext && last.page.nextCursor ? last.page.nextCursor : undefined,
  })
export const useMyBadges = () => useQuery({ queryKey: MY_QUERY_KEYS.badges(), queryFn: getBadges })
export const useMyBadgeDetail = (id: string | null) =>
  useQuery({
    queryKey: MY_QUERY_KEYS.badge(id ?? ''),
    queryFn: () => getMyBadgeDetail(id!),
    enabled: Boolean(id),
  })
export const useMyLearnedTerms = () =>
  useInfiniteQuery({
    queryKey: MY_QUERY_KEYS.terms(),
    queryFn: ({ pageParam }) => getMyLearnedTerms(pageParam as string | null, MY_TERMS_PAGE_SIZE),
    initialPageParam: null as string | null,
    getNextPageParam: (last) =>
      last.page.hasNext && last.page.nextCursor ? last.page.nextCursor : undefined,
  })
export function useUpdateMyProfile() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (request: UpdateMyProfileRequest) => updateMyProfile(request),
    onSuccess: () => client.invalidateQueries({ queryKey: MY_QUERY_KEYS.user() }),
  })
}
export function useDeleteMyAccount() {
  return useMutation({ mutationFn: deleteMyAccount })
}
