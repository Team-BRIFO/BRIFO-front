import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Loading } from '@/components/common/Loading'
import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import { AnalyzeCard } from '@/components/feature/analyze/AnalyzeCard'
import { DecisionResultModal } from '@/components/feature/decision/DecisionResultModal'
import { ErrorView } from '@/components/feature/error/ErrorView'

import { useDecisionDetailQuery, useDecisionListQuery } from './hooks/useDecisionQueries'

export function PredictionListPage() {
  const navigate = useNavigate()
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null)

  const decisionsQuery = useDecisionListQuery()
  const selectedDecisionQuery = useDecisionDetailQuery(selectedDecisionId)
  const decisions = decisionsQuery.data
  const selectedDecisionDetail = selectedDecisionQuery.data
  const selectedDecision = decisions?.find((decision) => decision.id === selectedDecisionId)

  return (
    <div className="bg-White flex min-h-dvh w-full flex-col pb-10">
      <StatusBar
        hasStatusArea={false}
        left={<StatusBarBackButton onClick={() => navigate(-1)} />}
      />

      <div className="flex flex-col gap-5.5 px-4">
        {/* 헤더 부분 */}
        <header className="flex flex-col gap-2">
          <h1 className="dnf-Subtitle1 text-Gray-10">오늘의 예측</h1>
          <p className="pretendard-Button2 text-Gray-6">
            정산 전까지 오늘 걸어둔 예측을 확인하세요
          </p>
        </header>

        {decisionsQuery.isError && !decisions ? (
          <ErrorView
            title="예측 목록을 불러오지 못했어요"
            description="잠시 후 다시 시도해주세요."
            buttonText="다시 시도"
            onButtonClick={() => decisionsQuery.refetch()}
          />
        ) : !decisions ? (
          <Loading className="py-10" />
        ) : decisions.length === 0 ? (
          <ErrorView title="오늘 등록한 예측이 없어요" description="새 예측을 등록해보세요." />
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
              {decisions.map((item) => (
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
                      status: item.isSettled ? 'SETTLED' : 'WAITING',
                      currentRate: item.stock.changeRate,
                    }}
                    stock={{
                      name: item.stock.name,
                      changeRate: item.stock.changeRate,
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {selectedDecisionId && selectedDecisionQuery.isError && !selectedDecisionDetail && (
          <ErrorView
            title="예측 결과를 불러오지 못했어요"
            description="잠시 후 다시 시도해주세요."
            buttonText="다시 시도"
            onButtonClick={() => selectedDecisionQuery.refetch()}
          />
        )}
      </div>

      {selectedDecision && selectedDecisionDetail && (
        <DecisionResultModal
          isOpen={!!selectedDecisionId}
          decisionId={selectedDecisionId ?? undefined}
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
      )}
    </div>
  )
}
