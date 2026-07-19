import {
  MOCK_BRIEFING_DETAIL,
  MOCK_BRIEFING_LIST_BY_CARD,
  MOCK_OFFICE_BRIEFING_LIST,
} from '@/mocks/mockBriefing'
import type {
  BriefingDetailResponse,
  BriefingListByCardResponse,
  OfficeBriefingListResponse,
} from '@/types/api/briefing'

/**
 * [단건] 브리핑 상세 내역을 조회합니다.
 * @param briefingId 조회할 브리핑 공개 ID (UUID)
 */
export const getBriefingDetail = async (_briefingId: string): Promise<BriefingDetailResponse> => {
  // TODO: API 연결
  // const { data } = await apiClient.get<ApiResponse<BriefingDetailResponse>>(`/api/briefings/${_briefingId}`)
  // return data.result

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_BRIEFING_DETAIL)
    }, 500)
  })
}

/**
 * [다건] 특정 카드뉴스에 종속된 사원들의 브리핑 목록을 조회합니다.
 * @param cardId 뉴스 카드 공개 ID (UUID)
 */
export const getCardNewsBriefings = async (
  _cardId: string,
): Promise<BriefingListByCardResponse> => {
  // TODO: API 연결
  // const { data } = await apiClient.get<ApiResponse<BriefingListByCardResponse>>(`/api/news/${_cardId}/briefing`)
  // return data.result

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_BRIEFING_LIST_BY_CARD)
    }, 500)
  })
}

/**
 * [다건] 현재 접속 중인 사용자의 전체 오피스 브리핑 상태 목록을 조회합니다.
 */
export const getOfficeBriefings = async (): Promise<OfficeBriefingListResponse> => {
  // TODO: API 연결
  // const { data } = await apiClient.get<ApiResponse<OfficeBriefingListResponse>>(`/api/briefings/office`)
  // return data.result

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_OFFICE_BRIEFING_LIST)
    }, 500)
  })
}
