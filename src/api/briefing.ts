import type { BriefingDetailResponse } from '@/types/api/briefing'


/**
 * 브리핑 상세 내역을 조회합니다.
 * @param briefingId 조회할 브리핑 공개 ID (UUID)
 */
export const getBriefingDetail = async (briefingId: string): Promise<BriefingDetailResponse> => {
  // TODO: 공통 apiClient(src/api/axios.ts)가 머지되면 아래 주석을 해제하고 연동하세요.
  // const { data } = await apiClient.get<ApiResponse<BriefingDetailResponse>>(`/api/briefings/${briefingId}`)
  // return data.result

  // Mocking Response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stock: {
          stockId: '0d6d4f4a-7d5d-4e4d-bf71-4b59d18c1a01',
          name: '삼성전자',
          price: 72420,
          changeRate: 2.0,
          tradeDate: '2026-07-03',
        },
        agent: {
          agentId: '0f2b7e7c-7d8a-4f4f-9b8e-0d1f3a2b9c11',
          agentType: 'ROOKIE',
          nickname: '루키',
          modelName: 'gpt-4o-mini',
        },
        newsCard: {
          cardId: '7bcd9b8a-2ed7-43a5-b4b4-1829aa4b5fd1',
          headline: '삼성전자, 반도체 실적 개선 기대',
        },
        briefing: {
          briefingId,
          direction: 'UP',
          confidenceRate: 72,
          contentText: '사장님 진짜 갑니다! HBM 수주 소식에 외국인까지 붙었어요. 지금이 기회예요!',
          oneLiner: '지금 이 흐름, 놓치기 아까워요 사장님!',
        },
      })
    }, 500)
  })
}
