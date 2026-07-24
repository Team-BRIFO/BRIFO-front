import ProComplete from '@/assets/characters/pro-complete.svg?react'
import ProIng from '@/assets/characters/pro-ing.svg?react'
import ProNormal from '@/assets/characters/pro-normal.svg?react'
import RookieComplete from '@/assets/characters/rookie-complete.svg?react'
import RookieIng from '@/assets/characters/rookie-ing.svg?react'
import RookieNormal from '@/assets/characters/rookie-normal.svg?react'
import TankerComplete from '@/assets/characters/tanker-complete.svg?react'
import TankerIng from '@/assets/characters/tanker-ing.svg?react'
import TankerNormal from '@/assets/characters/tanker-normal.svg?react'
import OfficeBg from '@/assets/images/OfficeBackground.svg?react'
import type { OfficeAgentStatusDTO } from '@/types/api/briefing'

/** 캐릭터 타입별 상태 이미지 맵 */
const CHARACTER_IMAGES = {
  ROOKIE: {
    normal: RookieNormal,
    ing: RookieIng,
    complete: RookieComplete,
  },
  TANKER: {
    normal: TankerNormal,
    ing: TankerIng,
    complete: TankerComplete,
  },
  PRO: {
    normal: ProNormal,
    ing: ProIng,
    complete: ProComplete,
  },
} as const

type AgentCharacterType = keyof typeof CHARACTER_IMAGES

/** status → 이미지 상태 변환 */
function getImageState(
  status: OfficeAgentStatusDTO['status'] | null,
): 'normal' | 'ing' | 'complete' {
  if (!status || status === 'FAILED') return 'normal'
  if (status === 'COMPLETED') return 'complete'
  return 'ing' // PENDING | ANALYZING
}

/**
 * 브리핑 상태별로 사원 status를 전달합니다.
 * key는 에이전트 타입(ROOKIE·TANKER·PRO),
 * value는 현재 브리핑 status (없으면 null = 대기중).
 */
export type AgentStatusMap = Partial<Record<AgentCharacterType, OfficeAgentStatusDTO['status']>>

export interface OfficeProps {
  /** 에이전트 타입별 브리핑 상태 맵 */
  agentStatusMap?: AgentStatusMap
}

/** 책상 고정 위치 및 에이전트 배치 순서 (오피스 이미지 좌표 기준) */
const DESK_SLOTS: { agentType: AgentCharacterType; style: React.CSSProperties }[] = [
  { agentType: 'TANKER', style: { bottom: '20%', left: '5%', width: 95 } }, // 좌하단
  { agentType: 'ROOKIE', style: { bottom: '38%', left: '36%', width: 95 } }, // 중앙
  { agentType: 'PRO', style: { bottom: '20%', right: '5%', width: 95 } }, // 우하단
]

/** 사무실 배경 + 캐릭터 상태를 결합한 오피스 컴포넌트 */
export function Office({ agentStatusMap = {} }: OfficeProps) {
  return (
    <div className="bg-White relative w-full rounded-xl" style={{ height: 263 }}>
      {/* 배경 */}
      <OfficeBg className="h-auto w-full rounded-xl" aria-hidden="true" />

      {/* 캐릭터 레이어 */}
      {DESK_SLOTS.map(({ agentType, style }) => {
        const status = agentStatusMap[agentType] ?? null
        const imgState = getImageState(status)
        const CharImg = CHARACTER_IMAGES[agentType][imgState]

        return (
          <div
            key={agentType}
            className="absolute"
            style={style}
            aria-label={`${agentType} 사원 (${imgState})`}
          >
            <CharImg className="h-auto w-full" />
          </div>
        )
      })}
    </div>
  )
}
