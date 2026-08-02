import { useNavigate } from 'react-router-dom'

import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import { PageErrorView } from '@/components/feature/error/PageErrorView'
import { PageLoadingView } from '@/components/feature/error/PageLoadingView'
import { MyHome } from '@/components/feature/my/MyHome'
import Logo from '@/components/logos/logo-small.svg?react'
import type { MyMenuKey } from '@/constants/myMenu'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'
import { PATH } from '@/routes/paths'

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
  const { data } = userQuery

  const handleMenu = (key: MyMenuKey) => {
    const path = MENU_PATHS[key]
    if (path) navigate(path)
  }

  return (
    <div className="bg-Background1 flex flex-1 flex-col">
      <StatusBar
        hasStatusArea={false}
        left={<Logo className="h-6 w-21" aria-label="BRIFO" />}
        right={
          <div className="flex items-center gap-3">
            <div className="dnf-Caption2 bg-Yellow-80 text-Yellow-20 rounded-full px-3 py-2">
              {userQuery.data ? `${userQuery.data.apSummary.balance.toLocaleString()} AP` : '0 AP'}
            </div>
            <StatusBarNotificationButton onClick={() => navigate(PATH.NOTIFICATION)} />
          </div>
        }
      />
      {!!userQuery.error && userQuery.fetchStatus === 'idle' ? (
        <PageErrorView error={userQuery.error} onRetry={() => userQuery.refetch()} />
      ) : userQuery.fetchStatus === 'fetching' || !data ? (
        <PageLoadingView />
      ) : (
        <div className="px-4 pt-3 pb-24">
          <MyHome
            profile={data.profile}
            stats={data.stats}
            apSummary={data.apSummary}
            onSelectMenu={handleMenu}
          />
        </div>
      )}
    </div>
  )
}
