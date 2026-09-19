import { twMerge } from 'tailwind-merge'

import type { AnalyzeResultType } from '@/components/feature/analyze/AnalyzeCard'
import { AnalyzeCard } from '@/components/feature/analyze/AnalyzeCard'
import { ALLOCATION_RATE_LEVEL_LABEL, DIRECTION_LABEL } from '@/mappers/diaryMapper'
import { useDiaryDayDetailQuery } from '@/pages/DiaryPage/hooks/useDiaryQueries'
import type { DiaryDayDetailItem } from '@/types/domain/diary'

export interface DiaryDateDetailProps {
  /** YYYY-MM-DD */
  date: string
  className?: string
}

function formatDateLabel(date: string): string {
  const [, month, day] = date.split('-')
  return `${Number(month)}월 ${Number(day)}일`
}

function toResultType({ direction, isCorrect }: DiaryDayDetailItem): AnalyzeResultType {
  const prefix = isCorrect ? 'SUCCESS' : 'FAIL'
  const suffix = direction === 'up' ? 'UP' : direction === 'down' ? 'DOWN' : 'HOLD'

  return `${prefix}_${suffix}` as AnalyzeResultType
}

/** 배분 비중(1~40%)을 소액/중간/집중 구간으로 묶는다 (통계 화면과 동일한 구간 정의) */
function allocationRateBand(ratePercent: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (ratePercent <= 13) return 'LOW'
  if (ratePercent <= 27) return 'MEDIUM'
  return 'HIGH'
}

/** 캘린더에서 날짜를 선택했을 때 보여주는 그날의 결정 상세 목록 (종목 · 사원 · 예측 · 결과) */
export function DiaryDateDetail({ date, className = '' }: DiaryDateDetailProps) {
  const { data, error, fetchStatus } = useDiaryDayDetailQuery(date)
  const isLoading = !data && !error
  const isError = !!error && fetchStatus === 'idle' && !data

  return (
    <div
      className={twMerge(
        'bg-White border-Gray-2 flex flex-col gap-3 rounded-lg border px-5 py-4',
        className,
      )}
    >
      <h3 className="dnf-Caption2 text-Gray-10">{formatDateLabel(date)}</h3>

      {isLoading ? (
        <p className="pretendard-Caption1 text-Gray-6">불러오는 중이에요...</p>
      ) : isError ? (
        <p className="pretendard-Caption1 text-Gray-6">이 날의 기록을 불러오지 못했어요.</p>
      ) : data!.items.length === 0 ? (
        <p className="pretendard-Caption1 text-Gray-6">이 날은 결정 기록이 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {data!.items.map((item) => (
            <li key={item.diaryId} className="flex items-start gap-2.5">
              {item.logoUrl ? (
                <img
                  src={item.logoUrl}
                  alt={`${item.stockName} 로고`}
                  className="bg-Gray-2 h-14 w-14 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="bg-Gray-2 h-14 w-14 shrink-0 rounded-full" />
              )}
              <div className="border-Gray-2 bg-White flex min-w-0 flex-1 flex-col overflow-hidden rounded-tl-2xl rounded-tr-2xl rounded-br-2xl border">
                <div className="flex items-center justify-between gap-2 px-2.5 pt-2">
                  <span className="pretendard-Caption1 text-Gray-10 truncate">
                    {item.agentNickname}
                  </span>
                  <span className="pretendard-Caption3 text-Gray-5 shrink-0">
                    {DIRECTION_LABEL[item.direction]} 배분{' '}
                    {ALLOCATION_RATE_LEVEL_LABEL[allocationRateBand(item.allocationRatePercent)]}
                  </span>
                </div>
                <AnalyzeCard
                  type="Analyze_small"
                  resultType={toResultType(item)}
                  apAmount={item.apDelta}
                  stock={{ name: item.stockName, logoUrl: item.logoUrl }}
                  showLogo={false}
                  nameClassName="dnf-Caption2 text-Gray-10"
                  className="rounded-none border-0"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
