import { Outlet } from 'react-router-dom'

/**
 * AppLayout
 * 로그인 후 영역 레이아웃 (홈, 사무실, 팀, 피드, 마이)
 * - 하단 GNB 탭 포함
 * TODO: BottomTabBar 컴포넌트 구현 후 교체
 */
export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      {/* TODO: BottomTabBar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-Gray-2 bg-White" />
    </div>
  )
}
