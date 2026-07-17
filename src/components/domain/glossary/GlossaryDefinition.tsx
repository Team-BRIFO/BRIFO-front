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
      className={`whitespace-pre-wrap pretendard-Body1-Regular text-Gray-8 bg-Gray-1 p-5 rounded-2xl ${className}`}
    >
      {children}
    </div>
  )
}
