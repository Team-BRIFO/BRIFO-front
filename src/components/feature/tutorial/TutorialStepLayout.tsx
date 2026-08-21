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
  /** 콘텐츠가 긴 STEP만 내부 스크롤 허용 */
  isContentScrollable?: boolean
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
  isContentScrollable = false,
  isReplay = false,
  onNext,
  onSkip,
}: TutorialStepLayoutProps) {
  return (
    <main
      className={`flex min-h-0 w-full flex-1 flex-col overflow-hidden overscroll-none pb-5 ${
        isReplay ? 'bg-Background1' : 'bg-white px-4'
      }`}
    >
      <StatusBar
        hasStatusArea={false}
        className={isReplay ? 'w-full shrink-0' : 'w-full shrink-0 [&>div:last-child]:px-0'}
        right={<StatusBarSkipButton onClick={onSkip} disabled={skipDisabled} />}
        title={isReplay ? '튜토리얼' : undefined}
      />

      <section
        className={`mt-8 flex min-h-0 flex-1 flex-col ${isContentScrollable ? 'overflow-y-auto overscroll-y-contain' : 'overflow-hidden'} ${isReplay ? 'px-4' : ''}`}
      >
        <div className="shrink-0">
          <p className="dnf-Title3 text-Gray-10 leading-[1.15]">STEP {step}</p>
          <h1 className="dnf-Title3 mt-1 leading-[1.15] text-[#FFBE00]">{title}</h1>
          <p className="pretendard-Caption1 mt-4 text-[#8A8499]">
            루키의 지시에 따라 튜토리얼을 진행해주세요.
          </p>
        </div>

        <AgentChat type="rookie" message={message} className="mt-8 shrink-0" />

        <div
          className={`mt-8 ${isContentScrollable ? 'shrink-0 pb-2' : 'min-h-0 flex-1 overflow-hidden'}`}
        >
          {children}
        </div>
      </section>

      <div className={`shrink-0 ${isReplay ? 'mx-4 flex justify-center' : ''}`}>
        <Button
          type="button"
          size={isReplay ? 'semilg' : 'lg'}
          color="primary"
          isFullWidth
          onClick={onNext}
          disabled={nextDisabled}
          className={`mt-6 shadow-[0_4px_8px_rgba(168,79,1,0.15)] ${isReplay ? 'max-w-80' : ''}`}
        >
          {buttonLabel}
        </Button>
      </div>
    </main>
  )
}
