import { Banner } from '@/components/common/Banner'
import { AgentCard } from '@/components/domain/agent/AgentCard'
import type { AgentSummary } from '@/types/domain/agent'

export interface AgentListSectionProps {
  agents: AgentSummary[]
  /** 사원 카드 선택 시 (상세 이동) */
  onSelectAgent?: (id: string) => void
}

/** 사원 목록 화면 본문 (헤더 · 사원 카드 리스트 · 안내 배너) */
export function AgentListSection({ agents, onSelectAgent }: AgentListSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="dnf-Subtitle2 text-Gray-10">사원</h1>
        <p className="pretendard-Body2-Regular text-Gray-6">내 AI 사원들을 관리하세요</p>
      </header>

      <div className="flex flex-col gap-3">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onClick={() => onSelectAgent?.(agent.id)} />
        ))}
      </div>

      <Banner variant="guide">
        <span className="block">사원은 예측이 적중할 때마다 EXP를 얻고 레벨업해요.</span>
        <span className="block">레벨이 오르면 보고서가 더 깊어집니다.</span>
      </Banner>
    </div>
  )
}
