import { twMerge } from 'tailwind-merge'

import { ProgressBar } from '@/components/common/ProgressBar'
import type { DiaryRateGroup } from '@/types/domain/diary'

/**
 * 행 순서별 바 색상.
 * 피그마는 1행 Pink-40 / 2행 Yellow-60 / 3행 미지정(0%)이라 3행 색을 Green-50 으로 보완했다.
 * 행이 4개 이상이면 순환한다.
 * TODO: 디자인 확정 시 값 의미(방향·사원 등) 기준 색으로 교체 검토
 */
const BAR_COLORS = ['bg-Pink-40', 'bg-Yellow-60', 'bg-Green-50']

export interface DiaryRateProgressCardProps {
  group: DiaryRateGroup
  className?: string
}

/**
 * 비율 프로그레스 카드.
 * 그룹 기준(방향별·사원별·종목별 등)을 컴포넌트가 알지 못하므로,
 * API 명세가 확정되면 데이터만 교체하면 된다.
 */
export function DiaryRateProgressCard({ group, className = '' }: DiaryRateProgressCardProps) {
  const { title, subtitle, rows } = group

  return (
    <section
      className={twMerge(
        'bg-White border-Gray-2 flex flex-col gap-4 rounded-lg border px-5 py-4.5',
        className,
      )}
    >
      <header className="flex flex-col gap-1.5">
        <h3 className="dnf-Caption2 text-Gray-10">{title}</h3>
        <p className="pretendard-Caption3 text-Gray-6">{subtitle}</p>
      </header>

      {/* 행 간격 · 행 내부 간격 모두 9px (피그마 #584:5665) → gap-2.25 */}
      <div className="flex flex-col gap-2.25">
        {rows.map((row, index) => (
          <div key={row.label} className="flex items-center gap-2.25">
            <span className="pretendard-Caption3 text-Gray-6 w-10 shrink-0 truncate">
              {row.label}
            </span>

            <ProgressBar
              progress={row.value}
              barColor={BAR_COLORS[index % BAR_COLORS.length]}
              heightClassName="h-2.5"
            />

            <span className="pretendard-Caption3 text-Gray-6 w-8 shrink-0 text-right">
              {row.value}%
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
