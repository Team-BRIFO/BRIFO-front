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

const renderHighlightedText = (
  text: string,
  terms?: GlossaryTerm[],
  onTermClick?: (termId: string) => void
): ReactNode => {
  if (!terms || terms.length === 0) return text

  let elements: ReactNode[] = [text]

  for (const term of terms) {
    elements = elements.flatMap((el, idx) => {
      if (typeof el !== 'string') return el

      const parts = el.split(term.surface)
      if (parts.length === 1) return el

      const result: ReactNode[] = []
      parts.forEach((part, partIdx) => {
        result.push(part)
        if (partIdx < parts.length - 1) {
          result.push(
            <GlossaryHighlightText
              key={`${term.termId}-${idx}-${partIdx}`}
              termId={term.termId}
              onClick={onTermClick}
            >
              {term.surface}
            </GlossaryHighlightText>
          )
        }
      })
      return result
    })
  }

  return <>{elements}</>
}

export function NewsCardPointList({ title, points, terms, onTermClick, className = '' }: NewsCardPointListProps) {
  if (!points || points.length === 0) return null

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {title && <h3 className="text-Yellow-30 dnf-Caption2">{title}</h3>}
      <ul className="flex flex-col gap-1">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="bg-Gray-10 mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
            <p className="text-Gray-10 pretendard-Caption1 leading-relaxed">
              {renderHighlightedText(point, terms, onTermClick)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
