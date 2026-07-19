export interface BriefingDetailStock {
  stockId: string
  name: string
  price: number
  changeRate: number
  tradeDate: string
}

export interface BriefingDetailAgent {
  agentId: string
  agentType: string
  nickname: string
  modelName: string
}

export interface BriefingDetailNewsCard {
  cardId: string
  headline: string | null
}

export interface BriefingDetailData {
  briefingId: string
  direction: 'UP' | 'DOWN' | 'NEUTRAL'
  confidenceRate: number
  contentText: string
  oneLiner: string
}

// 1. GET /api/briefings/{briefingId} (기존 단건 조회)
export interface BriefingDetailResponse {
  stock: BriefingDetailStock
  agent: BriefingDetailAgent
  newsCard: BriefingDetailNewsCard
  briefing: BriefingDetailData
}

// 2. GET /api/news/{cardId}/briefing (카드뉴스 기준 다건 조회)
export interface BriefingListItem {
  briefingId: string
  oneLiner: string
  direction: 'UP' | 'DOWN' | 'NEUTRAL'
  agentId: string
  nickname: string
  agentType: string
}

export interface BriefingListByCardResponse {
  stock: BriefingDetailStock
  items: BriefingListItem[]
}

// 3. GET /api/briefings/office (오피스 전체 브리핑 조회)
export interface OfficeAgentStatus {
  briefingId: string
  agentId: string
  nickname: string
  agentType: string
  status: 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED'
}

export interface OfficeBriefingItem {
  stockName: string
  agents: OfficeAgentStatus[]
}

export interface OfficeBriefingListResponse {
  items: OfficeBriefingItem[]
}

// 4. POST /api/news/{cardId}/briefings (브리핑 요청 생성)
export interface PostBriefingRequest {
  agentIds: string[]
}

export interface RequestedAgentData {
  briefingId: string
  agentId: string
  agentType: string
  salaryCost: number
}

export interface PostBriefingResponse {
  requestedCount: number
  totalSalaryCost: number
  requestedAgents: RequestedAgentData[]
}
