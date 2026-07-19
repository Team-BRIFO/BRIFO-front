import type { AgentType } from '@/types/domain/agent'

/** 사원 타입별 테마 (아바타 원형 배경, 레벨 ProgressBar 트랙/필/텍스트 색) */
interface AgentTheme {
  /** 아바타 원형 배경 색상 클래스 */
  circleBgClassName: string
  /** 레벨 바 트랙(배경) 색상 클래스 */
  levelTrackClassName: string
  /** 레벨 바 채움(fill) 색상 클래스 */
  levelFillClassName: string
  /** 레벨 바 위 텍스트(LV·%) 색상 클래스 */
  levelTextClassName: string
  /** 프로필 Badge(모델·Lv) 색상 클래스 (bg + text) */
  profileBadgeClassName: string
  /** 프로필 강조 텍스트(다음 레벨까지·EXP) 색상 클래스 */
  accentTextClassName: string
  /** 카드 Active 상태 테두리 색상 클래스 */
  activeBorderClassName: string
}

export const AGENT_THEME: Record<AgentType, AgentTheme> = {
  rookie: {
    circleBgClassName: 'bg-Pink-60',
    levelTrackClassName: 'bg-Pink-50',
    levelFillClassName: 'bg-Pink-40',
    levelTextClassName: 'text-Pink-100',
    profileBadgeClassName: 'bg-Pink-60 text-Pink-30',
    accentTextClassName: 'text-Pink-40',
    activeBorderClassName: 'border-Pink-40',
  },
  pro: {
    circleBgClassName: 'bg-Yellow-80',
    levelTrackClassName: 'bg-Yellow-80',
    levelFillClassName: 'bg-Yellow-50',
    levelTextClassName: 'text-Yellow-20',
    profileBadgeClassName: 'bg-Yellow-80 text-Yellow-20',
    accentTextClassName: 'text-Yellow-40',
    activeBorderClassName: 'border-Yellow-45',
  },
  tanker: {
    circleBgClassName: 'bg-Green-80',
    levelTrackClassName: 'bg-Green-80',
    levelFillClassName: 'bg-Green-50',
    levelTextClassName: 'text-Green-10',
    profileBadgeClassName: 'bg-Green-80 text-Green-20',
    accentTextClassName: 'text-Green-40',
    activeBorderClassName: 'border-Green-50',
  },
}
