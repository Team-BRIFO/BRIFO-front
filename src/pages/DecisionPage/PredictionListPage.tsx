import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import { AnalyzeCard } from '@/components/feature/analyze/AnalyzeCard'
import { DecisionResultModal } from '@/components/feature/decision/DecisionResultModal'
import { MOCK_DECISIONS } from '@/pages/DecisionPage/mockDecision'

export function PredictionListPage() {
  const navigate = useNavigate()
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null)

  const selectedDecision = MOCK_DECISIONS.find((d) => d.decisionId === selectedDecisionId)

  return (
    <div className="bg-White flex min-h-[100dvh] w-full flex-col pb-10">
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

        {/* 요약 배너 */}
        <div className="border-Yellow-80 bg-Yellow-100 flex items-center rounded-lg border px-4 py-3.5">
          <span className="pretendard-Button1 text-Yellow-20">
            오늘 {MOCK_DECISIONS.length}건 · 15:30 정산대기
          </span>
        </div>

        {/* 예측 리스트 */}
        <div className="flex flex-col gap-4">
          {MOCK_DECISIONS.map((item) => (
            <div
              key={item.decisionId}
              onClick={() => {
                if (item.isSettled) {
                  setSelectedDecisionId(item.decisionId)
                }
              }}
              className={item.isSettled ? 'cursor-pointer' : ''}
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
      </div>

      {selectedDecision && (
        <DecisionResultModal
          isOpen={!!selectedDecisionId}
          isSuccess={true} // 더미 데이터 (목록 API에 정보 없음)
          points={100} // 더미 데이터
          confidenceLevel={selectedDecision.confidenceLevel}
          stockInfo={{
            name: selectedDecision.stock.name,
            changeRate: selectedDecision.stock.changeRate,
          }}
          onAction={() => setSelectedDecisionId(null)}
          onClose={() => setSelectedDecisionId(null)}
        />
      )}
    </div>
  )
}
