import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import { Badge } from '@/components/common/Badge'
import { AgentAvatar } from '@/components/domain/agent/AgentAvatar'
import type { AgentType } from '@/types/domain/agent'

export type AgentPrediction = 'rise' | 'watch' | 'fall'

const PREDICTION_LABEL_BY_TYPE: Record<AgentPrediction, string> = {
  rise: '상승 예측',
  watch: '관망 예측',
  fall: '하락 예측',
}

export interface AgentChatProps extends HTMLAttributes<HTMLDivElement> {
  /** 말풍선을 표시할 사원 타입 */
  type: AgentType
  /** 사원 이름 (미전달 시 이름·뱃지 영역 숨김) */
  name?: string
  /** 사원의 메시지 */
  message: string
  /** 예측 상태 */
  prediction?: AgentPrediction
}

/** 사원 예측 메시지 말풍선 (아바타 · 예측 상태 · 메시지) */
export function AgentChat({
  type,
  name,
  message,
  prediction = 'rise',
  className = '',
  ...props
}: AgentChatProps) {
  return (
    <div className={twMerge('flex w-full items-center gap-2.5', className)} {...props}>
      <AgentAvatar type={type} size={56} hasCircleBg />

      <div className="border-Gray-2 bg-White flex min-w-0 flex-1 flex-col gap-2 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl border px-3.5 py-3">
        {name && (
          <div className="flex w-full items-center justify-between gap-2">
            <span className="dnf-Caption2 text-Gray-10 truncate">{name}</span>
            <Badge type={prediction} size="sm">
              {PREDICTION_LABEL_BY_TYPE[prediction]}
            </Badge>
          </div>
        )}

        <p className="pretendard-Caption2 text-Gray-6 w-full leading-[1.32] break-keep whitespace-pre-wrap">
          {message}
        </p>
      </div>
    </div>
  )
}
