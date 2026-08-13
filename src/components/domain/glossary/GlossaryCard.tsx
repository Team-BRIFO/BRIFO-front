import { twMerge } from 'tailwind-merge'

import type { MyGlossaryEntry } from '@/types/domain/glossary'

export interface GlossaryCardProps {
  entry: MyGlossaryEntry
  className?: string
}

function formatLearnedDayLabel(isoDate: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate)
  if (!match) return isoDate.slice(0, 10)

  const learned = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)!.value)
  const today = Date.UTC(value('year'), value('month') - 1, value('day'))
  const diffDays = Math.round((today - learned.getTime()) / 86_400_000)

  if (diffDays === 0) return '오늘'
  if (diffDays === 1) return '어제'
  if (diffDays > 1 && diffDays < 7) return `${diffDays}일 전`
  return `${Number(match[2])}/${Number(match[3])}`
}

/**
 * 내 용어장 카드 (용어 · 뜻풀이 · 학습일)
 *
 * TODO(#31): 용어장 도메인 이슈에서 공용 용어 카드가 나오면 이 컴포넌트를 대체할 것.
 */
export function GlossaryCard({ entry, className = '' }: GlossaryCardProps) {
  const { term, definition, learnedAt } = entry

  return (
    <article
      className={twMerge(
        'border-Gray-2 bg-White flex w-full flex-col gap-3 rounded-lg border px-5 py-4 text-left',
        className,
      )}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <span className="dnf-Caption1 text-Gray-10 truncate leading-none">{term}</span>
        <span className="pretendard-Caption4 text-Gray-6 shrink-0">
          {formatLearnedDayLabel(learnedAt)}
        </span>
      </div>

      <p className="pretendard-Caption2 text-Gray-7 w-full leading-[1.32]">{definition}</p>
    </article>
  )
}
