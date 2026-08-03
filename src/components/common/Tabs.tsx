import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from 'react'

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
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return

    e.preventDefault()

    const enabledIndexes = items
      .map((item, index) => (disabled || item.disabled ? -1 : index))
      .filter((index) => index !== -1)

    if (enabledIndexes.length === 0) return

    let nextIndex = currentIndex
    const currentEnabledPos = enabledIndexes.indexOf(currentIndex)

    if (e.key === 'ArrowRight') {
      nextIndex = enabledIndexes[(currentEnabledPos + 1) % enabledIndexes.length]
    } else if (e.key === 'ArrowLeft') {
      nextIndex =
        enabledIndexes[(currentEnabledPos - 1 + enabledIndexes.length) % enabledIndexes.length]
    } else if (e.key === 'Home') {
      nextIndex = enabledIndexes[0]
    } else if (e.key === 'End') {
      nextIndex = enabledIndexes[enabledIndexes.length - 1]
    }

    if (nextIndex !== currentIndex && nextIndex !== undefined) {
      tabsRef.current[nextIndex]?.focus()
      onChange(items[nextIndex].value)
    }
  }

  const activeIndex = items.findIndex((item) => item.value === value && !item.disabled && !disabled)
  const firstEnabledIndex = items.findIndex((item) => !item.disabled && !disabled)
  const focusableIndex = activeIndex !== -1 ? activeIndex : firstEnabledIndex

  // ─── Animation Logic ───
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateIndicator = () => {
      if (variant === 'segmented' && activeIndex !== -1) {
        const activeTab = tabsRef.current[activeIndex]
        const container = containerRef.current
        if (activeTab && container) {
          const containerRect = container.getBoundingClientRect()
          const tabRect = activeTab.getBoundingClientRect()
          setIndicatorStyle({
            left: tabRect.left - containerRect.left,
            width: tabRect.width,
            opacity: 1,
          })
        }
      } else {
        setIndicatorStyle({ left: 0, width: 0, opacity: 0 })
      }
    }

    updateIndicator()

    const container = containerRef.current
    if (!container || variant !== 'segmented') return

    const observer = new ResizeObserver(() => {
      updateIndicator()
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [activeIndex, variant, items.length])

  // ─── Render Logic ───
  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={ariaLabel}
      className={`${getContainerClass(variant, isFullWidth, segmentedType, className)} relative z-0`}
    >
      {variant === 'segmented' && activeIndex !== -1 && (
        <div
          className="bg-Yellow-40 absolute top-0 bottom-0 -z-10 rounded-full transition-all duration-300 ease-out"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            opacity: indicatorStyle.opacity,
          }}
        />
      )}
      {items.map((item, index) => {
        const isActive = item.value === value
        const isDisabled = Boolean(disabled || item.disabled)
        const tabIndex = !isDisabled && index === focusableIndex ? 0 : -1

        return (
          <button
            key={item.value}
            ref={(el) => {
              tabsRef.current[index] = el
            }}
            role="tab"
            type="button"
            tabIndex={tabIndex}
            aria-selected={isActive}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled && value !== item.value) {
                onChange(item.value)
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
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
  className: string,
): string {
  const base = ['flex items-center', className]

  if (variant !== 'segmented') {
    base.push(isFullWidth ? 'w-full' : 'w-max')
  }

  if (variant === 'segmented') {
    // 피그마 스펙 대응
    if (segmentedType === 2) {
      base.push(
        isFullWidth ? 'w-full' : 'w-[87.77%]',
        'h-6 justify-between rounded-[40px] bg-Background1',
      )
    } else {
      // Type 1 (리스트/통계 등, 213px)
      base.push(isFullWidth ? 'w-full' : 'w-[59.16%]', 'h-6 gap-[4px] rounded-[30px] bg-Gray-2')
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
  segmentedType: 1 | 2,
): string {
  const base = [
    'relative flex items-center justify-center transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Yellow-45',
    isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-80',
  ]

  if (variant === 'segmented') {
    // 폰트 스타일
    base.push(isActive ? 'pretendard-Caption1 text-White' : 'pretendard-Caption1 text-Gray-6')

    // 구조 및 배경 스타일
    if (segmentedType === 2) {
      base.push('h-full flex-1 rounded-[40px]')
      // 배경색은 애니메이션용 absolute div가 담당하므로 제거
    } else {
      base.push('h-full flex-1 rounded-[30px]')
    }
  } else if (variant === 'underline') {
    base.push('h-[2.5rem] pretendard-Caption1')
    base.push(
      isActive
        ? 'border-b-2 border-Gray-9 text-Gray-9'
        : 'border-b-2 border-transparent text-Gray-5',
    )
  } else if (variant === 'pill') {
    base.push('h-[2rem] px-4 rounded-full pretendard-Caption1')
    base.push(isActive ? 'bg-Gray-9 text-White' : 'bg-Background1 text-Gray-6')
  } else if (variant === 'plain') {
    base.push('pretendard-Caption1')
    base.push(isActive ? 'text-Gray-9 font-bold' : 'text-Gray-5')
  }

  return base.filter(Boolean).join(' ')
}
