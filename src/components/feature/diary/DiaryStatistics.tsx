import { DiaryHitRateCard } from '@/components/domain/diary/DiaryHitRateCard'
import { DiaryRateProgressCard } from '@/components/domain/diary/DiaryRateProgressCard'
import { DiaryStatTile } from '@/components/domain/diary/DiaryStatTile'
import type { DiaryStatistics as DiaryStatisticsData } from '@/types/domain/diary'

export interface DiaryStatisticsProps {
  statistics: DiaryStatisticsData
}

/**
 * 결정일기 통계 뷰 (적중률 요약 · 지표 타일 · 비율 프로그레스)
 *
 * 디자인 문의 — 시안 라벨이 실제 데이터와 맞지 않는 곳이 있다:
 *   - 타일 2번: 시안이 1번과 동일한 "87건 누적결정" 플레이스홀더 → correctDecisionCount(적중)로 채움
 *   - 타일 4번: 시안 "연속 근무" → 실제 값은 bestCorrectStreak(최고 연속 적중)
 *   - 확신도 카드 행: 시안 "루키/프로/탱커" → 실제는 LOW/MEDIUM/HIGH 3구간
 */
export function DiaryStatistics({ statistics }: DiaryStatisticsProps) {
  const { hitRate, items, groups } = statistics

  return (
    <div className="flex flex-col gap-2">
      <DiaryHitRateCard hitRate={hitRate} variant="statistics" />

      {/* 타일 개수는 데이터가 정한다 — 2열 그리드로 흐르게 둔다 */}
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <DiaryStatTile key={item.id} item={item} />
        ))}
      </div>

      {groups.map((group) => (
        <DiaryRateProgressCard key={group.id} group={group} />
      ))}
    </div>
  )
}
