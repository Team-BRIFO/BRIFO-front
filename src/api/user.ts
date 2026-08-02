import { mockFetch } from '@/api/client/mockNetwork'
import { MOCK_USER_PROFILE_META } from '@/mocks/user'
import { MOCK_MY_USER_RESPONSE } from '@/pages/MyPage/mockMy'
import type { MyUserResult, UpdateMyProfileRequest } from '@/types/api/user'

/** TODO: 공통 apiClient 연동 후 실제 /api/users/me 요청으로 교체 */
export async function getMyUser(): Promise<MyUserResult> {
  return mockFetch('GET /api/users/me', () => MOCK_MY_USER_RESPONSE.result)
}

export async function updateMyProfile(request: UpdateMyProfileRequest): Promise<void> {
  // TODO: PATCH /api/users/me/profile 연동. mock은 현재 관심종목 삭제만 흉내 내며,
  // 실제 종목 선택 UI/API 연결 전에는 신규 종목 추가를 보존하지 못한다.
  MOCK_MY_USER_RESPONSE.result.nickname = request.nickname.trim()
  MOCK_MY_USER_RESPONSE.result.companyName = request.companyName.trim()
  MOCK_USER_PROFILE_META.interestStocks = MOCK_USER_PROFILE_META.interestStocks.filter((stock) =>
    request.stockIds.includes(stock.id),
  )
}

export async function deleteMyAccount(): Promise<void> {
  // TODO: DELETE /api/users/me 연동
}
