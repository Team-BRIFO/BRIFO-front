import type { ElementType } from 'react'



// ─── Types ───────────────────────────────────────────────────────────────────

export type IconVariant = 'line' | 'filled' | 'brand'
export type IconSize = 16 | 20 | 24 | 28 | 32

export interface BaseIconProps {
  /** 렌더링할 아이콘 이름 */
  name: string

  /** 아이콘 스타일 종류 */
  variant?: IconVariant

  /** 아이콘 크기 */
  size?: IconSize

  /** 
   * 아이콘 색상 (Tailwind text-color 클래스 권장)
   * 예: 'text-Gray-9', 'text-Pink-30'
   * 생략 시 부모의 텍스트 색상(currentColor)을 상속받습니다.
   */
  color?: string

  /** 추가 스타일 className */
  className?: string
}

export type IconProps = BaseIconProps & (
  | {
      /** 장식용 아이콘 여부 (기본: true) */
      isDecorative?: true
      ariaLabel?: never
    }
  | {
      /** 의미 있는 아이콘일 경우 false로 설정해야 합니다 */
      isDecorative: false
      /** 의미 있는 아이콘일 때 screen reader에 전달할 라벨 (필수) */
      ariaLabel: string
    }
)

// ─── Icon Registry ───────────────────────────────────────────────────────────

/**
 * 아이콘 이름(name)을 실제 컴포넌트(SVG 또는 Lucide)와 매핑합니다.
 * 프로젝트에서 사용하는 아이콘이 추가될 때마다 이곳에 등록해주세요.
 */
const ICON_REGISTRY: Record<IconVariant, Record<string, ElementType>> = {
  line: {
  },
  filled: {
  },
  brand: {
  },
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Icon({
  name,
  variant = 'line',
  size = 24,
  color,
  ariaLabel,
  isDecorative = true,
  className = '',
}: IconProps) {
  const IconComponent = ICON_REGISTRY[variant]?.[name]

  if (!IconComponent) {
    console.warn(`[Icon] 아이콘을 찾을 수 없습니다: variant="${variant}", name="${name}"`)
    return null
  }

  // color prop이 주어지면 적용하고, 없으면 상속(currentColor)
  const finalClassName = [
    color,
    className
  ].filter(Boolean).join(' ')

  return (
    <IconComponent
      width={size}
      height={size}
      className={finalClassName || undefined}
      aria-hidden={isDecorative ? 'true' : undefined}
      aria-label={!isDecorative ? ariaLabel : undefined}
    />
  )
}
