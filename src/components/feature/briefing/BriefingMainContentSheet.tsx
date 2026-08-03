import { twMerge } from 'tailwind-merge'

import Button from '@/components/common/Button'
import { AgentCard } from '@/components/domain/agent/AgentCard'
import { BriefingComment } from '@/components/domain/briefing/BriefingComment'
import { BriefingNote } from '@/components/domain/briefing/BriefingNote'
import { BriefingTopCard } from '@/components/domain/briefing/BriefingTopCard'
import type { AgentSummary } from '@/types/domain/agent'

export interface BriefingData {
  badgeType: 'rise' | 'watch' | 'fall'
  badgeText: string
  percentage: number
  headline: string
  commentTag: string
  comment: string
  noteMessage: string
  isError?: boolean
  errorText?: string
  recommendText?: string
}

export interface BriefingMainContentSheetProps {
  agent: AgentSummary
  briefing: BriefingData
  onConfirm?: () => void
  className?: string
}

export function BriefingMainContentSheet({
  agent,
  briefing,
  onConfirm,
  className,
}: BriefingMainContentSheetProps) {
  return (
    <div className={twMerge('flex h-132 w-full flex-col items-stretch overflow-hidden', className)}>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        <AgentCard agent={agent} />
        <BriefingTopCard
          badgeType={briefing.badgeType}
          badgeText={briefing.badgeText}
          percentage={briefing.percentage}
          newsTitleText={briefing.headline}
        />
        {briefing.comment && (
          <BriefingComment
            tagText={briefing.commentTag}
            comment={briefing.comment}
            isErrorVariant={briefing.isError}
          />
        )}
        {(briefing.noteMessage || briefing.recommendText || briefing.errorText) && (
          <BriefingNote
            message={briefing.noteMessage}
            isErrorVariant={briefing.isError}
            errorText={briefing.errorText}
            recommendText={briefing.recommendText}
          />
        )}

        <Button isFullWidth color="primary" size="lg" onClick={onConfirm}>
          이 브리핑으로 결정
        </Button>
      </div>
    </div>
  )
}
