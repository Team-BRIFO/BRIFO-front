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

export interface BriefingDetailResponse {
  stock: BriefingDetailStock
  agent: BriefingDetailAgent
  newsCard: BriefingDetailNewsCard
  briefing: BriefingDetailData
}
