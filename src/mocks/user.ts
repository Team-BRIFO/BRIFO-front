import type { UserProfileMeta } from '@/types/domain/user'

export const MOCK_USER_PROFILE_META: UserProfileMeta = {
  id: 'current-user',
  jobTitle: '대표',
  characterType: 'rookie',
  interestStocks: [
    { id: '51f6a481-3a4f-4f74-b5b7-2f7f6a0d8c31', name: '삼성전자' },
    { id: '6b7a3d58-0f9b-4c7d-a05f-2d45aefedc3d', name: 'SK하이닉스' },
  ],
}
