/**
 * Badge 도메인 타입 (업적 · 배지)
 * - 공용 UI 컴포넌트 components/common/Badge 와 이름이 겹치므로 import 시 주의
 */

/** 업적 배지 한 개 */
export interface Badge {
  id: string
  /** 배지 이름 (예: 첫 결정) */
  name: string
  /** 획득 조건 설명 */
  description: string
  /** 배지 아이콘 식별자 — 에셋 확정 전까지 미지정이면 기본 아이콘 */
  iconKey?: string
  /** 획득 여부 */
  isUnlocked: boolean
  /** 획득 시각 (ISO 8601), 미획득이면 null */
  unlockedAt: string | null
}

/** 업적 진행률 */
export interface BadgeProgress {
  /** 획득한 배지 수 */
  unlockedCount: number
  /** 전체 배지 수 */
  totalCount: number
}
