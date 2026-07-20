import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { BriefingAgentListItem } from '@/components/feature/briefing/BriefingAgentListItem'
import { AnalyzeCard } from '@/components/feature/stock/AnalyzeCard'
import { useGetCardNewsBriefings } from '@/hooks/queries/useBriefing'
import type { AgentType } from '@/types/domain/agent'

export function BriefingPage() {
  const [searchParams] = useSearchParams()
  // URL에서 cardId 추출 (없으면 기본 mock UUID 사용)
  const cardId = searchParams.get('cardId') ?? 'mock-card-id'
  const navigate = useNavigate()

  const { data: response, isLoading, isError } = useGetCardNewsBriefings(cardId)

  if (isLoading) {
    return (
      <div className="bg-Gray-1 flex h-screen w-full flex-col items-center justify-center">
        <p className="pretendard-Body1 text-Gray-6">브리핑을 불러오는 중...</p>
      </div>
    )
  }

  if (isError || !response) {
    return (
      <div className="bg-Gray-1 flex h-screen w-full flex-col items-center justify-center">
        <p className="pretendard-Body1 text-Pink-30">브리핑 데이터를 불러오지 못했습니다.</p>
      </div>
    )
  }

  const { stock, items } = response

  const directionMap = {
    UP: { badgeType: 'rise' as const, badgeText: '상승 예측' },
    DOWN: { badgeType: 'fall' as const, badgeText: '하락 예측' },
    NEUTRAL: { badgeType: 'watch' as const, badgeText: '관망 예측' },
  }

  return (
    <div className="bg-Gray-1 flex h-screen w-full flex-col">
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
              tags: ['HBM', '반도체', '외국인 순매수'],
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
              {items.map((item) => {
                const mappedType = item.agentType.toLowerCase() as AgentType
                return (
                  <BriefingAgentListItem
                    key={item.briefingId}
                    agentType={mappedType}
                    agentName={item.nickname}
                    badgeType={directionMap[item.direction].badgeType}
                    badgeText={directionMap[item.direction].badgeText}
                    comment={item.oneLiner}
                    onClick={() => navigate(`/briefing/detail/${item.briefingId}`)}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
