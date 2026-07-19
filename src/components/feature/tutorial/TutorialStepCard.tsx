import TutorialCard from '@/assets/characters/Brifo_tutorial_step.svg?react'

interface TutorialStepCardProps {
  step: number
  title: string
  description: string
}

export default function TutorialStepCard({ step, title, description }: TutorialStepCardProps) {
  return (
    <div className="flex items-center gap-5 rounded-2xl bg-white px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <TutorialCard className="h-11 w-11 shrink-0" />

      <div className="flex flex-col">
        <span className="pretendard-Caption1 text-Gray-5">
          STEP {step.toString().padStart(2, '0')}
        </span>

        <span className="pretendard-Body1-Semibold text-Gray-9 mt-1">{title}</span>

        <span className="pretendard-Caption2 mt-1 max-w-48 leading-[132%] text-[#8A8499]">
          {description}
        </span>
      </div>
    </div>
  )
}
