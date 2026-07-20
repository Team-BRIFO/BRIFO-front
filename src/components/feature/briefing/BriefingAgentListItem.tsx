import type { HTMLAttributes } from 'react'

import { AgentChat } from '@/components/domain/agent/AgentChat'
import type { AgentType } from '@/types/domain/agent'

export interface BriefingAgentListItemProps extends HTMLAttributes<HTMLDivElement> {
  agentType: AgentType
  agentName: string
  badgeType: 'rise' | 'fall' | 'watch'
  badgeText: string // AgentChat ignores this because it uses predefined labels, but keeping for compatibility if needed
  comment: string
}

export function BriefingAgentListItem({
  agentType,
  agentName,
  badgeType,
  comment,
  ...props
}: BriefingAgentListItemProps) {
  return (
    <AgentChat
      type={agentType}
      name={agentName}
      prediction={badgeType}
      message={comment}
      {...props}
    />
  )
}
