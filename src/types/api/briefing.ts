import type { ApiResponse } from './common'

export interface BriefingStockDTO {
  stockId: string
  name: string
  price: number
  changeRate: number
  tradeDate: string
  hashtags?: string[]
}

export interface BriefingAgentDTO {
  agentId: string
  agentType: string
  nickname: string
  modelName: string
}

export interface BriefingNewsCardDTO {
  cardId: string
  headline: string | null
}

export interface BriefingDataDTO {
  briefingId: string
  direction: 'UP' | 'DOWN' | 'NEUTRAL'
  confidenceRate: number
  contentText: string
  oneLiner: string
}

// 1. GET /api/briefings/{briefingId} (기존 단건 조회)
export interface BriefingDetailResult {
  stock: BriefingStockDTO
  agent: BriefingAgentDTO
  newsCard: BriefingNewsCardDTO
  briefing: BriefingDataDTO
}
export type BriefingDetailResponse = ApiResponse<BriefingDetailResult>

// 2. GET /api/news/{cardId}/briefing (카드뉴스 기준 다건 조회)
export interface BriefingListItemDTO {
  briefingId: string
  oneLiner: string
  direction: 'UP' | 'DOWN' | 'NEUTRAL'
  agentId: string
  nickname: string
  agentType: string
}

export interface BriefingListByCardResult {
  stock: BriefingStockDTO
  items: BriefingListItemDTO[]
}
export type BriefingListByCardResponse = ApiResponse<BriefingListByCardResult>

// 3. GET /api/briefings/office (오피스 전체 브리핑 조회)
export interface OfficeAgentStatusDTO {
  briefingId: string
  agentId: string
  nickname: string
  agentType: string
  status: 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED'
}

export interface OfficeBriefingItemDTO {
  stockName: string
  agents: OfficeAgentStatusDTO[]
}

export interface OfficeBriefingListResult {
  items: OfficeBriefingItemDTO[]
}
export type OfficeBriefingListResponse = ApiResponse<OfficeBriefingListResult>

// 4. POST /api/news/{cardId}/briefings (브리핑 요청 생성)
export interface PostBriefingRequest {
  agentIds: string[]
}

export interface RequestedAgentDataDTO {
  briefingId: string
  agentId: string
  agentType: string
  salaryCost: number
}

export interface PostBriefingResult {
  requestedCount: number
  totalSalaryCost: number
  requestedAgents: RequestedAgentDataDTO[]
}
export type PostBriefingResponse = ApiResponse<PostBriefingResult>
