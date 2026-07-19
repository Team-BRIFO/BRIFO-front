/**
 * Agent 도메인 타입
 * - AI 사원(루키/프로/탱커): 타입, 레벨, EXP, 일급 등
 * - 공용 필드는 Agent(base)로 묶고, 화면별 전용 필드는 확장 타입으로 분리한다.
 */

/** AI 사원 타입 (캐릭터) */
export type AgentType = 'rookie' | 'pro' | 'tanker'

/** 목록/상세 공통 base */
export interface Agent {
  id: string
  /** 캐릭터 타입 (루키/프로/탱커) */
  type: AgentType
  /** 사원 이름 (예: 루키) */
  name: string
  /** 연결된 모델명 (예: Claude Haiku 4.5) */
  modelName: string
  /** 현재 레벨 */
  level: number
  /** 레벨업 진행률 (0~100, %) */
  levelProgress: number
}

/** 목록 카드 전용 (사원 목록 화면) */
export interface AgentSummary extends Agent {
  /** 적중률 (0~100, %) */
  hitRate: number
  /** 일급 (AP) */
  dailyAP: number
}

/** 사원 상세 통계 (2×2 그리드) */
export interface AgentStats {
  /** 적중률 (0~100, %) */
  hitRate: number
  /** 누적 분석 건수 */
  totalAnalysis: number
  /** 기여 AP */
  contributedAP: number
  /** 연속 근무 일수 */
  workStreak: number
}

/** 상세 화면 전용 */
export interface AgentDetail extends Agent {
  /** 한 줄 소개 (예: 초긍정·열정의 신입 분석가) */
  description: string
  /** EXP 진행 상황 */
  exp: {
    current: number
    max: number
  }
  /** 상세 통계 */
  stats: AgentStats
}
