/**
 * 뉴스 카드의 현재 스와이프(스크롤) 위치를 시각적으로 보여주기 위한 '읽기 전용' 인디케이터입니다.
 * - 클릭이나 터치를 통한 페이지 전환 기능은 지원하지 않습니다. (disabled 상태)
 * - 부모 컴포넌트에서 상태(currentIndex)를 받아 단순히 화면에 표시하는 역할만 수행합니다.
 */
export interface NewsCardIndicatorProps {
  total: number
  currentIndex: number
  className?: string
}

/**
 * NewsCardIndicator
 * 읽기 전용으로 동작하는 시각적 페이지네이션 인디케이터 컴포넌트입니다.
 */
export function NewsCardIndicator({ total, currentIndex, className = '' }: NewsCardIndicatorProps) {
  if (!Number.isInteger(total) || total <= 1) return null
  if (!Number.isInteger(currentIndex) || currentIndex < 0 || currentIndex >= total) return null

  return (
    <div
      role="group"
      aria-label="카드 뉴스 인디케이터"
      className={`inline-flex items-center justify-center gap-1.5 py-2.5 ${className}`}
    >
      {Array.from({ length: total }).map((_, idx) => {
        const isActive = idx === currentIndex
        return (
          <div
            key={idx}
            className={`h-2 shrink-0 rounded-full transition-all duration-300 ${
              isActive ? 'bg-Yellow-50 w-6' : 'bg-Gray-3 w-2'
            }`}
            aria-current={isActive ? 'page' : undefined}
          />
        )
      })}
    </div>
  )
}
