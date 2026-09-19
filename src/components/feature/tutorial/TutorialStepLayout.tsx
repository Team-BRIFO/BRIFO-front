import type { ReactNode } from 'react'

import Button from '@/components/common/Button'
import { StatusBar, StatusBarSkipButton } from '@/components/common/StatusBar'
import { AgentChat } from '@/components/domain/agent/AgentChat'

interface TutorialStepLayoutProps {
  step: number
  title: string
  message: string
  children: ReactNode
  buttonLabel?: string
  nextDisabled?: boolean
  skipDisabled?: boolean
  /** 설정에서 다시 보는 튜토리얼은 설정 하위 화면 헤더를 사용한다. */
  isReplay?: boolean
  onNext: () => void
  onSkip: () => void
}

export default function TutorialStepLayout({
  step,
  title,
  message,
  children,
  buttonLabel = '다음',
  nextDisabled = false,
  skipDisabled = false,
  isReplay = false,
  onNext,
  onSkip,
}: TutorialStepLayoutProps) {
  return (
    <main
      className={`relative flex min-h-0 w-full flex-1 flex-col overflow-hidden overscroll-none pb-5 ${
        isReplay ? 'bg-Background1' : 'bg-white px-4'
      }`}
    >
      <StatusBar
        hasStatusArea={false}
        className={isReplay ? 'w-full shrink-0' : 'w-full shrink-0 [&>div:last-child]:px-0'}
        right={<StatusBarSkipButton onClick={onSkip} disabled={skipDisabled} />}
        title={isReplay ? '튜토리얼' : undefined}
      />

      {/* 하단 버튼이 흰 배경 바 없이 콘텐츠 위에 떠 있으므로 가려지지 않도록 여백을 확보한다 */}
      <section
        className={`mt-4 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain pb-24 ${isReplay ? 'px-4' : ''}`}
      >
        <div className="shrink-0">
          <p className="dnf-Title3 text-Gray-10 leading-[1.15] break-keep">STEP {step}</p>
          <h1 className="dnf-Title3 mt-1 leading-[1.15] break-keep text-[#FFBE00]">{title}</h1>
          <p className="pretendard-Caption1 mt-4 break-keep text-[#8A8499]">
            루키의 지시에 따라 튜토리얼을 진행해주세요.
          </p>
        </div>

        <AgentChat type="rookie" message={message} className="mt-6 shrink-0" />

        <div className="mt-6 shrink-0 pb-2">{children}</div>
      </section>

      <Button
        type="button"
        size={isReplay ? 'semilg' : 'lg'}
        color="primary"
        onClick={onNext}
        disabled={nextDisabled}
        className={`absolute right-4 bottom-5 left-4 shadow-[0_4px_8px_rgba(168,79,1,0.15)] ${isReplay ? 'mx-auto max-w-80' : ''}`}
      >
        {buttonLabel}
      </Button>
    </main>
  )
}
