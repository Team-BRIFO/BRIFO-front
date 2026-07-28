import type { MouseEventHandler } from 'react'

import { Icon } from '@/components/common/Icon'

// ─── Types ───────────────────────────────────────────────────────────────────

export type IconButtonVariant = 'ghost' | 'solid' | 'outline' | 'danger' | 'brand'
export type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps {
  /** 렌더링할 아이콘 이름 */
  iconName: string

  /** screen reader에 전달할 버튼 설명 (필수) */
  ariaLabel: string

  /** 버튼 시각 스타일 */
  variant?: IconButtonVariant

  /** 버튼 크기 */
  size?: IconButtonSize

  /** 버튼 비활성화 여부 */
  disabled?: boolean

  /** 버튼 클릭 이벤트 */
  onClick?: MouseEventHandler<HTMLButtonElement>

  /** 버튼 타입 */
  type?: 'button' | 'submit' | 'reset'

  /** 추가 스타일 className */
  className?: string
}

// ─── Style Maps ──────────────────────────────────────────────────────────────

// 버튼 전체 크기와 내부 Icon 컴포넌트로 전달할 아이콘 크기를 매핑합니다.
const SIZE_MAP: Record<IconButtonSize, { button: string; icon: 16 | 20 | 24 | 28 | 32 }> = {
  sm: { button: 'w-8 h-8', icon: 16 }, // 32px
  md: { button: 'w-10 h-10', icon: 20 }, // 40px
  lg: { button: 'w-12 h-12', icon: 24 }, // 48px
}

const VARIANT_CLASS: Record<Exclude<IconButtonVariant, 'brand'>, string> = {
  ghost: 'bg-transparent text-Gray-9 hover:bg-Background1 active:bg-Gray-2',
  solid: 'bg-Gray-2 text-Gray-9 hover:bg-Gray-3',
  outline: 'bg-transparent border border-Gray-2 text-Gray-9 hover:bg-Background1',
  danger: 'bg-Pink-60 text-Pink-30 hover:opacity-80',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getBrandClass(): string {
  // 아이콘 이름에 따라 고유 브랜드 색상을 반환합니다.
  // 커스텀 브랜드 색상이 필요하다면 이곳에 추가하세요.
  return 'bg-White hover:bg-Background1'
}

function getColorClass(variant: IconButtonVariant): string {
  if (variant === 'brand') {
    return getBrandClass()
  }
  return VARIANT_CLASS[variant]
}

// ─── Component ───────────────────────────────────────────────────────────────

export function IconButton({
  iconName,
  ariaLabel,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}: IconButtonProps) {
  const { button: buttonSizeClass, icon: iconSize } = SIZE_MAP[size]
  const colorClass = getColorClass(variant)

  const baseClass = [
    'inline-flex items-center justify-center rounded-full shrink-0',
    'transition-colors duration-150',
    buttonSizeClass,
    colorClass,
    disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
    !disabled ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Yellow-45' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={baseClass}
    >
      <Icon
        name={iconName}
        size={iconSize}
        isDecorative={true} // 접근성 라벨은 부모 button이 가졌으므로 아이콘 자체는 숨김
      />
    </button>
  )
}
