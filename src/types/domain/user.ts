/**
 * User 도메인 타입
 * - 마이페이지 프로필/요약 지표
 * - AP 관련은 types/domain/ap.ts, 배지는 types/domain/badge.ts 참고
 */

import type { AgentType } from './agent'

/** 프로필 카드 (닉네임 · 회사 · 직함 · 캐릭터) */
export interface UserProfile {
  id: string
  /** 닉네임 (예: 포롱) */
  nickname: string
  /** 회사명 (예: 가즈아 투자사) */
  companyName: string
  /** 직함 (예: 사장) */
  jobTitle: string
  /** 프로필에 노출되는 AI 캐릭터 타입 */
  characterType: AgentType
}

/** 마이 메인 요약 지표 (적중률 · 누적결정 · 연속출석) */
export interface UserStats {
  /** 적중률 (0~100, %) */
  hitRate: number
  /** 누적 결정 건수 */
  totalDecisions: number
  /** 연속 출석 일수 */
  attendanceStreak: number
}

/** 관심 종목 (프로필 편집에서 선택) */
export interface UserInterestStock {
  id: string
  name: string
}

/** 프로필 편집 폼 값 */
export interface UserProfileFormValues {
  nickname: string
  companyName: string
  interestStocks: UserInterestStock[]
}
