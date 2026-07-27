import { useNavigate } from 'react-router-dom'

import Step1Image from '@/assets/characters/tutorial_step1.svg?react'
import Step2Image from '@/assets/characters/tutorial_step2.svg?react'
import Step3Image from '@/assets/characters/tutorial_step3.svg?react'
import Button from '@/components/common/Button'
import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import TutorialStepCard from '@/components/feature/tutorial/TutorialStepCard'
import { PATH } from '@/routes/paths'

const TUTORIAL_STEPS = [
  {
    step: 1,
    title: '첫 카드뉴스 확인',
    description: 'AI가 만든 5W1H 사실 요약 카드뉴스를 \n받아보세요',
    image: Step1Image,
  },
  {
    step: 2,
    title: '루키의 첫 분석',
    description: '루키 사원에게 분석을 의뢰하고 보고서를 \n채택해보세요',
    image: Step2Image,
  },
  {
    step: 3,
    title: '첫 예측 등록',
    description: `방향(↑↓~)과 확신도(1~5)를 선택해  \n 예측하세요`,
    image: Step3Image,
  },
] as const

export function TutorialIntroPage() {
  const navigate = useNavigate()

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-90 flex-col bg-white px-4 pt-6 pb-5">
      <StatusBar
        hasStatusArea
        className="w-full [&>div:last-child]:px-0"
        left={<StatusBarBackButton onClick={() => navigate(-1)} />}
      />

      <section className="mt-13 flex flex-1 flex-col">
        <div>
          <h1 className="dnf-Title3 text-Gray-10 leading-[1.2]">
            투자 튜토리얼
            <br />
            <span className="text-[#FFBE00]">3분이면 끝나요!</span>
          </h1>

          <p className="pretendard-Caption1 mt-3 text-[#8A8499]">
            뉴스 → 사원 분석 → 예측까지 한 번에 익혀보세요
          </p>
        </div>

        <div className="bg-Yellow-50 mt-5 flex h-12 items-center justify-center rounded-[20px]">
          <span className="pretendard-Body2-Semibold text-Yellow-5">튜토리얼 완료 시 보너스</span>

          <span className="dnf-Caption2 text-Yellow-5 ml-1">+200 AP</span>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {TUTORIAL_STEPS.map((item) => (
            <TutorialStepCard
              key={item.step}
              step={item.step}
              title={item.title}
              description={item.description}
              Image={item.image}
            />
          ))}
        </div>
      </section>

      <Button
        type="button"
        size="lg"
        color="primary"
        isFullWidth
        onClick={() => navigate(PATH.TUTORIAL)}
        className="mt-6 shadow-[0_4px_8px_0_rgba(168,79,1,0.15)]"
      >
        튜토리얼 시작하기
      </Button>
    </main>
  )
}
