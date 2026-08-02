import { mockFetch } from '@/api/client/mockNetwork'
import { MOCK_BADGE_DETAILS, MOCK_BADGE_LIST_RESPONSE } from '@/pages/MyPage/mockMy'
import type { BadgeDetailResult, BadgeListItemResponse } from '@/types/api/badge'

/** TODO: GET /api/badges 실 API 연동 */
export async function getBadges(): Promise<BadgeListItemResponse[]> {
  return mockFetch('GET /api/badges', () => MOCK_BADGE_LIST_RESPONSE.result.items)
}

/** TODO: GET /api/users/me/badges/:badgeId 실 API 연동 */
export async function getMyBadgeDetail(badgeId: string): Promise<BadgeDetailResult> {
  return mockFetch('GET /api/users/me/badges/:badgeId', () => {
    const response = MOCK_BADGE_DETAILS[badgeId]
    if (!response) throw new Error('Badge not found')
    return response.result
  })
}
