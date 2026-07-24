import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AgentCard } from '@/components/domain/agent/AgentCard'
import type { PredictionType } from '@/components/domain/decision/DirectionSelectorGroup'
import { DirectionSelectorGroup } from '@/components/domain/decision/DirectionSelectorGroup'
import HomeCardNewsSection from '@/components/feature/home/HomeCardNewsSection'
import TutorialComplete from '@/components/feature/tutorial/TutorialComplete'
import TutorialStepLayout from '@/components/feature/tutorial/TutorialStepLayout'
import { HOME_CARD_NEWS_MOCK_DATA } from '@/pages/HomePage/mockData'
import { PATH } from '@/routes/paths'
import type { AgentSummary } from '@/types/domain/agent'

type TutorialContent = 'cardNews' | 'agentSelection' | 'prediction'

interface TutorialStep {
  id: string
  step: number
  title: string
  message: string
  content: TutorialContent
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'card-news',
    step: 1,
    title: '카드뉴스 받기',
    message: '안녕하세요 사장님! 먼저 오늘의 카드뉴스를 눌러 시장 분위기를 확인해봐요!',
    content: 'cardNews',
  },
  {
    id: 'agent-analysis',
    step: 2,
    title: '분석 맡기기',
    message: '저에게 분석을 맡겨보세요! 보고서를 금방 써올게요.',
    content: 'agentSelection',
  },
  {
    id: 'stock-prediction',
    step: 3,
    title: '방향 예측하기',
    message: `오를 것 같으면 '상승'을 고르세요. 확신도가 높을수록 보상도 커집니다.`,
    content: 'prediction',
  },
]

const TUTORIAL_AGENTS: AgentSummary[] = [
  {
    id: 'rookie',
    type: 'rookie',
    name: '루키',
    modelName: 'Claude Haiku 4.5',
    level: 8,
    levelProgress: 30,
    hitRate: 64,
    dailyAP: 10,
  },
  {
    id: 'pro',
    type: 'pro',
    name: '프로',
    modelName: 'Claude Opus 4.x',
    level: 7,
    levelProgress: 30,
    hitRate: 64,
    dailyAP: 10,
  },
]

function CardNewsStep() {
  return (
    <HomeCardNewsSection items={HOME_CARD_NEWS_MOCK_DATA.slice(0, 2)} date="5/28" time="09:30" />
  )
}

function AgentSelectionStep() {
  const [selectedAgentId, setSelectedAgentId] = useState(TUTORIAL_AGENTS[0].id)

  return (
    <div className="flex flex-col gap-3">
      {TUTORIAL_AGENTS.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          active={selectedAgentId === agent.id}
          onClick={() => setSelectedAgentId(agent.id)}
        />
      ))}
    </div>
  )
}

function PredictionStep() {
  const [direction, setDirection] = useState<PredictionType | null>(null)

  return (
    <section className="border-Gray-2 rounded-2xl border p-4">
      <h2 className="dnf-Subtitle2 text-Gray-10">Q. 삼성전자는 오를까요?</h2>
      <DirectionSelectorGroup
        selectedDirection={direction}
        onDirectionChange={setDirection}
        className="mt-5"
      />
    </section>
  )
}

function renderStepContent(content: TutorialContent) {
  switch (content) {
    case 'cardNews':
      return <CardNewsStep />
    case 'agentSelection':
      return <AgentSelectionStep />
    case 'prediction':
      return <PredictionStep />
  }
}

export function TutorialPage() {
  const navigate = useNavigate()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const currentStep = TUTORIAL_STEPS[currentStepIndex]

  const handleNext = () => {
    const isLastStep = currentStepIndex === TUTORIAL_STEPS.length - 1

    if (isLastStep) {
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
      onNext={handleNext}
      onSkip={() => navigate(PATH.HOME)}
    >
      {renderStepContent(currentStep.content)}
    </TutorialStepLayout>
  )
}
