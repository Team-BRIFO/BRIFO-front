export type BriefingDirectionType = 'rise' | 'fall' | 'watch'
export type AgentStatusType = 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED'

export interface BriefingSummaryData {
  badgeType: BriefingDirectionType
  badgeText: string
  percentage: number
  headline: string
  commentTag: string
  comment: string
  noteMessage: string
}

export interface BriefingListItemData {
  id: string
  agentId: string
  agentType: string
  nickname: string
  direction: BriefingDirectionType
  oneLiner: string
}
