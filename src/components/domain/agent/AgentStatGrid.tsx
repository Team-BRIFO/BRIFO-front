import { twMerge } from 'tailwind-merge'

import { AgentStatCard } from '@/components/domain/agent/AgentStatCard'
import type { AgentStats } from '@/types/domain/agent'

export interface AgentStatGridProps {
  stats: AgentStats
  className?: string
}

/** 사원 상세 통계 2×2 그리드 (적중률 · 누적분석 · 기여 AP · 연속 근무) */
export function AgentStatGrid({ stats, className = '' }: AgentStatGridProps) {
  const { hitRate, totalAnalysis, contributedAP, workStreak } = stats

  return (
    <div className={twMerge('grid grid-cols-2 gap-2', className)}>
      <AgentStatCard value={hitRate} unit="%" label="적중률" />
      <AgentStatCard value={totalAnalysis} unit="건" label="누적분석" />
      <AgentStatCard value={contributedAP.toLocaleString()} label="기여 AP" />
      <AgentStatCard value={workStreak} unit="일" label="연속 근무" />
    </div>
  )
}
