import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import NavigationBar from '@/components/common/NavigationBar'
import { type NavigationValue } from '@/components/common/NavigationBar'
import { PATH } from '@/routes/paths'

const NAVIGATION_PATHS: Record<NavigationValue, string> = {
  team: PATH.TEAM,
  office: PATH.OFFICE,
  home: PATH.HOME,
  diary: PATH.DIARY,
  my: PATH.MY_PAGE,
}

function getNavigationValue(pathname: string): NavigationValue {
  if (pathname.startsWith(PATH.OFFICE) || pathname.startsWith(PATH.BRIEFING)) return 'office'
  if (pathname.startsWith(PATH.TEAM)) return 'team'
  if (pathname.startsWith(PATH.DIARY)) return 'diary'
  if (pathname.startsWith(PATH.MY_PAGE)) return 'my'

  // 그 외(홈, 에러 페이지, 로딩 페이지 등)는 홈 탭 활성화
  return 'home'
}

/**
 * AppLayout
 * 로그인 후 영역 레이아웃 (홈, 사무실, 팀, 피드, 마이)
 * - 하단 GNB 탭 포함
 * - Container 밖은 PC 환경 대응을 위해 보통 어두운 회색으로 둠 (글로벌 스타일에 추가 권장)
 * TODO: BottomTabBar 컴포넌트 구현 후 교체
 */

export function AppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0)
    }
  }, [pathname])

  const selectedNavigation = getNavigationValue(pathname)
  const handleNavigationChange = (value: NavigationValue) => {
    navigate(NAVIGATION_PATHS[value])
  }
  return (
    <div className="bg-White relative mx-auto flex h-dvh w-full max-w-3xl flex-col overflow-hidden shadow-xl">
      <main
        ref={mainRef}
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto ${
          selectedNavigation === 'home' ? 'bg-White' : 'bg-Background1'
        }`}
      >
        <Outlet />
      </main>
      <div className="z-40 flex w-full shrink-0 justify-center">
        <NavigationBar
          value={selectedNavigation}
          onChange={handleNavigationChange}
          isFullWidth
          className="max-md:w-full md:max-w-3xl"
        />
      </div>
    </div>
  )
}
