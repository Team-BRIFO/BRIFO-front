import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { signupSession } from '@/api/client/signupSession'
import { browserTokenStore } from '@/api/client/tokenStore'
import { Badge } from '@/components/common/Badge'
import BottomSheet from '@/components/common/BottomSheet'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import { Toast } from '@/components/common/Toast'
import { AgentCard } from '@/components/domain/agent/AgentCard'
import { AgentChat } from '@/components/domain/agent/AgentChat'
import { BriefingComment } from '@/components/domain/briefing/BriefingComment'
import { BriefingNote } from '@/components/domain/briefing/BriefingNote'
import { BriefingReviewSection } from '@/components/domain/briefing/BriefingReviewSection'
import { BriefingTopCard } from '@/components/domain/briefing/BriefingTopCard'
import { AllocationAmountSection } from '@/components/domain/decision/AllocationAmountSection'
import type { PredictionType } from '@/components/domain/decision/DirectionSelectorGroup'
import { DirectionSelectorGroup } from '@/components/domain/decision/DirectionSelectorGroup'
import { GlossaryDefinition } from '@/components/domain/glossary/GlossaryDefinition'
import { AnalyzeCard } from '@/components/feature/analyze/AnalyzeCard'
import { DecisionResultCard } from '@/components/feature/decision/DecisionResultCard'
import HomeCardNewsSection from '@/components/feature/home/HomeCardNewsSection'
import { NewsCard } from '@/components/feature/newsCard/NewsCard'
import { NewsCardIndicator } from '@/components/feature/newsCard/NewsCardIndicator'
import TutorialComplete from '@/components/feature/tutorial/TutorialComplete'
import TutorialStepLayout from '@/components/feature/tutorial/TutorialStepLayout'
import { TUTORIAL_AGENTS, TUTORIAL_STEPS } from '@/constants/tutorialSteps'
import { useCompleteOnboardingMutation } from '@/pages/TutorialPage/hooks/useCompleteOnboardingMutation'
import { useCreateTutorialRewardMutation } from '@/pages/TutorialPage/hooks/useCreateTutorialRewardMutation'
import {
  TUTORIAL_HOME_CARD_NEWS_MOCK,
  TUTORIAL_NEWS_CARD_MOCK,
  TUTORIAL_NEWS_CARD_MOCK_2,
} from '@/pages/TutorialPage/mockData'
import { PATH } from '@/routes/paths'
import type { TutorialContent } from '@/types/domain/tutorial'

/** 튜토리얼 시뮬레이션에서 사용하는 가상의 보유 자금 */
const TUTORIAL_BALANCE_AP = 1_000_000

/** 튜토리얼에서 유일하게 선택 가능한 카드뉴스(브리포테크)의 id */
const TUTORIAL_BRIFO_NEWS_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6'

function CardNewsListStep({
  selectedId,
  onSelect,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <HomeCardNewsSection
      items={TUTORIAL_HOME_CARD_NEWS_MOCK}
      date="8/22"
      time="09:30"
      selectedId={selectedId}
      onItemClick={(id) => {
        // 브리포테크(id: TUTORIAL_BRIFO_NEWS_ID 또는 'BRIFO01')만 선택
        if (id === TUTORIAL_BRIFO_NEWS_ID || id === 'BRIFO01') {
          onSelect(String(id))
        }
      }}
    />
  )
}

/** 튜토리얼 카드뉴스 안의 용어 클릭 시 보여줄 정의 (실제 서비스의 용어 바텀시트를 모사) */
const TUTORIAL_TERM_DEFINITIONS: Record<string, { title: string; definition: string }> = {
  hbm: {
    title: 'HBM',
    definition:
      'HBM은 여러 개의 메모리를 수직으로 쌓아 데이터 처리 속도를 높인 고대역폭 메모리예요. AI 반도체에 주로 사용돼요.',
  },
}

