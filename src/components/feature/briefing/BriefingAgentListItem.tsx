import type { HTMLAttributes } from 'react'

import { AgentChat } from '@/components/domain/agent/AgentChat'
import type { AgentType } from '@/types/domain/agent'

export interface BriefingAgentListItemProps extends HTMLAttributes<HTMLDivElement> {
  agentType: AgentType
  agentName: string
  badgeType: 'rise' | 'fall' | 'watch'
  comment: string
}

export function BriefingAgentListItem({
  agentType,
  agentName,
  badgeType,
  comment,
  className,
  ...props
}: BriefingAgentListItemProps) {
  return (
    <AgentChat
      className={className}
      type={agentType}
      name={agentName}
      prediction={badgeType}
      message={comment}
      {...props}
    />
  )
}
