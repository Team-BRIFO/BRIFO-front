import { Pagination, type PaginationItem } from '@/components/common/Pagination'

export interface CardNewsIndicatorProps {
  total: number
  currentIndex: number
  className?: string
}

export function CardNewsIndicator({ total, currentIndex, className = '' }: CardNewsIndicatorProps) {
  // Create an array of PaginationItems from total length
  // 클릭 불가능한 읽기 전용 상태로 만들기 위해 disabled: true 전달
  const items: PaginationItem[] = Array.from({ length: total }, (_, i) => ({
    value: i + 1, // 1-indexed for the component
    disabled: true,
  }))

  // Handle case where currentIndex is 0-indexed but Pagination expects 1-indexed
  const activePage = currentIndex + 1

  if (total <= 1) return null

  return (
    <Pagination
      items={items}
      currentPage={activePage}
      onPageChange={() => {}}
      ariaLabel="카드 뉴스 인디케이터"
      className={className}
    />
  )
}