function CardNewsDetailStep() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null)
  const selectedTerm = selectedTermId ? TUTORIAL_TERM_DEFINITIONS[selectedTermId] : null

  return (
    <div className="flex flex-col items-center gap-6 overflow-hidden pb-4">
      <div
        className="-mx-4 flex w-[calc(100%+2rem)] snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
        aria-label="추천 카드뉴스"
        onScroll={(event) => {
          const { scrollLeft, clientWidth } = event.currentTarget
          if (clientWidth > 0) setCurrentIndex(Math.min(1, Math.round(scrollLeft / clientWidth)))
        }}
      >
        {[TUTORIAL_NEWS_CARD_MOCK, TUTORIAL_NEWS_CARD_MOCK_2].map((newsCard) => (
          <div key={newsCard.cardId} className="w-full shrink-0 snap-center px-4">
            <NewsCard data={newsCard} onTermClick={setSelectedTermId} className="w-full" />
          </div>
        ))}
      </div>
      <NewsCardIndicator total={2} currentIndex={currentIndex} />

      <BottomSheet
        isOpen={selectedTerm !== null}
        onClose={() => setSelectedTermId(null)}
        ariaLabel="어려운 단어 안내"
        className="items-center gap-4.5"
      >
        {selectedTerm && (
          <>
            <BottomSheet.Body className="flex flex-col gap-5">
              <div className="flex flex-col items-center gap-2">
                <Badge size="md" type="normal">
                  주식 용어
                </Badge>
                <p className="dnf-Title4 break-keep">{selectedTerm.title}</p>
              </div>
              <div className="flex flex-col gap-2">
                <AgentChat type="rookie" message="이 단어, 제가 쉽게 알려드릴게요!" />
                <GlossaryDefinition className="break-keep">
                  {selectedTerm.definition}
                </GlossaryDefinition>
              </div>
              <p className="pretendard-Caption2 text-Gray-6 text-center break-keep">
                이해했어요를 누르면 내 용어장에 저장돼요.
              </p>
            </BottomSheet.Body>
            <BottomSheet.Footer>
              <Button size="lg" isFullWidth onClick={() => setSelectedTermId(null)}>
                이해했어요
              </Button>
            </BottomSheet.Footer>
          </>
        )}
      </BottomSheet>
    </div>
  )
}

function AgentSelectionStep({
  selectedAgentId,
  onSelect,
}: {
  selectedAgentId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {TUTORIAL_AGENTS.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          active={selectedAgentId === agent.id}
          compact
          onClick={() => {
            if (agent.id === 'rookie') {
              onSelect(agent.id)
            }
          }}
        />
      ))}
    </div>
  )
}

function AnalysisRequestedStep() {
  return (
    <div className="bg-White mx-auto mt-9 flex w-[calc(100%-1rem)] flex-col items-center rounded-3xl px-5 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
      <Modal.Header className="flex flex-col items-center gap-4 text-center">
        <h2 className="dnf-Title4 text-Gray-10 m-0">분석을 의뢰했어요!</h2>
        <p className="pretendard-Caption2 text-Gray-6 m-0 text-center leading-5 tracking-[-0.04em]">
          루키가 브리포테크 보고서를 쓰고 있어요.
          <br />
          사무실에서 진행 상황을 볼 수 있어요!
        </p>
      </Modal.Header>
      {/* 실제 동작은 하지 않는 미리보기용 버튼 — 진행은 하단 "다음" 버튼으로 */}
      <Modal.Footer className="mt-5 flex w-full flex-col items-center gap-2">
        <Button isFullWidth size="lg" color="primary" tabIndex={-1} className="pointer-events-none">
          사무실 바로가기
        </Button>
        <Button
          isFullWidth
          size="lg"
          color="assistive"
          tabIndex={-1}
          className="pointer-events-none"
        >
          다른 카드뉴스 더보기
        </Button>
      </Modal.Footer>
    </div>
  )
}

function AnalysisReportStep() {
  return (
    <article className="flex flex-col gap-3">
      <BriefingTopCard
        badgeType="rise"
        badgeText="상승 예측"
        percentage={72}
        newsTitleText="통합 시험용 시제품 제작 완료"
      />
      <BriefingComment comment="사장님, 지난번 브리포시스템 관망이 적중하셨죠! 이번 브리포테크도 결이 비슷해요." />
      <BriefingNote message="사장님, 이건 진짜 기회예요! HBM3E 12단 양산이 시작됐고, 엔비디아·AMD 공급 계약까지 임박했어요. 게다가 외국인이 5거래일 연속 순매수 중이라 수급도 든든합니다! 과거 HBM3 양산 발표 때도 한 달간 강세였던 전례가 있어요. 다만 단기 급등 구간이라 분할 접근만 주의하면 좋겠습니다." />
    </article>
  )
}

