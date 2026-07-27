import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/common/Button'
import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { PATH } from '@/routes/paths'

interface MyPageLayoutProps {
  title: string
  children: ReactNode
}

interface MyPageErrorProps {
  onRetry: () => void
}

/** 마이 API 공통 오류 상태 — 실 API 요청 실패가 로딩으로 고정되지 않도록 분리한다. */
export function MyPageError({ onRetry }: MyPageErrorProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <p className="pretendard-Body2-Regular text-Gray-6">
        정보를 불러오지 못했어요.
        <br />
        잠시 후 다시 시도해주세요.
      </p>
      <Button variant="outline" color="assistive" size="md" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  )
}

/** 마이 하위 화면 공통 StatusBar·스크롤 여백 레이아웃 */
export function MyPageLayout({ title, children }: MyPageLayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-Background1 flex min-h-full flex-col">
      <StatusBar
        hasStatusArea={false}
        left={<StatusBarBackButton onClick={() => navigate(-1)} />}
        title={title}
        right={<StatusBarNotificationButton onClick={() => navigate(PATH.NOTIFICATION)} />}
      />
      <div className="px-4 pt-3 pb-24">{children}</div>
    </div>
  )
}
