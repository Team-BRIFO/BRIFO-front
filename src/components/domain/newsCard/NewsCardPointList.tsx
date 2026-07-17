//import { GlossaryHighlightText } from '@/components/domain/glossary/GlossaryHighlightText'

export interface NewsCardPointListProps {
  points: string[]
  glossaryTerms?: string[]
  className?: string
}

export function NewsCardPointList({ points, glossaryTerms = [], className = '' }: NewsCardPointListProps) {
  if (!points || points.length === 0) return null

  return (
    <ul className={`flex flex-col gap-2 ${className}`}>
      {points.map((point, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="text-Gray-10 mt-1 shrink-0">•</span>
          <p className="text-Gray-8 pretendard-Body1 leading-relaxed">
            {point}
            {/* 추후 glossary 도메인 컴포넌트 추가 시 아래 코드로 교체 */}
            {/* <GlossaryHighlightText
              text={point}
              highlightWord={glossaryTerms}
              highlightClassName="text-Yellow-30 font-semibold bg-Yellow-100 px-1 rounded"
            /> */}
          </p>
        </li>
      ))}
    </ul>
  )
}
