import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'solid' | 'outline'
export type ButtonColor = 'primary' | 'secondary' | 'assistive'
export type ButtonSize = 'lg' | 'semilg' | 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  color?: ButtonColor
  size?: ButtonSize
  isFullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const sizeStyles = {
  lg: 'h-15 px-8 gap-2 rounded-3xl pretendard-Subtitle6',
  semilg: 'h-13 px-6 gap-2 rounded-[20px] pretendard-Subtitle6',
  md: 'h-11 px-5 gap-2 rounded-2xl pretendard-Button1',
  sm: 'h-10 px-4 gap-2  rounded-[14px] pretendard-Button2',
}

const solidStyles = {
  primary:
    'bg-Yellow-40 text-Pink-5 hover:bg-Yellow-30 active:bg-Yellow-20 disabled:bg-Gray-3 disabled:text-Gray-5',

  secondary:
    'bg-Yellow-80 text-Yellow-20 hover:bg-Yellow-70 hover:text-Yellow-10 active:bg-Yellow-60 active:text-Yellow-5 disabled:bg-Gray-3 disabled:text-Gray-5',

  assistive:
    'bg-Gray-1 text-Gray-7 hover:bg-Gray-2 active:bg-Gray-3 active:text-Gray-8 disabled:bg-Gray-3 disabled:text-Gray-5',
}

const outlineStyles = {
  primary:
    'border border-Yellow-40 bg-Yellow-100 text-Pink-5 hover:border-Yellow-30 hover:bg-Yellow-80 active:border-Yellow-20 active:bg-Yellow-70 disabled:border-Gray-6 disabled:text-Gray-5',

  secondary:
    'border border-Yellow-80 bg-White text-Yellow-20  disabled:border-Gray-6 disabled:text-Gray-3',

  assistive:
    'border border-Gray-3 bg-White text-Gray-6 hover:border-Gray-4 hover:bg-Gray-2 hover:text-Gray-7 active:bg-Gray-3 active:border-Gray-7 active:text-Gray-8 disabled:border-Gray-9 disabled:bg-Gray-5 disabled:text-Gray-9',
}

export default function Button({
  children,
  variant = 'solid',
  color = 'primary',
  size = 'lg',
  isFullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const variantStyle = variant === 'solid' ? solidStyles[color] : outlineStyles[color]

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 transition-colors duration-200 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyle} ${isFullWidth ? 'w-full' : ''} ${className} `}
      {...props}
    >
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  )
}
