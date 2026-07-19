import { AgentProfileCard } from '@/components/domain/agent/AgentProfileCard'
import { AgentStatGrid } from '@/components/domain/agent/AgentStatGrid'
import type { AgentDetail } from '@/types/domain/agent'

export interface AgentDetailSectionProps {
  agent: AgentDetail
}

/** 사원 상세 화면 본문 (프로필 카드 · 통계 2×2 그리드) */
export function AgentDetailSection({ agent }: AgentDetailSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <AgentProfileCard agent={agent} />
      <AgentStatGrid stats={agent.stats} />
    </div>
  )
}
