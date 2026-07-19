import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import ProCharacter from '@/assets/characters/pro.svg?react'
import RookieCharacter from '@/assets/characters/rookie.svg?react'
import TankerCharacter from '@/assets/characters/tanker.svg?react'
import type { AgentType } from '@/types/domain/agent'

import { AGENT_THEME } from './agentTheme'

const CHARACTER_BY_TYPE: Record<AgentType, typeof RookieCharacter> = {
  rookie: RookieCharacter,
  pro: ProCharacter,
  tanker: TankerCharacter,
}

export interface AgentAvatarProps extends HTMLAttributes<HTMLDivElement> {
  type: AgentType
  /** 캐릭터 이미지 크기(px). 기본 60 (목록), 상세는 112 사용 */
  size?: number
  /** 원형 배경 표시 여부 (상세 화면에서 사용) */
  hasCircleBg?: boolean
}

export function AgentAvatar({
  type,
  size = 60,
  hasCircleBg = false,
  className = '',
  ...props
}: AgentAvatarProps) {
  const Character = CHARACTER_BY_TYPE[type]
  const { circleBgClassName } = AGENT_THEME[type]

  return (
    <div
      className={twMerge(
        'flex shrink-0 items-center justify-center',
        hasCircleBg && `rounded-full ${circleBgClassName}`,
        className,
      )}
      style={hasCircleBg ? { width: size + 8, height: size + 8 } : undefined}
      {...props}
    >
      <Character width={size} height={size} aria-hidden="true" />
    </div>
  )
}
