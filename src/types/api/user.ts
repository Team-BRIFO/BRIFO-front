import type { ApiResponse } from './common'

export interface MyUserResult {
  nickname: string
  companyName: string
  balanceAp: number
  thisWeekEarnedAp: number
  decisionAccuracyRate: number
  totalDecision: number
  consecutiveDays: number
  learnedTermCount: number
}

export interface UpdateMyProfileRequest {
  nickname: string
  companyName: string
  stockIds: string[]
}

export type MyUserApiResponse = ApiResponse<MyUserResult>
export type UpdateMyProfileApiResponse = ApiResponse<null>
export type DeleteMyAccountApiResponse = ApiResponse<null>
