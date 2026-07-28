import type { ReactNode } from 'react'

export interface GlossaryDefinitionProps {
  /** 상세 설명 텍스트 */
  children: ReactNode
  /** 커스텀 스타일 className */
  className?: string
}

export function GlossaryDefinition({ children, className = '' }: GlossaryDefinitionProps) {
  return (
    // 용어 설명은 Button2(14px/line-height 100%)보다 긴 문단이므로, 피그마 스펙의
    // 20px 줄높이와 -0.56px 자간을 적용한다. 동등한 타이포 유틸이 생기면 그 유틸로 교체한다.
    <div
      className={`pretendard-Button2 text-Gray-8 bg-Background1 rounded-2xl p-5 whitespace-pre-wrap ${className}`}
      style={{ lineHeight: '20px', letterSpacing: '-0.56px' }}
    >
      {children}
    </div>
  )
}
