import { Outlet } from 'react-router-dom'

/**
 * AuthLayout
 * 비로그인 영역 레이아웃 (스플래시, 온보딩, 튜토리얼)
 * - 하단 GNB 탭 없음
 */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Outlet />
    </div>
  )
}
