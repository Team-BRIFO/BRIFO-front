import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import FolderDownIcon from '@/assets/icons/folder-down.svg?react'
import FolderMinusIcon from '@/assets/icons/folder-minus.svg?react'
import FolderUpIcon from '@/assets/icons/folder-up.svg?react'

export type PredictionType = 'UP' | 'HOLD' | 'DOWN'

export interface DirectionSelectorGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange'
> {
  /** 현재 활성화되어 선택된 방향 상태 */
  selectedDirection: PredictionType | null
  /** 방향 카드가 클릭되었을 때 부모로 선택 값을 넘겨주는 콜백 함수 */
  onDirectionChange: (direction: PredictionType) => void
  /** 컴포넌트 전체 비활성화 여부 */
  disabled?: boolean
}

interface PredictionOptionProps extends Omit<
  HTMLAttributes<HTMLButtonElement>,
  'type' | 'onClick' | 'disabled'
> {
  type: PredictionType
  isSelected: boolean
  onClick: () => void
  disabled?: boolean
}

function PredictionOption({
  type,
  isSelected,
  onClick,
  disabled,
  className,
  ...props
}: PredictionOptionProps) {
  const baseClass =
    'flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border py-4 transition-colors duration-200'

  let Icon = FolderMinusIcon
  let label = ''

  if (type === 'UP') {
    Icon = FolderUpIcon
    label = '상승'
  } else if (type === 'HOLD') {
    Icon = FolderMinusIcon
    label = '관망'
  } else if (type === 'DOWN') {
    Icon = FolderDownIcon
    label = '하락'
  }

  const dynamicClass = isSelected
    ? 'border-Yellow-30 bg-Yellow-100 text-Yellow-30'
    : 'border-Gray-2 bg-White text-Gray-5 hover:bg-Gray-1'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        baseClass,
        dynamicClass,
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      {...props}
    >
      <Icon className="h-6 w-6" strokeWidth={2} />
      <span className="pretendard-Body2-Semibold">{label}</span>
    </button>
  )
}

export function DirectionSelectorGroup({
  selectedDirection,
  onDirectionChange,
  disabled = false,
  className,
  ...props
}: DirectionSelectorGroupProps) {
  return (
    <div className={twMerge('flex w-full flex-col items-start gap-3', className)} {...props}>
      <span className="pretendard-Body1-Bold text-Gray-10">방향을 선택하세요</span>
      <div className="flex w-full justify-between gap-2">
        <PredictionOption
          type="UP"
          isSelected={selectedDirection === 'UP'}
          onClick={() => onDirectionChange('UP')}
          disabled={disabled}
        />
        <PredictionOption
          type="HOLD"
          isSelected={selectedDirection === 'HOLD'}
          onClick={() => onDirectionChange('HOLD')}
          disabled={disabled}
        />
        <PredictionOption
          type="DOWN"
          isSelected={selectedDirection === 'DOWN'}
          onClick={() => onDirectionChange('DOWN')}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
