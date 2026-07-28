import type { AgentType } from './agent'

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
  recommendText?: string
}

export interface BriefingListItemData {
  id: string
  agentId: string
  agentType: AgentType
  nickname: string
  direction: BriefingDirectionType
  oneLiner: string
}

export interface BriefingStock {
  id: string
  name: string
  price: number
  changeRate: number
  tradeDate: string
  hashtags: string[]
}

export interface BriefingListData {
  stock: BriefingStock
  items: BriefingListItemData[]
}

export interface BriefingDetailData {
  stock: BriefingStock
  agent: import('./agent').AgentSummary
  activeTab: AgentType
  briefing: BriefingSummaryData
}

export interface OfficeAgentStatus {
  briefingId: string
  agentId: string
  name: string
  type: AgentType
  status: AgentStatusType
}

export interface OfficeBriefingItem {
  stockName: string
  agents: OfficeAgentStatus[]
}

export interface BriefingRequestResult {
  requestedCount: number
  totalSalaryCost: number
  requestedAgents: Array<{
    briefingId: string
    agentId: string
    type: AgentType
    salaryCost: number
  }>
}
