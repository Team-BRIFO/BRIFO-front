import type { MouseEventHandler, ReactNode } from 'react'

import { Icon } from '@/components/common/Icon/Icon'

// ─── Types ───────────────────────────────────────────────────────────────────

type ChipVariant = 'default' | 'filled' | 'outline' | 'gray' | 'status' | 'trend'
type ChipSize = 'sm' | 'md' | 'lg'
type ChipStatus = 'success' | 'warning' | 'danger' | 'neutral'
/** trend variant일 때 방향을 지정 */
type TrendDirection = 'up' | 'down'

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ChipProps {
  /** chip에 표시할 내용 */
  children: ReactNode

  /** chip 시각 스타일 */
  variant?: ChipVariant

  /** chip 크기 (variant="trend"일 때는 무시됨 — 고정 사이즈 적용) */
  size?: ChipSize

  /** 상태 표시용 색상 의미 (variant="status"일 때 사용) */
  status?: ChipStatus

  /**
   * 방향 (variant="trend"일 때 사용)
   * - up:   Green 계열 배경·텍스트, ▲ 지시자
   * - down: Gray 계열 배경·텍스트, ▼ 지시자
   */
  direction?: TrendDirection

  /** 선택 상태 여부 */
  isSelected?: boolean

  /** 삭제 가능한 chip 여부 */
  isRemovable?: boolean

  /** 비활성화 여부 */
  disabled?: boolean

  /** 왼쪽 아이콘 */
  leftIcon?: ReactNode

  /** 오른쪽 아이콘 */
  rightIcon?: ReactNode

  /** chip 클릭 이벤트 */
  onClick?: MouseEventHandler<HTMLButtonElement>

  /** 삭제 버튼 클릭 이벤트 */
  onRemove?: MouseEventHandler<HTMLButtonElement>

  /** 추가 스타일 className */
  className?: string
}

// ─── Style Maps ──────────────────────────────────────────────────────────────

const SIZE_CLASS: Record<ChipSize, string> = {
  sm: 'h-4 py-0.5 px-2 gap-2.5 pretendard-Caption2',
  md: 'h-6 py-1.5 px-3 gap-2.5 pretendard-Caption1',
  lg: 'h-[26px] py-1.5 px-3 gap-2.5 pretendard-Button2',
}

// variant="status"가 아닌 경우 (trend 제외)
const VARIANT_CLASS: Record<Exclude<ChipVariant, 'status' | 'trend'>, string> = {
  default: 'bg-Gray-1 text-Gray-5',
  filled: 'bg-Yellow-100 text-Yellow-10',
  outline: 'bg-Pink-60 text-Pink-30 gap-1', // # prefix 포함, gap 4px
  gray: 'bg-Gray-1 text-Gray-5',
}

// variant="status"일 때 status prop에 따른 색상
const STATUS_CLASS: Record<ChipStatus, string> = {
  success: 'bg-Green-100 text-Green-30',
  warning: 'bg-Yellow-100 text-Yellow-10',
  danger: 'bg-Pink-60 text-Pink-30',
  neutral: 'bg-Gray-2 text-Gray-5',
}

// variant="trend"일 때 direction에 따른 색상
// label(왼쪽 텍스트)은 부모에서 text-Gray-9로 별도 지정, value는 이 색을 상속
const TREND_CLASS: Record<TrendDirection, string> = {
  up: 'bg-Gray-2 text-Pink-30',
  down: 'bg-Gray-2 text-Green-30',
}

const TREND_INDICATOR: Record<TrendDirection, string> = {
  up: '▲',
  down: '▼',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getColorClass(variant: ChipVariant, status?: ChipStatus, direction?: TrendDirection): string {
  if (variant === 'status') return STATUS_CLASS[status ?? 'neutral']
  if (variant === 'trend') return TREND_CLASS[direction ?? 'down']
  return VARIANT_CLASS[variant]
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Chip({
  children,
  variant = 'default',
  size = 'md',
  status,
  direction,
  isSelected = false,
  isRemovable = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onClick,
  onRemove,
  className = '',
}: ChipProps) {
  const isInteractive = onClick !== undefined
  const isTrend = variant === 'trend'
  const colorClass = getColorClass(variant, status, direction)

  // trend variant는 고정 사이즈(피그마 스펙: py-1 px-2 gap-1), 나머지는 size 기반
  const sizeClass = isTrend
    ? 'py-1 px-2 gap-1 pretendard-Caption2'
    : SIZE_CLASS[size]

  // trend variant는 12px radius, 나머지는 pill(20px)
  const radiusClass = isTrend ? 'rounded-[12px]' : 'rounded-[20px]'

  const hasRemoveAction = Boolean(isRemovable && onRemove)
  const isComplex = isInteractive && hasRemoveAction

  const baseClass = [
    'inline-flex items-center justify-center',
    radiusClass,
    'transition-colors duration-150',
    sizeClass,
    colorClass,
    isSelected ? 'ring-1 ring-Yellow-45' : '',
    disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
    isInteractive && !disabled ? 'hover:opacity-80' : '',
    isInteractive && !disabled && !isComplex
      ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Yellow-45'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const removeBtn = hasRemoveAction ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onRemove!(e)
      }}
      disabled={disabled}
      aria-label={`${children} 삭제`}
      className="relative z-10 flex shrink-0 items-center p-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
    >
      <Icon name="close" size={16} isDecorative />
    </button>
  ) : null

  // 1. onClick과 onRemove가 둘 다 있는 경우 (버튼 중첩 방지)
  if (isComplex) {
    return (
      <div className={`${baseClass} relative`}>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-pressed={isSelected}
          className="absolute inset-0 z-0 h-full w-full cursor-pointer rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Yellow-45"
          aria-label={typeof children === 'string' ? children : '칩'}
        />
        {leftIcon && <span className="pointer-events-none relative z-10 flex shrink-0 items-center">{leftIcon}</span>}
        {variant === 'outline' && <span className="pointer-events-none relative z-10" aria-hidden="true">#</span>}
        {isTrend && direction && <span className="pointer-events-none relative z-10" aria-hidden="true">{TREND_INDICATOR[direction]}</span>}
        <span className="pointer-events-none relative z-10">{children}</span>
        {removeBtn}
      </div>
    )
  }

  // 2. 단일 액션 또는 단순 표시용 컴포넌트 내용
  const content = (
    <>
      {leftIcon && <span className="flex shrink-0 items-center">{leftIcon}</span>}
      {variant === 'outline' && <span aria-hidden="true">#</span>}
      {isTrend && direction && <span aria-hidden="true">{TREND_INDICATOR[direction]}</span>}
      <span>{children}</span>
      {removeBtn || (rightIcon && <span className="flex shrink-0 items-center">{rightIcon}</span>)}
    </>
  )

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={isSelected}
        className={baseClass}
      >
        {content}
      </button>
    )
  }

  return <span className={baseClass}>{content}</span>
}
