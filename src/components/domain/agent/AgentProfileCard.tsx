import { Badge } from '@/components/common/Badge'
import type { AgentDetail } from '@/types/domain/agent'

import { AgentAvatar } from './AgentAvatar'
import { AgentLevelBar } from './AgentLevelBar'
import { AGENT_THEME } from './agentTheme'

export interface AgentProfileCardProps {
  agent: AgentDetail
  className?: string
}

/** 사원 상세 프로필 카드 (아바타 · 이름/소개 · Badge · EXP · 레벨 진행 바) */
export function AgentProfileCard({ agent, className = '' }: AgentProfileCardProps) {
  const { type, name, modelName, description, level, levelProgress, exp } = agent
  const { profileBadgeClassName, accentTextClassName } = AGENT_THEME[type]

  return (
    <div
      className={[
        'border-Gray-2 bg-White flex flex-col overflow-hidden rounded-xl border',
        'shadow-[0px_4px_40px_0px_rgba(224,224,224,0.15)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-col items-center gap-5 px-0 pt-4 pb-1">
        <AgentAvatar type={type} size={112} hasCircleBg />

        <div className="flex flex-col items-center gap-2">
          <span className="dnf-Subtitle1 text-Gray-10">{name}</span>
          <span className="pretendard-Caption1 text-Gray-6 font-normal">{description}</span>

          <div className="flex gap-1.5">
            <Badge size="xl" className={profileBadgeClassName}>
              {modelName}
            </Badge>
            <Badge size="xl" className={profileBadgeClassName}>
              {`Lv.${level}`}
            </Badge>
          </div>
        </div>

        <div className="flex w-full items-center justify-between px-3">
          <span className={`pretendard-Caption1 ${accentTextClassName}`}>다음 레벨까지</span>
          <span className={`pretendard-Caption1 ${accentTextClassName}`}>
            {exp.current.toLocaleString()} / {exp.max.toLocaleString()} EXP
          </span>
        </div>
      </div>

      <AgentLevelBar type={type} level={level} levelProgress={levelProgress} />
    </div>
  )
}
