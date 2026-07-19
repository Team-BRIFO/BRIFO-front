import { useRef } from 'react'
import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import { ProgressBar } from '@/components/common/ProgressBar'

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
  const trackRef = useRef<HTMLDivElement>(null)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return
    const updateValue = (clientX: number) => {
      const rect = trackRef.current!.getBoundingClientRect()
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
      const percent = x / rect.width
      const newValue = Math.round(min + percent * (max - min))
      if (newValue !== value) {
        onChange(newValue)
      }
    }

    updateValue(e.clientX)

    const handlePointerMove = (ev: PointerEvent) => updateValue(ev.clientX)
    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
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

        {/* ConfidenceSlider (Custom Interaction) */}
        <div
          ref={trackRef}
          role="slider"
          aria-label="확신도 조절"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          tabIndex={0}
          className="focus-visible:ring-Yellow-30 relative flex w-full cursor-pointer items-center py-2 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
          onPointerDown={handlePointerDown}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              e.preventDefault()
              if (value < max) onChange(value + 1)
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              e.preventDefault()
              if (value > min) onChange(value - 1)
            }
          }}
        >
          {/* 시각적 표현을 담당하는 ProgressBar */}
          <ProgressBar
            progress={percentage}
            hasThumb={true}
            barColor="bg-Yellow-30"
            className="pointer-events-none"
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
