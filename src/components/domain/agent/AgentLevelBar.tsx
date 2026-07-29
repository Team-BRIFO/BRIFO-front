import { twMerge } from 'tailwind-merge'

import { ProgressBar } from '@/components/common/ProgressBar'
import { AGENT_THEME } from '@/components/domain/agent/agentTheme'
import type { AgentType } from '@/types/domain/agent'

export interface AgentLevelBarProps {
  type: AgentType
  /** 현재 레벨 */
  level: number
  /** 레벨업 진행률 (0~100, %) — 바가 채워지는 비율 */
  levelProgress: number
  className?: string
}

/**
 * 사원 카드 하단의 레벨 진행 바 (LV.n · 진행률%)
 * - 공용 ProgressBar 하나로 구성 (트랙/필 색 + LV/% 오버레이)
 * - 목록 카드 / 프로필 카드에서 공통 사용
 */
export function AgentLevelBar({ type, level, levelProgress, className = '' }: AgentLevelBarProps) {
  const { levelTrackClassName, levelFillClassName, levelTextClassName } = AGENT_THEME[type]

  return (
    <ProgressBar
      progress={levelProgress}
      barColor={levelFillClassName}
      trackColor={levelTrackClassName}
      heightClassName="h-7"
      className={twMerge('overflow-hidden rounded-none', className)}
    >
      <div className={twMerge('flex h-full items-center justify-between px-4', levelTextClassName)}>
        <span className="dnf-Caption2">LV. {level}</span>
        <span className="pretendard-Caption1">{levelProgress}%</span>
      </div>
    </ProgressBar>
  )
}
