import {
  MOCK_GET_DECISION_RESPONSES,
  MOCK_POST_DECISION_RESPONSE,
} from '@/pages/DecisionPage/mockDecision'
import type {
  GetDecisionResponse,
  PostDecisionRequest,
  PostDecisionResponse,
} from '@/types/api/decision'

/**
 * [생성] 특정 브리핑에 대한 예측(결정)을 등록합니다.
 * @param briefingId 브리핑 공개 ID (UUID)
 * @param req 예측 방향(UP/DOWN/NEUTRAL) 및 확신도(1~5)
 */
export const postDecision = async (
  briefingId: string,
  req: PostDecisionRequest,
): Promise<PostDecisionResponse> => {
  void briefingId // TS 에러 방지

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...MOCK_POST_DECISION_RESPONSE.default,
        direction: req.direction,
        confidenceLevel: req.confidenceLevel,
      })
    }, 500)
  })
}

/**
 * [단건] 예측(결정) 상세 내역 및 정산 결과를 조회합니다.
 * @param decisionId 결정 공개 ID (UUID)
 */
export const getDecision = async (decisionId: string): Promise<GetDecisionResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockResult = MOCK_GET_DECISION_RESPONSES[decisionId]
      if (mockResult) {
        resolve(mockResult)
      } else {
        reject(new Error('Decision not found'))
      }
    }, 500)
  })
}
