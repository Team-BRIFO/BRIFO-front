/** 공통 API 응답 envelope */
export interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  result: T
}
