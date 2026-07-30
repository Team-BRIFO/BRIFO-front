import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

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
