import axios from 'axios'

// TODO: 프로젝트 공통 axios 인스턴스(인터셉터 포함)가 준비되면 교체 필요
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
})

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
  const { data } = await axiosInstance.get<ApiResponse<TermDetailResponse>>(`/api/terms/${termId}`)
  return data.result
}
