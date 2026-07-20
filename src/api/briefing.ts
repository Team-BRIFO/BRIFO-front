import {
  MOCK_BRIEFING_DETAILS,
  MOCK_BRIEFING_LIST_BY_CARD,
  MOCK_OFFICE_BRIEFING_LIST,
} from '@/pages/BriefingPage/mockBriefing'
import type {
  BriefingDetailResponse,
  BriefingListByCardResponse,
  OfficeBriefingListResponse,
  PostBriefingRequest,
  PostBriefingResponse,
} from '@/types/api/briefing'

/**
 * [단건] 브리핑 상세 내역을 조회합니다.
 * @param briefingId 조회할 브리핑 공개 ID (UUID)
 */
export const getBriefingDetail = async (briefingId: string): Promise<BriefingDetailResponse> => {
  // TODO: API 연결
  // const { data } = await apiClient.get<ApiResponse<BriefingDetailResponse>>(`/api/briefings/${briefingId}`)
  // return data.result

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = MOCK_BRIEFING_DETAILS[briefingId]
      if (result) {
        resolve(result)
      } else {
        reject(new Error('Briefing not found'))
      }
    }, 500)
  })
}

/**
 * [다건] 특정 카드뉴스에 종속된 사원들의 브리핑 목록을 조회합니다.
 * @param cardId 뉴스 카드 공개 ID (UUID)
 */
export const getCardNewsBriefings = async (cardId: string): Promise<BriefingListByCardResponse> => {
  // TODO: API 연결
  // const { data } = await apiClient.get<ApiResponse<BriefingListByCardResponse>>(`/api/news/${cardId}/briefing`)
  // return data.result

  void cardId // TS 미사용 변수 에러 방지

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

/**
 * [생성] 특정 뉴스 카드에 대해 여러 사원들에게 브리핑을 요청합니다.
 * @param cardId 뉴스 카드 공개 ID (UUID)
 * @param req 요청 body (사원 ID 목록 최대 3개)
 */
export const postBriefingRequest = async (
  cardId: string,
  req: PostBriefingRequest,
): Promise<PostBriefingResponse> => {
  void cardId

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        requestedCount: req.agentIds.length,
        totalSalaryCost: req.agentIds.length * 100, // mock salary cost
        requestedAgents: req.agentIds.map((agentId) => ({
          agentId,
          briefingId: `mock-briefing-${agentId}`,
          agentType: 'rookie', // mock type
          salaryCost: 100,
        })),
      })
    }, 500)
  })
}
