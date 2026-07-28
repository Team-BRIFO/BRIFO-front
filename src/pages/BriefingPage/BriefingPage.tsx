import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { AnalyzeCard } from '@/components/feature/analyze/AnalyzeCard'
import { BriefingAgentListItem } from '@/components/feature/briefing/BriefingAgentListItem'
import { useCardNewsBriefingsQuery } from '@/pages/BriefingPage/hooks/useBriefingQueries'
import { PATH } from '@/routes/paths'

export function BriefingPage() {
  const [searchParams] = useSearchParams()
  // URL에서 cardId 추출 (없으면 기본 mock UUID 사용)
  const cardId = searchParams.get('cardId') ?? 'mock-card-id'
  const navigate = useNavigate()

  const { data, isLoading, isError, refetch } = useCardNewsBriefingsQuery(cardId)

  if (isLoading && !data) {
    return (
      <div className="bg-Background1 flex h-screen w-full flex-col items-center justify-center">
        <p className="pretendard-Body1 text-Gray-6">브리핑을 불러오는 중...</p>
      </div>
    )
  }

  if ((isError && !data) || !data) {
    return (
      <div className="bg-Background1 flex h-screen w-full flex-col items-center justify-center">
        <p className="pretendard-Body1 text-Pink-30">브리핑 데이터를 불러오지 못했습니다.</p>
        <button
          type="button"
          className="pretendard-Button2 text-Gray-6 mt-4 underline"
          onClick={() => refetch()}
        >
          다시 시도
        </button>
      </div>
    )
  }

  const { stock, items } = data

  return (
    <div className="bg-Background1 flex h-screen w-full flex-col">
      {/* 글로벌 상태바 헤더 */}
      <StatusBar
        className="bg-White"
        left={<StatusBarBackButton />}
        title="브리핑"
        right={<StatusBarNotificationButton />}
      />

      {/* 스크롤 가능한 본문 영역 */}
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-8">
          {/* 주식 요약 카드 */}
          <AnalyzeCard
            type="normal"
            resultType="HASHTAG"
            stock={{
              ...stock,
              keywords: stock.hashtags,
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
              {items.length === 0 ? (
                <p className="pretendard-Body2-Regular text-Gray-6 py-10 text-center">
                  아직 도착한 브리핑이 없어요.
                </p>
              ) : (
                items.map((item) => (
                  <BriefingAgentListItem
                    key={item.id}
                    agentType={item.agentType}
                    agentName={item.nickname}
                    badgeType={item.direction}
                    comment={item.oneLiner}
                    onClick={() => navigate(PATH.BRIEFING_DETAIL(item.id))}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
