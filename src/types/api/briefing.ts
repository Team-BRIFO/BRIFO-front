import type { ApiResponse } from '@/types/api/common'

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
  summary: string
  personalComment: string | null
  contentText: string
  oneLiner: string
}

// 1. GET /api/briefings/{briefingId} (기존 단건 조회)
export interface BriefingDetailResult {
  stock: BriefingStockDTO
  agent: BriefingAgentDTO
  newsCards: BriefingNewsCardDTO[]
  briefing: BriefingDataDTO
}
export type BriefingDetailResponse = ApiResponse<BriefingDetailResult>

// 2. GET /api/stocks/{stockId}/briefing (종목 기준 브리핑 조회)
export interface BriefingListItemDTO {
  briefingId: string
  status: 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED'
  oneLiner: string | null
  direction: 'UP' | 'DOWN' | 'NEUTRAL' | null
  agentId: string
  nickname: string
  agentType: string
}

export interface BriefingListByStockResult {
  stock: BriefingStockDTO
  items: BriefingListItemDTO[]
}
export type BriefingListByStockResponse = ApiResponse<BriefingListByStockResult>

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

// 4. POST /api/stocks/{stockId}/briefings (브리핑 분석 요청 생성)
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
