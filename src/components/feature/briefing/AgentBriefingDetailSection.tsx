import { Badge } from '@/components/common/Badge'
import Button from '@/components/common/Button'
import { AgentAvatar } from '@/components/domain/agent/AgentAvatar'
import { AgentLevelBar } from '@/components/domain/agent/AgentLevelBar'
import { BriefingNote } from '@/components/domain/briefing/BriefingNote'
import type { AgentType } from '@/types/domain/agent'

export interface AgentBriefingDetailSectionProps {
  /** 1. AI 사원 상태 요약 데이터 (Agent 프로필 및 사양) */
  agent: {
    type: AgentType
    name: string
    modelName: string
    hitRate: number
    salary: number
    level: number
    expProgress: number
  }
  /** 2. 브리핑 요약 텍스트 정보 */
  briefing: {
    opinion: 'UP' | 'HOLD' | 'DOWN'
    confidence: number
    headline: string
    message: string
  }
  /** 3. 하단 결정 버튼 트리거 액션 핸들러 */
  onConfirmDecision: () => void
}

export function AgentBriefingDetailSection({
  agent,
  briefing,
  onConfirmDecision,
}: AgentBriefingDetailSectionProps) {
  // 방향성(Opinion)에 따른 배지 매핑
  const renderOpinionBadge = () => {
    switch (briefing.opinion) {
      case 'UP':
        return <Badge type="rise">상승 예측</Badge>
      case 'DOWN':
        return <Badge type="fall">하락 예측</Badge>
      case 'HOLD':
        return <Badge type="watch">관망 예측</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex w-[328px] flex-col gap-[22px] px-4">
      {/* 1. Agent_Meta_Card */}
      <div className="border-Gray-2 flex flex-col overflow-hidden rounded-xl border bg-white">
        {/* Profile_Row */}
        <div className="flex items-center gap-3 p-4">
          <AgentAvatar type={agent.type} size={60} hasCircleBg />
          <div className="flex flex-col gap-1">
            {/* Name_Row */}
            <div className="flex items-center gap-2">
              <span className="pretendard-Body1-Bold text-Gray-10">{agent.name}</span>
              <span className="pretendard-Caption1 text-Gray-6">{agent.modelName}</span>
            </div>
            {/* Record_Row */}
            <span className="pretendard-Caption1 text-Gray-6">
              적중 {agent.hitRate}% · 일급 {agent.salary}AP
            </span>
          </div>
        </div>

        {/* AgentExpProgress */}
        <AgentLevelBar type={agent.type} level={agent.level} levelProgress={agent.expProgress} />
      </div>

      {/* 2. Briefing_Content_Group */}
      <div className="flex flex-col gap-3">
        {/* Badge_Row */}
        <div className="flex items-center gap-[6px]">
          {renderOpinionBadge()}
          <Badge type="normal">확신 {briefing.confidence}%</Badge>
        </div>
        {/* Headline_Text */}
        <h2 className="pretendard-Title4 text-Gray-10 w-full font-bold break-words">
          {briefing.headline}
        </h2>
      </div>

      {/* 3. BriefingNote */}
      <BriefingNote message={briefing.message} />

      {/* 4. Confirm_Action_Button */}
      <Button isFullWidth className="!bg-[#FFBB00] !text-white" onClick={onConfirmDecision}>
        이 브리핑으로 결정
      </Button>
    </div>
  )
}
