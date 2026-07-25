import type { ApiResponse } from './common'

export interface BadgeListItemResponse {
  badgeId: string
  code: string
  name: string
  isOwned: boolean
}

export interface BadgeDetailResult {
  badgeId: string
  code: string
  name: string
  description: string | null
  rewardAp: number
}

export type BadgeListApiResponse = ApiResponse<{ items: BadgeListItemResponse[] }>
export type BadgeDetailApiResponse = ApiResponse<BadgeDetailResult>
