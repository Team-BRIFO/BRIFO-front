import type { ReactNode } from 'react'

import { GlossaryHighlightText } from '@/components/domain/glossary/GlossaryHighlightText'
import type { GlossaryTerm } from '@/types/domain/glossary'

export interface NewsCardPointListProps {
  title?: string
  points: string[]
  terms?: GlossaryTerm[]
  onTermClick?: (termId: string) => void
  className?: string
}

/**
 * 카드 전체(3줄 요약)에서 같은 용어가 여러 번 나와도 가장 처음 등장한 자리만
 * 형광펜 처리한다. 이미 처리된 용어는 usedTermIds에 표시해 이후 줄에서 건너뛴다.
 */
const renderHighlightedText = (
  text: string,
  terms: GlossaryTerm[] | undefined,
  usedTermIds: Set<string>,
  onTermClick?: (termId: string) => void,
): ReactNode => {
  if (!terms || terms.length === 0) return text

  let elements: ReactNode[] = [text]

  for (const term of terms) {
    if (usedTermIds.has(term.termId)) continue

    let highlighted = false
    elements = elements.flatMap((el, idx) => {
      if (highlighted || typeof el !== 'string') return el

      const matchIndex = el.indexOf(term.surface)
      if (matchIndex === -1) return el

      highlighted = true
      const before = el.slice(0, matchIndex)
      const after = el.slice(matchIndex + term.surface.length)
      return [
        before,
        <GlossaryHighlightText
          key={`${term.termId}-${idx}`}
          termId={term.termId}
          onClick={onTermClick}
        >
          {term.surface}
        </GlossaryHighlightText>,
        after,
      ]
    })

    if (highlighted) usedTermIds.add(term.termId)
  }

  return <>{elements}</>
}

export function NewsCardPointList({
  title,
  points,
  terms,
  onTermClick,
  className = '',
}: NewsCardPointListProps) {
  if (!points || points.length === 0) return null

  const usedTermIds = new Set<string>()

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {title && <h3 className="text-Yellow-30 dnf-Caption2">{title}</h3>}
      <ul className="flex flex-col gap-1">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="bg-Gray-10 mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
            <p className="text-Gray-10 pretendard-Caption1 leading-relaxed">
              {renderHighlightedText(point, terms, usedTermIds, onTermClick)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
