import { memo } from 'react'

import Logo from '@/assets/logo/brifo_logo_small.svg?react'
import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import { formatWon } from '@/components/domain/ap/apTransactionMeta'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'

interface DiaryPageHeaderProps {
  onNotificationClick: () => void
  onBalanceClick: () => void
}

/**
 * 결정 일기 탭 전환과 무관하게 유지되는 상단 영역.
 * 라우팅 훅을 직접 호출하면 Router 컨텍스트 변화에 구독돼 memo가 무력화되므로,
 * 네비게이션은 부모(DiaryPage)에서 안정적인 콜백으로 전달받는다.
 */
function DiaryPageHeader({ onNotificationClick, onBalanceClick }: DiaryPageHeaderProps) {
  const userQuery = useUserProfileQuery()
  const balanceText = userQuery.data
    ? formatWon(userQuery.data.apSummary.balance)
    : userQuery.error
      ? '자금 조회 실패'
      : '자금 불러오는 중'

  return (
    <StatusBar
      hasStatusArea={false}
      left={<Logo className="h-6 w-21" aria-label="BRIFO" />}
      right={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBalanceClick}
            aria-label="자금 내역 보기"
            className="dnf-Caption2 bg-Yellow-80 text-Yellow-20 rounded-full px-3 py-2"
          >
            {balanceText}
          </button>
          <StatusBarNotificationButton onClick={onNotificationClick} />
        </div>
      }
    />
  )
}

export default memo(DiaryPageHeader)
