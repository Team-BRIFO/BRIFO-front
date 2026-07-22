import { twMerge } from 'tailwind-merge'

import type { DiaryHitRate } from '@/types/domain/diary'

import { DIARY_LEGEND, DIARY_LEGEND_DOT } from './diaryTheme'

export interface DiaryHitRateCardProps {
  hitRate: DiaryHitRate
  /**
   * 표시 형태
   * - 'calendar': 캘린더 하단 — 흰 배경, 우측에 방향 범례
   * - 'statistics': 통계 상단 — Yellow 배경, 범례 없이 우측에 수치
   */
  variant?: 'calendar' | 'statistics'
  className?: string
}

/** 종합 적중률 카드 (캘린더 하단 · 통계 상단 공용) */
export function DiaryHitRateCard({
  hitRate,
  variant = 'calendar',
  className = '',
}: DiaryHitRateCardProps) {
  const { rate, totalCount, periodLabel } = hitRate
  const isStatistics = variant === 'statistics'
  const summary = `${periodLabel} · 결정 ${totalCount}건`

  const rateText = (
    <p className="dnf-Title2 text-Yellow-30 flex items-center gap-0.5">
      <span>{rate}</span>
      <span>%</span>
    </p>
  )

  return (
    <div
      className={twMerge(
        'flex w-full items-center justify-between rounded-lg border',
        isStatistics
          ? 'bg-Yellow-105 border-Yellow-80 px-4 py-3'
          : 'bg-White border-Gray-2 px-5 py-4',
        className,
      )}
    >
      <div className={twMerge('flex flex-col', isStatistics ? 'gap-1.5' : 'gap-2')}>
        <h2 className="dnf-Caption2 text-Gray-10">종합 적중률</h2>
        {!isStatistics && rateText}
        <p className="pretendard-Caption3 text-Gray-6">{summary}</p>
      </div>

      {isStatistics ? (
        rateText
      ) : (
        // 백엔드 문의: 라벨(적중/오답/관망)은 시안 그대로지만 실제 데이터는 방향이다 — diaryTheme 주석 참고
        <ul className="flex flex-col gap-2">
          {DIARY_LEGEND.map(({ direction, label }) => (
            <li key={direction} className="flex items-center gap-1">
              <span
                className={twMerge('h-3 w-3 rounded-full', DIARY_LEGEND_DOT[direction])}
                aria-hidden="true"
              />
              <span className="pretendard-Caption1 text-Gray-10">{label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
