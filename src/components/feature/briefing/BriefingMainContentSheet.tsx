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
    <div className={twMerge('flex w-full flex-col items-stretch', className)}>
      <div className="flex flex-col gap-2 pb-8">
        <AgentCard agent={agent} className="border-none shadow-none" />
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

        {/* 버튼이 스크롤 마지막에 위치하도록 영역 내부로 이동 */}
        <div className="mt-4 pt-2">
          <Button isFullWidth color="primary" size="lg" onClick={onConfirm}>
            이 브리핑으로 결정
          </Button>
        </div>
      </div>
    </div>
  )
}
