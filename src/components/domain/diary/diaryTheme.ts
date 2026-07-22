import type { DiaryDirection } from '@/types/domain/diary'

/**
 * 캘린더 점 색 — 피그마 시안 기준 (민트 / 코랄 / 회색).
 *
 * 백엔드 문의: 시안의 점은 **결과 유형(적중·오답·관망)** 인데,
 * `GET /api/diaries/calendar` 는 `days[].direction = { up, down, neutral }` 로
 * **방향만** 내려준다. `correctDecisionCount` 는 월 합계라 날짜별로 쪼갤 수 없다.
 *
 * 그래서 지금은 시안의 색·범례를 그대로 쓰되 점을 방향으로 채우고 있다.
 * → 상승 결정이 민트("적중") 점으로 보이는 등 **의미가 맞지 않는 상태**다.
 * 백엔드가 날짜별 outcome( correct / incorrect / neutral )을 추가하면 그대로 교체하면 된다.
 */
export const DIARY_DIRECTION_DOT: Record<DiaryDirection, string> = {
  up: 'bg-Green-50',
  down: 'bg-Pink-40',
  neutral: 'bg-Gray-4',
}

/**
 * 캘린더 범례 — 피그마 시안의 라벨(적중 / 오답 / 관망)과 색을 그대로 따른다.
 * 라벨과 실제 데이터(방향)의 불일치는 위 주석 참고.
 */
export const DIARY_LEGEND: { direction: DiaryDirection; label: string }[] = [
  { direction: 'up', label: '적중' },
  { direction: 'down', label: '오답' },
  { direction: 'neutral', label: '관망' },
]

/** 범례 점은 캘린더 점보다 옅은 코랄을 쓴다 (피그마 스펙) */
export const DIARY_LEGEND_DOT: Record<DiaryDirection, string> = {
  ...DIARY_DIRECTION_DOT,
  down: 'bg-Pink-50',
}

/** AP 증감을 부호 포함 문자열로 (0은 부호 없이) */
export function formatApDelta(apDelta: number): string {
  if (apDelta === 0) return '0'

  return apDelta < 0 ? `${apDelta}` : `+${apDelta}`
}
