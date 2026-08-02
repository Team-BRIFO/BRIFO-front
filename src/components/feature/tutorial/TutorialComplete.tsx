import CelebrationImage from '@/assets/characters/celebration.svg?react'
import Button from '@/components/common/Button'
import { StatusBar } from '@/components/common/StatusBar'

interface TutorialCompleteProps {
  reward: number
  onComplete: () => void
  isPending?: boolean
}

export default function TutorialComplete({
  reward,
  onComplete,
  isPending = false,
}: TutorialCompleteProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full flex-col bg-white px-4 pt-6 pb-5">
      <StatusBar hasStatusArea className="w-full [&>div:last-child]:px-0" />

      <section className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="dnf-Title3 text-Gray-10 leading-[1.2]">
          튜토리얼 완료!
          <br />
          <span className="text-[#FFBE00]">환영해요 사장님!</span>
        </h1>

        <p className="pretendard-Caption1 mt-4 leading-[1.45] text-[#8A8499]">
          이제 진짜 사장님이 되셨어요.
          <br />
          사원들과 함께 첫 투자를 시작해봐요!
        </p>

        <CelebrationImage className="mt-17 h-30 w-52" aria-hidden="true" />

        <div className="border-Yellow-80 bg-Yellow-105 mt-17 flex w-57.75 flex-col rounded-xl border px-6 py-3.5">
          <span className="pretendard-Caption2 text-Gray-6">튜토리얼 보상</span>
          <strong className="dnf-Title2 text-Yellow-30 mt-1">+ {reward} AP</strong>
        </div>
      </section>

      <Button
        type="button"
        size="lg"
        color="primary"
        isFullWidth
        disabled={isPending}
        onClick={onComplete}
        className="mt-6 shadow-[0_4px_8px_rgba(168,79,1,0.15)]"
      >
        {isPending ? '완료 처리 중...' : '튜토리얼 종료'}
      </Button>
    </main>
  )
}
