import type { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import { AgentAvatar } from '@/components/domain/agent/AgentAvatar'
import { AgentLevelBar } from '@/components/domain/agent/AgentLevelBar'
import { AGENT_THEME } from '@/components/domain/agent/agentTheme'
import { formatWon } from '@/components/domain/ap/apTransactionMeta'
import type { AgentSummary } from '@/types/domain/agent'

export interface AgentCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  agent: AgentSummary
  /** 선택/활성 상태 — 타입 색 테두리(2px)로 강조 */
  active?: boolean
  /** 세로 공간이 좁은 목록(예: 튜토리얼)에서 아바타·여백을 줄인다 */
  compact?: boolean
}

interface StatItemProps {
  label: string
  value: string
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <span className="pretendard-Caption2 text-Gray-6 inline-flex items-center gap-1">
      <span>{label}</span>
      <span>{value}</span>
    </span>
  )
}

/** 사원 목록 카드 (AI_level: 아바타 · 이름/모델 · 적중/일급 · 레벨 바 · Active 상태) */
export function AgentCard({
  agent,
  active = false,
  compact = false,
  className = '',
  ...props
}: AgentCardProps) {
  const { type, name, modelName, level, levelProgress, hitRate, dailyAP } = agent
  const { activeBorderClassName } = AGENT_THEME[type]

  return (
    <button
      type="button"
      className={twMerge(
        'bg-White flex w-full flex-col overflow-hidden rounded-lg text-left',
        'shadow-[0px_4px_40px_0px_color-mix(in_srgb,var(--color-Gray-2)_15%,transparent)]',
        active ? `border-2 ${activeBorderClassName}` : 'border-Gray-2 border',
        'focus-visible:ring-Yellow-45 focus-visible:ring-2 focus-visible:outline-hidden',
        className,
      )}
      {...props}
    >
      <div className={`flex items-center ${compact ? 'gap-3 px-3.5 py-3' : 'gap-4 px-4 py-3.5'}`}>
        <AgentAvatar type={type} size={compact ? 52 : 60} />

        <div className={`flex min-w-0 flex-1 flex-col ${compact ? 'gap-1.5' : 'gap-2'}`}>
          <div className={`flex flex-col ${compact ? 'gap-1' : 'gap-1.5'}`}>
            <span className="dnf-Subtitle3 text-Gray-10">{name}</span>
            <span className="pretendard-Caption2 text-Gray-6 truncate">{modelName}</span>
          </div>

          <div className="flex items-center gap-2">
            <StatItem label="적중" value={`${hitRate}%`} />
            <StatItem label="의뢰비" value={formatWon(dailyAP)} />
          </div>
        </div>
      </div>

      <AgentLevelBar type={type} level={level} levelProgress={levelProgress} compact={compact} />
    </button>
  )
}
