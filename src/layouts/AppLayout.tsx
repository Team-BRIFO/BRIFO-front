import NavigationBar from '@/components/common/NavigationBar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { PATH } from '@/routes/paths'
import { type NavigationValue } from '@/components/common/NavigationBar'

const NAVIGATION_PATHS: Record<NavigationValue, string> = {
  briefing: PATH.BRIEFING,
  team: PATH.TEAM,
  home: PATH.HOME,
  diary: PATH.DIARY_CALENDAR,
  my: PATH.MY_PAGE,
}

function getNavigationValue(pathname: string): NavigationValue {
  if (pathname.startsWith(PATH.BRIEFING)) return 'briefing'
  if (pathname.startsWith(PATH.TEAM)) return 'team'
  if (pathname.startsWith(PATH.DIARY_CALENDAR)) return 'diary'
  if (pathname.startsWith(PATH.MY_PAGE)) return 'my'
  return 'home'
}
export function AppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const selectedNavigation = getNavigationValue(pathname)
  const handleNavigationChange = (value: NavigationValue) => {
    navigate(NAVIGATION_PATHS[value])
  }
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <div className="fixed right-0 bottom-0 left-0 z-40 flex justify-center">
        <NavigationBar
          value={selectedNavigation}
          onChange={handleNavigationChange}
          isFullWidth
          className="max-w-md"
        />
      </div>
    </div>
  )
}
