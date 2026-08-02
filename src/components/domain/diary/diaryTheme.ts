import type { DiaryCalendarOutcome } from '@/types/domain/diary'

/** 캘린더 결과 점 색 — 피그마 시안 기준 (민트 / 코랄 / 회색) */
export const DIARY_OUTCOME_DOT: Record<DiaryCalendarOutcome, string> = {
  win: 'bg-Green-50',
  loss: 'bg-Pink-40',
  neutral: 'bg-Gray-4',
}

/** 캘린더 범례 — API 결과 유형(적중 / 오답 / 관망)을 따른다 */
export const DIARY_LEGEND: { outcome: DiaryCalendarOutcome; label: string }[] = [
  { outcome: 'win', label: '적중' },
  { outcome: 'loss', label: '오답' },
  { outcome: 'neutral', label: '관망' },
]

/** 범례 점은 캘린더 점보다 옅은 코랄을 쓴다 (피그마 스펙) */
export const DIARY_LEGEND_DOT: Record<DiaryCalendarOutcome, string> = {
  ...DIARY_OUTCOME_DOT,
  loss: 'bg-Pink-50',
}

/** AP 증감을 부호 포함 문자열로 (0은 부호 없이) */
export function formatApDelta(apDelta: number): string {
  if (apDelta === 0) return '0'

  return apDelta < 0 ? `${apDelta}` : `+${apDelta}`
}
