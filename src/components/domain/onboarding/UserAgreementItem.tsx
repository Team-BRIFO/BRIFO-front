import CheckIcon from '@/assets/icons/check.svg?react'
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react'

interface UserAgreementItemProps {
  label: string
  type?: 'required' | 'optional'
  checked: boolean
  onToggle?: () => void
  onView?: () => void
}

export default function UserAgreementItem({
  label,
  type = 'required',
  checked,
  onToggle,
  onView,
}: UserAgreementItemProps) {
  return (
    <div className="flex items-center justify-between px-3 py-3">
      <button type="button" onClick={onToggle} className="flex items-center gap-3">
        <CheckIcon className={`h-5 w-5 ${checked ? 'text-Yellow-45' : 'text-Gray-6'}`} />

        <span className="pretendard-Caption2 text-Gray-7">
          {type === 'required' && <span className="text-Pink-30 mr-1">(필수)</span>}
          {type === 'optional' && <span className="text-Gray-5 mr-1">(선택)</span>}
          {label}
        </span>
      </button>

      <button
        type="button"
        onClick={onView}
        className="pretendard-Caption1 text-Gray-5 flex items-center gap-1"
      >
        보기
        <ChevronRightIcon className="h-3 w-3" />
      </button>
    </div>
  )
}
