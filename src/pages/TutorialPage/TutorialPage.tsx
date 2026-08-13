import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { signupSession } from '@/api/client/signupSession'
import { browserTokenStore } from '@/api/client/tokenStore'
import BrifoTecLogo from '@/assets/logo/BRIFOTEC.svg'
import { Toast } from '@/components/common/Toast'
import { AgentCard } from '@/components/domain/agent/AgentCard'
import { BriefingComment } from '@/components/domain/briefing/BriefingComment'
import { BriefingNote } from '@/components/domain/briefing/BriefingNote'
import { BriefingReviewSection } from '@/components/domain/briefing/BriefingReviewSection'
import { BriefingTopCard } from '@/components/domain/briefing/BriefingTopCard'
import { ConfidenceSliderSection } from '@/components/domain/decision/ConfidenceSliderSection'
import type { PredictionType } from '@/components/domain/decision/DirectionSelectorGroup'
import { DirectionSelectorGroup } from '@/components/domain/decision/DirectionSelectorGroup'
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
import type { ConfidenceLevel } from '@/types/domain/decision'
import type { TutorialContent } from '@/types/domain/tutorial'

/** 카드뉴스 상세·브리핑·예측 등 콘텐츠가 viewport를 넘는 STEP만 스크롤 허용 */
const SCROLLABLE_TUTORIAL_CONTENTS: TutorialContent[] = [
  'cardNewsDetail',
  'analysisReport',
  'prediction',
  'predictionRegistered',
  'predictionResult',
]

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
        // 브리포테크(id: '3fa85f64-5717-4562-b3fc-2c963f66afa6' 또는 'BRIFO01')만 선택
        if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa6' || id === 'BRIFO01') {
          onSelect(String(id))
        }
      }}
    />
  )
}

function CardNewsDetailStep({ isSecond = false }: { isSecond?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-6 overflow-hidden pb-4">
      <NewsCard
        data={isSecond ? TUTORIAL_NEWS_CARD_MOCK_2 : TUTORIAL_NEWS_CARD_MOCK}
        className="w-full"
      />
      <NewsCardIndicator total={2} currentIndex={isSecond ? 1 : 0} />
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
    <div className="flex flex-col gap-3">
      {TUTORIAL_AGENTS.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          active={selectedAgentId === agent.id}
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
    <section className="border-Gray-2 mt-9 flex w-full flex-col items-center rounded-xl border px-5 py-6 text-center">
      <h2 className="dnf-Title4 text-Gray-10">분석을 의뢰했어요!</h2>
      <p className="pretendard-Button2 text-Gray-6 mt-4 leading-relaxed font-normal">
        루키 · 프로 · 탱커가 보고서를 쓰고 있어요.
        <br />
        사무실에서 진행 상황을 볼 수 있어요!
      </p>
      <div className="bg-Yellow-40 text-Pink-5 pretendard-Subtitle6 mt-5 w-72 rounded-3xl px-8 py-5">
        내일까지 기다리기
      </div>
    </section>
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
      <BriefingComment comment="사장님, 지난번 종목 관망이 적중하셨죠! 이번 브리포테크도 결이 비슷해요." />
      <BriefingNote message="사장님, 이건 진짜 기회예요! 차세대 공정 모듈의 통합 시험용 시제품 제작을 마쳤어요. 장시간 연속 운전과 제어 기능 연동 여부 확인에 따라 수급도 든든합니다! 다만 아직 검증이 남아있는 단기 급등 구간이라 분할 접근만 주의하면 좋겠습니다." />
    </article>
  )
}

function PredictionStep({
  direction,
  confidence,
  onDirectionChange,
  onConfidenceChange,
}: {
  direction: PredictionType | null
  confidence: ConfidenceLevel
  onDirectionChange: (direction: PredictionType) => void
  onConfidenceChange: (value: ConfidenceLevel) => void
}) {
  return (
    <section className="flex flex-col">
      <DirectionSelectorGroup selectedDirection={direction} onDirectionChange={onDirectionChange} />
      <ConfidenceSliderSection
        value={confidence}
        onChange={onConfidenceChange}
        apCost={60}
        expectedReward={100}
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

function PredictionRegisteredStep() {
  return (
    <section className="border-Gray-2 flex flex-col items-center rounded-2xl border px-4 py-7 text-center">
      <h2 className="dnf-Subtitle2 text-Gray-10">예측 등록 완료!</h2>
      <strong className="dnf-Title2 text-Yellow-30 mt-2">+100 AP</strong>
      <AnalyzeCard
        type="normal"
        resultType="HASHTAG"
        stock={{
          name: '브리포테크',
          code: 'BRIFO01',
          marketType: 'KOSPI',
          logoUrl: BrifoTecLogo,
          price: 31850,
          changeRate: 17.96,
          keywords: ['차세대공정', '모듈', '성능검증'],
        }}
        className="mt-5"
      />
      <p className="pretendard-Caption2 text-Gray-6 mt-5 text-center leading-[1.4]">
        <span className="text-Pink-30">오늘 15:30</span> 장 마감에 자동으로 정산돼요.
        <br />
        결과는 알림으로 알려드릴게요!
      </p>
    </section>
  )
}

function PredictionResultStep() {
  return (
    <DecisionResultCard
      points={100}
      stockName="브리포테크"
      changeRate={8.1}
      resultText="상승 적중"
      confidenceLevel={5}
      comment="사장님, 제가 된다고 했잖아요!"
    />
  )
}

interface StepContentProps {
  stepId: string
  content: TutorialContent
  selectedAgentId: string
  selectedNewsId: string | null
  direction: PredictionType | null
  confidence: ConfidenceLevel
  setSelectedAgentId: (id: string) => void
  setSelectedNewsId: (id: string) => void
  setDirection: (direction: PredictionType) => void
  setConfidence: (value: ConfidenceLevel) => void
}

function renderStepContent({
  stepId,
  content,
  selectedAgentId,
  selectedNewsId,
  direction,
  confidence,
  setSelectedAgentId,
  setSelectedNewsId,
  setDirection,
  setConfidence,
}: StepContentProps) {
  switch (content) {
    case 'cardNewsList':
      return <CardNewsListStep selectedId={selectedNewsId} onSelect={setSelectedNewsId} />
    case 'cardNewsDetail':
      return <CardNewsDetailStep isSecond={stepId === 'card-news-detail-guide'} />
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
          confidence={confidence}
          onDirectionChange={setDirection}
          onConfidenceChange={setConfidence}
        />
      )
    case 'predictionRegistered':
      return <PredictionRegisteredStep />
    case 'predictionResult':
      return <PredictionResultStep />
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
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null)
  const [direction, setDirection] = useState<PredictionType | null>('UP')
  const [confidence, setConfidence] = useState<ConfidenceLevel>(3)

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
          reward={isReplay ? undefined : 200}
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
        isContentScrollable={SCROLLABLE_TUTORIAL_CONTENTS.includes(currentStep.content)}
        isReplay={isReplay}
        onNext={handleNext}
        onSkip={isReplay ? navigateSettings : handleSkip}
      >
        {renderStepContent({
          stepId: currentStep.id,
          content: currentStep.content,
          selectedAgentId,
          selectedNewsId,
          direction,
          confidence,
          setSelectedAgentId,
          setSelectedNewsId,
          setDirection,
          setConfidence,
        })}
      </TutorialStepLayout>
      {!isReplay && submitError && (
        <Toast message={submitError.serviceMessage ?? '온보딩을 완료하지 못했어요'} />
      )}
    </>
  )
}
