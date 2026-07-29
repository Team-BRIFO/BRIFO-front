import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import CelebrationImage from '@/assets/characters/celebration.svg?react'
import Button from '@/components/common/Button'
import { Loading } from '@/components/common/Loading'
import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import { BriefingCard } from '@/components/domain/briefing/BriefingCard'
import { ErrorView } from '@/components/feature/error/ErrorView'
import { useCardNewsBriefingsQuery } from '@/pages/BriefingPage/hooks/useBriefingQueries'
import { PATH } from '@/routes/paths'
import type { BriefingRequestResult } from '@/types/domain/briefing'

export function BriefingCompletePage() {
  const { cardId } = useParams<{ cardId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const briefingRequest = location.state?.briefingRequest as BriefingRequestResult | undefined

  // 해당 카드뉴스 종목명 확보를 위해 브리핑 목록 조회 재사용 (이미 캐싱되어 빠름)
  const cardNewsQuery = useCardNewsBriefingsQuery(cardId ?? null)

  const agentCount = briefingRequest?.requestedAgents.length ?? 3

  // 임시 테스트용 상태 (순차적 뱃지 변경)
  const [mockAgents, setMockAgents] = useState<string[]>([])

  useEffect(() => {
    const t1 = setTimeout(() => setMockAgents(['rookie']), 1000)
    const t2 = setTimeout(() => setMockAgents(['rookie', 'pro']), 2000)
    const t3 = setTimeout(() => setMockAgents(['rookie', 'pro', 'tanker']), 3000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  // 모든 사원이 완료되었는지 확인
  const isAllComplete =
    mockAgents.includes('rookie') && mockAgents.includes('pro') && mockAgents.includes('tanker')

  if (cardNewsQuery.isError && !cardNewsQuery.data) {
    return (
      <div className="bg-Background1 flex min-h-screen flex-col">
        <StatusBar left={<StatusBarBackButton />} />
        <div className="px-4 py-6">
          <ErrorView
            title="브리핑 정보를 불러오지 못했어요"
            description="잠시 후 다시 시도해주세요."
            buttonText="다시 시도"
            onButtonClick={() => cardNewsQuery.refetch()}
          />
        </div>
      </div>
    )
  }

  if (!cardNewsQuery.data) {
    return <Loading className="py-10" />
  }

  const stockName = cardNewsQuery.data.stock.name

  return (
    <div className="bg-White box-border flex h-screen w-full flex-col px-4">
      <StatusBar
        left={<StatusBarBackButton />}
        // title 없음
      />

      <div className="mt-20 flex flex-1 flex-col items-center gap-15.5">
        {/* 상단: 캐릭터 & 타이틀 영역 */}
        <div className="flex flex-col items-center gap-7">
          {/* 아바타 그룹 연출 (픽셀 이미지 대체) */}
          <CelebrationImage width={208} height={120} />

          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="dnf-Title3 text-Gray-10 m-0">브리핑 도착!</h1>
            <p className="pretendard-Caption1 text-Gray-6 whitespace-pre-wrap">
              {`사원 ${agentCount}명이 ${stockName} 분석을 끝냈어요.\n지금 바로 확인해 보세요.`}
            </p>
          </div>
        </div>

        {/* 중단: 주식 분석 카드 영역 */}
        <div className="flex w-full flex-col">
          <BriefingCard
            type={isAllComplete ? '완료' : '진행중'}
            active={false}
            stock={{ name: stockName }}
            agentStatuses={{
              rookie: mockAgents.includes('rookie') ? '완료' : '진행중',
              pro: mockAgents.includes('pro') ? '완료' : '진행중',
              tanker: mockAgents.includes('tanker') ? '완료' : '진행중',
            }}
          />
        </div>

        {/* 하단: 액션 버튼 영역 */}
        <div className="flex w-full flex-col items-center gap-4">
          <Button isFullWidth size="lg" color="primary" onClick={() => navigate(PATH.BRIEFING)}>
            지금 확인하기
          </Button>
          <button
            type="button"
            className="pretendard-Caption1 text-Gray-6 cursor-pointer border-none bg-transparent underline underline-offset-2"
            onClick={() => navigate(PATH.OFFICE)}
          >
            나중에 보고싶어요
          </button>
        </div>
      </div>
    </div>
  )
}
