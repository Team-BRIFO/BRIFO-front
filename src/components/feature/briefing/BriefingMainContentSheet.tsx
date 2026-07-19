import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import Button from '@/components/common/Button'
import { AgentCard } from '@/components/domain/agent/AgentCard'
import { BriefingComment } from '@/components/domain/briefing/BriefingComment'
import { BriefingNote } from '@/components/domain/briefing/BriefingNote'
import { BriefingTopCard } from '@/components/domain/briefing/BriefingTopCard'

export interface BriefingMainContentSheetProps {
  /** 시트 내부에 유기적으로 주입되어 결합될 도메인 UI 자식 노드들 (Slot 기반 설계) */
  children?: ReactNode
  className?: string
}

export function BriefingMainContentSheet({ children, className }: BriefingMainContentSheetProps) {
  return (
    <div
      className={twMerge(
        'flex h-[528px] w-[328px] flex-col items-stretch overflow-hidden',
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-[22px] overflow-y-auto">
        {children || (
          <>
            <AgentCard
              agent={{
                id: 'rookie-1',
                type: 'rookie',
                name: '루키',
                modelName: 'Claude Haiku 4.5',
                hitRate: 64,
                dailyAP: 10,
                level: 8,
                levelProgress: 30,
              }}
            />
            <BriefingTopCard
              badgeType="rise"
              badgeText="상승 예측"
              percentage={72}
              newsTitleText="HBM 수주 확대로 단기 모멘텀 강세"
            />
            <BriefingComment
              tagText="사장님 맞춤"
              comment="사장님, 이건 진짜 기회예요! HBM3E 12단 양산이..."
            />
            <BriefingNote message="반도체 섹터 전반의 상승세가 예상되며, 특히 HBM 관련주의 수혜가 두드러질 전망입니다." />

            <Button isFullWidth className="mt-auto !bg-[#FFBB00] !text-white">
              이 브리핑으로 결정
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
