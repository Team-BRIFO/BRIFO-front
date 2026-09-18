import { useState } from 'react'

import BottomSheet from '@/components/common/BottomSheet'
import Button from '@/components/common/Button'
import { BriefingReviewSection } from '@/components/domain/briefing/BriefingReviewSection'
import { AllocationAmountSection } from '@/components/domain/decision/AllocationAmountSection'
import type { PredictionType } from '@/components/domain/decision/DirectionSelectorGroup'
import { DirectionSelectorGroup } from '@/components/domain/decision/DirectionSelectorGroup'
import { AnalyzeCard } from '@/components/feature/analyze/AnalyzeCard'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'
import type { DecisionDirection } from '@/types/domain/decision'
import { MAX_ALLOCATION_RATE_PERCENT } from '@/types/domain/decision'

export interface DecisionBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  stock: {
    name: string
    code?: string
    marketType?: string
    price: number
    changeRate: number
    hashtags?: string[]
    logoUrl?: string | null
  }
  agent: {
    name: string
  }
  briefing: {
    badgeText: string
    badgeType: 'rise' | 'fall' | 'watch'
    oneLiner: string
  }
  onConfirm: (direction: DecisionDirection, allocatedAp: number) => void
  isSubmitting?: boolean
}

export function DecisionBottomSheet({
  isOpen,
  onClose,
  stock,
  agent,
  briefing,
  onConfirm,
  isSubmitting = false,
}: DecisionBottomSheetProps) {
  const [direction, setDirection] = useState<PredictionType>('UP')
  const [allocatedAp, setAllocatedAp] = useState(0)
  const { data: profile } = useUserProfileQuery()
  const balance = profile?.apSummary.balance ?? 0
  const maxAllocatableAp = Math.floor((balance * MAX_ALLOCATION_RATE_PERCENT) / 100)

  const handleConfirm = () => {
    if (isSubmitting) return
    if (allocatedAp < 1 || allocatedAp > maxAllocatableAp) return
    const confirmDirection = direction === 'HOLD' ? 'NEUTRAL' : (direction as 'UP' | 'DOWN')
    onConfirm(confirmDirection, allocatedAp)
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} showHandle={true}>
      {/* 바텀시트 바디 */}
      <BottomSheet.Body className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {/* 바텀시트 헤더 (타이틀) */}
          <div className="mt-4.5 text-center">
            <h2 className="dnf-Subtitle2 text-Gray-10 text-center">투자 결정</h2>
          </div>
          {/* 주식 요약 카드 */}
          <AnalyzeCard
            type="normal"
            resultType="HASHTAG"
            stock={{
              ...stock,
              keywords: stock.hashtags,
            }}
          />
        </div>

        {/* 방향 선택 */}
        <DirectionSelectorGroup selectedDirection={direction} onDirectionChange={setDirection} />

        {/* 배분 금액 선택 */}
        <AllocationAmountSection value={allocatedAp} onChange={setAllocatedAp} balance={balance} />

        {/* 브리핑 다시보기 */}
        <BriefingReviewSection
          reviews={[
            {
              agentName: agent.name,
              badgeType: briefing.badgeType,
              badgeText: briefing.badgeText,
              comment: briefing.oneLiner,
            },
          ]}
        />
        <div className="flex flex-col gap-3">
          <Button
            isFullWidth
            size="lg"
            color="primary"
            onClick={handleConfirm}
            disabled={isSubmitting || allocatedAp < 1 || allocatedAp > maxAllocatableAp}
          >
            {isSubmitting ? '등록 중...' : '예측 등록하기'}
          </Button>
          <button
            type="button"
            className="pretendard-Caption2 text-Gray-7 underline underline-offset-2"
            onClick={onClose}
          >
            다음에 할게요
          </button>
        </div>
      </BottomSheet.Body>
    </BottomSheet>
  )
}