function PredictionStep({
  direction,
  allocatedAp,
  onDirectionChange,
  onAllocatedApChange,
}: {
  direction: PredictionType | null
  allocatedAp: number
  onDirectionChange: (direction: PredictionType) => void
  onAllocatedApChange: (value: number) => void
}) {
  return (
    <section className="flex flex-col">
      <DirectionSelectorGroup selectedDirection={direction} onDirectionChange={onDirectionChange} />
      <AllocationAmountSection
        value={allocatedAp}
        onChange={onAllocatedApChange}
        balance={TUTORIAL_BALANCE_AP}
        className="mt-6"
      />
      <BriefingReviewSection
        className="mt-6"
        reviews={[
          {
            agentName: '루키',
            badgeType: 'rise',
            badgeText: '상승 예측',
            comment:
              '사장님, 진짜 갑니다! 신규 공정 소식에 외부 기대감까지 붙었어요. 지금이 기회예요!',
          },
        ]}
      />
    </section>
  )
}

const MARKET_TYPE_LABEL: Record<string, string> = {
  KOSPI: '코스피',
  KOSDAQ: '코스닥',
}

function PredictionRegisteredStep({ selectedNewsId }: { selectedNewsId: string | null }) {
  // 이전 스텝(카드뉴스 선택)에서 고른 자산을 그대로 보여준다
  const selectedNews =
    TUTORIAL_HOME_CARD_NEWS_MOCK.find((item) => String(item.id) === selectedNewsId) ??
    TUTORIAL_HOME_CARD_NEWS_MOCK[0]
  const { stock } = selectedNews

  return (
    <section className="border-Gray-2 flex flex-col items-center rounded-2xl border px-4 py-7 text-center">
      <h2 className="dnf-Subtitle2 text-Gray-10">예측 등록 완료!</h2>
      <AnalyzeCard
        type="normal"
        resultType="HASHTAG"
        stock={{
          name: stock.name,
          code: stock.code,
          marketType: MARKET_TYPE_LABEL[stock.marketType] ?? stock.marketType,
          logoUrl: stock.logoUrl,
          price: stock.price,
          changeRate: stock.changeRate,
          keywords: ['HBM', '반도체', '외국인 순매수'],
        }}
        className="mt-5"
      />
      <p className="pretendard-Caption2 text-Gray-6 mt-5 text-center leading-[1.4]">
        <span className="text-Pink-30">장 마감 시</span> 자동으로 정산돼요.
        <br />
        결과는 알림으로 알려드릴게요!
      </p>
    </section>
  )
}

function PredictionResultStep({ allocatedAp }: { allocatedAp: number }) {
  return (
    <DecisionResultCard
      // 카드 문구가 "2배 적중 보너스"이므로 배분액의 2배를 적중 보상으로 표시한다
      points={allocatedAp * 2}
      stockName="브리포테크"
      changeRate={8.1}
      resultText="상승 적중"
      allocatedAp={allocatedAp}
      comment="사장님, 제가 된다고 했잖아요!"
    />
  )
}

interface StepContentProps {
  content: TutorialContent
  selectedAgentId: string
  selectedNewsId: string | null
  direction: PredictionType | null
  allocatedAp: number
  setSelectedAgentId: (id: string) => void
  setSelectedNewsId: (id: string) => void
  setDirection: (direction: PredictionType) => void
  setAllocatedAp: (value: number) => void
}

