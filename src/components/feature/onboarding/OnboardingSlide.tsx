import Button from '@/components/common/Button'
import { StatusBar, StatusBarBackButton, StatusBarSkipButton } from '@/components/common/StatusBar'

interface OnboardingSlideProps {
  image: string
  title: string
  highlightedText: string
  description: string
  currentStep: number
  totalSteps: number
  onNext: () => void
  onBack?: () => void
  onSkip?: () => void
}

export default function OnboardingSlide({
  image,
  title,
  highlightedText,
  description,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onSkip,
}: OnboardingSlideProps) {
  const titleParts = title.split(highlightedText)

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-90 flex-col bg-white px-4 pt-6 pb-5">
      <div className="flex h-15 items-center justify-between">
        <StatusBar
          className="w-full [&>div:last-child]:px-0"
          hasStatusArea
          left={onBack ? <StatusBarBackButton onClick={onBack} /> : undefined}
          right={<StatusBarSkipButton onClick={onSkip} />}
        />
      </div>

      <div className="flex flex-1 flex-col items-center">
        <div className="mt-8 flex h-52 w-full items-center justify-center">
          <img src={image} alt="" aria-hidden="true" className="h-full w-full object-contain" />
        </div>

        <div className="mt-7 text-center">
          <h1 className="dnf-Title2 text-Gray-10 whitespace-pre-line">
            {titleParts[0]}
            <span className="text-Yellow-40">{highlightedText}</span>
            {titleParts[1]}
          </h1>

          <p className="pretendard-Body2-Semibold mt-4 whitespace-pre-line text-[#8A8499]">
            {description}
          </p>
        </div>

        <div
          className="mt-6 flex items-center gap-1.5"
          aria-label={`${totalSteps}단계 중 ${currentStep}단계`}
        >
          {Array.from({ length: totalSteps }, (_, index) => {
            const isActive = index + 1 === currentStep

            return (
              <span
                key={index}
                className={`h-2.5 rounded-full transition-all ${
                  isActive ? 'bg-Yellow-45 w-6' : 'bg-Gray-3 w-2.5'
                }`}
              />
            )
          })}
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        color="primary"
        isFullWidth
        onClick={onNext}
        className="mx-auto h-15 w-82 shadow-[0_4px_8px_rgba(168,79,1,0.15)]"
      >
        다음
      </Button>
    </div>
  )
}
