import type { MouseEventHandler } from 'react'

export interface ToggleProps {
  /** 현재 켜져 있는지 여부 */
  isOn: boolean

  /** 클릭 시 상태 변경 핸들러 */
  onClick: MouseEventHandler<HTMLButtonElement>

  /** 비활성화 여부 */
  disabled?: boolean

  /** 스크린 리더용 고유 라벨 */
  ariaLabel?: string

  /** 스크린 리더용 참조 라벨 ID */
  ariaLabelledBy?: string

  /** 추가 스타일 className */
  className?: string
}

export function Toggle({
  isOn,
  onClick,
  disabled = false,
  ariaLabel,
  ariaLabelledBy,
  className = '',
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={[
        'focus-visible:ring-Yellow-45 relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        isOn ? 'bg-Gray-9' : 'bg-Gray-3',
        disabled ? 'cursor-not-allowed opacity-50' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* 기본 Accessible Name (props로 덮어쓰기 가능) */}
      <span className="sr-only">Toggle</span>
      <span
        aria-hidden="true"
        className={[
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          isOn ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  )
}
