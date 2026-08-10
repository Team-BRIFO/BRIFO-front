import CheckIcon from '@/assets/icons/check.svg?react'
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react'

interface UserAgreementItemProps {
  label: string
  type?: 'required' | 'optional'
  checked: boolean
  onToggle?: () => void
  onView?: () => void
  showType?: boolean
  /** 설정 약관처럼 체크 없이 내용만 확인하는 경우 사용한다. */
  readOnly?: boolean
  className?: string
  variant?: 'default' | 'all'
}

export default function UserAgreementItem({
  label,
  type = 'required',
  checked,
  onToggle,
  onView,
  showType = true,
  readOnly = false,
  className = '',
  variant = 'default',
}: UserAgreementItemProps) {
  return (
    <div className="flex items-center justify-between py-3">
      {readOnly ? (
        <span className={className || 'pretendard-Caption2 text-Gray-7'}>
          {showType && type === 'required' && <span className="text-Pink-30 mr-1">(필수)</span>}

          {showType && type === 'optional' && <span className="text-Gray-5 mr-1">(선택)</span>}

          {label}
        </span>
      ) : (
        <button type="button" onClick={onToggle} className="flex items-center gap-3">
          {variant === 'all' ? (
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                checked ? 'bg-Yellow-45' : 'bg-Gray-3'
              }`}
            >
              <CheckIcon className={`h-4 w-4 ${checked ? 'text-White' : 'text-Gray-6'}`} />
            </span>
          ) : (
            <CheckIcon
              className={`h-5 w-5 shrink-0 ${checked ? 'text-Yellow-45' : 'text-Gray-6'}`}
            />
          )}
          <span className={className || 'pretendard-Caption2 text-Gray-7'}>
            {showType && type === 'required' && <span className="text-Pink-30 mr-1">(필수)</span>}

            {showType && type === 'optional' && <span className="text-Gray-5 mr-1">(선택)</span>}

            {label}
          </span>
        </button>
      )}

      {onView && (
        <button
          type="button"
          onClick={onView}
          className="pretendard-Caption1 text-Gray-5 flex items-center gap-1"
        >
          보기
          <ChevronRightIcon className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
