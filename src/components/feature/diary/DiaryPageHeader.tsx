import { memo } from 'react'

import Logo from '@/assets/logo/brifo_logo_small.svg?react'
import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'

interface DiaryPageHeaderProps {
  onNotificationClick: () => void
}

/** 결정 일기 탭 전환과 무관하게 유지되는 상단 영역. */
function DiaryPageHeader({ onNotificationClick }: DiaryPageHeaderProps) {
  const userQuery = useUserProfileQuery()
  const balanceText = userQuery.data
    ? `${userQuery.data.apSummary.balance.toLocaleString()} AP`
    : userQuery.error
      ? 'AP 조회 실패'
      : 'AP 불러오는 중'

  return (
    <StatusBar
      hasStatusArea={false}
      left={<Logo className="h-6 w-21" aria-label="BRIFO" />}
      right={
        <div className="flex items-center gap-3">
          <div className="dnf-Caption2 bg-Yellow-80 text-Yellow-20 rounded-full px-3 py-2">
            {balanceText}
          </div>
          <StatusBarNotificationButton onClick={onNotificationClick} />
        </div>
      }
    />
  )
}

export default memo(DiaryPageHeader)
