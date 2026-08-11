import { useLocation, useNavigate } from 'react-router-dom'

import Button from '@/components/common/Button'
import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import TutorialStepCard from '@/components/feature/tutorial/TutorialStepCard'
import { TUTORIAL_INTRO_STEPS } from '@/constants/tutorialSteps'
import { PATH } from '@/routes/paths'

export function TutorialIntroPage() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isReplay = pathname === PATH.TUTORIAL_REPLAY_INTRO

  return (
    <main
      className={`flex w-full flex-1 flex-col ${
        isReplay ? 'bg-Background1 h-dvh min-h-0 overflow-hidden pb-5' : 'px-4 pt-6 pb-5'
      }`}
    >
      <StatusBar
        hasStatusArea={!isReplay}
        className={isReplay ? 'w-full' : 'w-full [&>div:last-child]:px-0'}
        left={<StatusBarBackButton onClick={() => navigate(-1)} />}
        title={isReplay ? '튜토리얼' : undefined}
      />

      <section
        className={`mt-13 flex min-h-0 flex-1 flex-col ${isReplay ? 'overflow-y-auto px-4' : ''}`}
      >
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

        {!isReplay && (
          <div className="bg-Yellow-50 mt-5 flex h-12 items-center justify-center rounded-[20px]">
            <span className="pretendard-Body2-Semibold text-Yellow-5">튜토리얼 완료 시 보너스</span>

            <span className="dnf-Caption2 text-Yellow-5 ml-1">+200 AP</span>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3">
          {TUTORIAL_INTRO_STEPS.map((item) => (
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

      <div className={isReplay ? 'mx-4 flex justify-center' : undefined}>
        <Button
          type="button"
          size={isReplay ? 'semilg' : 'lg'}
          color="primary"
          isFullWidth
          onClick={() => navigate(isReplay ? PATH.TUTORIAL_REPLAY : PATH.TUTORIAL)}
          className={`mt-6 shadow-[0_4px_8px_0_rgba(168,79,1,0.15)] ${isReplay ? 'max-w-80' : ''}`}
        >
          튜토리얼 시작하기
        </Button>
      </div>
    </main>
  )
}
