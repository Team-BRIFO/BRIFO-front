import type { ReactNode } from 'react'

export interface GlossaryHighlightTextProps {
  /** 용어 공개 ID (API 호출용 UUID) */
  termId: string
  /** 강조할 용어 텍스트 */
  children: ReactNode
  /** 용어 클릭 시 팝업(바텀시트)을 띄우기 위한 이벤트 핸들러 */
  onClick?: (termId: string) => void
  className?: string
}

export function GlossaryHighlightText({
  termId,
  children,
  onClick,
  className = '',
}: GlossaryHighlightTextProps) {
  const baseClassName = `bg-Yellow-80 text-Gray-10 decoration-Gray-10 font-semibold underline decoration-1 underline-offset-4 transition-colors ${className}`

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(termId)}
        className={`cursor-pointer ${baseClassName}`}
      >
        {children}
      </button>
    )
  }

  return <span className={baseClassName}>{children}</span>
}
