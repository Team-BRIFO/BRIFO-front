import { GlossaryStatusBadge } from '@/components/feature/glossary/GlossaryStatusBadge'

export interface GlossaryTermItemProps {
  /** 용어 제목 */
  term: string
  /** 학습 여부 */
  isLearned?: boolean
  /** 커스텀 스타일 className */
  className?: string
}

export function GlossaryTermItem({
  term,
  isLearned = false,
  className = '',
}: GlossaryTermItemProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <h2 className="dnf-Title4 text-Gray-10">{term}</h2>
      <GlossaryStatusBadge isLearned={isLearned} />
    </div>
  )
}
