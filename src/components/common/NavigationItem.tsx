import type { FunctionComponent, SVGProps } from 'react'

interface NavigationItemProps {
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>
  label: string
  isActive?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export default function NavigationItem({
  Icon,
  label,
  isActive = false,
  disabled = false,
  onClick,
  className = '',
}: NavigationItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex flex-1 flex-col items-center justify-center gap-1 disabled:cursor-not-allowed disabled:opacity-50 ${isActive ? 'text-Yellow-40' : 'text-Gray-5'} ${className} `}
    >
      <Icon className="h-6 w-6" />
      <span className="pretendard-Button2">{label}</span>
    </button>
  )
}
