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
  return (
    <span
      onClick={() => onClick?.(termId)}
      className={`cursor-pointer bg-Yellow-80 text-Gray-10 underline decoration-Gray-10 decoration-1 underline-offset-4 font-semibold transition-colors ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </span>
  )
}
