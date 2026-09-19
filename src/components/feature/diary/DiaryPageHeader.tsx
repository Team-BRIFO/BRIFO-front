import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import Logo from '@/assets/logo/brifo_logo_small.svg?react'
import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import { formatWon } from '@/components/domain/ap/apTransactionMeta'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'
import { PATH } from '@/routes/paths'

interface DiaryPageHeaderProps {
  onNotificationClick: () => void
}

/** 결정 일기 탭 전환과 무관하게 유지되는 상단 영역. */
function DiaryPageHeader({ onNotificationClick }: DiaryPageHeaderProps) {
  const navigate = useNavigate()
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
            onClick={() => navigate(PATH.MY_AP)}
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
