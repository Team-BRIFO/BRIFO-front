import type { ElementType, ReactNode } from 'react'

export type ContainerVariant = 'page' | 'section' | 'fluid'
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg'

export interface ContainerProps {
  /** 컨테이너 내부 콘텐츠 */
  children: ReactNode

  /**
   * 컨테이너 용도
   * - page: 모바일 화면 전체를 감싸는 최상위 래퍼 (기본 360px 고정, 중앙 정렬, 배경/테두리 포함, 최소 높이 화면 꽉 참)
   * - section: 페이지 내부의 구역 (최대 너비 360px 유지, 배경 투명)
   * - fluid: 너비 제한 없이 100% 꽉 차는 구역
   */
  variant?: ContainerVariant

  /** 렌더링할 HTML 시맨틱 태그 (기본값: 'div') */
  as?: ElementType

  /** 좌우 padding 크기 */
  padding?: ContainerPadding

  /**
   * 최대 너비 (기본값: 360)
   * 모바일 뷰 고정을 원칙으로 하므로 360px을 기본으로 사용
   */
  maxWidth?: number | string

  /** 가운데 정렬 여부 (variant="page"일 때는 기본 true) */
  isCentered?: boolean

  /** 추가 스타일 className */
  className?: string
}

// ─── Style Maps ──────────────────────────────────────────────────────────────

const PADDING_CLASS: Record<ContainerPadding, string> = {
  none: 'px-0',
  sm: 'px-4', // 16px
  md: 'px-5', // 20px
  lg: 'px-6', // 24px
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Container({
  children,
  variant = 'page',
  as: Component = 'div',
  padding = 'md',
  maxWidth = 360,
  isCentered = true,
  className = '',
}: ContainerProps) {
  // 1. 최대 너비와 중앙 정렬 처리
  const isFluid = variant === 'fluid'
  const widthClass = isFluid ? 'w-full' : 'w-full'
  const maxWidthStyle = isFluid
    ? undefined
    : { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }
  const centerClass = isCentered && !isFluid ? 'mx-auto' : ''

  // 2. 패딩 처리
  const paddingClass = PADDING_CLASS[padding]

  // 3. Variant별 고유 스타일 (피그마 스펙 반영)
  // page: 화면 꽉 차는 높이, 세로 배치, 흰색 배경, 피그마에서 요청한 0.5px 검은 테두리
  const variantClass = variant === 'page' ? 'min-h-screen flex flex-col bg-White ' : ''

  const baseClass = [widthClass, centerClass, paddingClass, variantClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={baseClass} style={maxWidthStyle}>
      {children}
    </Component>
  )
}