function renderStepContent({
  content,
  selectedAgentId,
  selectedNewsId,
  direction,
  allocatedAp,
  setSelectedAgentId,
  setSelectedNewsId,
  setDirection,
  setAllocatedAp,
}: StepContentProps) {
  switch (content) {
    case 'cardNewsList':
      return <CardNewsListStep selectedId={selectedNewsId} onSelect={setSelectedNewsId} />
    case 'cardNewsDetail':
      return <CardNewsDetailStep />
    case 'agentSelection':
      return <AgentSelectionStep selectedAgentId={selectedAgentId} onSelect={setSelectedAgentId} />
    case 'analysisRequested':
      return <AnalysisRequestedStep />
    case 'analysisReport':
      return <AnalysisReportStep />
    case 'prediction':
      return (
        <PredictionStep
          direction={direction}
          allocatedAp={allocatedAp}
          onDirectionChange={setDirection}
          onAllocatedApChange={setAllocatedAp}
        />
      )
    case 'predictionRegistered':
      return <PredictionRegisteredStep selectedNewsId={selectedNewsId} />
    case 'predictionResult':
      return <PredictionResultStep allocatedAp={allocatedAp} />
  }
}

export function TutorialPage() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isReplay = pathname === PATH.TUTORIAL_REPLAY
  const completeOnboarding = useCompleteOnboardingMutation()
  const createTutorialReward = useCreateTutorialRewardMutation()
  const hasCompletedOnboarding = useRef(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState(TUTORIAL_AGENTS[0].id)
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(TUTORIAL_BRIFO_NEWS_ID)
  const [direction, setDirection] = useState<PredictionType | null>('UP')
  const [allocatedAp, setAllocatedAp] = useState(Math.floor(TUTORIAL_BALANCE_AP * 0.2))

  const currentStep = TUTORIAL_STEPS[currentStepIndex]

  const handleNext = () => {
    if (currentStepIndex === TUTORIAL_STEPS.length - 1) {
      setIsComplete(true)
      return
    }

    setCurrentStepIndex((previous) => previous + 1)
  }

  const navigateHome = () => navigate(PATH.HOME, { replace: true })
  const navigateSettings = () => navigate(PATH.MY_SETTINGS, { replace: true })

  const requestTutorialReward = () => {
    createTutorialReward.mutate(undefined, { onSuccess: navigateHome })
  }

  const finishOnboarding = (shouldReward: boolean) => {
    if (hasCompletedOnboarding.current) {
      if (shouldReward) requestTutorialReward()
      else navigateHome()
      return
    }

    completeOnboarding.mutate(undefined, {
      onSuccess: (result) => {
        if ('token' in result && result.token) {
          browserTokenStore.setTokens(result.token)
        }
        signupSession.clear()
        hasCompletedOnboarding.current = true

        if (shouldReward) requestTutorialReward()
        else navigateHome()
      },
    })
  }

  const handleComplete = () => finishOnboarding(true)
  const handleSkip = () => finishOnboarding(false)

  const isSubmitting = completeOnboarding.isPending || createTutorialReward.isPending
  const submitError = completeOnboarding.error ?? createTutorialReward.error

  if (isComplete) {
    return (
      <>
        <TutorialComplete
          reward={isReplay ? undefined : 100_000}
          isReplay={isReplay}
          onComplete={isReplay ? navigateSettings : handleComplete}
          isPending={isReplay ? false : isSubmitting}
        />
        {!isReplay && submitError && (
          <Toast message={submitError.serviceMessage ?? '온보딩을 완료하지 못했어요'} />
        )}
      </>
    )
  }

  return (
    <>
      <TutorialStepLayout
        key={currentStep.id}
        step={currentStep.step}
        title={currentStep.title}
        message={currentStep.message}
        buttonLabel={currentStep.buttonLabel}
        nextDisabled={currentStep.content === 'cardNewsList' && !selectedNewsId}
        skipDisabled={!isReplay && isSubmitting}
        isReplay={isReplay}
        onNext={handleNext}
        onSkip={isReplay ? navigateSettings : handleSkip}
      >
        {renderStepContent({
          content: currentStep.content,
          selectedAgentId,
          selectedNewsId,
          direction,
          allocatedAp,
          setSelectedAgentId,
          setSelectedNewsId,
          setDirection,
          setAllocatedAp,
        })}
      </TutorialStepLayout>
      {!isReplay && submitError && (
        <Toast message={submitError.serviceMessage ?? '온보딩을 완료하지 못했어요'} />
      )}
    </>
  )
}
