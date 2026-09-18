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
  /**
   * segmented Type 1 전용: 전체 너비를 3개 항목 기준(213px) 고정폭으로 두는 대신,
   * 항목 개수에 비례해 늘어나도록 함 (1~2개일 때 탭이 불필요하게 넓어지는 것을 방지).
   * 탭 1개당 폭은 3개 기준일 때와 동일하게 유지된다.
   */
  sizeToContent?: boolean
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
  sizeToContent = false,
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

  // segmented Type 1 기준폭(213px)은 3개 항목 기준이므로, 항목 수에 비례해 컨테이너 폭을 줄인다.
  const SEGMENTED_TYPE1_REFERENCE_COUNT = 3
  const segmentedType1Width =
    variant === 'segmented' && segmentedType === 1 && sizeToContent
      ? `${(59.16 * Math.min(items.length, SEGMENTED_TYPE1_REFERENCE_COUNT)) / SEGMENTED_TYPE1_REFERENCE_COUNT}%`
      : undefined

  // ─── Render Logic ───
  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={ariaLabel}
      className={`${getContainerClass(variant, isFullWidth, segmentedType, sizeToContent, className)} relative z-0`}
      style={segmentedType1Width ? { width: segmentedType1Width } : undefined}
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
  sizeToContent: boolean,
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
      // Type 1 (리스트/통계 등, 213px). sizeToContent일 때는 인라인 style로 폭을 지정한다.
      base.push(
        sizeToContent ? '' : isFullWidth ? 'w-full' : 'w-[59.16%]',
        'h-6 gap-1 rounded-[30px] bg-Gray-2',
      )
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

    // 구조 및 배경 스타일 (항목은 항상 컨테이너 폭을 균등 분배)
    if (segmentedType === 2) {
      base.push('h-full flex-1 rounded-[40px]')
      // 배경색은 애니메이션용 absolute div가 담당하므로 제거
    } else {
      base.push('h-full flex-1 rounded-[30px]')
    }
  } else if (variant === 'underline') {
    base.push('h-10 pretendard-Caption1')
    base.push(
      isActive
        ? 'border-b-2 border-Gray-9 text-Gray-9'
        : 'border-b-2 border-transparent text-Gray-5',
    )
  } else if (variant === 'pill') {
    base.push('h-8 px-4 rounded-full pretendard-Caption1')
    base.push(isActive ? 'bg-Gray-9 text-White' : 'bg-Background1 text-Gray-6')
  } else if (variant === 'plain') {
    base.push('pretendard-Caption1')
    base.push(isActive ? 'text-Gray-9 font-bold' : 'text-Gray-5')
  }

  return base.filter(Boolean).join(' ')
}
