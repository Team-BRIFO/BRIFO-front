import type { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import { DIARY_LEGEND, DIARY_OUTCOME_DOT } from '@/components/domain/diary/diaryTheme'
import type { DiaryCalendarOutcome } from '@/types/domain/diary'

const LABEL_BY_OUTCOME = Object.fromEntries(
  DIARY_LEGEND.map(({ outcome, label }) => [outcome, label]),
) as Record<DiaryCalendarOutcome, string>

export interface DiaryCalendarDayProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
  /** 표시할 날짜(일) */
  day: number
  /** 그날 존재한 정산 결과 (빈 배열이면 회색 점 1개) */
  outcomes?: DiaryCalendarOutcome[]
}

/**
 * 캘린더 한 칸 (40×40 · 날짜 + 결과 점, 최대 3개)
 */
export function DiaryCalendarDay({
  day,
  outcomes = [],
  className = '',
  ...props
}: DiaryCalendarDayProps) {
  const hasDecision = outcomes.length > 0
  const summary = hasDecision
    ? outcomes.map((outcome) => LABEL_BY_OUTCOME[outcome]).join(', ')
    : '결정 없음'

  return (
    <button
      type="button"
      aria-label={`${day}일 ${summary}`}
      className={twMerge(
        'flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1 rounded-lg',
        'focus-visible:ring-Yellow-45 focus-visible:ring-2 focus-visible:outline-hidden',
        className,
      )}
      {...props}
    >
      {/* Main/Subtitle/Bold16 — 유틸리티가 Semibold 라 굵기만 덮어쓴다 */}
      <span className="pretendard-Body1-Semibold text-Gray-8 text-sm font-bold md:text-base">
        {day}
      </span>

      <span className="flex items-center gap-0.5" aria-hidden="true">
        {hasDecision ? (
          outcomes.map((outcome) => (
            <span
              key={outcome}
              className={twMerge('h-1.5 w-1.5 rounded-full', DIARY_OUTCOME_DOT[outcome])}
            />
          ))
        ) : (
          <span className="bg-Background1 h-1 w-1 rounded-full" />
        )}
      </span>
    </button>
  )
}
