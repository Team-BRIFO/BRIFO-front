import type { DiaryCalendarOutcome, DiaryDayMark } from '@/types/domain/diary'

/** 캘린더 그리드 한 칸 */
export interface DiaryCalendarCell {
  /** 일(1~31). 앞 여백 칸은 null */
  day: number | null
  /** 그날 존재한 정산 결과 */
  outcomes: DiaryCalendarOutcome[]
}

/** YYYY-MM-DD 로 포맷 */
export function toDateKey(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')

  return `${year}-${mm}-${dd}`
}

/**
 * 해당 월의 캘린더 주(week) 배열을 만든다.
 * - 첫 주는 시작 요일만큼 앞을 비우고(피그마도 첫 주가 우측 정렬), 마지막 주는 채우지 않는다.
 * - month 는 1~12
 */
export function buildCalendarWeeks(
  year: number,
  month: number,
  marks: DiaryDayMark[],
): DiaryCalendarCell[][] {
  const outcomesByDate = new Map(marks.map((mark) => [mark.date, mark.outcomes]))

  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const lastDay = new Date(year, month, 0).getDate()

  const cells: DiaryCalendarCell[] = [
    ...Array.from({ length: firstWeekday }, () => ({ day: null, outcomes: [] })),
    ...Array.from({ length: lastDay }, (_, index) => {
      const day = index + 1

      return {
        day,
        outcomes: outcomesByDate.get(toDateKey(year, month, day)) ?? [],
      }
    }),
  ]

  const weeks: DiaryCalendarCell[][] = []
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }

  return weeks
}

/** 이전/다음 달로 이동한 {year, month} 를 반환 (month 는 1~12) */
export function shiftMonth(year: number, month: number, delta: number) {
  const date = new Date(year, month - 1 + delta, 1)

  return { year: date.getFullYear(), month: date.getMonth() + 1 }
}
