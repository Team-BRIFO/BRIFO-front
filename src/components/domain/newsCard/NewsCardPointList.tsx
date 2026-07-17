//import { GlossaryHighlightText } from '@/components/domain/glossary/GlossaryHighlightText'

export interface TermItem {
  termId: string
  surface: string
  displayOrder: number
}

export interface NewsCardPointListProps {
  title?: string
  points: string[]
  terms?: TermItem[]
  className?: string
}

export function NewsCardPointList({
  title,
  points,
  className = '',
}: NewsCardPointListProps) {
  if (!points || points.length === 0) return null

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {title && <h3 className="text-Yellow-30 dnf-Caption2 mb-1">{title}</h3>}
      <ul className="flex flex-col gap-2">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-Gray-10 mt-0.5 shrink-0 text-[12px] leading-tight">•</span>
            <p className="text-Gray-10 pretendard-Caption1 leading-relaxed">
              {point}
              {/* 추후 glossary 도메인 컴포넌트 추가 시 아래 코드로 교체 */}
              {/* <GlossaryHighlightText
                text={point}
                terms={terms}
                highlightClassName="text-Yellow-30 font-semibold bg-Yellow-100 px-1 rounded"
              /> */}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
