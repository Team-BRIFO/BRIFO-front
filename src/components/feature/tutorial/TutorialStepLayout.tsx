import type { ReactNode } from 'react'

import Button from '@/components/common/Button'
import { StatusBar, StatusBarSkipButton } from '@/components/common/StatusBar'
import { AgentChat } from '@/components/domain/agent/AgentChat'

interface TutorialStepLayoutProps {
  step: number
  title: string
  message: string
  children: ReactNode
  onNext: () => void
  onSkip: () => void
}

export default function TutorialStepLayout({
  step,
  title,
  message,
  children,
  onNext,
  onSkip,
}: TutorialStepLayoutProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-90 flex-col bg-white px-4 pt-6 pb-5">
      <StatusBar
        hasStatusArea
        className="w-full [&>div:last-child]:px-0"
        right={<StatusBarSkipButton onClick={onSkip} />}
      />

      <section className="mt-8 flex flex-1 flex-col">
        <div>
          <p className="dnf-Title3 text-Gray-10 leading-[1.15]">STEP {step}</p>
          <h1 className="dnf-Title3 mt-1 leading-[1.15] text-[#FFBE00]">{title}</h1>
          <p className="pretendard-Caption1 mt-4 text-[#8A8499]">
            루키의 지시에 따라 튜토리얼을 진행해주세요.
          </p>
        </div>

        <AgentChat type="rookie" message={message} className="mt-8" />

        <div className="mt-8 flex-1">{children}</div>
      </section>

      <Button
        type="button"
        size="lg"
        color="primary"
        isFullWidth
        onClick={onNext}
        className="mt-6 shadow-[0_4px_8px_rgba(168,79,1,0.15)]"
      >
        이해했어요
      </Button>
    </main>
  )
}
