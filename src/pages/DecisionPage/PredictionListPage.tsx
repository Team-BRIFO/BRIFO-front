import { useNavigate } from 'react-router-dom'

import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import { PredictionDecisionCard } from '@/components/feature/decision/PredictionDecisionCard'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useDecisionListQuery } from '@/pages/DecisionPage/hooks/useDecisionQueries'

export function PredictionListPage() {
  const navigate = useNavigate()

  const decisionsQuery = useDecisionListQuery()
  const decisions = decisionsQuery.data

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
              {decisions.map((item) => (
                <PredictionDecisionCard key={item.id} decision={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
