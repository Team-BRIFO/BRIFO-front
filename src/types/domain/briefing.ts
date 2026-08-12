import type { AgentSummary, AgentType } from '@/types/domain/agent'

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
  status: AgentStatusType
  direction: BriefingDirectionType | null
  oneLiner: string | null
}

export interface BriefingStock {
  id: string
  name: string
  logoUrl?: string
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
  agent: AgentSummary
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
  stockId: string
  stockName: string
  logoUrl?: string
  agents: OfficeAgentStatus[]
  isCompleted: boolean
  agentStatuses: {
    rookie: '완료' | '진행중'
    pro: '완료' | '진행중'
    tanker: '완료' | '진행중'
  }
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
