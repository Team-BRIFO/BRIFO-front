import type { MouseEventHandler, ReactNode } from 'react'

import { Icon } from '@/components/common/Icon'

export interface ChipProps {
  /** 칩에 표시할 텍스트 */
  children: ReactNode

  /** 삭제 버튼 클릭 이벤트 (전달 시 X 버튼 표시됨) */
  onRemove?: MouseEventHandler<HTMLButtonElement>

  /** 비활성화 여부 */
  disabled?: boolean

  /** 추가 스타일 className */
  className?: string
}

export function Chip({ children, onRemove, disabled = false, className = '' }: ChipProps) {
  const hasRemoveAction = Boolean(onRemove)

  return (
    <div
      className={[
        'inline-flex h-[26px] items-center justify-center gap-1',
        'bg-Gray-1 rounded-[20px] px-3 py-1.5 transition-colors duration-150',
        'text-Gray-6 pretendard-Caption1',
        disabled ? 'pointer-events-none cursor-not-allowed opacity-40' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="truncate">{children}</span>

      {hasRemoveAction && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove!(e)
          }}
          disabled={disabled}
          aria-label="칩 삭제"
          className="hover:text-Gray-8 flex shrink-0 items-center p-0.5 focus-visible:ring-1 focus-visible:ring-current focus-visible:outline-none"
        >
          {/* TODO: Icon 컴포넌트가 lucide-react 등으로 연결되어 있어야 함 */}
          <Icon name="close" size={14} isDecorative />
        </button>
      )}
    </div>
  )
}
