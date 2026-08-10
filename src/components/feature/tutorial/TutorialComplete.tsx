import CelebrationImage from '@/assets/characters/celebration.svg?react'
import Button from '@/components/common/Button'
import { StatusBar } from '@/components/common/StatusBar'

interface TutorialCompleteProps {
  reward?: number
  onComplete: () => void
  isPending?: boolean
  isReplay?: boolean
}

export default function TutorialComplete({
  reward,
  onComplete,
  isPending = false,
  isReplay = false,
}: TutorialCompleteProps) {
  return (
    <main
      className={`mx-auto flex w-full flex-col pb-5 ${
        isReplay ? 'bg-Background1 h-dvh min-h-0' : 'min-h-dvh bg-white px-4 pt-6'
      }`}
    >
      <StatusBar
        hasStatusArea={!isReplay}
        className={isReplay ? 'w-full' : 'w-full [&>div:last-child]:px-0'}
        title={isReplay ? '튜토리얼' : undefined}
      />

      <section
        className={`flex flex-1 flex-col items-center justify-center text-center ${
          isReplay ? 'px-4' : ''
        }`}
      >
        <h1 className="dnf-Title3 text-Gray-10 leading-[1.2]">
          {isReplay ? '튜토리얼을 다시 살펴봤어요!' : '튜토리얼 완료!'}
          <br />
          <span className="text-Brand-Highlight">
            {isReplay ? '투자 결정에 활용해보세요.' : '환영해요 사장님!'}
          </span>
        </h1>

        <p className="pretendard-Caption1 text-Text-Guide mt-4 leading-[1.45]">
          {isReplay ? '언제든 설정에서 다시 볼 수 있어요.' : '이제 진짜 사장님이 되셨어요.'}
          {!isReplay && (
            <>
              <br />
              사원들과 함께 첫 투자를 시작해봐요!
            </>
          )}
        </p>

        <CelebrationImage className="mt-17 h-30 w-52" aria-hidden="true" />

        {reward !== undefined && (
          <div className="border-Yellow-80 bg-Yellow-105 mt-17 flex w-57.75 flex-col rounded-xl border px-6 py-3.5">
            <span className="pretendard-Caption2 text-Gray-6">튜토리얼 보상</span>
            <strong className="dnf-Title2 text-Yellow-30 mt-1">+ {reward} AP</strong>
          </div>
        )}
      </section>

      <div className={isReplay ? 'mx-4 flex justify-center' : undefined}>
        <Button
          type="button"
          size={isReplay ? 'semilg' : 'lg'}
          color="primary"
          isFullWidth
          disabled={isPending}
          onClick={onComplete}
          className={`mt-6 shadow-[0_4px_8px_rgba(168,79,1,0.15)] ${isReplay ? 'max-w-80' : ''}`}
        >
          {isPending ? '완료 처리 중...' : isReplay ? '설정으로 돌아가기' : '튜토리얼 종료'}
        </Button>
      </div>
    </main>
  )
}
