export interface GlossaryTermItemProps {
  /** 용어 제목 */
  term: string
  /** 커스텀 스타일 className */
  className?: string
}

export function GlossaryTermItem({ term, className = '' }: GlossaryTermItemProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <h2 className="dnf-Title4 text-Gray-10">{term}</h2>
    </div>
  )
}
