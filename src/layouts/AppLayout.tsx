import { Outlet } from 'react-router-dom'

import { Container } from '@/components/common/Container'

/**
 * AppLayout
 * 로그인 후 영역 레이아웃 (홈, 사무실, 팀, 피드, 마이)
 * - 하단 GNB 탭 포함
 * - Container 밖은 PC 환경 대응을 위해 보통 어두운 회색으로 둠 (글로벌 스타일에 추가 권장)
 * TODO: BottomTabBar 컴포넌트 구현 후 교체
 */
export function AppLayout() {
  return (
    <Container
      variant="page"
      padding="none"
      className="relative mx-auto h-[100dvh] overflow-hidden shadow-xl"
    >
      <main className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
      {/* TODO: BottomTabBar */}
      <nav className="border-Gray-2 bg-White z-50 h-16 w-full shrink-0 border-t" />
    </Container>
  )
}
