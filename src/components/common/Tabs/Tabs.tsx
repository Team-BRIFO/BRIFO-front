import type { ReactNode } from 'react'

export type TabsVariant = 'underline' | 'segmented' | 'pill' | 'plain'

export interface TabItem {
  /** 탭 값 */
  value: string
  /** 표시할 라벨 */
  label: ReactNode
  /** 비활성화 여부 */
  disabled?: boolean
}

export interface TabsProps {
  /** 현재 선택된 탭 값 */
  value: string
  /** 탭 선택 변경 이벤트 */
  onChange: (value: string) => void
  /** 탭 항목 목록 */
  items: TabItem[]
  /** 탭 시각 스타일 (기본값: segmented) */
  variant?: TabsVariant
  /** 탭 그룹 접근성 label */
  ariaLabel?: string
  /** 탭이 부모 너비를 꽉 채울지 여부 */
  isFullWidth?: boolean
  /** 
   * segmented variant일 때의 피그마 대응 타입
   * 1: Type 1 (213px, gap 4px, 반경 30px)
   * 2: Type 2 (316px, space-between, 반경 40px)
   */
  segmentedType?: 1 | 2
  /** 전체 비활성화 여부 */
  disabled?: boolean
  /** 추가 스타일 className */
  className?: string
}

export function Tabs({
  value,
  onChange,
  items,
  variant = 'segmented',
  ariaLabel = '탭 메뉴',
  isFullWidth = false,
  segmentedType = 1,
  disabled = false,
  className = '',
}: TabsProps) {
  // ─── Render Logic ───
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={getContainerClass(variant, isFullWidth, segmentedType, className)}
    >
      {items.map((item) => {
        const isActive = item.value === value
        const isDisabled = disabled || item.disabled

        return (
          <button
            key={item.value}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled && value !== item.value) {
                onChange(item.value)
              }
            }}
            className={getItemClass(variant, isActive, isDisabled, segmentedType)}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Style Helpers ───────────────────────────────────────────────────────────

function getContainerClass(
  variant: TabsVariant,
  isFullWidth: boolean,
  segmentedType: 1 | 2,
  className: string
): string {
  const base = ['flex items-center', isFullWidth ? 'w-full' : 'w-max', className]

  if (variant === 'segmented') {
    // 피그마 스펙 대응
    if (segmentedType === 2) { // Type 2 (사원/시스템 등, 316px)
      base.push('w-[316px] h-[24px] justify-between rounded-[40px] bg-Gray-1')
    } else { // Type 1 (리스트/통계 등, 213px)
      base.push('w-[213px] h-[24px] gap-[4px] rounded-[30px] bg-Gray-2')
    }
  } else if (variant === 'underline') {
    base.push('border-b border-Gray-2 gap-4')
  } else if (variant === 'pill') {
    base.push('gap-2')
  } else if (variant === 'plain') {
    base.push('gap-4')
  }

  return base.filter(Boolean).join(' ')
}

function getItemClass(
  variant: TabsVariant,
  isActive: boolean,
  isDisabled: boolean,
  segmentedType: 1 | 2
): string {
  const base = [
    'relative flex items-center justify-center transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Yellow-45',
    isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-80',
  ]

  if (variant === 'segmented') {
    // 폰트 스타일
    base.push(isActive ? 'pretendard-Button2 text-White' : 'pretendard-Button2 text-Gray-6')
    
    // 구조 및 배경 스타일
    if (segmentedType === 2) {
      base.push('h-full flex-1 rounded-[40px]')
      if (isActive) base.push('bg-Yellow-40')
    } else {
      base.push('h-full flex-1 rounded-[30px]')
      if (isActive) base.push('bg-Yellow-40')
    }
  } else if (variant === 'underline') {
    base.push('h-[40px] pretendard-Button2')
    base.push(isActive ? 'border-b-2 border-Gray-9 text-Gray-9' : 'border-b-2 border-transparent text-Gray-5')
  } else if (variant === 'pill') {
    base.push('h-[32px] px-4 rounded-full pretendard-Button2')
    base.push(isActive ? 'bg-Gray-9 text-White' : 'bg-Gray-1 text-Gray-6')
  } else if (variant === 'plain') {
    base.push('pretendard-Button2')
    base.push(isActive ? 'text-Gray-9 font-bold' : 'text-Gray-5')
  }

  return base.filter(Boolean).join(' ')
}
