import type { ApiResponse } from '@/types/api/common'

export interface BadgeListItemResponse {
  badgeId: string
  code: string
  name: string
  isOwned: boolean
}

/**
 * 사용자 보유 배지 상세 응답.
 * 이 응답이 반환된 배지는 획득 상태로 간주한다.
 * TODO: API에 획득 여부/시각 필드가 추가되면 타입과 mapBadgeDetail 매핑을 함께 갱신한다.
 */
export interface BadgeDetailResult {
  badgeId: string
  code: string
  name: string
  description: string | null
  rewardAp: number
}

export type BadgeListApiResponse = ApiResponse<{ items: BadgeListItemResponse[] }>
export type BadgeDetailApiResponse = ApiResponse<BadgeDetailResult>
