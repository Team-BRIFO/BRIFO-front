import { useState } from 'react'

import { ApiError } from '@/api/client/ApiError'
import Modal from '@/components/common/Modal'
import { AnalyzeCard } from '@/components/feature/analyze/AnalyzeCard'
import { DecisionResultModalContent } from '@/components/feature/decision/DecisionResultModal'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useDecisionDetailQuery } from '@/pages/DecisionPage/hooks/useDecisionQueries'
import type { DecisionListItem } from '@/types/domain/decision'

interface PredictionDecisionCardProps {
  decision: DecisionListItem
  isAfterMarketClose?: boolean
}

/**
 * 결정 카드 한 건과 정산 결과 모달.
 * 모달 상태를 카드 단위로 보유해 다른 결정 카드의 렌더를 막는다.
 */
export function PredictionDecisionCard({
  decision,
  isAfterMarketClose,
}: PredictionDecisionCardProps) {
  const [isResultModalOpen, setIsResultModalOpen] = useState(false)
  const resultQuery = useDecisionDetailQuery(isResultModalOpen ? decision.id : null)
  const detail = resultQuery.data

  const isSettlementWaiting =
    resultQuery.error instanceof ApiError && resultQuery.error.status === 409

  const openResultModal = () => {
    if (decision.isSettled) setIsResultModalOpen(true)
  }

  const closeResultModal = () => {
    setIsResultModalOpen(false)
  }

  return (
    <>
      <div
        onClick={openResultModal}
        onKeyDown={(event) => {
          if (decision.isSettled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault()
            openResultModal()
          }
        }}
        role={decision.isSettled ? 'button' : undefined}
        tabIndex={decision.isSettled ? 0 : undefined}
        className={
          decision.isSettled
            ? 'focus-visible:ring-Pink-30 cursor-pointer rounded-xl focus:outline-none focus-visible:ring-2'
            : ''
        }
      >
        <AnalyzeCard
          resultType="PREDICTION"
          predictionFooter={{
            status: decision.isSettled ? 'SETTLED' : isAfterMarketClose ? 'SETTLING' : 'WAITING',
            currentRate: decision.stock.changeRate,
          }}
          stock={{
            name: decision.stock.name,
            logoUrl: decision.stock.logoUrl,
            changeRate: decision.stock.changeRate,
          }}
        />
      </div>

      {isResultModalOpen && (
        <Modal isOpen onClose={closeResultModal}>
          {!!resultQuery.error && resultQuery.fetchStatus === 'idle' && !detail ? (
            <PageErrorView
              className="p-0"
              title={isSettlementWaiting ? '정산 대기 중입니다' : '예측 결과를 불러오지 못했어요'}
              description={isSettlementWaiting ? '잠시 후 다시 확인해 주세요.' : undefined}
              error={resultQuery.error}
              onRetry={isSettlementWaiting ? undefined : () => resultQuery.refetch()}
              buttonText={isSettlementWaiting ? '닫기' : undefined}
              onButtonClick={isSettlementWaiting ? closeResultModal : undefined}
            />
          ) : !detail ? (
            <PageLoadingView className="p-0" />
          ) : (
            <DecisionResultModalContent
              decisionId={decision.id}
              isSuccess={detail.isCorrect ?? false}
              points={Math.abs(detail.apDelta ?? 0)}
              confidenceLevel={decision.confidenceLevel}
              stockInfo={{
                name: decision.stock.name,
                changeRate: detail.stock.changeRate ?? 0,
              }}
              onAction={closeResultModal}
              onClose={closeResultModal}
            />
          )}
        </Modal>
      )}
    </>
  )
}
