import type { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import { DIARY_DIRECTION_DOT, DIARY_LEGEND } from '@/components/domain/diary/diaryTheme'
import type { DiaryDirection } from '@/types/domain/diary'

const LABEL_BY_DIRECTION = Object.fromEntries(
  DIARY_LEGEND.map(({ direction, label }) => [direction, label]),
) as Record<DiaryDirection, string>

export interface DiaryCalendarDayProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
  /** 표시할 날짜(일) */
  day: number
  /** 그날 존재한 결정 방향 (빈 배열이면 회색 점 1개) */
  directions?: DiaryDirection[]
}

/**
 * 캘린더 한 칸 (40×40 · 날짜 + 결과 점, 최대 3개)
 *
 * 백엔드 문의: 결과 점을 위해 API 방향값을 임시로 사용한다 — diaryTheme 주석 참고.
 */
export function DiaryCalendarDay({
  day,
  directions = [],
  className = '',
  ...props
}: DiaryCalendarDayProps) {
  const hasDecision = directions.length > 0
  const summary = hasDecision
    ? directions.map((direction) => LABEL_BY_DIRECTION[direction]).join(', ')
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
          directions.map((direction) => (
            <span
              key={direction}
              className={twMerge('h-1.5 w-1.5 rounded-full', DIARY_DIRECTION_DOT[direction])}
            />
          ))
        ) : (
          <span className="bg-Background1 h-1 w-1 rounded-full" />
        )}
      </span>
    </button>
  )
}
