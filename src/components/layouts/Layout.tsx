import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title?: string
}

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="bg-White relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col shadow-sm">
      {/* 
        상단 안전영역 + 헤더 (sticky 적용)
        PC에서는 env()가 0으로 평가되어 기본 h-14만 적용되며,
        모바일(iOS/Android)에서는 노치/펀치홀 등에 대응하기 위해 safe-area-inset-top 패딩이 추가됩니다.
        sticky top-0과 함께 z-50을 부여해 스크롤 시에도 최상단에 고정되게 구현하였습니다.
      */}
      {title ? (
        <header className="border-Gray-1 bg-White/80 sticky top-0 z-50 w-full border-b pt-[env(safe-area-inset-top,24px)] backdrop-blur-md">
          <div className="flex h-14 items-center justify-center px-4">
            <h1 className="text-Gray-10 truncate text-lg font-semibold">{title}</h1>
          </div>
        </header>
      ) : (
        <div className="bg-White sticky top-0 z-50 w-full pt-[env(safe-area-inset-top,24px)]" />
      )}

      {/* 
        메인 콘텐츠 영역 
        하단에 홈 인디케이터나 네비게이션 바에 콘텐츠가 가리지 않도록 
        safe-area-inset-bottom 값을 pb로 적용합니다.
      */}
      <main className="w-full flex-1 pb-[env(safe-area-inset-bottom,16px)]">{children}</main>
    </div>
  )
}
