import { useState } from 'react'

import BottomSheet from '@/components/common/BottomSheet'
import Button from '@/components/common/Button'
import { BriefingReviewSection } from '@/components/domain/briefing/BriefingReviewSection'
import { ConfidenceSliderSection } from '@/components/domain/decision/ConfidenceSliderSection'
import {
  DirectionSelectorGroup,
  type PredictionType,
} from '@/components/domain/decision/DirectionSelectorGroup'
import { StockInfo } from '@/components/domain/stock/StockInfo'
import { StockPriceChange } from '@/components/domain/stock/StockPriceChange'

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
  onConfirm: (direction: 'UP' | 'DOWN' | 'NEUTRAL', confidence: number) => void
}

export function DecisionBottomSheet({
  isOpen,
  onClose,
  stock,
  agent,
  briefing,
  onConfirm,
}: DecisionBottomSheetProps) {
  const [direction, setDirection] = useState<PredictionType>('UP')
  const [confidence, setConfidence] = useState(3)

  // API 스펙이나 요구사항에 따라 계산 (임시 로직)
  const apCost = confidence * 20
  const expectedReward = confidence * 20

  const handleConfirm = () => {
    const confirmDirection = direction === 'HOLD' ? 'NEUTRAL' : (direction as 'UP' | 'DOWN')
    onConfirm(confirmDirection, confidence)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} showHandle={true}>
      {/* 바텀시트 바디 */}
      <BottomSheet.Body className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {/* 바텀시트 헤더 (타이틀) */}
          <div className="text-center">
            <h2 className="dnf-Subtitle2 text-Gray-10 text-center">투자 결정</h2>
          </div>
          {/* 주식 요약 카드 */}
          <div className="border-Gray-3 bg-White flex flex-col overflow-hidden rounded-2xl border">
            <div className="flex items-center justify-between p-4">
              <StockInfo
                name={stock.name}
                code={stock.code}
                marketType={stock.marketType}
                logoUrl={stock.logoUrl}
              />
              <StockPriceChange
                price={stock.price}
                changeRate={stock.changeRate}
                textAlign="right"
              />
            </div>
            {stock.hashtags && stock.hashtags.length > 0 && (
              <div className="bg-Gray-1 text-Gray-6 pretendard-Caption1 flex flex-wrap gap-2 px-4 py-3">
                {stock.hashtags.map((tag, idx) => (
                  <span key={idx}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 방향 선택 */}
        <DirectionSelectorGroup selectedDirection={direction} onDirectionChange={setDirection} />

        {/* 확신도 선택 */}
        <ConfidenceSliderSection
          value={confidence}
          onChange={setConfidence}
          apCost={apCost}
          expectedReward={expectedReward}
        />

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
      </BottomSheet.Body>

      {/* 하단 액션 버튼 */}
      <BottomSheet.Footer>
        <div className="flex flex-col gap-3">
          <Button isFullWidth size="lg" color="primary" onClick={handleConfirm}>
            예측 등록하기
          </Button>
          <button
            type="button"
            className="pretendard-Caption2 text-Gray-7 underline underline-offset-2"
            onClick={onClose}
          >
            다음에 할게요
          </button>
        </div>
      </BottomSheet.Footer>
    </BottomSheet>
  )
}
