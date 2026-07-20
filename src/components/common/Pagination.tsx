export interface PaginationItem {
  value: number
  disabled?: boolean
}

export interface PaginationProps {
  /** 전체 인디케이터 아이템 배열 */
  items: PaginationItem[]

  /** 현재 활성화된 페이지의 값 (item.value와 일치해야 함) */
  currentPage: number

  /** 인디케이터 클릭 이벤트 */
  onPageChange: (page: number) => void

  /** 스크린 리더용 라벨 (기본값 제공됨) */
  ariaLabel?: string

  /** 추가 스타일 className */
  className?: string
}

export function Pagination({
  items,
  currentPage,
  onPageChange,
  ariaLabel = '페이지 인디케이터',
  className = '',
}: PaginationProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`bg-Yellow-100 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2.5 ${className}`}
    >
      {items.map((item) => {
        const isActive = item.value === currentPage
        const isDisabled = item.disabled

        // 색상 토큰: 활성(Yellow-50), 비활성(Gray-3)
        const dotColorClass = isActive ? 'bg-Yellow-50' : 'bg-Gray-3'

        return (
          <button
            key={item.value}
            type="button"
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled && onPageChange) {
                onPageChange(item.value)
              }
            }}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`${item.value}번째 페이지`}
            className={[
              'h-2 w-2 shrink-0 rounded-full transition-colors duration-200',
              dotColorClass,
              !isDisabled
                ? 'focus-visible:ring-Yellow-45 cursor-pointer hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none'
                : 'cursor-default',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        )
      })}
    </div>
  )
}
