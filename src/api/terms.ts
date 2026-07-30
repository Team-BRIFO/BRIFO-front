export interface TermDetailResponse {
  termId: string
  term: string
  definition: string
  category: string
  isLearned: boolean
}

export interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  result: T
}

/**
 * 용어 상세 조회 API
 * @param termId 조회할 용어 공개 ID (UUID)
 */
export const getTermDetail = async (termId: string): Promise<TermDetailResponse> => {
  // TODO: 공통 Axios 인스턴스(src/api/client/axiosInstance.ts)로 실제 API를 연동하세요.
  // const { data } = await apiClient.get<ApiResponse<TermDetailResponse>>(`/api/terms/${termId}`)
  // return data.result

  return {
    termId,
    term: '임시 용어',
    definition: '공통 axios 인스턴스 연동 전 표시되는 임시 데이터입니다.',
    category: '임시 카테고리',
    isLearned: false,
  }
}
