import { twMerge } from 'tailwind-merge'

import { DIARY_LEGEND, DIARY_LEGEND_DOT } from '@/components/domain/diary/diaryTheme'
import type { DiaryCalendarOutcome } from '@/types/domain/diary'

export interface DiaryDateDetailProps {
  /** YYYY-MM-DD */
  date: string
  /** 그날 존재한 정산 결과 */
  outcomes: DiaryCalendarOutcome[]
  className?: string
}

function formatDateLabel(date: string): string {
  const [, month, day] = date.split('-')
  return `${Number(month)}월 ${Number(day)}일`
}

/** 캘린더에서 날짜를 선택했을 때 보여주는 그날의 결과 요약 카드 */
export function DiaryDateDetail({ date, outcomes, className = '' }: DiaryDateDetailProps) {
  const hasDecision = outcomes.length > 0
  const counts = DIARY_LEGEND.map(({ outcome, label }) => ({
    outcome,
    label,
    count: outcomes.filter((item) => item === outcome).length,
  }))

  return (
    <div
      className={twMerge(
        'bg-White border-Gray-2 flex flex-col gap-3 rounded-lg border px-5 py-4',
        className,
      )}
    >
      <h3 className="dnf-Caption2 text-Gray-10">{formatDateLabel(date)}</h3>

      {hasDecision ? (
        <ul className="flex flex-wrap items-center gap-4">
          {counts
            .filter(({ count }) => count > 0)
            .map(({ outcome, label, count }) => (
              <li key={outcome} className="flex items-center gap-1.5">
                <span
                  className={twMerge('h-2.5 w-2.5 rounded-full', DIARY_LEGEND_DOT[outcome])}
                  aria-hidden="true"
                />
                <span className="pretendard-Caption1 text-Gray-10">
                  {label} {count}건
                </span>
              </li>
            ))}
        </ul>
      ) : (
        <p className="pretendard-Caption1 text-Gray-6">이 날은 결정 기록이 없어요.</p>
      )}
    </div>
  )
}
