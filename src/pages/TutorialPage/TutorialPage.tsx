import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SkHynixLogo from '@/assets/logo/sk-hynix.png'
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
import TutorialComplete from '@/components/feature/tutorial/TutorialComplete'
import TutorialStepLayout from '@/components/feature/tutorial/TutorialStepLayout'
import { HOME_CARD_NEWS_MOCK_DATA } from '@/pages/HomePage/mockData'
import { MOCK_NEWS_CARDS } from '@/pages/NewsCardPage/newsCard'
import {
  TUTORIAL_AGENTS,
  TUTORIAL_STEPS,
  type TutorialContent,
} from '@/pages/TutorialPage/tutorial'
import { PATH } from '@/routes/paths'
import type { ConfidenceLevel } from '@/types/domain/decision'

function CardNewsListStep() {
  return (
    <HomeCardNewsSection items={HOME_CARD_NEWS_MOCK_DATA.slice(0, 2)} date="5/28" time="09:30" />
  )
}

function CardNewsDetailStep() {
  return (
    <div className="overflow-hidden">
      <NewsCard data={MOCK_NEWS_CARDS[0]} />
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
          onClick={() => onSelect(agent.id)}
        />
      ))}
    </div>
  )
}

function AnalysisRequestedStep() {
  return (
    <section className="border-Gray-2 mt-9 flex flex-col items-center rounded-xl border px-5 py-6 text-center">
      <h2 className="dnf-Title4 text-Gray-10">분석을 의뢰했어요!</h2>
      <p className="pretendard-Button2 text-Gray-6 mt-4 leading-relaxed font-normal">
        루키 · 프로 · 탱커가 삼성전자 보고서를 쓰고 있어요.
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
        newsTitleText="HBM 수주 확대로 단기 모멘텀 강세"
      />
      <BriefingComment comment="사장님, 지난번 SK하이닉스 관망이 적중하셨죠! 이번 삼성전자도 결이 비슷해요." />
      <BriefingNote message="사장님, 이건 진짜 기회예요! HBM3E 12단 양산이 시작됐고, 엔비디아·AMD 공급 계약까지 임박했어요. 게다가 외국인이 5거래일 연속 순매수 중이라 수급도 든든합니다! 과거 HBM3 양산 발표 때도 한 달간 강세였던 전례가 있어요. 다만 단기 급등 구간이라 분할 접근만 주의하면 좋겠습니다." />
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
            comment: '사장님, 진짜 갑니다! HBM 수주 소식에 외국인까지 붙었어요. 지금이 기회예요!',
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
          name: 'SK 하이닉스',
          code: '005930',
          marketType: '코스피',
          logoUrl: SkHynixLogo,
          price: 2679000,
          changeRate: 6.3,
          keywords: ['HBM', '반도체', '외국인 순매수'],
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
      stockName="삼성전자"
      changeRate={8.1}
      resultText="상승 적중"
      confidenceLevel={5}
      comment="사장님, 제가 된다고 했잖아요!"
    />
  )
}

interface StepContentProps {
  content: TutorialContent
  selectedAgentId: string
  direction: PredictionType | null
  confidence: ConfidenceLevel
  setSelectedAgentId: (id: string) => void
  setDirection: (direction: PredictionType) => void
  setConfidence: (value: ConfidenceLevel) => void
}

function renderStepContent({
  content,
  selectedAgentId,
  direction,
  confidence,
  setSelectedAgentId,
  setDirection,
  setConfidence,
}: StepContentProps) {
  switch (content) {
    case 'cardNewsList':
      return <CardNewsListStep />
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
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState(TUTORIAL_AGENTS[0].id)
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

  if (isComplete) {
    return <TutorialComplete reward={200} onComplete={() => navigate(PATH.HOME)} />
  }

  return (
    <TutorialStepLayout
      key={currentStep.id}
      step={currentStep.step}
      title={currentStep.title}
      message={currentStep.message}
      buttonLabel={currentStep.buttonLabel}
      onNext={handleNext}
      onSkip={() => navigate(PATH.HOME)}
    >
      {renderStepContent({
        content: currentStep.content,
        selectedAgentId,
        direction,
        confidence,
        setSelectedAgentId,
        setDirection,
        setConfidence,
      })}
    </TutorialStepLayout>
  )
}
