import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { AnalyzeCard } from '@/components/feature/analyze/AnalyzeCard'
import { BriefingAgentListItem } from '@/components/feature/briefing/BriefingAgentListItem'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useStockBriefingsQuery } from '@/pages/BriefingPage/hooks/useStockBriefingsQuery'
import { PATH } from '@/routes/paths'

export function BriefingPage() {
  const [searchParams] = useSearchParams()
  const stockId = searchParams.get('stockId')
  const navigate = useNavigate()

  const { data, fetchStatus, error, refetch } = useStockBriefingsQuery(stockId)

  return (
    <div className="bg-Background1 flex h-screen w-full flex-col">
      {/* 글로벌 상태바 헤더 */}
      <StatusBar
        hasStatusArea={false}
        className="bg-White"
        left={<StatusBarBackButton onClick={() => navigate(-1)} />}
        title="브리핑"
        right={<StatusBarNotificationButton />}
      />

      {!!error && fetchStatus === 'idle' ? (
        <PageErrorView
          title="브리핑 데이터를 불러오지 못했습니다."
          error={error}
          onRetry={() => refetch()}
        />
      ) : fetchStatus === 'fetching' || !data ? (
        <PageLoadingView />
      ) : (
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
          <div className="flex flex-col gap-8">
            {/* 주식 요약 카드 */}
            <AnalyzeCard
              type="normal"
              resultType="HASHTAG"
              stock={{
                ...data.stock,
                keywords: data.stock.hashtags,
              }}
            />

            {/* AI 사원 브리핑 리스트 */}
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="dnf-Subtitle2 text-Gray-10">AI 사원 브리핑</h2>
                <p className="pretendard-Button2 text-Gray-6 mt-1">
                  세 사원이 같은 종목을 다르게 봅니다
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {data.items.filter((item) => item.status !== 'FAILED').length === 0 ? (
                  <p className="pretendard-Body2-Regular text-Gray-6 py-10 text-center">
                    아직 도착한 브리핑이 없어요.
                  </p>
                ) : (
                  data.items
                    .filter((item) => item.status !== 'FAILED')
                    .map((item) => (
                      <BriefingAgentListItem
                        key={item.id}
                        agentType={item.agentType}
                        agentName={item.nickname}
                        badgeType={item.direction}
                        comment={item.oneLiner}
                        onClick={() =>
                          item.status === 'COMPLETED'
                            ? navigate(PATH.BRIEFING_DETAIL(item.id))
                            : null
                        }
                        className={
                          item.status !== 'COMPLETED'
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
