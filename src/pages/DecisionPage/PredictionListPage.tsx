import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ApiError } from '@/api/client/ApiError'
import Modal from '@/components/common/Modal'
import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import { AnalyzeCard } from '@/components/feature/analyze/AnalyzeCard'
import { DecisionResultModalContent } from '@/components/feature/decision/DecisionResultModal'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import {
  useDecisionDetailQuery,
  useDecisionListQuery,
} from '@/pages/DecisionPage/hooks/useDecisionQueries'

export function PredictionListPage() {
  const navigate = useNavigate()
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null)

  const [isAfterMarketClose] = useState(() => {
    const kstTime = new Date(
      Date.now() + new Date().getTimezoneOffset() * 60000 + 9 * 60 * 60 * 1000,
    )
    return kstTime.getHours() > 15 || (kstTime.getHours() === 15 && kstTime.getMinutes() >= 30)
  })

  const decisionsQuery = useDecisionListQuery()
  const selectedDecisionQuery = useDecisionDetailQuery(selectedDecisionId)

  const isSettlementWaiting =
    selectedDecisionQuery.error instanceof ApiError && selectedDecisionQuery.error.status === 409
  const decisions = decisionsQuery.data
  const selectedDecisionDetail = selectedDecisionQuery.data
  const selectedDecision = decisions?.find((decision) => decision.id === selectedDecisionId)

  if (!!decisionsQuery.error && decisionsQuery.fetchStatus === 'idle' && !decisions) {
    return (
      <div className="bg-White flex min-h-dvh w-full flex-col pb-10">
        <StatusBar
          hasStatusArea={false}
          left={<StatusBarBackButton onClick={() => navigate(-1)} />}
        />
        <PageErrorView error={decisionsQuery.error} onRetry={() => decisionsQuery.refetch()} />
      </div>
    )
  }

  if (!decisions) {
    return (
      <div className="bg-White flex min-h-dvh w-full flex-col pb-10">
        <StatusBar
          hasStatusArea={false}
          left={<StatusBarBackButton onClick={() => navigate(-1)} />}
        />
        <PageLoadingView />
      </div>
    )
  }

  return (
    <div className="bg-Background1 flex min-h-dvh w-full flex-col pb-10">
      <StatusBar
        hasStatusArea={false}
        left={<StatusBarBackButton onClick={() => navigate(-1)} />}
      />

      <div className="flex flex-col gap-5.5 px-4 pt-4">
        {/* 헤더 부분 */}
        <header className="flex flex-col gap-2">
          <h1 className="dnf-Subtitle1 text-Gray-10">오늘의 예측</h1>
          <p className="pretendard-Button2 text-Gray-6">
            정산 전까지 오늘 걸어둔 예측을 확인하세요
          </p>
        </header>

        {decisions.length === 0 ? (
          <div className="border-Yellow-80 bg-Yellow-100 flex items-center rounded-lg border px-4 py-3.5">
            <span className="pretendard-Button1 text-Yellow-20">
              오늘 {decisions.length}건 · 15:30 정산대기
            </span>
          </div>
        ) : (
          <>
            {/* 요약 배너 */}
            <div className="border-Yellow-80 bg-Yellow-100 flex items-center rounded-lg border px-4 py-3.5">
              <span className="pretendard-Button1 text-Yellow-20">
                오늘 {decisions.length}건 · 15:30 정산대기
              </span>
            </div>

            {/* 예측 리스트 */}
            <div className="flex flex-col gap-4">
              {decisions.map((item) => {
                let footerStatus: 'SETTLED' | 'WAITING' | 'SETTLING' = item.isSettled
                  ? 'SETTLED'
                  : 'WAITING'
                // 당일 15:30 이후에는 무조건 정산 중으로 표시
                if (isAfterMarketClose) {
                  footerStatus = 'SETTLING'
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.isSettled) {
                        setSelectedDecisionId(item.id)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (item.isSettled && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault()
                        setSelectedDecisionId(item.id)
                      }
                    }}
                    role={item.isSettled ? 'button' : undefined}
                    tabIndex={item.isSettled ? 0 : undefined}
                    className={
                      item.isSettled
                        ? 'focus-visible:ring-Pink-30 cursor-pointer rounded-xl focus:outline-none focus-visible:ring-2'
                        : ''
                    }
                  >
                    <AnalyzeCard
                      resultType="PREDICTION"
                      predictionFooter={{
                        status: footerStatus,
                        currentRate: item.stock.changeRate,
                      }}
                      stock={{
                        name: item.stock.name,
                        logoUrl: item.stock.logoUrl,
                        changeRate: item.stock.changeRate,
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </>
        )}

        {selectedDecisionId && (
          <Modal isOpen={!!selectedDecisionId} onClose={() => setSelectedDecisionId(null)}>
            {!!selectedDecisionQuery.error &&
            selectedDecisionQuery.fetchStatus === 'idle' &&
            !selectedDecisionDetail ? (
              <PageErrorView
                title={isSettlementWaiting ? '정산 대기 중입니다' : '예측 결과를 불러오지 못했어요'}
                description={isSettlementWaiting ? '잠시 후 다시 확인해 주세요.' : undefined}
                error={selectedDecisionQuery.error}
                onRetry={isSettlementWaiting ? undefined : () => selectedDecisionQuery.refetch()}
                buttonText={isSettlementWaiting ? '닫기' : undefined}
                onButtonClick={isSettlementWaiting ? () => setSelectedDecisionId(null) : undefined}
              />
            ) : !selectedDecisionDetail ? (
              <PageLoadingView />
            ) : selectedDecision && selectedDecisionDetail ? (
              <DecisionResultModalContent
                decisionId={selectedDecisionId}
                isSuccess={selectedDecisionDetail.isCorrect ?? false}
                points={Math.abs(selectedDecisionDetail.apDelta ?? 0)}
                confidenceLevel={selectedDecision.confidenceLevel}
                stockInfo={{
                  name: selectedDecision.stock.name,
                  changeRate: selectedDecisionDetail.stock.changeRate ?? 0,
                }}
                onAction={() => setSelectedDecisionId(null)}
                onClose={() => setSelectedDecisionId(null)}
              />
            ) : null}
          </Modal>
        )}
      </div>
    </div>
  )
}
