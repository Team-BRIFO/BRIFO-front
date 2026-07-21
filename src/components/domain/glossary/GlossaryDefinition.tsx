import type { ReactNode } from 'react'

export interface GlossaryDefinitionProps {
  /** 상세 설명 텍스트 */
  children: ReactNode
  /** 커스텀 스타일 className */
  className?: string
}

export function GlossaryDefinition({ children, className = '' }: GlossaryDefinitionProps) {
  return (
    <div
      className={`pretendard-Button2 text-Gray-8 bg-Gray-1 rounded-2xl p-5 whitespace-pre-wrap ${className}`}
      style={{ lineHeight: '20px', letterSpacing: '-0.56px' }}
    >
      {children}
    </div>
  )
}
