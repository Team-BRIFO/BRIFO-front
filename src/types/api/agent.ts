/**
 * 사원(Agent) 조회 API 응답 타입
 * - 목록/상세 두 엔드포인트의 응답 result 구조
 */

/** 서버 사원 타입 코드 (도메인 AgentType 대문자) */
export type AgentTypeCode = 'ROOKIE' | 'PRO' | 'TANKER'

/** 사원 목록 아이템 (요약) */
export interface AgentListItemResponse {
  agentId: string
  nickname: string
  agentType: AgentTypeCode
  modelName: string
  level: number
  exp: number
  dailySalary: number
  accuracyRate: number
}

/** 사원 목록 result */
export interface AgentListResult {
  items: AgentListItemResponse[]
}

/** 사원 상세 result */
export interface AgentDetailResponse {
  agentId: string
  nickname: string
  agentType: AgentTypeCode
  level: number
  exp: number
  modelName: string
  description?: string
  accuracyRate: number
  totalAnalyses: number
  contributedAp: number
  consecutiveWorkDays: number
  dailySalary: number
}
