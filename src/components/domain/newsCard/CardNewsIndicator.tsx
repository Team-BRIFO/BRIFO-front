import { Pagination, type PaginationItem } from '@/components/common/Pagination'

export interface CardNewsIndicatorProps {
  total: number
  currentIndex: number
  onChange?: (index: number) => void
  className?: string
}

export function CardNewsIndicator({ total, currentIndex, onChange, className = '' }: CardNewsIndicatorProps) {
  // Create an array of PaginationItems from total length
  const items: PaginationItem[] = Array.from({ length: total }, (_, i) => ({
    value: i + 1, // 1-indexed for the component
  }))

  const handlePageChange = (page: number) => {
    if (onChange) {
      onChange(page - 1) // Provide 0-indexed back to parent if parent expects 0-index
    }
  }

  // Handle case where currentIndex is 0-indexed but Pagination expects 1-indexed
  const activePage = currentIndex + 1

  if (total <= 1) return null

  return (
    <Pagination
      items={items}
      currentPage={activePage}
      onPageChange={handlePageChange}
      className={className}
    />
  )
}
