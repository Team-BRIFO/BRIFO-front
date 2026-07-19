import { useMutation, useQuery } from '@tanstack/react-query'

import {
  getBriefingDetail,
  getCardNewsBriefings,
  getOfficeBriefings,
  postBriefingRequest,
} from '@/api/briefing'
import type {
  BriefingDetailResponse,
  BriefingListByCardResponse,
  OfficeBriefingListResponse,
  PostBriefingRequest,
  PostBriefingResponse,
} from '@/types/api/briefing'

export const BRIEFING_QUERY_KEYS = {
  all: ['briefings'] as const,
  detail: (id: string) => [...BRIEFING_QUERY_KEYS.all, 'detail', id] as const,
  listByCard: (cardId: string) => [...BRIEFING_QUERY_KEYS.all, 'list', 'card', cardId] as const,
  officeList: () => [...BRIEFING_QUERY_KEYS.all, 'office'] as const,
}

/**
 * [단건] 브리핑 상세 조회
 */
export function useGetBriefingDetail(briefingId: string | null) {
  return useQuery<BriefingDetailResponse, Error>({
    queryKey: BRIEFING_QUERY_KEYS.detail(briefingId ?? ''),
    queryFn: () => getBriefingDetail(briefingId!),
    enabled: Boolean(briefingId),
  })
}

/**
 * [다건] 특정 뉴스 카드에 대한 사원 브리핑 목록 조회
 */
export function useGetCardNewsBriefings(cardId: string | null) {
  return useQuery<BriefingListByCardResponse, Error>({
    queryKey: BRIEFING_QUERY_KEYS.listByCard(cardId ?? ''),
    queryFn: () => getCardNewsBriefings(cardId!),
    enabled: Boolean(cardId),
  })
}

/**
 * [다건] 오피스 전체 브리핑 상태 조회
 */
export function useGetOfficeBriefings() {
  return useQuery<OfficeBriefingListResponse, Error>({
    queryKey: BRIEFING_QUERY_KEYS.officeList(),
    queryFn: getOfficeBriefings,
  })
}

/**
 * [생성] 브리핑 다건 생성 요청 (최대 3명)
 */
export function usePostBriefingRequest() {
  return useMutation<PostBriefingResponse, Error, { cardId: string; req: PostBriefingRequest }>({
    mutationFn: ({ cardId, req }) => postBriefingRequest(cardId, req),
  })
}
