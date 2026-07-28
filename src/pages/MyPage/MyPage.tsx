import { useNavigate } from 'react-router-dom'

import { Loading } from '@/components/common/Loading'
import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import { MyHome } from '@/components/feature/my/MyHome'
import Logo from '@/components/logos/logo-small.svg?react'
import type { MyMenuKey } from '@/constants/myMenu'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'
import { PATH } from '@/routes/paths'

import { MyPageError } from './MyPageLayout'

const MENU_PATHS: Partial<Record<MyMenuKey, string>> = {
  profileEdit: PATH.MY_EDIT,
  glossary: PATH.MY_GLOSSARY,
  apHistory: PATH.MY_AP,
  badges: PATH.MY_BADGES,
}

/** SCR-13 마이 메인 */
export function MyPage() {
  const navigate = useNavigate()
  const userQuery = useUserProfileQuery()
  if (userQuery.isError && !userQuery.data)
    return <MyPageError onRetry={() => userQuery.refetch()} />
  if (!userQuery.data) return <Loading className="py-10" />
  const { profile, stats, apSummary } = userQuery.data
  const handleMenu = (key: MyMenuKey) => {
    const path = MENU_PATHS[key]
    if (path) navigate(path)
  }

  return (
    <div className="bg-Background1 flex flex-1 flex-col">
      <StatusBar
        hasStatusArea={false}
        left={<Logo className="h-[1.5rem] w-[5.25rem]" aria-label="BRIFO" />}
        right={
          <div className="flex items-center gap-3">
            <div className="dnf-Caption2 bg-Yellow-80 text-Yellow-20 rounded-full px-3 py-2">
              {`${apSummary.balance.toLocaleString()} AP`}
            </div>
            <StatusBarNotificationButton onClick={() => navigate(PATH.NOTIFICATION)} />
          </div>
        }
      />
      <div className="px-4 pt-3 pb-24">
        <MyHome profile={profile} stats={stats} apSummary={apSummary} onSelectMenu={handleMenu} />
      </div>
    </div>
  )
}
