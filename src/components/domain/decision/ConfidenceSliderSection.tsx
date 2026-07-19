import type { ChangeEvent, HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ConfidenceSliderSectionProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange'
> {
  /** 현재 슬라이더의 확신도 선택 수치 (부모에서 제어) */
  value: number
  /** 최소 선택 범위 구성 (Default: 1) */
  min?: number
  /** 최대 선택 범위 구성 (Default: 5) */
  max?: number
  /** 슬라이더 바 조작 시 상태를 변경하는 콜백 핸들러 */
  onChange: (value: number) => void
  /** 선택 수치에 따라 동적으로 계산되어 가이드로 출력될 재화 정보 */
  apCost: number
  expectedReward: number
}

export function ConfidenceSliderSection({
  value,
  min = 1,
  max = 5,
  onChange,
  apCost,
  expectedReward,
  className,
  ...props
}: ConfidenceSliderSectionProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

  // 트랙 배경의 채워진 영역 비율 계산 (linear-gradient 용도)
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div
      className={twMerge('flex w-full flex-col items-stretch gap-6 px-6 py-4', className)}
      {...props}
    >
      {/* Title */}
      <span className="pretendard-Body1-Bold text-Gray-10">확신도</span>

      {/* Slider Area */}
      <div className="flex w-full flex-col gap-2">
        {/* Labels: 조금 / 많이 */}
        <div className="flex items-center justify-between px-1">
          <span className="pretendard-Caption1 text-Yellow-40">조금</span>
          <span className="pretendard-Caption1 text-Yellow-40">많이</span>
        </div>

        {/* ConfidenceSlider */}
        <div className="flex w-full items-center">
          <input
            type="range"
            aria-label="확신도 조절"
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            className="bg-Gray-2 accent-Yellow-30 focus-visible:ring-Yellow-30 h-2 w-full cursor-pointer appearance-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              background: `linear-gradient(to right, var(--color-Yellow-30) ${percentage}%, var(--color-Gray-2) ${percentage}%)`,
            }}
          />
        </div>
      </div>

      {/* Info_Guide_Text */}
      <span className="pretendard-Caption1 text-Gray-6 text-center">
        확신도 {value} · AP {apCost} 소모 · 적중 시 +{expectedReward}AP
      </span>
    </div>
  )
}
