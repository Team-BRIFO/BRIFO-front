import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react'
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react'
import { DiaryCalendarDay } from '@/components/domain/diary/DiaryCalendarDay'
import { DiaryHitRateCard } from '@/components/domain/diary/DiaryHitRateCard'
import type { DiaryDayMark, DiaryHitRate } from '@/types/domain/diary'
import { buildCalendarWeeks, toDateKey } from '@/utils/diaryCalendar'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export interface DiaryCalendarProps {
  /** 표시 중인 연도 */
  year: number
  /** 표시 중인 월 (1~12) */
  month: number
  marks: DiaryDayMark[]
  hitRate: DiaryHitRate
  onChangeMonth: (delta: number) => void
  /** 날짜 선택 시 (YYYY-MM-DD) */
  onSelectDate?: (date: string) => void
}

/** 결정일기 캘린더 뷰 (월 네비 · 요일 · 날짜 그리드 · 적중률 카드) */
export function DiaryCalendar({
  year,
  month,
  marks,
  hitRate,
  onChangeMonth,
  onSelectDate,
}: DiaryCalendarProps) {
  const weeks = buildCalendarWeeks(year, month, marks)

  return (
    <div className="flex flex-col gap-4">
      {/* 월 네비 → 그리드 13px (피그마 #587:4790) */}
      <div className="flex flex-col gap-[13px]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="이전 달"
            onClick={() => onChangeMonth(-1)}
            className="focus-visible:ring-Yellow-45 [&_path]:fill-Gray-6 flex h-6 w-6 items-center justify-center focus-visible:ring-2 focus-visible:outline-hidden"
          >
            <ChevronLeftIcon width={24} height={24} aria-hidden="true" />
          </button>

          <p className="dnf-Caption1 text-Gray-10 flex items-center gap-0.5">
            <span>{year}.</span>
            <span>{String(month).padStart(2, '0')}</span>
          </p>

          <button
            type="button"
            aria-label="다음 달"
            onClick={() => onChangeMonth(1)}
            className="focus-visible:ring-Yellow-45 [&_path]:fill-Gray-6 flex h-6 w-6 items-center justify-center focus-visible:ring-2 focus-visible:outline-hidden"
          >
            <ChevronRightIcon width={24} height={24} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between px-4 py-3">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday} className="pretendard-Body1-Semibold text-Gray-10">
                {weekday}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex items-center gap-2">
                {week.map(({ day, directions }, cellIndex) =>
                  day === null ? (
                    <span key={`empty-${cellIndex}`} className="h-10 w-10 shrink-0" />
                  ) : (
                    <DiaryCalendarDay
                      key={day}
                      day={day}
                      directions={directions}
                      onClick={() => onSelectDate?.(toDateKey(year, month, day))}
                    />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <DiaryHitRateCard hitRate={hitRate} variant="calendar" />
    </div>
  )
}
